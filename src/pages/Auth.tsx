import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Github, Chrome, AlertCircle, Sparkles } from 'lucide-react';
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
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-luxury-gold/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] blur-[100px] rounded-full translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block text-2xl font-display font-medium tracking-tighter mb-8">
            LUXE<span className="text-luxury-gold italic">DOOW</span>
          </Link>
          <h1 className="text-4xl font-display font-light mb-4">
            {isLogin ? 'Access Reserve' : 'Create Identity'}
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em]">
            {isLogin ? 'Global Procurement Tier Access' : 'Register for the Billion-Dollar Platform'}
          </p>
        </div>

        <div className="glass p-10 md:p-12 border-white/5 relative group">
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles size={16} className="text-luxury-gold" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Full Designation</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Knight"
                      className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-sm outline-none focus:border-luxury-gold transition-all text-white placeholder:text-gray-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Email Directive</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-sm outline-none focus:border-luxury-gold transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Secure Passkey</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-sm outline-none focus:border-luxury-gold transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest leading-relaxed"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group/btn"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Grant Access' : 'Create Reserve'}
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4 text-gray-800">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] uppercase tracking-[0.4em]">Alternative</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleSignIn}
              className="py-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3 text-gray-400 hover:text-white"
            >
              <Chrome size={18} />
              <span className="text-[9px] uppercase tracking-widest">Google</span>
            </button>
            <button className="py-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3 text-gray-400 hover:text-white opacity-50 cursor-not-allowed">
              <Github size={18} />
              <span className="text-[9px] uppercase tracking-widest">Github</span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); clearError(); }}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-luxury-gold transition-colors"
            >
              {isLogin ? "Don't have an identity yet? Begin Here" : "Already registered? Authenticate"}
            </button>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-gray-600">
          <ShieldCheck size={14} className="text-luxury-gold" />
          <span className="text-[8px] uppercase tracking-[0.4em]">End-to-End Enterprise Encryption Active</span>
        </div>
      </motion.div>
    </div>
  );
}
