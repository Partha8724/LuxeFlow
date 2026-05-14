import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Package, Truck, Clock, ArrowLeft, Shield, ChevronRight, LogOut, Search } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Navigate, Link, useNavigate } from 'react-router-dom';

export default function Orders() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setFetching(false);
        return;
      }
      try {
        // Query by userId (new) or buyerId (old)
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
        <div className="w-16 h-16 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
        <div className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] font-black animate-pulse">Syncing Transaction Matrix</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="pt-40 px-6 pb-32 max-w-[1400px] mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12"
      >
        <div className="relative">
          <div className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] mb-6 font-black flex items-center gap-4">
             <div className="w-12 h-px bg-luxury-gold" />
             Procurement Records
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-medium text-white tracking-tighter">
            THE <span className="text-luxury-gold italic">ARCHIVE</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-8">
          <Link to="/profile" className="px-8 py-4 border border-white/10 text-[10px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all font-bold">
            Profile Matrix
          </Link>
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-luxury-gold hover:text-white transition-colors group font-black"
          >
            <Search size={16} /> New Acquisition
          </button>
        </div>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#080808] border border-white/5 p-24 text-center max-w-3xl mx-auto space-y-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
          <Package size={80} strokeWidth={0.5} className="mx-auto text-gray-800" />
          <div>
            <h2 className="text-3xl font-display text-white mb-4">No Records Identified.</h2>
            <p className="text-gray-500 text-[11px] uppercase tracking-[0.3em] leading-relaxed max-w-sm mx-auto">
              Your global procurement history is currently empty. Initialize your first acquisition to begin tracking.
            </p>
          </div>
          <Link 
            to="/shop" 
            className="inline-block px-12 py-5 bg-white text-black text-[10px] uppercase tracking-[0.5em] font-black hover:bg-luxury-gold hover:text-white transition-all shadow-xl"
          >
            Access Boutique
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Summary Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#080808] border border-white/[0.05] p-10 space-y-10">
               <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-4">Total Assets Held</p>
                  <p className="text-5xl font-display font-medium text-white tracking-tighter">
                    {orders.length} <span className="text-xl text-luxury-gold">Objects</span>
                  </p>
               </div>
               <div className="h-px bg-white/5" />
               <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-gray-600 font-bold">Trust Standing</span>
                    <span className="text-luxury-gold font-black">99.9% Reliable</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-gray-600 font-bold">Member Tier</span>
                    <span className="text-white font-black">Elite Private</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-luxury-gold/5 border border-luxury-gold/10 p-8 flex items-center gap-6">
               <Shield className="text-luxury-gold" size={32} />
               <p className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold leading-relaxed font-bold">
                 All acquisitions are secured via end-to-end architectural encryption.
               </p>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-8 space-y-8">
            {orders.map((order, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={order.id}
                className="bg-[#080808] border border-white/[0.08] hover:border-luxury-gold/30 transition-all duration-700 p-10 md:p-12 relative group overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-luxury-gold/[0.03] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="flex flex-col md:flex-row justify-between mb-12 gap-8 items-start md:items-center">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-black">Transmission ID</div>
                    <div className="font-mono text-sm text-white tracking-wider font-bold">
                      {order.id.slice(0, 12).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex gap-12">
                     <div>
                        <div className="text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-black">Settlement</div>
                        <div className="font-display text-xl text-luxury-gold">
                          {formatCurrency(parseFloat(order.amount || order.total || 0), order.currency || 'GBP')}
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-black">Status</div>
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "w-2 h-2 rounded-full",
                             order.status === 'SHIPPED' ? "bg-luxury-gold" : "bg-green-500"
                           )} />
                           <span className="text-[10px] font-bold uppercase text-white tracking-[0.3em]">{order.status}</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                   <div className="text-[8px] uppercase tracking-[0.5em] text-gray-800 font-black mb-4">Object Designation</div>
                   <div className="bg-white/[0.01] border border-white/5 p-6 flex justify-between items-center group-hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                            <Package size={20} className="text-gray-600" />
                         </div>
                         <div>
                            <p className="text-sm font-display font-medium text-white italic">{order.productName || (order.items?.[0]?.name)}</p>
                            <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">QTY: {order.items?.[0]?.quantity || 1}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-800 group-hover:text-luxury-gold transition-colors" />
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-8 border-t border-white/5">
                   <div className="space-y-4">
                      <div className="text-[9px] uppercase tracking-[0.4em] text-gray-700 font-bold">Fulfillment Logistics</div>
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium">
                         <Truck size={14} className="text-luxury-gold" />
                         <span>Tracking: {order.trackingNumber || 'GENERATING MATRIX...'}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em] font-black mb-1">Timestamp</p>
                      <p className="text-[10px] font-mono text-gray-500">
                        {order.timestamp?.toDate ? order.timestamp.toDate().toLocaleString() : new Date().toLocaleString()}
                      </p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
