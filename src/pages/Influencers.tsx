import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, TrendingUp, DollarSign, Share2, 
  Target, Zap, ShieldCheck, ArrowRight,
  Gift, Trophy, MessageSquare, Instagram, 
  Chrome, Music2, Search
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Influencers() {
  const [activeSegment, setActiveSegment] = useState('Marketplace');

  const influencers = [
    { name: 'Maison Noir', followers: '1.2M', niche: 'Minimalist Tech', status: 'Active' },
    { name: 'Architectural Digest', followers: '450K', niche: 'Home Ecosystems', status: 'Active' },
    { name: 'Quantum Design', followers: '890K', niche: 'Wearable Logic', status: 'Growth' },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12"
        >
          <div>
            <div className="text-luxury-gold text-[10px] uppercase tracking-[0.8em] mb-6 font-black flex items-center gap-4">
               <div className="w-12 h-px bg-luxury-gold" />
               Partner Ecosystem
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-medium text-white tracking-tighter">
              CREATOR <span className="text-luxury-gold italic">ATELIER</span>
            </h1>
            <p className="text-gray-500 text-[11px] uppercase tracking-[0.4em] mt-6 max-w-xl leading-relaxed">
              The high-conversion interface for architectural influencers. Monetize your curation with Billion-Dollar efficiency.
            </p>
          </div>
          
          <button className="bg-white text-black px-12 py-5 text-[11px] uppercase tracking-[0.5em] font-black hover:bg-luxury-gold hover:text-white transition-all shadow-2xl flex items-center gap-4">
            Initialize Partnership <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Dash Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {['Marketplace', 'Affiliate Matrix', 'Content Factory', 'Growth Insights'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSegment(tab)}
                className={cn(
                  "w-full p-6 border text-left transition-all group flex justify-between items-center",
                  activeSegment === tab 
                    ? "bg-luxury-gold border-luxury-gold text-black italic font-display text-xl" 
                    : "bg-[#080808] border-white/5 text-gray-500 hover:border-white/20"
                )}
              >
                <span className={cn(
                  activeSegment === tab ? "opacity-100" : "text-[10px] uppercase tracking-widest font-black"
                )}>{tab}</span>
                {activeSegment === tab ? <Zap size={16} fill="black" /> : <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}

            <div className="mt-12 p-8 bg-luxury-gold/5 border border-luxury-gold/10 space-y-4">
               <Gift className="text-luxury-gold" size={24} />
               <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Refer 10 creators to unlock the <span className="text-luxury-gold font-black">Architect Tier</span> commission multiplier.</p>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-9">
            <div className="bg-[#080808] border border-white/5 p-12">
               <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
                  <h3 className="text-xs uppercase tracking-[0.5em] text-white font-black">Viral Affiliate Network</h3>
                  <div className="flex gap-4">
                     <button className="p-3 bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors">
                        <Search size={16} />
                     </button>
                  </div>
               </div>

               <div className="space-y-6">
                  {influencers.map((inf, i) => (
                    <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-black/40 border border-white/5 hover:border-luxury-gold/30 transition-all group">
                       <div className="flex items-center gap-8 mb-6 md:mb-0">
                          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-luxury-gold group-hover:border-luxury-gold transition-colors">
                             <Users size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-display text-white">{inf.name}</h4>
                            <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black mt-1">{inf.niche}</p>
                          </div>
                       </div>
                       <div className="flex gap-16 items-center">
                          <div className="text-center">
                             <p className="text-[9px] text-gray-700 uppercase tracking-widest mb-1">Followers</p>
                             <p className="text-lg font-mono text-white tracking-tighter">{inf.followers}</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[9px] text-gray-700 uppercase tracking-widest mb-1">Status</p>
                             <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                {inf.status}
                             </div>
                          </div>
                          <button className="px-6 py-3 border border-white/10 text-[9px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all font-black">
                            Audit Performance
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white/[0.02] border border-white/5 p-12 space-y-6 group hover:border-luxury-gold/20 transition-all">
                  <Music2 className="text-luxury-gold opacity-50 group-hover:opacity-100 transition-opacity" size={32} />
                  <h4 className="text-lg font-display text-white italic">Viral Hub Management</h4>
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] leading-relaxed">
                    Automatically generate TikTok and IG Reels captions optimized for our procurement engine.
                  </p>
                  <button className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-black border-b border-luxury-gold/30 pb-1">Initialize Content Engine</button>
               </div>
               <div className="bg-white/[0.02] border border-white/5 p-12 space-y-6 group hover:border-luxury-gold/20 transition-all">
                  <Share2 className="text-luxury-gold opacity-50 group-hover:opacity-100 transition-opacity" size={32} />
                  <h4 className="text-lg font-display text-white italic">Social Propagation Matrix</h4>
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] leading-relaxed">
                    Distribute unique tracking identifiers across your digital nodes to capture attribution.
                  </p>
                  <button className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-black border-b border-luxury-gold/30 pb-1">Get Matrix Links</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
