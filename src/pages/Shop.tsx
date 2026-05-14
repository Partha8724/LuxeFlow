import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ShoppingBag, Eye, Heart, X, ShieldCheck, Truck, Sparkles, TrendingUp, Zap, Anchor, MapPin, AlertCircle, RefreshCw, Wand2, Search } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Product } from '../types';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getRecommendations, AIRecommendation } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import PayPalPayment from '../components/PayPalPayment';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

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
    supplier: 'CJ'
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
    supplier: 'CJ'
  }
];

interface CheckoutOverlayProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

function CheckoutOverlay({ product, onClose, onAddToCart }: CheckoutOverlayProps) {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postcode: '',
    country: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const fetchAddress = async () => {
      if (user) {
        setLoadingProfile(true);
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.address) {
              setAddress(data.address);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    fetchAddress();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [user]);

  const handlePaymentSuccess = async (details: any) => {
    console.log('Payment Successful:', details);
    setSuccess(true);
    
    // Create actual order in Firestore
    if (user) {
      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          userEmail: user.email,
          productId: product.id,
          productName: product.name,
          amount: product.price,
          currency: product.currency,
          status: 'authorized',
          shippingAddress: address,
          paypalOrderId: details.id,
          timestamp: Timestamp.now()
        });
      } catch (err) {
        console.error("Order logging failed:", err);
      }
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[200] bg-luxury-black flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold mb-8">
           <ShieldCheck size={48} />
        </div>
        <h2 className="text-4xl font-display font-light mb-4">Procurement Authorized</h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-12">The object has been reserved. Tracking link deployed to email.</p>
        <button 
          onClick={onClose}
          className="px-12 py-5 border border-white/20 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
        >
          Return to Archive
        </button>
      </motion.div>
    );
  }

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
           className="max-w-xl self-center"
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
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-5">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Logistics</span>
                <span className="text-xs font-mono text-white flex items-center gap-2">
                   <Truck size={14} className="text-luxury-gold" /> Global Express
                </span>
              </div>

              {user ? (
                <div className="space-y-10">
                  <div className="p-8 border border-luxury-gold/30 bg-luxury-gold/5 flex items-center justify-between group">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                           <MapPin size={24} />
                        </div>
                        <div>
                          <h4 className="text-[11px] uppercase tracking-[0.4em] text-white font-black">Fulfillment Destination</h4>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1 font-medium">
                            {address.street ? `${address.street}, ${address.city}` : 'No global node identified'}
                          </p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setShowAddress(!showAddress)}
                       className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors"
                     >
                       {showAddress ? 'Lock Entry' : 'Override'}
                     </button>
                  </div>

                  <AnimatePresence>
                    {showAddress && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-6 pt-2"
                      >
                         <div className="grid grid-cols-2 gap-6">
                            <input 
                              id="checkout-street"
                              type="text" 
                              placeholder="STREET ADDRESS"
                              value={address.street}
                              onChange={(e) => setAddress({...address, street: e.target.value})}
                              className="col-span-2 bg-white/[0.02] border border-white/10 p-5 text-[10px] uppercase tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-bold"
                            />
                            <input 
                              id="checkout-city"
                              type="text" 
                              placeholder="CITY"
                              value={address.city}
                              onChange={(e) => setAddress({...address, city: e.target.value})}
                              className="bg-white/[0.02] border border-white/10 p-5 text-[10px] uppercase tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-bold"
                            />
                            <input 
                              id="checkout-postcode"
                              type="text" 
                              placeholder="POSTCODE"
                              value={address.postcode}
                              onChange={(e) => setAddress({...address, postcode: e.target.value})}
                              className="bg-white/[0.02] border border-white/10 p-5 text-[10px] uppercase tracking-widest outline-none focus:border-luxury-gold font-mono text-white font-bold"
                            />
                            <input 
                              id="checkout-country"
                              type="text" 
                              placeholder="COUNTRY"
                              value={address.country}
                              onChange={(e) => setAddress({...address, country: e.target.value})}
                              className="col-span-2 bg-white/[0.02] border border-white/10 p-5 text-[10px] uppercase tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-bold"
                            />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 space-y-8">
                    <div className="p-6 border border-white/10 bg-white/[0.01] flex items-center gap-5">
                       <ShieldCheck size={24} className="text-luxury-gold" />
                       <div className="text-[11px] uppercase tracking-[0.4em] text-gray-400 font-black">End-to-End Encrypted Settlement</div>
                    </div>

                    <div className="p-6 bg-red-500/5 border border-red-500/20 flex items-center gap-4 animate-pulse">
                       <Zap size={18} className="text-red-500 fill-red-500" />
                       <p className="text-[9px] uppercase tracking-[0.4em] text-red-500 font-black">
                          {Math.floor(Math.random() * 5) + 2} items remaining in this architecture. High demand detected.
                       </p>
                    </div>
                    
                    {(!address.street || !address.city || !address.country) ? (
                      <div className="p-12 border border-red-500/10 bg-red-500/5 text-center space-y-6">
                        <AlertCircle size={32} className="mx-auto text-red-500/30" />
                        <p className="text-[11px] uppercase tracking-[0.5em] text-red-400 font-bold leading-relaxed">
                          Fulfillment coordinates missing.
                        </p>
                        <button 
                          onClick={() => setShowAddress(true)}
                          className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all font-bold"
                        >
                          Manual Input Mode
                        </button>
                      </div>
                    ) : (
                      <PayPalPayment 
                        amount={product.price}
                        currency={product.currency}
                        onSuccess={handlePaymentSuccess}
                        onError={(err) => console.error(err)}
                      />
                    )}

                    <div className="flex items-center gap-6 mt-12">
                      <button 
                        id="checkout-add-to-cart"
                        onClick={() => { onAddToCart(); onClose(); }}
                        className="flex-1 py-8 bg-black/40 border border-white/10 text-white text-[11px] uppercase tracking-[0.6em] font-extrabold hover:bg-white hover:text-black transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                      >
                        Add to Reserve Collection
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="p-12 border border-white/5 bg-white/5 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
                      <ShieldCheck size={48} className="text-luxury-gold" />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.5em] text-gray-400 mb-10 leading-relaxed font-bold">
                      Identity verification protocol required for architectural procurement.
                    </p>
                    <Link 
                      id="checkout-auth-link"
                      to="/auth" 
                      className="inline-block px-16 py-6 bg-white text-black text-[11px] uppercase tracking-[0.5em] font-extrabold hover:bg-luxury-gold hover:text-white transition-all duration-700 shadow-2xl"
                    >
                      Authenticate Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const ProductCard: React.FC<{ product: Product; index: number; onSelect: () => void }> = ({ product, index, onSelect }) => {
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
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);

  const handleAiSearch = async () => {
    if (!aiSearchQuery) return;
    setAiSearchLoading(true);
    setTimeout(() => {
      setSearchTerm(aiSearchQuery);
      setIsAiSearchOpen(false);
      setAiSearchLoading(false);
    }, 1500);
  };
  const { addToCart } = useCart();
  const [recs, setRecs] = useState<AIRecommendation | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    async function loadRecs() {
      const stored = localStorage.getItem('luxe_viewed_products');
      const viewed = stored ? JSON.parse(stored) : [];
      
      if (Array.isArray(viewed) && viewed.length > 0) {
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
      <AnimatePresence>
        {isAiSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-4xl"
            >
              <div className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] mb-4 font-black flex items-center gap-4">
                <Wand2 size={16} /> Semantic Search Architect
              </div>
              <div className="relative">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Describe your vision (e.g. 'Minimalist techware for a Tokyo winter')..."
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  className="w-full bg-transparent border-b-2 border-white/10 p-8 text-3xl md:text-5xl font-display font-light text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-800"
                />
                {aiSearchLoading && (
                  <div className="absolute right-0 bottom-4">
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       className="w-12 h-12 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full"
                     />
                  </div>
                )}
              </div>
              <div className="mt-12 flex justify-between items-center">
                <div className="flex gap-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <span>Press Enter to Architect</span>
                  <span className="text-luxury-gold/30">|</span>
                  <span className="hover:text-white cursor-pointer" onClick={() => setIsAiSearchOpen(false)}>Escape to Exit</span>
                </div>
                <button 
                  onClick={handleAiSearch}
                  className="bg-white text-black px-12 py-5 text-[10px] uppercase tracking-widest font-black hover:bg-luxury-gold hover:text-white transition-all shadow-2xl"
                >
                  Process Vision
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-24 left-12 h-screen w-px bg-white/5 hidden xl:block" />
      
      {/* Header */}
      <div className="relative mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-10">
        <div>
           <div className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold mb-4 font-bold flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
             Live Architecture v2.0
           </div>
           <h1 className="text-6xl md:text-8xl font-display font-light leading-none italic">
             Global <span className="text-luxury-gold not-italic">Archive</span>
           </h1>
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
              <button 
                onClick={() => setIsAiSearchOpen(true)}
                className="bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold px-6 py-4 rounded-sm text-[10px] uppercase tracking-widest font-black hover:bg-luxury-gold hover:text-white transition-all flex items-center gap-3"
              >
                <Wand2 size={16} /> AI Architect
              </button>
              <div className="relative flex-1 md:w-80">
                <input 
                  type="text" 
                  placeholder="Search Collection..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-[10px] uppercase tracking-[0.3em] outline-none focus:border-luxury-gold transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
              </div>
           </div>
        </div>
      </div>

      {recs && recs.productIds && Array.isArray(recs.productIds) && (
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
