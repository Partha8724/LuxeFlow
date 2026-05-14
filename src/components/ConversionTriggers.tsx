import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Zap, ShieldCheck, Globe, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface Sale {
  id: string;
  name: string;
  location: string;
  time: string;
}

const LOCATIONS = ['London', 'Tokyo', 'Zurich', 'New York', 'Dubai', 'Paris', 'Monaco', 'Singapore'];
const PRODUCTS = ['Architectural Timepiece', 'Silk Matrix', 'Titanium Frame', 'Obsidian Desk', 'Ethereal Soundbar'];

export function ConversionTriggers() {
  const [activeSale, setActiveSale] = useState<Sale | null>(null);

  useEffect(() => {
    const triggerSale = () => {
      const name = ['Alex', 'Julian', 'Maximilian', 'Elena', 'Satoshi', 'Vincenzo'][Math.floor(Math.random() * 6)];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      
      setActiveSale({
        id: Math.random().toString(36),
        name: `${name} K.`,
        location: location,
        time: 'Just now'
      });

      setTimeout(() => setActiveSale(null), 5000);
    };

    const timer = setInterval(() => {
      if (Math.random() > 0.7) triggerSale();
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-[100] pointer-events-none">
      <AnimatePresence>
        {activeSale && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="bg-[#080808] border border-luxury-gold/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 backdrop-blur-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold shrink-0 border border-luxury-gold/20">
               <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-1">Live Acquisition</p>
              <p className="text-[11px] text-white font-medium">
                <span className="text-luxury-gold italic">{activeSale.name}</span> in <span className="text-white font-black">{activeSale.location}</span>
              </p>
              <div className="flex items-center gap-3 mt-2 text-[8px] uppercase tracking-widest text-green-500 font-bold">
                 <Zap size={10} className="fill-green-500" />
                 Verified Settlement
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TrustBanner() {
  return (
    <div className="bg-luxury-gold py-1.5 px-6 flex items-center justify-center gap-8 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 whitespace-nowrap">
          <ShieldCheck size={12} className="text-black" />
          <span className="text-black text-[9px] uppercase tracking-[0.4em] font-black">Billion-Dollar Architectural Security Active</span>
          <div className="w-1 h-1 bg-black/30 rounded-full" />
          <Globe size={12} className="text-black" />
          <span className="text-black text-[9px] uppercase tracking-[0.4em] font-black">Global Priority Fulfillment</span>
          <div className="w-8 h-px bg-black/20" />
        </div>
      ))}
    </div>
  );
}
