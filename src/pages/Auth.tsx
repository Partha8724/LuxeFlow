import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Github, Chrome, AlertCircle, Sparkles, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      navigate('/shop');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/shop');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center bg-[#020202] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[540px] relative z-10"
      >
        <div className="text-center mb-16">
          <Link to="/" className="inline-block text-3xl font-display font-medium tracking-tighter mb-12 hover:scale-105 transition-transform">
            LUXE<span className="text-luxury-gold italic">DOOW</span>
          </Link>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight text-white">
            {isLogin ? 'Welcome Back.' : 'Join the Elite.'}
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-[0.6em] font-medium opacity-60">
            {isLogin ? 'Access your private procurement tier' : 'Establish your global trade identity'}
          </p>
        </div>

        <div className="bg-[#080808] border border-white/[0.08] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative group">
          <div className="absolute top-0 right-0 p-8">
            <Sparkles size={24} className="text-luxury-gold/40" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold ml-1">Full Designation</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      id="auth-name"
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alexander Knight"
                      className="w-full bg-white/[0.02] border border-white/10 p-5 pl-14 text-sm outline-none focus:border-luxury-gold focus:bg-white/[0.04] transition-all text-white placeholder:text-gray-800 font-medium"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold ml-1">Universal ID</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  id="auth-email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@maison.com"
                  className="w-full bg-white/[0.02] border border-white/10 p-5 pl-14 text-sm outline-none focus:border-luxury-gold focus:bg-white/[0.04] transition-all text-white placeholder:text-gray-800 font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold ml-1">Maison Passkey</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  id="auth-password"
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.02] border border-white/10 p-5 pl-14 text-sm outline-none focus:border-luxury-gold focus:bg-white/[0.04] transition-all text-white placeholder:text-gray-800 font-medium"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-5 bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              id="auth-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-white text-black text-[11px] uppercase tracking-[0.5em] font-extrabold hover:bg-luxury-gold hover:text-white transition-all duration-700 flex items-center justify-center gap-4 group/btn shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
            >
              {isSubmitting ? (
                <RefreshCcw className="animate-spin" size={18} />
              ) : (
                <>
                  {isLogin ? 'Enter The Archive' : 'Establish Identity'}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <div className="my-12 flex items-center gap-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] uppercase tracking-[0.6em] text-gray-700 font-black">OR</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button 
              id="auth-google"
              onClick={handleGoogleSignIn}
              className="py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/20 transition-all flex items-center justify-center gap-4 text-gray-400 hover:text-white group"
            >
              <Chrome size={20} className="group-hover:text-luxury-gold transition-colors" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Google</span>
            </button>
            <button className="py-5 border border-white/5 bg-white/[0.01] flex items-center justify-center gap-4 text-gray-700 opacity-40 cursor-not-allowed">
              <Github size={20} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Github</span>
            </button>
          </div>

          <div className="mt-14 text-center">
            <button 
              id="auth-toggle"
              onClick={() => { setIsLogin(!isLogin); clearError(); }}
              className="text-[10px] uppercase tracking-[0.4em] text-gray-500 hover:text-luxury-gold transition-all font-bold"
            >
              <span className="inline-block border-b border-transparent hover:border-luxury-gold pb-1">
                {isLogin ? "No identity recorded? Commence Registration" : "Identity already verified? Sign In"}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-4 text-gray-700">
          <ShieldCheck size={16} className="text-luxury-gold/40" />
          <span className="text-[9px] uppercase tracking-[0.5em] font-medium">Billion-Dollar Tier Security Standard Active</span>
        </div>
      </motion.div>
    </div>

  );
}
