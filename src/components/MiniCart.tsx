import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
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
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#050505] border-l border-white/10 z-[100] flex flex-col pt-safe-top shadow-[-20px_0_100px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-10 border-b border-white/[0.05]">
              <div>
                <h2 className="text-3xl font-display font-light text-white tracking-tighter">Your <span className="text-luxury-gold italic">Selection</span></h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mt-2 font-bold">Secure Procurement Queue</p>
              </div>
              <button 
                onClick={toggleCart} 
                className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all group"
              >
                <X size={20} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <ShoppingBag size={64} strokeWidth={1} className="text-gray-700" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">The Reserve is Empty.</p>
                  <button 
                    onClick={toggleCart}
                    className="px-8 py-3 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Start Acquisition
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-8 group animate-fade-in relative">
                    <div className="w-28 h-36 overflow-hidden bg-white/[0.02] border border-white/5 flex-shrink-0 group-hover:border-luxury-gold/50 transition-all duration-700">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-display text-white mb-2 leading-tight group-hover:text-luxury-gold transition-colors">{item.product.name}</h3>
                          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black">Ref: {item.product.id.slice(0, 8)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-700 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-end justify-between">
                         <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">Quantity</span>
                            <div className="flex items-center gap-4 text-xs font-mono text-white">
                               <button className="text-gray-600 hover:text-white">—</button>
                               <span>{item.quantity}</span>
                               <button className="text-gray-600 hover:text-white">+</button>
                            </div>
                         </div>
                         <div className="text-xl font-display italic text-white tracking-tight">
                           {formatCurrency(item.product.price * item.quantity, item.product.currency)}
                         </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-10 border-t border-white/10 bg-[#080808] space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-2">Total Value</p>
                    <p className="text-3xl font-display font-bold text-white tracking-tighter">
                      {formatCurrency(cartTotal, cart[0].product.currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-green-500 uppercase tracking-[0.3em] font-black mb-1 flex items-center justify-end gap-2">
                      <ShieldCheck size={12} /> Priority Verified
                    </p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">Insurance Included</p>
                  </div>
                </div>

                {!user ? (
                   <div className="space-y-6">
                     <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] text-center leading-relaxed">Identity verification protocol required for final billion-dollar tier settlement.</p>
                     <button 
                       onClick={signInWithGoogle}
                       className="w-full bg-white text-black py-6 text-[11px] uppercase tracking-[0.6em] font-black hover:bg-luxury-gold hover:text-white transition-all shadow-2xl"
                     >
                       Authenticate via Google
                     </button>
                   </div>
                ) : (
                   <div className="space-y-8">
                      <button 
                        className="w-full bg-luxury-gold text-white py-6 text-[11px] uppercase tracking-[0.6em] font-black hover:bg-white hover:text-black transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)] flex items-center justify-center gap-4 group"
                      >
                         Initialize Settlement <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                      <div className="flex flex-col items-center gap-4">
                         <div className="flex gap-6 opacity-30">
                            {/* Card Network Logos Placeholder */}
                            <div className="w-10 h-6 bg-white/20 rounded-sm" />
                            <div className="w-10 h-6 bg-white/20 rounded-sm" />
                            <div className="w-10 h-6 bg-white/20 rounded-sm" />
                         </div>
                         <p className="text-[9px] uppercase tracking-[0.5em] text-gray-700">Encrypted via Billion-Dollar Shield</p>
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
