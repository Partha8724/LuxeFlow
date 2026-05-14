import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ShoppingBag, Eye, Heart, X, ShieldCheck, Truck } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Product } from '../types';
import React, { useState, useEffect, useMemo } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { getRecommendations, AIRecommendation } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Architectural Silk Blazer",
    description: "Hand-stitched mulberry silk from Lake Como.",
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
    description: "Swiss-movement within a matte volcanic casing.",
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
    description: "Hand-blown recycled glass with gold particulate.",
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
    description: "Cold-rolled steel and minimalist aesthetic.",
    price: 850,
    currency: 'GBP',
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000"],
    category: "Objects",
    status: 'active',
    supplier: 'Direct'
  }
];

interface CheckoutOverlayProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

function CheckoutOverlay({ product, onClose, onAddToCart }: CheckoutOverlayProps) {
  useEffect(() => {
    // Prevent background scrolling while overlay is open
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-luxury-black flex flex-col md:flex-row overflow-y-auto overflow-x-hidden min-h-screen"
    >
      <button 
        onClick={onClose} 
        className="fixed top-8 right-8 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md transition-all group border border-white/10"
      >
        <X size={20} className="group-hover:rotate-90 group-hover:scale-110 transition-transform duration-500" />
      </button>

      {/* Left: Expansive Imagery */}
      <div className="w-full md:w-[55%] relative min-h-[50vh] md:min-h-screen bg-[#020202] flex items-center justify-center p-12 md:p-24 md:sticky md:top-0 order-1 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black/90 via-luxury-black/20 to-transparent z-10" />
         
         <div className="absolute top-12 left-12 z-20 flex flex-col gap-3">
             <span className="text-[9px] uppercase tracking-[0.4em] px-4 py-2 bg-white/5 backdrop-blur-xl rounded border border-white/10 text-white text-center">
               {product.category}
             </span>
             {product.supplier && (
               <span className="text-[9px] uppercase tracking-[0.4em] px-4 py-2 bg-luxury-gold/5 backdrop-blur-xl rounded border border-luxury-gold/20 text-luxury-gold text-center">
                 {product.supplier}
               </span>
             )}
         </div>
         
         <motion.div
           initial={{ scale: 1.05, opacity: 0, filter: 'blur(10px)' }}
           animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
           transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
           className="relative z-10 w-full max-w-2xl aspect-square md:aspect-auto md:h-[80vh]"
         >
           <img 
             src={product.images[0]} 
             alt={product.name} 
             className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.05)] brightness-90 contrast-[1.1] grayscale-[0.1]"
           />
         </motion.div>
      </div>

      {/* Right: Content & Actions */}
      <div className="w-full md:w-[45%] p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 bg-luxury-black relative z-20 min-h-screen">
         <motion.div 
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
           className="max-w-xl mx-auto md:mx-0 w-full"
         >
            <div className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold mb-8 font-semibold flex items-center gap-3">
              <span className="w-8 h-px bg-luxury-gold"></span>
              Exclusive Procurement
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-white mb-6 leading-[1.1] tracking-tight">
              {product.name}
            </h2>
            
            <div className="flex items-center gap-6 mb-12">
              <div className="text-3xl lg:text-4xl font-mono text-white/90">
                {formatCurrency(product.price, product.currency)}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold bg-luxury-gold/5 px-3 py-1.5 rounded-sm border border-luxury-gold/10 whitespace-nowrap">
                Taxes Inclusive
              </span>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mb-12"></div>
            
            <p className="text-gray-400 font-light leading-relaxed mb-16 text-sm lg:text-base text-justify">
              {product.description}
              <br/><br/>
              Meticulously designed with uncompromising precision, this object represents the pinnacle of modern luxury. Sourced globally, tested rigorously to ensure flawless execution and performance.
            </p>

            <div className="space-y-4 mb-16">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-colors cursor-default">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Logistic Route</span>
                <span className="text-xs font-mono text-white flex items-center gap-3">
                   <Truck size={14} className="text-luxury-gold" /> VIP Priority Express
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-colors cursor-default">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Authentication</span>
                <span className="text-xs font-mono text-white flex items-center gap-3">
                   <ShieldCheck size={14} className="text-luxury-gold" /> Certified Origin
                </span>
              </div>
            </div>

            <div className="space-y-4">
               <button 
                 onClick={() => {
                   onAddToCart();
                   onClose();
                 }}
                 className="w-full py-6 bg-white text-black text-xs uppercase tracking-[0.4em] font-medium hover:bg-luxury-gold hover:text-white transition-all duration-500 hover:tracking-[0.5em] flex justify-center items-center gap-3 group"
               >
                 Add to Collection <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
               </button>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: () => void;
}

export function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="group flex flex-col"
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#0a0a0a] relative border border-white/5 group-hover:border-luxury-gold/40 transition-all duration-700">
        <motion.div 
          className="w-full h-full transform origin-center transition-transform duration-[2s] ease-[0.19,1,0.22,1] group-hover:scale-110"
        >
          <img 
            src={product.images[currentImageIdx]} 
            alt={`${product.name} - view ${currentImageIdx + 1}`}
            className="w-full h-full object-cover brightness-90 contrast-125 grayscale-[0.2] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
          />
        </motion.div>
        
        {/* Lux inner shadow */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none group-hover:shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] transition-shadow duration-1000" />
        
        {product.images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={prevImage} className="w-8 h-8 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors">
              &lsaquo;
            </button>
            <button onClick={nextImage} className="w-8 h-8 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors">
              &rsaquo;
            </button>
          </div>
        )}
        
        {/* Subtle Overlay Actions */}
        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.19,1,0.22,1] bg-black/60 backdrop-blur-xl border-t border-white/10 flex justify-between items-center">
          <div className="flex gap-6">
            <button className="text-white/40 hover:text-white transition-colors hover:scale-110 transform duration-300"><Eye size={16} /></button>
            <button className="text-white/40 hover:text-luxury-gold transition-colors hover:scale-110 transform duration-300"><Heart size={16} /></button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Add to Bag
          </button>
        </div>

        <div className="absolute top-6 left-6">
          <span className="text-[9px] uppercase tracking-[0.4em] font-medium bg-black/50 backdrop-blur-md px-4 py-2 border border-white/10 text-white/80 tracking-widest pointer-events-none shadow-xl">
            {product.category}
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-4 flex flex-col flex-grow relative">
        <div className="flex justify-between items-baseline z-10">
          <h3 className="text-xl font-display italic font-light text-white/60 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-700">
            {product.name}
          </h3>
          <span className="text-[10px] font-mono text-luxury-gold opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            {formatCurrency(product.price, product.currency)}
          </span>
        </div>
        <div className="h-px w-12 bg-white/10 group-hover:bg-luxury-gold/50 group-hover:w-full transition-all duration-700 ease-[0.19,1,0.22,1]" />
        
        <div>
          <div className={cn(
            "text-[11px] text-gray-400 font-light leading-relaxed max-w-full uppercase tracking-widest transition-all duration-500 overflow-hidden relative",
            isExpanded ? "max-h-[500px]" : "max-h-[3rem] line-clamp-2"
          )}>
            {product.description}
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[9px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors flex items-center gap-2 group/btn"
          >
            {isExpanded ? 'Minimize' : 'Discover More'}
            <div className={cn(
              "w-px h-3 bg-white/30 group-hover/btn:bg-luxury-gold transition-all duration-500",
              isExpanded ? "transform rotate-90" : ""
            )} />
          </button>
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {product.variants.map(v => (
              <span key={v.sku} className="text-[9px] text-white/40 border border-white/10 px-2 py-1 uppercase font-mono tracking-widest">
                {v.size || v.color || v.sku}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { useCart } from '../contexts/CartContext';

export function ProductSkeleton() {
  return (
    <div className="group flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_infinite]" />
      </div>
      <div className="mt-8 space-y-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline">
          <div className="h-4 bg-white/5 w-1/2 rounded"></div>
          <div className="h-3 bg-white/5 w-1/4 rounded"></div>
        </div>
        <div className="h-px w-12 bg-white/5" />
        <div className="space-y-2">
          <div className="h-2 bg-white/5 w-[90%] rounded"></div>
          <div className="h-2 bg-white/5 w-[70%] rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterSupplier, setFilterSupplier] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  
  const { addToCart } = useCart();

  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    // Simulate premium async loading
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [filterCategory, filterStatus, filterSupplier, sortBy, searchTerm]);

  useEffect(() => {
    const saved = localStorage.getItem('luxe_viewed_products');
    if (saved) {
      setViewedIds(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    async function fetchRecs() {
      if (viewedIds.length === 0) return;
      setLoadingRecs(true);
      const recs = await getRecommendations(viewedIds.slice(-5), MOCK_PRODUCTS);
      if (recs) {
        setRecommendation(recs);
      }
      setLoadingRecs(false);
    }
    fetchRecs();
  }, [viewedIds]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    const newViewed = [...viewedIds.filter(id => id !== product.id), product.id];
    setViewedIds(newViewed);
    localStorage.setItem('luxe_viewed_products', JSON.stringify(newViewed));
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    const newViewed = [...viewedIds.filter(id => id !== product.id), product.id];
    setViewedIds(newViewed);
    localStorage.setItem('luxe_viewed_products', JSON.stringify(newViewed));
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (searchTerm.trim()) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    if (filterStatus !== 'All') {
      result = result.filter(p => p.status === filterStatus);
    }

    if (filterSupplier !== 'All') {
      result = result.filter(p => p.supplier === filterSupplier);
    }
    
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [filterCategory, filterStatus, filterSupplier, searchTerm, sortBy]);

  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const recommendedProducts = useMemo(() => {
    if (!recommendation) return [];
    return MOCK_PRODUCTS.filter(p => recommendation.productIds.includes(p.id));
  }, [recommendation]);

  return (
    <div className="pt-40 px-12 pb-32 max-w-[1400px] mx-auto">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="text-xs-wide text-luxury-gold mb-4 opacity-80">Seasonal Selection</div>
          <h1 className="text-5xl md:text-7xl font-display font-light">Inventory 01</h1>
        </div>
        
        <div className="flex flex-col items-end gap-6 text-[10px] uppercase tracking-[0.4em] text-gray-500 w-full md:w-auto mt-8 md:mt-0">
          <div className="flex gap-8 overflow-x-auto max-w-full pb-2 md:pb-0">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilterCategory(cat)}
                className={`transition-all relative group whitespace-nowrap ${filterCategory === cat ? 'text-luxury-gold' : 'hover:text-white'}`}
              >
                {cat}
                <span className={`absolute -bottom-2 left-0 h-px bg-luxury-gold transition-all duration-500 ${filterCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-6 w-full">
            <input 
              type="text"
              placeholder="SEARCH CATALOGUE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-b border-white/10 pb-1 outline-none text-white placeholder-gray-600 focus:border-luxury-gold/50 transition-colors w-full md:w-64"
            />
            
            <div className="flex items-center gap-2">
              <span className="opacity-40">Status:</span>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-b border-white/10 pb-1 outline-none text-white appearance-none cursor-pointer hover:border-luxury-gold/50 transition-colors"
              >
                <option value="All" className="bg-luxury-black">All Status</option>
                <option value="active" className="bg-luxury-black">Active</option>
                <option value="draft" className="bg-luxury-black">Draft</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-40">Supplier:</span>
              <select 
                value={filterSupplier} 
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="bg-transparent border-b border-white/10 pb-1 outline-none text-white appearance-none cursor-pointer hover:border-luxury-gold/50 transition-colors"
              >
                <option value="All" className="bg-luxury-black">All Suppliers</option>
                <option value="Direct" className="bg-luxury-black">Direct</option>
                <option value="CJ Dropshipping" className="bg-luxury-black">CJ Dropshipping</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="opacity-40">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-b border-white/10 pb-1 outline-none text-white appearance-none cursor-pointer hover:border-luxury-gold/50 transition-colors w-full md:w-auto"
              >
                <option value="newest" className="bg-luxury-black">Newest Arrivals</option>
                <option value="price_asc" className="bg-luxury-black">Price: Low to High</option>
                <option value="price_desc" className="bg-luxury-black">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loadingRecs ? (
        <div className="mb-24 bg-white/[0.01] border border-luxury-gold/10 p-8 flex flex-col items-center justify-center py-16 animate-pulse">
          <RefreshCcw className="animate-spin text-luxury-gold mb-4" size={24} />
          <p className="text-[10px] uppercase tracking-widest text-luxury-gold/50">Consulting AI Stylist...</p>
        </div>
      ) : recommendation && recommendedProducts.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="mb-24 bg-[#050505] border border-luxury-gold/20 p-8 relative overflow-hidden group hover:border-luxury-gold/40 transition-colors duration-700"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 gap-6 relative z-10">
            <div>
              <h2 className="text-xl md:text-2xl font-display italic text-luxury-gold mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-luxury-gold"></span>
                Curated for You
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 max-w-xl leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
            <span className="text-[8px] uppercase tracking-[0.5em] text-luxury-gold/50 bg-luxury-gold/5 border border-luxury-gold/20 px-4 py-2 self-start md:self-auto">
              AI Powered Discovery
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
             {recommendedProducts.map((product, idx) => (
               <div key={`rec-${product.id}`}>
                <ProductCard 
                  product={product} 
                  index={idx} 
                  onSelect={() => {
                    setSelectedProduct(product);
                  }}
                />
               </div>
             ))}
          </div>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
        {isLoadingProducts ? (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        ) : filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((product, idx) => (
            <div key={product.id}>
              <ProductCard 
                product={product} 
                index={idx} 
                onSelect={() => {
                  setSelectedProduct(product);
                }}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">No objects match your criteria.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <CheckoutOverlay 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={() => {
               handleAddToCart(selectedProduct);
               setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
