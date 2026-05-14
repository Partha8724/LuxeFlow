import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, RefreshCcw, Wand2, TrendingUp, Truck, ShieldCheck, AlertCircle, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

function PremiumSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#0a0a0a] border border-white/5", className)}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

// Component for AI Generation
function AIServiceCard() {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!productName) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/ai/generate-description', { productName });
      setResult(res.data.description);
    } catch (e: any) {
      console.error(e);
      setError('The AI Content Engine is currently undergoing scheduled maintenance. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl space-y-6 relative overflow-hidden group hover:border-luxury-gold/30 transition-colors duration-700">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-display font-light flex items-center gap-3">
          <Wand2 className="text-luxury-gold" size={20} />
          AI Content Atelier
        </h3>
      </div>
      <p className="text-sm text-gray-400 font-light relative z-10 leading-relaxed">
        Generate SEO-optimized, highly-converting luxury descriptions for global imports.
      </p>
      
      <div className="space-y-4 relative z-10">
        <input 
          type="text" 
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Product Title (e.g. Italian Leather Bag)"
          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-luxury-gold transition-colors text-sm backdrop-blur-md"
        />
        {error && (
          <div className="flex items-center gap-2 text-[10px] text-red-500 uppercase tracking-widest bg-red-500/5 p-3 border border-red-500/20">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <button 
          onClick={generate}
          disabled={loading}
          className="w-full py-4 bg-white text-black uppercase tracking-[0.3em] text-xs font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden relative group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-yellow-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 flex items-center gap-2">
            {loading ? <RefreshCcw className="animate-spin" size={16} /> : 'Cultivate Luxury Copy'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {loading ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 space-y-3 relative z-10"
          >
            <PremiumSkeleton className="h-4 w-full rounded" />
            <PremiumSkeleton className="h-4 w-[90%] rounded" />
            <PremiumSkeleton className="h-4 w-[75%] rounded" />
          </motion.div>
        ) : result ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 bg-black/40 backdrop-blur-md border border-luxury-gold/20 rounded-xl text-xs leading-relaxed text-gray-300 font-light max-h-[300px] overflow-y-auto relative z-10"
          >
            {result}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Component for CJ Authentication
function CJAuthCard() {
  const [apiKey, setApiKey] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = async () => {
    if (!apiKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/supplier/cj/auth', { apiKey });
      if (res.data.success) {
        setToken(res.data.accessToken);
      } else {
        setError(res.data.error || 'Authentication failed');
      }
    } catch (e: any) {
      setError(e.response?.data?.error || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl space-y-6 relative overflow-hidden group hover:border-luxury-gold/30 transition-colors duration-700">
      <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-display font-light flex items-center gap-3">
          <ShieldCheck className="text-luxury-gold" size={20} />
          CJ Bridge Authorization
        </h3>
      </div>
      <p className="text-sm text-gray-400 font-light relative z-10 leading-relaxed">
        Establish a secure connection with CJ Dropshipping to enable autonomous fulfillment and inventory synchronization.
      </p>
      
      <div className="space-y-4 relative z-10">
        <input 
          type="password" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste API Key (e.g. CJ5414...)"
          className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl outline-none focus:border-luxury-gold transition-colors text-sm font-mono"
        />
        <button 
          onClick={authenticate}
          disabled={loading}
          className="w-full py-4 border border-luxury-gold text-luxury-gold uppercase tracking-[0.3em] text-xs font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 z-0" />
          <span className="relative z-10 flex items-center gap-2">
            {loading ? <RefreshCcw className="animate-spin" size={16} /> : 'Authorize Bridge'}
          </span>
        </button>
      </div>

      {token && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-green-500 text-[10px] uppercase tracking-widest">
            <ShieldCheck size={14} /> Bridge Established
          </div>
          <div className="text-[10px] font-mono text-white break-all opacity-60">
            {token.substring(0, 30)}...
          </div>
          <p className="text-[9px] text-gray-500 italic">This token is now active for logistics sync.</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 uppercase tracking-widest">
          {error}
        </div>
      )}
    </div>
  );
}

// Order List Component
function AutoImportCard() {
  const [supplierLink, setSupplierLink] = useState('');
  const [commissionAmount, setCommissionAmount] = useState<number>(10);
  const [autoPublish, setAutoPublish] = useState(true);
  const [importing, setImporting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [detectedVariants, setDetectedVariants] = useState<{name: string, mapping: string}[]>([]);
  const [showMapping, setShowMapping] = useState(false);

  const luxeFlowAttributes = ['Size', 'Color', 'Material', 'Style', 'SKU'];

  const handleAnalyze = () => {
    if (!supplierLink) return;
    if (!supplierLink.includes('http')) {
      setError('Please provide a valid supplier URL.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setShowMapping(false);
    
    // Simulate variant detection
    setTimeout(() => {
      setAnalyzing(false);
      setDetectedVariants([
        { name: 'Dimension', mapping: 'Size' },
        { name: 'Hue', mapping: 'Color' },
        { name: 'Component', mapping: 'Material' }
      ]);
      setShowMapping(true);
    }, 2000);
  };

  const handleImport = () => {
    setImporting(true);
    setError('');
    setImportedCount(null);
    
    // Simulate AI parsing and importing with a chance of failure
    setTimeout(() => {
      if (supplierLink.includes('error')) {
        setError('Logistical endpoint unreachable. Catalog access denied.');
        setImporting(false);
      } else {
        setImporting(false);
        setImportedCount(24);
        setShowMapping(false);
      }
    }, 3000);
  };

  return (
    <div className="glass p-8 rounded-2xl space-y-6 lg:col-span-2 xl:col-span-1 relative overflow-hidden group hover:border-luxury-gold/30 transition-colors duration-700">
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-display font-light flex items-center gap-3">
          <Wand2 className="text-luxury-gold" size={20} />
          Autonomic Importer Bot
        </h3>
        <span className="text-[9px] uppercase tracking-[0.4em] text-luxury-gold border border-luxury-gold/30 px-3 py-1">Beta Access</span>
      </div>
      <p className="text-sm text-gray-400 font-light relative z-10 leading-relaxed">
        Supply a supplier catalog URL. Our AI system will automatically import products, calculate the final price (supplier cost + commission) while hiding the commission from the customer, and implement advanced, high-ranking SEO keyword generation for quick discoverability on Google.
      </p>
      
      <div className="space-y-4 relative z-10">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Supplier Catalog URL</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={supplierLink}
              onChange={(e) => {
                setSupplierLink(e.target.value);
                if (error) setError('');
                if (showMapping) setShowMapping(false);
              }}
              placeholder="https://supplier.com/catalog..."
              className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl outline-none focus:border-luxury-gold transition-colors text-sm"
            />
            <button 
              onClick={handleAnalyze}
              disabled={analyzing || importing || !supplierLink}
              className="px-6 py-4 border border-white/10 hover:border-luxury-gold text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {analyzing ? <RefreshCcw className="animate-spin" size={14} /> : 'Analyze'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-[10px] text-red-500 uppercase tracking-widest bg-red-500/5 p-3 border border-red-500/20">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <AnimatePresence>
          {showMapping && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-bold">Variant Mapping Required</h4>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest">{detectedVariants.length} Attributes Detected</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {detectedVariants.map((variant, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-black/20 p-3 border border-white/5">
                      <div className="flex-1">
                        <span className="text-[9px] text-gray-500 uppercase block mb-1">Supplier Field</span>
                        <span className="text-xs font-mono text-white">{variant.name}</span>
                      </div>
                      <div className="flex-[0.2] flex justify-center">
                        <Play size={10} className="text-luxury-gold" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] text-gray-500 uppercase block mb-1">LuxeFlow Attribute</span>
                        <select 
                          value={variant.mapping}
                          onChange={(e) => {
                            const newVariants = [...detectedVariants];
                            newVariants[idx].mapping = e.target.value;
                            setDetectedVariants(newVariants);
                          }}
                          className="w-full bg-transparent text-xs text-luxury-gold outline-none cursor-pointer"
                        >
                          {luxeFlowAttributes.map(attr => (
                            <option key={attr} value={attr} className="bg-luxury-black text-white">{attr}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Fixed Commission ($)</label>
            <input 
              type="number" 
              value={commissionAmount}
              onChange={(e) => setCommissionAmount(Number(e.target.value))}
              placeholder="10"
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-luxury-gold transition-colors text-sm font-mono text-luxury-gold"
            />
          </div>
          <div className="flex flex-col justify-end gap-4 pb-2">
            <label className="flex items-center gap-3 cursor-pointer group/toggle">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn("block w-10 h-6 rounded-full transition-all duration-500", autoPublish ? "bg-luxury-gold" : "bg-white/10 group-hover/toggle:bg-white/20")}></div>
                <div className={cn("dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-500", autoPublish ? "transform translate-x-4" : "")}></div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-300">Auto Publish</span>
            </label>
            <label className="flex items-center gap-3 cursor-not-allowed opacity-80">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={true}
                  readOnly
                  className="sr-only"
                />
                <div className="block w-10 h-6 rounded-full transition-colors bg-luxury-gold"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-4"></div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold">Advanced SEO Generation</span>
            </label>
          </div>
        </div>
        
        <p className="text-[10px] text-gray-500 italic mt-4 font-mono">
          * Final price calculates as Supplier Cost + ${commissionAmount} commission. Commission is hidden from customers.
        </p>

        <button 
          onClick={handleImport}
          disabled={importing || analyzing || !supplierLink || (detectedVariants.length > 0 && !showMapping)}
          className="w-full py-5 mt-4 bg-white text-black uppercase tracking-[0.3em] text-xs font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-yellow-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 z-0" />
          <span className="relative z-10 flex items-center gap-2">
            {importing ? (
              <>
                <RefreshCcw className="animate-spin" size={16} /> Autonomously Finding & Publishing...
              </>
            ) : (
              <>
                {showMapping ? 'Finalize & Import' : 'Initialize Sequence'} <Play size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>

      {importedCount !== null && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl space-y-2"
        >
          <div className="flex items-center gap-2 text-green-500 text-[10px] uppercase tracking-widest">
            <ShieldCheck size={14} /> Import Complete
          </div>
          <p className="text-xs text-white font-light">
            Successfully parsed and extracted <span className="font-mono text-luxury-gold">{importedCount}</span> products. 
            {autoPublish ? ` Applied $${commissionAmount} commission, generated high-ranking SEO metadata, and published to live catalog.` : ` Saved as drafts. Apply commission to publish.`}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (e) {
      console.error('Order fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const syncTracking = async (orderId: string, supplierOrderId: string) => {
    setSyncing(orderId);
    try {
      const res = await axios.post('/api/orders/sync-tracking', { orderId, supplierOrderId });
      if (res.data.success) {
        await fetchOrders();
      }
    } catch (e) {
      console.error('Tracking sync failed', e);
    } finally {
      setSyncing(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass p-10 rounded-none border-white/5 space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-white/5">
          <PremiumSkeleton className="h-4 w-48 rounded" />
          <PremiumSkeleton className="h-4 w-24 rounded" />
        </div>
        <div className="space-y-4">
          <PremiumSkeleton className="h-16 w-full rounded" />
          <PremiumSkeleton className="h-16 w-full rounded" />
          <PremiumSkeleton className="h-16 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4 flex justify-between">
        Recent Acquisitions
        <button onClick={fetchOrders} className="hover:text-luxury-gold transition-colors flex items-center gap-2">
          <RefreshCcw size={10} /> Refresh
        </button>
      </div>
      <div className="glass rounded-none overflow-hidden border-white/5">
        <table className="w-full text-left text-[10px] uppercase tracking-[0.2em]">
          <thead className="bg-white/[0.03] border-b border-white/5 text-gray-400">
            <tr>
              <th className="p-8 font-medium">Order ID</th>
              <th className="p-8 font-medium">Status</th>
              <th className="p-8 font-medium">Logistics Center</th>
              <th className="p-8 font-medium">Items</th>
              <th className="p-8 font-medium text-right">Valuation</th>
              <th className="p-8 font-medium text-right">Tracking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light text-gray-500">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-all duration-700 group">
                <td className="p-8 text-white font-mono text-xs opacity-80">{order.id.substring(0, 12)}...</td>
                <td className="p-8">
                  <span className={cn(
                    "px-4 py-1.5 border rounded-none text-[8px] tracking-[0.3em]",
                    order.status === 'PAID' ? "border-green-500/30 text-green-500" :
                    order.status === 'SHIPPED' ? "border-luxury-gold/30 text-luxury-gold font-bold" :
                    "border-white/10 text-gray-500"
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="p-8 font-mono opacity-60">CJ_GLOBAL_{order.shippingAddress?.country === 'United Kingdom' ? 'UK' : 'US'}</td>
                <td className="p-8">{order.items?.length || 0} Objects</td>
                <td className="p-8 text-right font-mono text-white text-sm">£{order.total?.toLocaleString()}</td>
                <td className="p-8 text-right">
                  {order.trackingNumber ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-white font-mono">{order.trackingNumber}</span>
                      <span className="text-[8px] text-luxury-gold">SHIPPED</span>
                    </div>
                  ) : order.supplierOrderId ? (
                    <button 
                      onClick={() => syncTracking(order.id, order.supplierOrderId)}
                      disabled={syncing === order.id}
                      className="text-luxury-gold hover:text-white transition-colors flex items-center gap-2 ml-auto"
                    >
                      {syncing === order.id ? <RefreshCcw size={10} className="animate-spin" /> : <Truck size={10} />}
                      Sync CJ Tracking
                    </button>
                  ) : (
                    <span className="opacity-30">Preparing...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryList() {
  const [inventory] = useState([
    { id: '1', name: "Architectural Silk Blazer", price: 1250, stock: 12, status: 'Active', supplier: 'CJ Dropshipping' },
    { id: '2', name: "Midnight Skeleton Tourbillon", price: 8400, stock: 3, status: 'Low Stock', supplier: 'Spocket Global' },
    { id: '3', name: "Obsidian Travel Valise", price: 950, stock: 24, status: 'Active', supplier: 'CJ Dropshipping' },
    { id: '4', name: "Cashmere Lounge Set", price: 680, stock: 0, status: 'Out of Stock', supplier: 'Spocket Global' },
  ]);

  return (
    <div className="space-y-6">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4 flex justify-between">
        Curated Stock Management
      </div>
      <div className="glass rounded-none overflow-hidden border-white/5">
        <table className="w-full text-left text-[10px] uppercase tracking-[0.2em]">
          <thead className="bg-white/[0.03] border-b border-white/5 text-gray-400">
            <tr>
              <th className="p-8 font-medium">Object Name</th>
              <th className="p-8 font-medium">Valuation</th>
              <th className="p-8 font-medium">Stock Level</th>
              <th className="p-8 font-medium">Supplier Engine</th>
              <th className="p-8 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light text-gray-500">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-all duration-700 group cursor-pointer">
                <td className="p-8 text-white font-mono text-xs opacity-80">{item.name}</td>
                <td className="p-8 font-mono opacity-80">£{item.price.toLocaleString()}</td>
                <td className="p-8 font-mono">{item.stock} Units</td>
                <td className="p-8">{item.supplier}</td>
                <td className="p-8 text-right">
                  <span className={cn(
                    "px-4 py-1.5 border rounded-none text-[8px] tracking-[0.3em]",
                    item.status === 'Active' ? "border-green-500/30 text-green-500" :
                    item.status === 'Low Stock' ? "border-luxury-gold/30 text-luxury-gold" :
                    "border-red-500/30 text-red-500"
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="pt-40 px-12 pb-32 max-w-[1400px] mx-auto flex gap-16">
      {/* Sidebar */}
      <div className="w-72 space-y-2 hidden lg:block">
        <div className="px-5 mb-8">
          <div className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold opacity-80 mb-2">Management</div>
          <h2 className="text-2xl font-display italic font-light italic">Console</h2>
        </div>
        {[
          { id: 'analytics', label: 'Elegance Analytics', icon: TrendingUp },
          { id: 'inventory', label: 'Curated Stock', icon: Package },
          { id: 'fulfillment', label: 'Global Logistics', icon: Truck },
          { id: 'billing', label: 'Financial Reserve', icon: ShieldCheck },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-none text-[10px] uppercase tracking-[0.25em] transition-all duration-500",
              activeTab === item.id ? "bg-white/5 border-l-2 border-luxury-gold text-white" : "text-gray-500 hover:text-white"
            )}
          >
            <item.icon size={14} className={activeTab === item.id ? "text-luxury-gold" : ""} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-16">
        <div className="flex justify-between items-end border-b border-white/10 pb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-transparent opacity-50 z-0 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-light">Maison Admin</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
              <span className="w-4 h-px bg-luxury-gold inline-block"></span>
              London Hub / Enterprise Tier
            </p>
          </div>
          <div className="relative z-10 hidden md:flex items-center gap-4">
            <button className="px-8 py-3 glass border-white/10 hover:border-white transition-all text-[9px] uppercase tracking-[0.3em] font-medium flex items-center gap-3">
              <RefreshCcw size={12} /> Sync Marketplace
            </button>
            <button className="px-8 py-3 bg-luxury-white text-luxury-black hover:bg-luxury-gold hover:text-white transition-all text-[9px] uppercase tracking-[0.3em] font-bold">
              New Object
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <AIServiceCard />
          <AutoImportCard />
          <CJAuthCard />
          
          <div className="glass p-10 rounded-none border-white/5 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display italic font-light flex items-center gap-3">
                <Package className="text-luxury-gold" size={18} />
                Automation Intel
              </h3>
              <span className="text-[9px] uppercase tracking-widest text-green-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Systems
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/[0.02] p-6 border border-white/5">
                <div className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Active Channels</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <div className="w-1 h-1 rounded-full bg-luxury-gold" /> CJ Dropshipping
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 opacity-50">
                    <div className="w-1 h-1 rounded-full bg-gray-600" /> Spocket Global
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.02] p-6 border border-white/5">
                <div className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Logistics Routing</div>
                <div className="text-xs text-luxury-gold font-mono uppercase tracking-tight">AI-Optimized</div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]">
                <span className="text-gray-500">Global VAT Status:</span>
                <span className="text-white">Compliant (UK/US)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]">
                <span className="text-gray-500">Warehouse Link:</span>
                <span className="text-white">West London Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic List Render based on Active Tab */}
        {activeTab === 'inventory' && <InventoryList />}
        {activeTab === 'fulfillment' && <OrderList />}
        {activeTab === 'analytics' && (
          <div className="glass p-10 rounded-none border-white/5 space-y-8 flex flex-col items-center justify-center min-h-[300px]">
             <TrendingUp className="text-luxury-gold/50 mb-4" size={32} />
             <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Analytics Engine Aligning Data...</p>
          </div>
        )}
        {activeTab === 'billing' && (
          <div className="glass p-10 rounded-none border-white/5 space-y-8 flex flex-col items-center justify-center min-h-[300px]">
             <ShieldCheck className="text-luxury-gold/50 mb-4" size={32} />
             <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Financial Reserve Data Locked for Security</p>
          </div>
        )}
      </div>
    </div>
  );
}
