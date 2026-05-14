import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export function MiniCart() {
  const { cart, isCartOpen, toggleCart, removeFromCart, cartTotal } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-luxury-black border-l border-white/10 z-50 flex flex-col pt-safe-top"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-display font-light uppercase tracking-widest text-luxury-gold">Your Selection</h2>
              <button onClick={toggleCart} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <p className="text-sm font-light uppercase tracking-widest mb-4">Your bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 group bg-white/[0.02] border border-white/5 p-4 hover:border-luxury-gold/30 transition-colors">
                    <div className="w-20 h-24 overflow-hidden bg-black/20">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-display">{item.product.name}</h3>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="text-luxury-gold text-sm font-mono tracking-widest">
                        {formatCurrency(item.product.price * item.quantity, item.product.currency)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-luxury-black/90 pb-safe-bottom">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Estimated Total</span>
                  <span className="text-lg font-mono text-white tracking-widest">{formatCurrency(cartTotal, cart[0].product.currency)}</span>
                </div>

                {!user ? (
                   <div className="border border-white/10 p-4 bg-white/[0.02] text-center mb-4 text-xs font-light text-gray-400">
                     Authentication required to finalize procurement.
                     <button 
                       onClick={signInWithGoogle}
                       className="w-full mt-4 bg-luxury-white text-luxury-black py-4 text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-gold transition-colors"
                     >
                        Authenticate
                     </button>
                   </div>
                ) : (
                   <div className="space-y-4">
                     {status === 'success' ? (
                       <div className="text-center py-4 border border-green-500/30 text-green-400 bg-green-500/5 uppercase tracking-widest text-[10px]">
                         Procurement Successful!
                       </div>
                     ) : (
                       <PayPalButtons 
                         style={{ layout: 'vertical', color: 'white', shape: 'pill', label: 'checkout', height: 48 }}
                         createOrder={async () => {
                           const res = await axios.post('/api/paypal/create-order', {
                             amount: cartTotal,
                             currency: cart[0].product.currency,
                             items: cart.map(i => ({
                               id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity
                             }))
                           });
                           return res.data.id;
                         }}
                         onApprove={async (data) => {
                           setStatus('processing');
                           try {
                             const res = await axios.post('/api/paypal/capture-order', {
                               orderID: data.orderID,
                               buyerId: user.uid,
                               shippingInfo: {
                                 name: user.displayName || "Luxe Client",
                                 address: "123 High Street", city: "London", postcode: "SW1A 1AA",
                                 country: "United Kingdom", phone: "0123456789"
                               }
                             });
                             if (res.data.status === 'COMPLETED') setStatus('success');
                           } catch (e) {
                             setStatus('error');
                           }
                         }}
                       />
                     )}
                     <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.4em] text-gray-600">
                      <ShieldCheck size={12} className="text-luxury-gold" />
                      <span>Encrypted Transaction</span>
                     </div>
                   </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
