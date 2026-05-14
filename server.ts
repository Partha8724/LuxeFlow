import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import axios from 'axios';
import * as admin from 'firebase-admin';
import fs from 'fs';

dotenv.config();

const PORT = 3000;

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve('./firebase-applet-config.json'), 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const db = admin.firestore(firebaseConfig.firestoreDatabaseId);

// PayPal & CJ Configuration
const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

import { StoreIntelligenceEngine } from './src/StoreIntelligenceEngine';

// Lazy initialized clients
let stripeClient: Stripe | null = null;
let genAI: GoogleGenerativeAI | null = null;
let intelligenceEngine: StoreIntelligenceEngine | null = null;

function getIntelligenceEngine() {
  if (!intelligenceEngine && process.env.GEMINI_API_KEY) {
    intelligenceEngine = new StoreIntelligenceEngine(process.env.GEMINI_API_KEY, db);
  }
  return intelligenceEngine;
}

function getStripe() {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

function getGemini() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * PayPal Service Logic
 */
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
}

/**
 * CJDropshipping Bridge Utility
 */
const CJ_API_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

async function getCJAccessToken(apiKey: string) {
  try {
    const response = await axios.post(`${CJ_API_URL}/authentication/getAccessToken`, {
      apiKey: apiKey
    });
    
    if (response.data.success) {
      return response.data.data.accessToken;
    }
    throw new Error(response.data.message || 'Failed to fetch access token');
  } catch (error: any) {
    console.error('CJ Auth Failure:', error.response?.data || error.message);
    throw error;
  }
}

async function triggerCJOrder(orderId: string, orderData: any, shippingInfo: any) {
  try {
    const token = await db.collection('settings').doc('cj_config').get().then(d => d.data()?.accessToken || process.env.CJ_ACCESS_TOKEN);
    
    const cjPayload = {
      orderNumber: orderId,
      shippingZip: shippingInfo.postcode,
      shippingName: shippingInfo.name,
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingPhone: shippingInfo.phone,
      shippingProvince: shippingInfo.province || "N/A",
      shippingCountry: shippingInfo.country,
      fromCountry: shippingInfo.country === 'United Kingdom' ? 'UK' : 'US',
      orderSource: 'LuxeFlow_Direct',
      remark: "BLIND_DROPSHIPPING: NO INVOICE, LUXURY PACKAGING ONLY",
      products: orderData.items.map((item: any) => ({
        variantId: item.externalId || item.id,
        quantity: item.quantity
      }))
    };

    const response = await axios.post(`${CJ_API_URL}/order/create`, cjPayload, {
      headers: { 'CJ-Access-Token': token }
    });

    if (response.data.success) {
      await db.collection('orders').doc(orderId).update({
        supplierOrderId: response.data.data.orderId,
        status: 'PROCESSING',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('CJ Bridge Failure:', error);
    throw error;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // AI Marketing & Basic Routes...
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/ai/generate-description', async (req, res) => {
    try {
      const { productName, targetMarket = 'UK' } = req.body;
      const ai = getGemini();
      if (!ai) return res.status(500).json({ error: 'Gemini API not configured' });
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Write a high-end, luxury product description for '${productName}' targeting the ${targetMarket} market. 
                     Use sophisticated ${targetMarket === 'UK' ? 'British English' : 'American English'}. 
                     Focus on quality, exclusivity, and lifestyle. Include SEO-optimized metadata and keywords.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ description: response.text() });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  // --- ORDER MANAGEMENT ---

  app.get('/api/orders', async (req, res) => {
    try {
      const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- SUPPLIER & SETTINGS ---

  app.post('/api/supplier/cj/auth', async (req, res) => {
    try {
      const { apiKey } = req.body;
      const token = await getCJAccessToken(apiKey);
      
      // Persist token for backend use
      await db.collection('settings').doc('cj_config').set({
        accessToken: token,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ accessToken: token, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  async function getActiveCJToken() {
    const doc = await db.collection('settings').doc('cj_config').get();
    return doc.exists ? doc.data()?.accessToken : process.env.CJ_ACCESS_TOKEN;
  }

  app.post('/api/orders/sync-tracking', async (req, res) => {
    try {
      const { orderId, supplierOrderId } = req.body;
      if (!supplierOrderId) return res.status(400).json({ error: 'Supplier Order ID required' });
      
      const token = await getActiveCJToken();
      
      const response = await axios.get(`${CJ_API_URL}/order/tail/query?orderId=${supplierOrderId}`, {
        headers: { 'CJ-Access-Token': token }
      });

      if (response.data.success && response.data.data.trackingNumber) {
        await db.collection('orders').doc(orderId).update({
          trackingNumber: response.data.data.trackingNumber,
          status: 'SHIPPED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ success: true, tracking: response.data.data.trackingNumber });
      } else {
        res.json({ success: false, message: 'Tracking not available yet' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/paypal/create-order', async (req, res) => {
    try {
      const { amount, currency = 'GBP', items } = req.body;
      const accessToken = await getPayPalAccessToken();
      
      const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: currency, value: amount }
        }]
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Perspective order in Firestore
      await db.collection('orders').doc(response.data.id).set({
        status: 'PENDING',
        total: amount,
        currency,
        items: items || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        buyerId: 'guest_user' // Replace with real auth UID in production
      });
      
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  });

  app.post('/api/paypal/capture-order', async (req, res) => {
    try {
      const { orderID, shippingInfo } = req.body;
      const accessToken = await getPayPalAccessToken();
      
      const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.data.status === 'COMPLETED') {
        const orderDoc = await db.collection('orders').doc(orderID).get();
        const orderData = orderDoc.data();

        await db.collection('orders').doc(orderID).update({
          status: 'PAID',
          shippingAddress: shippingInfo,
          paymentIntentId: response.data.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // USE THE ADVANCED STORE INTELLIGENCE ENGINE FOR FULFILLMENT
        if (orderData) {
          const engine = getIntelligenceEngine();
          if (engine) {
            const token = await getActiveCJToken();
            engine.handleAutoFulfillment(orderID, orderData, shippingInfo, token).catch(e => console.error('Engine Fulfillment Error:', e));
          } else {
             // Fallback
             triggerCJOrder(orderID, orderData, shippingInfo).catch(e => console.error('CJ Initial sync failed:', e));
          }
        }
      }

      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  });

  // --- STORE INTELLIGENCE ENGINE ENDPOINTS ---
  app.post('/api/engine/localize', async (req, res) => {
    try {
      const { rawData, targetMarket } = req.body;
      const engine = getIntelligenceEngine();
      if (!engine) return res.status(500).json({ error: 'AI Engine offline' });
      const localized = await engine.localizeProduct(rawData, targetMarket);
      res.json(localized);
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.post('/api/engine/visual-enhance', async (req, res) => {
    try {
      const { imageUrl, style } = req.body;
      const engine = getIntelligenceEngine();
      if (!engine) return res.status(500).json({ error: 'AI Engine offline' });
      const enhancedUrl = await engine.enhanceProductImage(imageUrl, style);
      res.json({ url: enhancedUrl });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.post('/api/engine/profit-guardian', async (req, res) => {
    try {
       const { productId, currentCost } = req.body;
       const engine = getIntelligenceEngine();
       if (!engine) return res.status(500).json({ error: 'AI Engine offline' });
       const newPrice = await engine.runProfitGuardian(productId, currentCost, 20);
       res.json({ success: true, newPrice });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.post('/api/engine/ad-gen', async (req, res) => {
    try {
       const { condition, city } = req.body;
       const engine = getIntelligenceEngine();
       if (!engine) return res.status(500).json({ error: 'AI Engine offline' });
       const script = await engine.generatePredictiveAdStrategy(condition, city);
       res.json({ script });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.post('/api/engine/chat', async (req, res) => {
     try {
        const { message, orderId } = req.body;
        const engine = getIntelligenceEngine();
        if (!engine) return res.status(500).json({ error: 'AI Engine offline' });
        const reply = await engine.resolveCustomerQuery(message, orderId);
        res.json({ reply });
     } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  // Vite middleare & Startup...
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LuxeFlow Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => { console.error('Failed to start server:', err); });

