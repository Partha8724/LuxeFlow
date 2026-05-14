import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, Globe, Zap, Shield, Sparkles, ArrowRight, Play, Star, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Product } from '../types';

const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Onyx Horizon Watch",
    description: "Swiss-movement within a matte volcanic casing. A masterclass in stealth luxury and architectural timekeeping.",
    price: 4800,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000"],
    category: "Chronometry",
    status: 'active',
    supplier: 'Direct'
  },
  {
    id: '2',
    name: "Architectural Silk Blazer",
    description: "Hand-stitched mulberry silk from Lake Como. Optimized for early autumn evening events.",
    price: 1250,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1594932224010-75f2a778b87d?auto=format&fit=crop&q=80&w=1000"],
    category: "Couture",
    status: 'active',
    supplier: 'Direct'
  },
  {
    id: '3',
    name: "Monolith Wireless Speaker",
    description: "Sandstone texture with 360-degree acoustic clarity. Sound as an architectural element.",
    price: 1200,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=1000"],
    category: "Electronics",
    status: 'active',
    supplier: 'Direct'
  }
];

export default function Landing() {
  const [typingText, setTypingText] = useState("");
  const fullText = "THE ART OF ARCHITECTURAL PROCUREMENT.";
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#020202]">
      {/* Hero Section with Video/Atmosphere */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
             className="absolute inset-0 w-full h-full object-cover brightness-[0.2] grayscale-[0.3]"
             alt="Luxury Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-luxury-black z-10" />
           
           {/* Animated Particles/Blobs */}
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               opacity: [0.1, 0.2, 0.1],
               x: [0, 50, 0]
             }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-luxury-gold/5 blur-[150px] rounded-full" 
           />
           <motion.div 
             animate={{ 
               scale: [1.2, 1, 1.2],
               opacity: [0.05, 0.1, 0.05],
               x: [0, -50, 0]
             }}
             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full" 
           />
         </div>

         <div className="relative z-20 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div className="text-luxury-gold text-[10px] uppercase tracking-[0.8em] mb-12 flex justify-center items-center gap-6 font-bold">
                <span className="w-12 h-px bg-luxury-gold/50 hidden sm:block"></span>
                {typingText}
                <span className="w-12 h-px bg-luxury-gold/50 hidden sm:block"></span>
              </div>
              <h1 className="text-6xl md:text-[11vw] font-display font-light leading-[0.85] tracking-tight mb-12">
                LUXE <span className="text-luxury-gold italic">DOOW</span>
              </h1>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.6em] font-light mb-16 max-w-2xl mx-auto leading-relaxed">
                The Sovereign OS for Billion-Dollar Global Dropshipping Platforms and Architectural Commerce.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1, duration: 1 }}
               className="flex flex-col md:flex-row gap-8 justify-center items-center"
            >
              <button 
                onClick={() => navigate('/shop')}
                className="group relative px-16 py-7 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden"
              >
                <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                  Enter Boutique <ArrowUpRight size={14} />
                </span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="px-16 py-7 border border-white/20 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500"
              >
                Partner Registration
              </button>
            </motion.div>
         </div>

         <motion.div 
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-gray-600"
         >
            <span className="text-[8px] uppercase tracking-[0.5em]">Scroll to archive</span>
            <ChevronDown size={16} />
         </motion.div>
      </section>

      {/* Stats/Proof Section */}
      <section className="py-32 px-12 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {[
            { label: 'Global Trade Volume', val: '£1.2B+', sub: 'Autonomous Transactions' },
            { label: 'Partnership Network', val: '450+', sub: 'Luxury Manufacturers' },
            { label: 'Fulfillment Velocity', val: '< 5 Days', sub: 'USA/UK Priority' },
            { label: 'AI Optimization', val: '98.4%', sub: 'Yield Accuracy' }
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left space-y-4"
            >
              <div className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">{s.label}</div>
              <div className="text-4xl font-display font-light">{s.val}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className="py-40 px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
           <div>
              <div className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] mb-4 font-bold flex items-center gap-3">
                 <div className="w-8 h-px bg-luxury-gold" />
                 Curation v2.2
              </div>
              <h2 className="text-5xl md:text-8xl font-display font-light tracking-tight">The Best Products</h2>
           </div>
           <button 
             onClick={() => navigate('/shop')}
             className="text-[10px] uppercase tracking-[0.4em] text-gray-500 hover:text-white flex items-center gap-4 transition-colors group pb-2 border-b border-white/5 hover:border-white transition-all"
           >
             Explore Full Reserve <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
          {FEATURED_PRODUCTS.map((p, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2, duration: 1 }}
               className="group cursor-pointer"
               onClick={() => navigate('/shop')}
            >
              <div className="aspect-[4/5] bg-[#0a0a0a] border border-white/5 overflow-hidden relative mb-10 group-hover:border-luxury-gold/50 transition-all duration-700">
                <img src={p.images[0]} className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-8 left-8">
                   <div className="px-4 py-1.5 bg-black/60 backdrop-blur border border-white/10 text-[8px] uppercase tracking-[0.3em] text-white">{p.category}</div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-white text-black flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Acquire Object</span>
                    <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-4">
                 <h3 className="text-3xl font-display font-light italic group-hover:text-luxury-gold transition-colors duration-500">{p.name}</h3>
                 <span className="text-sm font-mono text-gray-500">{formatCurrency(p.price, p.currency)}</span>
              </div>
              <div className="h-px w-12 bg-white/10 group-hover:w-full group-hover:bg-luxury-gold/30 transition-all duration-1000" />
              <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-gray-600 line-clamp-2 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-52 relative overflow-hidden bg-white text-black">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none scale-150">
          <Shield size={400} />
        </div>
        <div className="max-w-[1400px] mx-auto px-12 relative z-10 flex flex-col xl:flex-row items-center justify-between gap-32">
           <div className="max-w-2xl text-center xl:text-left">
             <div className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold mb-8 font-bold">Infrastructure Excellence</div>
             <h2 className="text-6xl md:text-8xl font-display font-medium leading-[0.85] mb-12 tracking-tighter">THE OS FOR BILLION-DOLLAR VIRTUES.</h2>
             <p className="text-xl font-light leading-relaxed mb-16 text-gray-600 italic">
               "Luxe Doow is not just a store. It is the architectural spine of global luxury commerce, automating the bridge between partner intelligence and high-end storefront beauty."
             </p>
             <button 
               onClick={() => navigate('/seller')}
               className="px-16 py-7 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gold transition-colors duration-500 shadow-2xl"
             >
               Explore Partner Central
             </button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full xl:w-auto">
              {[
                { icon: Zap, text: 'AI Autonomous Yield', sub: 'Dynamic Pricing Engine' },
                { icon: Shield, text: 'Enterprise Grade', sub: 'End-to-End Security' },
                { icon: Globe, text: 'Global Logistics', sub: 'UK/USA Express Links' },
                { icon: Sparkles, text: 'Master Curation', sub: 'High-End Manufacturer Access' }
              ].map((item, i) => (
                <div key={i} className="p-10 border border-black/10 flex flex-col items-center xl:items-start text-center xl:text-left gap-6 group hover:bg-black hover:text-white transition-all duration-700">
                  <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <item.icon size={24} strokeWidth={1} className="group-hover:scale-110 group-hover:text-luxury-gold transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold mb-2">{item.text}</h4>
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-gray-400">{item.sub}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
