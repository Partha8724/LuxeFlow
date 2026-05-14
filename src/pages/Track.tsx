import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, MapPin, Truck, CheckCircle2, ShieldCheck, Globe, Clock, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Track() {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = () => {
    if (!trackingId) return;
    setLoading(true);
    // Simulate high-tech backend lookup
    setTimeout(() => {
      setResult({
        id: trackingId.toUpperCase(),
        status: 'IN TRANSIT',
        location: 'Global Distribution Hub - Shenzhen',
        eta: 'May 18, 2026',
        steps: [
          { status: 'Order Verified', time: 'May 14, 2026 - 09:12', completed: true },
          { status: 'Neural Quality Assurance', time: 'May 14, 2026 - 14:00', completed: true },
          { status: 'Dispatch to Global Hub', time: 'May 15, 2026 - 02:45', completed: true },
          { status: 'Carrier Assignment (Air Matrix)', time: 'May 15, 2026 - 22:10', completed: false },
          { status: 'Customs Clearance Protocol', time: 'Pending', completed: false }
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black pt-40 px-6 pb-32">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="text-luxury-gold text-[10px] uppercase tracking-[0.8em] font-black mb-6">Logistics Matrix</div>
          <h1 className="text-6xl md:text-8xl font-display font-medium text-white tracking-tighter mb-8 italic">
            SECURE <span className="text-luxury-gold not-italic">TRACKING</span>
          </h1>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
            Real-time satellite surveillance of your global procurement. Encrypted end-to-end.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-24 max-w-2xl mx-auto">
          <input 
            type="text"
            placeholder="ENTER TRANSMISSION ID (e.g. LUXE-8829-X)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full bg-[#080808] border border-white/10 p-8 pl-16 text-white font-mono text-sm tracking-widest placeholder:text-gray-700 focus:outline-none focus:border-luxury-gold/50 transition-all shadow-2xl"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" size={24} />
          <button 
            onClick={handleTrack}
            disabled={loading || !trackingId}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-8 py-3 text-[10px] uppercase tracking-widest font-black hover:bg-luxury-gold hover:text-white transition-all disabled:opacity-30 flex items-center gap-3"
          >
            {loading ? 'CALCULATING...' : 'INITIALIZE'} <ArrowRight size={14} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-2 border-luxury-gold/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-t-2 border-luxury-gold rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Globe className="absolute inset-0 m-auto text-luxury-gold animate-pulse" size={32} />
              </div>
              <div className="space-y-4 text-center">
                <p className="text-luxury-gold text-[10px] uppercase tracking-[0.6em] font-black">Syncing with Orbital Carriers</p>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      className="w-1.5 h-1.5 bg-luxury-gold rounded-full"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-12"
            >
              {/* Main Status */}
              <div className="md:col-span-12 bg-[#080808] border border-white/5 p-12 relative overflow-hidden flex flex-col md:flex-row justify-between gap-12">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Package size={200} />
                </div>
                
                <div className="relative z-10">
                   <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-4">Current Status</p>
                   <h2 className="text-5xl font-display text-white tracking-tighter italic flex items-center gap-6">
                     {result.status} <Zap className="text-luxury-gold fill-luxury-gold" size={32} />
                   </h2>
                   <div className="mt-8 flex gap-8">
                      <div>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Expected Delivery</p>
                        <p className="text-xl font-display text-luxury-gold">{result.eta}</p>
                      </div>
                      <div className="w-px bg-white/10" />
                      <div>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Carrier Network</p>
                        <p className="text-xl font-display text-white">SKY-VECTOR 9</p>
                      </div>
                   </div>
                </div>

                <div className="relative z-10 flex flex-col justify-between items-start md:items-end text-left md:text-right">
                   <div className="bg-luxury-gold/10 border border-luxury-gold/30 px-6 py-3 rounded-full mb-8">
                      <p className="text-[9px] text-luxury-gold uppercase tracking-[0.3em] font-black flex items-center gap-3">
                        <ShieldCheck size={14} /> Identity Verified
                      </p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">Transmission ID</p>
                     <p className="text-sm font-mono text-white tracking-widest font-black">{result.id}</p>
                   </div>
                </div>
              </div>

              {/* Steps */}
              <div className="md:col-span-7 bg-[#080808] border border-white/5 p-12">
                 <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white mb-12 border-b border-white/5 pb-8">Temporal Log</h3>
                 <div className="space-y-12">
                    {result.steps.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-8 relative group">
                        {idx !== result.steps.length - 1 && (
                          <div className={cn(
                            "absolute left-4 top-10 w-0.5 h-12",
                            step.completed ? "bg-luxury-gold" : "bg-white/5"
                          )} />
                        )}
                        <div className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-500",
                          step.completed ? "bg-luxury-gold border-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" : "bg-transparent border-white/10 text-gray-700"
                        )}>
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1 pb-4">
                           <p className={cn(
                             "text-[10px] uppercase tracking-widest font-black transition-colors duration-500",
                             step.completed ? "text-white" : "text-gray-700"
                           )}>{step.status}</p>
                           <p className="text-[10px] font-mono text-gray-600 mt-2">{step.time}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Map/Context */}
              <div className="md:col-span-5 space-y-8">
                 <div className="bg-[#080808] border border-white/5 p-10 h-[300px] relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-[10s]">
                       {/* Mock Map Background */}
                       <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#222_1px,_transparent_1px)] [background-size:20px_20px]" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <MapPin className="text-luxury-gold" size={32} strokeWidth={1} />
                        <div>
                          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-2">Last Reported Position</p>
                          <p className="text-xl font-display text-white italic">{result.location}</p>
                        </div>
                    </div>
                    <div className="absolute bottom-8 left-8 flex items-center gap-4 text-green-500 animate-pulse">
                       <div className="w-2 h-2 bg-green-500 rounded-full" />
                       <span className="text-[10px] uppercase tracking-widest font-black">Satellite Online</span>
                    </div>
                 </div>

                 <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-10 space-y-6">
                    <Clock className="text-luxury-gold" size={32} />
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] leading-relaxed">
                      Your acquisition is currently moving through core distribution logic. Architectural alignment with your delivery coordinates is 98% complete.
                    </p>
                    <button className="text-[10px] uppercase tracking-[0.4em] font-black text-luxury-gold hover:text-white transition-colors flex items-center gap-4">
                      Notify Local Courier <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-[#080808] border border-white/5 p-20 text-center space-y-8"
            >
               <Truck size={64} strokeWidth={0.5} className="mx-auto text-gray-800" />
               <p className="text-[11px] text-gray-600 uppercase tracking-[0.4em] font-black">Waiting for Authorization...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
