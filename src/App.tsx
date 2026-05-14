import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Globe, Menu, X, LogOut, LogIn, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Landing from './pages/Landing';
import Shop from './pages/Shop';
import SellerDashboard from './pages/SellerDashboard';
import Orders from './pages/Orders';
import About from './pages/About';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Track from './pages/Track';
import AdminDashboard from './pages/AdminDashboard';
import Influencers from './pages/Influencers';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { MiniCart } from './components/MiniCart';
import { ConversionTriggers, TrustBanner } from './components/ConversionTriggers';
import ChatWidget from './components/ChatWidget';

function AuthErrorNotification() {
  const { error, clearError } = useAuth();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-6"
        >
          <div className="glass p-6 border-luxury-gold/30 flex items-start gap-4 shadow-2xl">
            <div className="p-2 bg-luxury-gold/10 rounded-full">
              <AlertCircle size={18} className="text-luxury-gold" />
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold mb-1">Authentication Advisory</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={clearError}
              className="text-gray-600 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toggleCart, cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
      scrolled || location.pathname !== '/' ? 'h-20 glass editorial-border border-b' : 'h-28 bg-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-12 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-display font-medium tracking-tighter flex items-center gap-1">
            LUXE<span className="text-luxury-gold italic">DOOW</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 text-xs-wide text-gray-500">
            <Link to="/shop" className="hover:text-white transition-colors">Boutique</Link>
            <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
            <Link to="/track" className="hover:text-white transition-colors">Tracking</Link>
            <Link to="/influencers" className="hover:text-white transition-colors">Partnership</Link>
            <Link to="/seller" className="hover:text-white transition-colors">Philosophy</Link>
            {user && <Link to="/sovereign" className="text-luxury-gold hover:text-white transition-colors">Sovereign Layer</Link>}
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex bg-white/5 border border-white/10 rounded-full px-5 py-2 text-[9px] tracking-widest items-center gap-4 text-gray-400">
            <span className="text-white">GBP £</span>
            <div className="w-px h-3 bg-white/10"></div>
            <span className="hover:text-white transition-colors cursor-pointer">USD $</span>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-gray-500 hover:text-luxury-gold transition-colors hidden sm:block"><Globe size={16} /></button>
            <button onClick={toggleCart} className="relative group">
              <ShoppingBag size={18} className="text-white group-hover:text-luxury-gold transition-colors" />
              {cartItemCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-luxury-gold text-luxury-black rounded-full text-[8px] flex items-center justify-center font-bold">
                   {cartItemCount}
                 </span>
              )}
            </button>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            {user ? (
              <div className="flex items-center gap-6">
                 <Link to="/profile" className="flex items-center gap-4 hover:scale-105 transition-transform group">
                   <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:border-luxury-gold transition-colors overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <span className="uppercase text-[12px] font-black text-luxury-gold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      )}
                   </div>
                   <div className="text-left hidden lg:block">
                     <p className="text-[8px] text-luxury-gold uppercase tracking-[0.4em] font-black leading-tight">Master Tier</p>
                     <p className="text-[11px] font-display font-medium text-white tracking-tight">{user.displayName || 'Architect'}</p>
                   </div>
                 </Link>
                 <div className="h-6 w-px bg-white/5 mx-2"></div>
                 <button onClick={logout} className="text-gray-600 hover:text-luxury-gold transition-all" title="Sign Out">
                   <LogOut size={16} strokeWidth={1.5} />
                 </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-[10px] font-mono text-gray-400 hover:text-luxury-gold transition-colors uppercase tracking-widest border border-white/10 px-4 py-2 rounded-sm bg-white/[0.02] hover:bg-white/[0.05]">
                <LogIn size={14} />
                <span>Identification</span>
              </Link>
            )}
            <button className="text-luxury-white border border-white/10 p-3 hover:bg-white hover:text-black transition-all">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const initialOptions = {
    "client-id": (process as any).env.PAYPAL_CLIENT_ID || "test",
    currency: "GBP",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold/30 selection:text-white antialiased">
              <TrustBanner />
              <ConversionTriggers />
              <Navbar />
              <MiniCart />
              <ChatWidget />
              <AuthErrorNotification />
              <main>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/track" element={<Track />} />
                    <Route path="/sovereign" element={<AdminDashboard />} />
                    <Route path="/influencers" element={<Influencers />} />
                    <Route path="/seller" element={<SellerDashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </AnimatePresence>
              </main>
            
            <footer className="py-24 border-t border-white/5 px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 gap-y-20">
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <h2 className="text-2xl font-display tracking-tighter">LUXE<span className="text-luxury-gold">DOOW</span></h2>
                  <p className="max-w-md text-gray-500 font-light text-sm leading-relaxed">
                    The architect's OS for billionaire-tier dropshipping. 
                    Optimized for global logistics with AI-powered marketing and autonomous fulfillment.
                  </p>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400">Navigation</h3>
                  <ul className="space-y-4 text-xs font-light text-gray-500 uppercase tracking-widest">
                    <li><Link to="/shop" className="hover:text-white transition-colors">Boutique</Link></li>
                    <li><Link to="/discover" className="hover:text-white transition-colors">Viral Feed</Link></li>
                    <li><Link to="/track" className="hover:text-white transition-colors">Global Tracking</Link></li>
                    <li><Link to="/influencers" className="hover:text-white transition-colors">Influencer Node</Link></li>
                    <li><Link to="/sovereign" className="hover:text-white transition-colors">Sovereign Control</Link></li>
                    <li><Link to="/seller" className="hover:text-white transition-colors">Sell With Us</Link></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400">Logistics</h3>
                  <ul className="space-y-4 text-xs font-light text-gray-500 uppercase tracking-widest">
                    <li><span className="text-luxury-gold">UK:</span> 3-5 Day Priority</li>
                    <li><span className="text-luxury-gold">USA:</span> 3-5 Day Express</li>
                    <li><span className="text-luxury-gold">Global:</span> Fully Insured</li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <span className="text-[9px] uppercase tracking-[0.5em] text-gray-600">© 2026 LuxeFlow Global. All Rights Reserved.</span>
                <div className="flex gap-8 text-[9px] uppercase tracking-[0.5em] text-gray-600">
                  <a href="#" className="hover:text-white">Privacy</a>
                  <a href="#" className="hover:text-white">Terms</a>
                  <a href="#" className="hover:text-white">Tax/VAT</a>
                </div>
              </div>
            </footer>
          </div>
        </Router>
        </CartProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  );
}
