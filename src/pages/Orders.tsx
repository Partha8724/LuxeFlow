import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Package, Truck, Clock } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Navigate } from 'react-router-dom';

export default function Orders() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setFetching(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'orders'),
          where('buyerId', '==', user.uid),
          orderBy('createdAt', 'desc')
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
      <div className="pt-40 px-12 pb-32 max-w-[1400px] mx-auto flex justify-center text-luxury-gold uppercase tracking-[0.5em] text-[10px]">
        Retrieving records...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="pt-40 px-12 pb-32 max-w-[1200px] mx-auto min-h-screen">
      <div className="border-b border-white/5 pb-10 mb-16">
        <div className="text-xs-wide text-luxury-gold mb-4 opacity-80">Client Profile</div>
        <h1 className="text-5xl md:text-6xl font-display font-light">Your Acquisitions</h1>
      </div>

      {orders.length === 0 ? (
        <div className="glass p-16 text-center border-white/5">
          <p className="text-gray-400 font-light mb-6">No procurements have been recorded for your account yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={order.id}
              className="glass p-8 border-white/5 hover:border-luxury-gold/20 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-6 border-b border-white/5 pb-8">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Order Reference</div>
                  <div className="font-mono text-sm">{order.id}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Total Valuation</div>
                  <div className="font-mono text-sm text-luxury-gold">
                    {formatCurrency(parseFloat(order.total || 0), order.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Status</div>
                  <div className="flex items-center gap-2">
                    {order.status === 'SHIPPED' ? <Truck size={14} className="text-luxury-gold" /> :
                     order.status === 'PAID' ? <Clock size={14} className="text-green-500" /> :
                     <Package size={14} className="text-gray-500" />}
                    <span className="text-xs font-mono uppercase text-white tracking-widest">{order.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Secured Objects</div>
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-white/[0.02] p-4 text-sm font-light">
                    <span className="italic font-display">{item.name}</span>
                    <span className="font-mono text-gray-400">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center bg-luxury-gold/5 p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 md:mb-0">Logistics Tracking Intitiated</div>
                  <div className="font-mono text-luxury-gold flex items-center gap-4">
                    <span>{order.trackingNumber}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
