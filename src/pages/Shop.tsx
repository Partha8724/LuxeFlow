import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ShoppingBag, Eye, Heart, X, ShieldCheck, Truck, Sparkles, TrendingUp, Zap, Anchor } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Product } from '../types';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getRecommendations, AIRecommendation } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Architectural Silk Blazer",
    description: "Hand-stitched mulberry silk from Lake Como. Optimized for early autumn evening events.",
    price: 1250,
    currency: 'GBP',
    images: [
      "https://images.unsplash.com/photo-1594932224010-75f2a778b87d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000"
    ],
    category: "Couture",
    status: 'active',
    supplier: 'Direct',
    variants: [
      { sku: 'BLAZER-S', size: 'S', priceModifier: 0 },
      { sku: 'BLAZER-M', size: 'M', priceModifier: 0 }
    ]
  },
  {
    id: '2',
    name: "Onyx Horizon Watch",
    description: "Swiss-movement within a matte volcanic casing. A masterclass in stealth luxury.",
    price: 4800,
    currency: 'GBP',
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1587836141349-eb7ba9872cb0?auto=format&fit=crop&q=80&w=1000"
    ],
    category: "Chronometry",
    status: 'active',
    supplier: 'Direct',
    variants: [
      { sku: 'WATCH-BLACK', color: 'Black', priceModifier: 0 },
    ]
  },
  {
    id: '3',
    name: "Nebula Glass Decanter",
    description: "Hand-blown recycled glass with gold particulate patterns inspired by deep space.",
    price: 340,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1511384012138-3026553dc17d?auto=format&fit=crop&q=80&w=1000"],
    category: "Objects",
    status: 'active',
    supplier: 'Direct'
  },
  {
    id: '4',
    name: "Brutalist Chair",
    description: "Cold-rolled steel and minimalist aesthetic. Designed for sharp architectural spaces.",
    price: 850,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000"],
    category: "Objects",
    status: 'active',
    supplier: 'Direct'
  },
  {
    id: '5',
    name: "Cashmere Tech Overcoat",
    description: "Water-repellent cashmere blend. Technical elegance for the modern explorer.",
    price: 1850,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1539533727851-6a407ca8a97c?auto=format&fit=crop&q=80&w=1000"],
    category: "Couture",
    status: 'active',
    supplier: 'CJ Supply'
  },
  {
    id: '6',
    name: "Monolith Wireless Speaker",
    description: "Sandstone texture with 360-degree acoustic clarity. Sound as an architectural element.",
    price: 1200,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=1000"],
    category: "Electronics",
    status: 'active',
    supplier: 'CJ Supply'
  }
];

interface CheckoutOverlayProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

function CheckoutOverlay({ product, onClose, onAddToCart }: CheckoutOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-luxury-black flex flex-col md:flex-row overflow-y-auto overflow-x-hidden"
    >
      <button 
        onClick={onClose} 
        className="fixed top-8 right-8 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md transition-all group border border-white/10"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <div className="w-full md:w-[55%] relative min-h-[50vh] md:min-h-screen bg-[#020202] flex items-center justify-center p-12 md:sticky md:top-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black/90 via-transparent to-transparent z-10" />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src={product.images[0]} 
            className="relative z-10 w-full max-w-2xl aspect-square object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.05)]"
          />
      </div>

      <div className="w-full md:w-[45%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-luxury-black">
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="max-w-xl"
         >
            <div className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-luxury-gold"></span>
              Procurement Reserve
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-light text-white mb-6 leading-tight">
              {product.name}
            </h2>
            <div className="text-3xl font-mono text-white/90 mb-12">
              {formatCurrency(product.price, product.currency)}
            </div>
            <p className="text-gray-400 font-light leading-relaxed mb-16 text-sm text-justify">
              {product.description}
            </p>
            <div className="space-y-4 mb-16">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-5">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Logistics</span>
                <span className="text-xs font-mono text-white flex items-center gap-2">
                   <Truck size={14} className="text-luxury-gold" /> Global Express
                </span>
              </div>
            </div>
            <button 
              onClick={() => { onAddToCart(); onClose(); }}
              className="w-full py-6 bg-white text-black text-xs uppercase tracking-[0.4em] font-bold hover:bg-luxury-gold hover:text-white transition-all duration-500"
            >
              Add to Collection
            </button>
         </motion.div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index, onSelect }: { product: Product, index: number, onSelect: () => void }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const getInsight = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (insight) return;
    setLoadingInsight(true);
    // In a real app, this would hit AI engine for specific item insights
    setTimeout(() => {
      setInsight("High demand in London. 98.4% Quality Satisfaction.");
      setLoadingInsight(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 1.2 }}
      className="group"
      onClick={onSelect}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#0a0a0a] relative border border-white/5 group-hover:border-luxury-gold/40 transition-all duration-700 cursor-pointer">
        <img 
          src={product.images[0]} 
          className="w-full h-full object-cover brightness-90 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <span className="text-[8px] uppercase tracking-[0.4em] bg-black/60 backdrop-blur px-3 py-1.5 border border-white/10 text-white">
             {product.category}
           </span>
        </div>

        <button 
          onClick={getInsight}
          className="absolute top-6 right-6 w-10 h-10 rounded-none bg-black/60 backdrop-blur border border-white/10 text-luxury-gold flex items-center justify-center hover:bg-luxury-gold hover:text-white transition-all z-20 group/insight"
        >
          {loadingInsight ? <RefreshCcw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {insight && (
            <div className="absolute top-12 right-0 w-48 bg-black/90 backdrop-blur-xl border border-luxury-gold/30 p-3 text-[9px] uppercase tracking-widest leading-relaxed text-white z-30 pointer-events-none">
              {insight}
            </div>
          )}
        </button>

        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-white text-black flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Acquire Object</span>
            <ShoppingBag size={16} />
        </div>
      </div>

      <div className="mt-8 space-y-2">
         <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-display italic font-light group-hover:text-luxury-gold transition-colors duration-500">{product.name}</h3>
            <span className="text-xs font-mono opacity-60">{formatCurrency(product.price, product.currency)}</span>
         </div>
         <div className="h-px w-8 bg-white/10 group-hover:w-full group-hover:bg-luxury-gold/50 transition-all duration-1000" />
         <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 line-clamp-1">{product.description}</p>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [recs, setRecs] = useState<AIRecommendation | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    async function loadRecs() {
      const viewed = JSON.parse(localStorage.getItem('luxe_viewed_products') || '[]');
      if (viewed.length > 0) {
        setLoadingRecs(true);
        const data = await getRecommendations(viewed.slice(-3), MOCK_PRODUCTS);
        setRecs(data);
        setLoadingRecs(false);
      }
    }
    loadRecs();
  }, []);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, filterCategory]);

  const categories = ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

  return (
    <div className="pt-40 px-12 pb-32 max-w-[1500px] mx-auto min-h-screen">
      <div className="fixed top-24 left-12 h-screen w-px bg-white/5 hidden xl:block" />
      
      {/* Header */}
      <div className="relative mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-10">
        <div>
           <div className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold mb-4 font-bold flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
             Live Architecture v2.0
           </div>
           <h1 className="text-6xl md:text-8xl font-display font-light leading-none">Boutique</h1>
        </div>

        <div className="flex flex-col items-end gap-8 w-full md:w-auto">
           <div className="flex gap-10 overflow-x-auto pb-4 max-w-full no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.4em] transition-all whitespace-nowrap",
                    filterCategory === cat ? "text-luxury-gold underline underline-offset-8" : "text-gray-500 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-6 w-full">
              <input 
                type="text" 
                placeholder="Search Collection..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 md:w-80 bg-white/5 border border-white/10 p-4 text-[10px] uppercase tracking-[0.3em] outline-none focus:border-luxury-gold transition-all"
              />
           </div>
        </div>
      </div>

      {recs && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-32 p-12 glass border-luxury-gold/20 relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <Zap className="text-luxury-gold/20" size={64} />
          </div>
          <div className="relative z-10 max-w-2xl mb-16">
            <div className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold mb-4 font-bold">Predictive Curation</div>
            <h2 className="text-3xl font-display font-light mb-6">Maison Insights</h2>
            <p className="text-sm text-gray-400 font-light italic leading-relaxed">"{recs.reasoning}"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {MOCK_PRODUCTS.filter(p => recs.productIds.includes(p.id)).map((p, i) => (
                <ProductCard key={`rec-${p.id}`} product={p} index={i} onSelect={() => setSelectedProduct(p)} />
             ))}
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
        {filtered.map((product, idx) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={idx} 
            onSelect={() => setSelectedProduct(product)} 
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <CheckoutOverlay 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
            onAddToCart={() => {
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
