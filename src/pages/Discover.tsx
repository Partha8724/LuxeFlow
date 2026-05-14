import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, Heart, MessageCircle, Share2, Music2, ShoppingCart, ArrowLeft, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';

// Mock data for viral products
const VIRAL_PRODUCTS = [
  {
    id: 'v1',
    name: "Architectural Timepiece",
    description: "Cold-forged steel with exposed mechanical heartbeat. The zenith of horological engineering.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-in-a-box-34533-large.mp4",
    price: 12500,
    currency: "GBP",
    likes: "45.2K",
    comments: "1.2K",
    shares: "8.9K",
    music: "Ambient Echoes - Quantum Series",
    brand: "Luxe Obsidian"
  },
  {
    id: 'v2',
    name: "Ceramic Sound Matrix",
    description: "Bespoke acoustic resonance chamber for the true audiophile. Hand-poured porcelain.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-silver-and-black-earphones-41135-large.mp4",
    price: 4200,
    currency: "GBP",
    likes: "32.1K",
    comments: "842",
    shares: "5.4K",
    music: "Static Pulse - Cyber Design",
    brand: "Sonic Void"
  },
  {
    id: 'v3',
    name: "Ethereal Silk Drapery",
    description: "Woven from sunlight and spider-silk technology. Zero-weight comfort.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-white-silk-fabric-waving-in-the-wind-34024-large.mp4",
    price: 890,
    currency: "GBP",
    likes: "128K",
    comments: "4.5K",
    shares: "22K",
    music: "Flowing - Silk Road",
    brand: "Aetherial"
  }
];

export default function Discover() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide" ref={containerRef}>
      {/* Top Nav */}
      <div className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="text-white hover:text-luxury-gold transition-colors">
          <ArrowLeft size={32} strokeWidth={1} />
        </button>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.5em] font-black">
          <span className="text-white border-b border-luxury-gold pb-1">For You</span>
          <span className="text-gray-500 hover:text-white cursor-pointer transition-colors">Following</span>
        </div>
        <button onClick={() => setMuted(!muted)} className="text-white">
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {VIRAL_PRODUCTS.map((product, idx) => (
        <VideoPage 
          key={product.id} 
          product={product} 
          muted={muted} 
          onAdd={() => addToCart(product as any)}
        />
      ))}
    </div>
  );
}

const VideoPage: React.FC<{ product: any; muted: boolean; onAdd: () => void }> = ({ product, muted, onAdd }) => {
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        src={product.video}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        loop
        muted={muted}
        playsInline
      />

      {/* Right Action Bar */}
      <div className="absolute right-6 bottom-32 flex flex-col gap-8 z-20">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => setLiked(!liked)}
            className={`w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${liked ? 'text-red-500 scale-110' : 'text-white'}`}
          >
            <Heart size={28} fill={liked ? "currentColor" : "none"} />
          </button>
          <span className="text-[10px] text-white font-bold">{product.likes}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <MessageCircle size={28} />
          </button>
          <span className="text-[10px] text-white font-bold">{product.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Share2 size={28} />
          </button>
          <span className="text-[10px] text-white font-bold">{product.shares}</span>
        </div>

        <div className="mt-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border-2 border-luxury-gold/50 p-1"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-luxury-gold to-white flex items-center justify-center">
              <Music2 size={20} className="text-black" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black to-transparent z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full border border-luxury-gold flex items-center justify-center text-[10px] font-black text-luxury-gold">
              LD
            </div>
            <span className="text-white font-display text-lg tracking-tight">@{product.brand.toLowerCase().replace(' ', '')}</span>
            <div className="bg-luxury-gold/20 text-luxury-gold text-[8px] px-2 py-0.5 rounded-sm flex items-center gap-1 font-black">
              <ShieldCheck size={10} /> VERIFIED
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-display text-white mb-4 tracking-tighter leading-none italic">{product.name}</h2>
          <p className="text-gray-400 text-sm mb-10 max-w-lg leading-relaxed opacity-80">
            {product.description}
          </p>

          <div className="flex items-center gap-8">
            <button 
              onClick={onAdd}
              className="flex-1 bg-white text-black py-5 px-10 text-[11px] uppercase tracking-[0.4em] font-black hover:bg-luxury-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group"
            >
              <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
              Acquire for {formatCurrency(product.price, product.currency)}
            </button>
            <div className="w-16 h-16 rounded-full border border-white/20 flex flex-col items-center justify-center group cursor-pointer hover:border-white/50 transition-colors">
              <div className="w-1 h-1 bg-white rounded-full mb-1" />
              <div className="w-1 h-1 bg-white rounded-full mb-1" />
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Music Row */}
      <div className="absolute bottom-8 right-10 flex items-center gap-4 text-white opacity-50">
        <Music2 size={14} />
        <span className="text-[10px] uppercase tracking-widest font-bold">{product.music}</span>
      </div>
    </div>
  );
}
