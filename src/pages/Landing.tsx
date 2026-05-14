import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Star } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Product } from '../types';

const BEST_PRODUCT: Product = {
  id: 'apple-mock-1',
  name: "Horizon Pro Titanium Max",
  description: "Forged from aerospace-grade titanium. The ultimate expression of technological artistry and precision engineering.",
  price: 1499,
  currency: 'USD',
  images: [
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1603898037225-b77055745778?auto=format&fit=crop&q=80&w=1000"
  ],
  category: "Technology",
  status: 'active',
  supplier: 'Direct'
};

const DISCOUNT_PRODUCTS: Product[] = [
  {
    id: 'disc-1',
    name: "AeroPod Pro Acoustics",
    description: "Active noise cancellation and adaptive transparency in a sleek obsidian shell.",
    price: 199,
    currency: 'USD',
    images: ["https://images.unsplash.com/photo-1608044736181-ed7d0c3eb1a8?auto=format&fit=crop&q=80&w=1000"],
    category: "Audio",
    status: 'active',
    supplier: 'Direct'
  },
  {
    id: 'disc-2',
    name: "Nova Smart Display",
    description: "The minimalist ambient display that seamlessly blends into your architectural space.",
    price: 249,
    currency: 'USD',
    images: ["https://images.unsplash.com/photo-1627918542456-11f421f1d198?auto=format&fit=crop&q=80&w=1000"],
    category: "Technology",
    status: 'active',
    supplier: 'Direct'
  }
];

// Typing Animation Hook
function useTypewriter(text: string, speed = 100) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);
    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayedText;
}

export default function Landing() {
  const typingText = useTypewriter("Pioneering the Future of Premium Dropshipping", 50);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cinematic Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="text-center max-w-5xl z-10"
        >
          <div className="text-xs-wide text-luxury-gold mb-8 opacity-80 min-h-[20px]">
            {typingText}
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-light mb-8 tracking-tight leading-[0.85]">
            LUXE <span className="text-luxury-gold italic font-light">FLOW</span>
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.6em] font-light mb-20 max-w-lg mx-auto leading-relaxed">
            Curating a global collection of architectural objects and high-end horology.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link 
              to="/shop" 
              className="group relative px-14 py-6 bg-luxury-white text-luxury-black font-semibold tracking-[0.3em] overflow-hidden uppercase text-[10px] transition-all duration-700"
            >
              <span className="relative z-10">Secure Procurement</span>
              <div className="absolute inset-0 bg-luxury-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700" />
            </Link>
            <Link 
              to="/seller" 
              className="px-14 py-6 border border-white/10 hover:border-white transition-all duration-700 uppercase text-[10px] tracking-[0.3em] font-light"
            >
              Partner Portal
            </Link>
          </div>
        </motion.div>
        
        {/* Cinematic background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-luxury-gold/5 rounded-full blur-[200px] -z-10 animate-pulse duration-[10000ms]" />
        
        <div className="absolute bottom-16 left-12 text-[9px] uppercase tracking-[0.5em] text-white/30 font-light flex flex-col gap-2">
          <span className="text-luxury-gold opacity-60">Status: Integrated</span>
          <span>London • New York • Singapore</span>
        </div>
      </section>

      {/* Flagship Product Showcase (Apple-style) */}
      <section className="relative py-40 border-t border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-luxury-gold/30 bg-luxury-gold/5 text-luxury-gold text-[9px] uppercase tracking-[0.4em]">
                  <Star size={10} />
                  Flagship Recommendation
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-light mb-6">
                  {BEST_PRODUCT.name}
                </h2>
                <p className="text-gray-400 font-light leading-relaxed mb-10 max-w-lg">
                  {BEST_PRODUCT.description}
                  <br/><br/>
                  Immerse yourself in unparalleled clarity. Engineered with a proprietary thermal architecture to sustain peak performance.
                </p>
                
                <div className="flex items-center gap-8 mb-12">
                  <div className="text-3xl font-mono tracking-widest">{formatCurrency(BEST_PRODUCT.price, BEST_PRODUCT.currency)}</div>
                  <button className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 hover:border-luxury-gold hover:text-luxury-gold transition-colors">
                    <Play size={16} className="ml-1" />
                  </button>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Watch Film</span>
                </div>

                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-luxury-gold hover:text-white transition-colors group"
                >
                  Explore Collection
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 aspect-square max-w-2xl mx-auto rounded-3xl overflow-hidden glass p-4 group"
              >
                <img 
                  src={BEST_PRODUCT.images[0]} 
                  alt={BEST_PRODUCT.name} 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-[2s] grayscale-[0.2] hover:grayscale-0"
                />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-luxury-gold/5 blur-[100px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Bot Discovery / Discount Offers */}
      <section className="py-40 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-light mb-6">Automated Discovery</h2>
            <p className="text-gray-500 font-light leading-relaxed text-sm">
              Our AI continuously scans the global marketplace to identify premium hardware experiencing temporary price inefficiencies. Act quickly to secure these objects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {DISCOUNT_PRODUCTS.map((prod, idx) => (
              <motion.div 
                key={prod.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 1 }}
                className="flex flex-col md:flex-row gap-8 glass p-8 border-white/5 hover:border-luxury-gold/30 transition-colors group"
              >
                <div className="w-full md:w-1/2 aspect-square overflow-hidden bg-white/5">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="inline-block px-2 py-1 bg-red-900/30 text-red-400 text-[8px] uppercase tracking-[0.5em] mb-4 border border-red-500/20 w-fit">
                    AI Opportunity Detected
                  </div>
                  <h3 className="text-2xl font-display font-light mb-4">{prod.name}</h3>
                  <p className="text-gray-500 text-xs font-light mb-8 line-clamp-3">{prod.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-gray-600 line-through text-xs font-mono mr-3">
                        {formatCurrency(prod.price * 1.5, prod.currency)}
                      </span>
                      <span className="text-luxury-gold text-lg font-mono">
                        {formatCurrency(prod.price, prod.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
