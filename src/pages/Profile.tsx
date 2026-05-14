import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Shield, Save, RefreshCcw, Camera, ArrowLeft, Heart, Package, CreditCard, ChevronRight, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  tier: 'Elite' | 'Platinum' | 'Architect';
  memberSince: Timestamp;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postcode: '',
      country: ''
    },
    tier: 'Elite',
    memberSince: Timestamp.now()
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Initialize with auth data
          setProfile(prev => ({
            ...prev,
            name: user.displayName || '',
            email: user.email || '',
            memberSince: Timestamp.now()
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        updatedAt: Timestamp.now()
      }, { merge: true });
      // Show success notification or similar
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCcw className="animate-spin text-luxury-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div>
            <div className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] mb-4 font-bold flex items-center gap-3">
              <div className="w-8 h-px bg-luxury-gold" />
              Identity Management
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white">
              MY <span className="text-luxury-gold italic">ATELIER</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Discovery
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar / Overview */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#080808] border border-white/[0.08] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                <Shield size={60} strokeWidth={1} className="text-luxury-gold" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full border-2 border-luxury-gold/30 p-2 flex items-center justify-center bg-black overflow-hidden group-hover:border-luxury-gold transition-all duration-700">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={64} className="text-gray-800" strokeWidth={1} />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-white border-4 border-black hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-display font-bold text-white mb-2">{profile.name || 'Architect'}</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-black mb-6">{profile.tier} Member</p>
                
                <div className="w-full h-px bg-white/5 mb-6" />
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-gray-600 mb-1">Acquisitions</p>
                    <p className="text-lg font-mono text-white">0</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-gray-600 mb-1">Trust Level</p>
                    <p className="text-lg font-mono text-luxury-gold">99.9%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Heart, label: 'Vaulted Objects', count: 12 },
                { icon: Package, label: 'Active Transmissions', count: 0 },
                { icon: CreditCard, label: 'Financial Matrix', count: 'Active' },
                { icon: Shield, label: 'Cyber Defense', count: 'Standard' }
              ].map((item, i) => (
                <button 
                  key={i}
                  className="w-full bg-[#080808] border border-white/[0.05] p-5 flex items-center justify-between group hover:bg-white/[0.02] hover:border-luxury-gold/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-500 group-hover:text-luxury-gold transition-colors">
                      <item.icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors font-bold">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-600">{item.count}</span>
                    <ChevronRight size={14} className="text-gray-800 group-hover:text-luxury-gold transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="bg-[#080808] border border-white/[0.08] p-10 md:p-14 shadow-2xl">
              <form onSubmit={handleSave} className="space-y-12">
                {/* Personal Section */}
                <section>
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] text-white font-black">Identity Details</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Full Designation</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold" size={16} />
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/[0.02] border border-white/10 p-5 pl-14 text-xs tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Universal Email</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold" size={16} />
                        <input 
                          type="email" 
                          disabled
                          value={profile.email}
                          className="w-full bg-white/[0.01] border border-white/5 p-5 pl-14 text-xs tracking-widest outline-none text-gray-600 cursor-not-allowed font-medium opacity-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Mobile Link</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold" size={16} />
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+44 ••• ••• ••••"
                          className="w-full bg-white/[0.02] border border-white/10 p-5 pl-14 text-xs tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Logistics Section */}
                <section>
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] text-white font-black">Global Fulfillment Node</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Primary Residence / HQ</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold" size={16} />
                        <input 
                          type="text" 
                          value={profile.address.street}
                          onChange={(e) => setProfile(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                          placeholder="Penthouse 4, 15 Bruton St."
                          className="w-full bg-white/[0.02] border border-white/10 p-5 pl-14 text-xs tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Territory / City</label>
                      <input 
                        type="text" 
                        value={profile.address.city}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                        placeholder="Mayfair, London"
                        className="w-full bg-white/[0.02] border border-white/10 p-5 text-xs tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Secure Zone / Postcode</label>
                      <input 
                        type="text" 
                        value={profile.address.postcode}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: { ...prev.address, postcode: e.target.value } }))}
                        placeholder="W1J 6JD"
                        className="w-full bg-white/[0.02] border border-white/10 p-5 text-xs tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-medium font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">National Designation / Country</label>
                      <input 
                        type="text" 
                        value={profile.address.country}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                        placeholder="United Kingdom"
                        className="w-full bg-white/[0.02] border border-white/10 p-5 text-xs tracking-widest outline-none focus:border-luxury-gold transition-all text-white font-medium"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] text-white font-black">Viral Propagation Node</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  
                  <div className="bg-luxury-gold/10 border border-luxury-gold/30 p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="absolute -left-10 -top-10 opacity-5 pointer-events-none">
                      <Share2 size={150} className="text-luxury-gold" />
                    </div>
                    <div className="relative z-10 space-y-4 max-w-md">
                      <p className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-black italic">REFER & EARN ARCHITECT CREDTS</p>
                      <h4 className="text-3xl font-display text-white tracking-tighter">Expand the Luxe <span className="text-luxury-gold italic">Network</span></h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] leading-relaxed">
                        Authorize 3 peers to the platform and receive a <span className="text-white font-black">20% Logic Discount</span> on your next architectural procurement.
                      </p>
                    </div>
                    <div className="relative z-10 w-full md:w-auto">
                       <div className="bg-black/50 border border-white/10 p-4 pl-6 pr-4 flex items-center justify-between gap-6 backdrop-blur-xl">
                          <span className="text-[10px] font-mono text-gray-400">LUXE.ARCHITECT.PROMO.882</span>
                          <button className="px-6 py-3 bg-white text-black text-[9px] uppercase tracking-widest font-black hover:bg-luxury-gold hover:text-white transition-all">Copy Matrix Link</button>
                       </div>
                    </div>
                  </div>
                </section>

                <div className="pt-10 flex flex-col sm:flex-row gap-6">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-6 bg-white text-black text-[11px] uppercase tracking-[0.5em] font-extrabold hover:bg-luxury-gold hover:text-white transition-all duration-700 flex items-center justify-center gap-4 shadow-xl"
                  >
                    {saving ? <RefreshCcw className="animate-spin" size={20} /> : (
                      <>
                        <Save size={18} />
                        Sync Identity Matrix
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    className="flex-1 py-6 border border-white/10 text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-white/5 transition-all"
                  >
                    Export Data Profile
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-12 p-8 border border-white/[0.05] bg-white/[0.01] flex items-center justify-between text-center md:text-left flex-col md:flex-row gap-8">
               <div className="flex items-center gap-4">
                  <Shield size={24} className="text-luxury-gold" />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-white font-bold mb-1">Cyber-Protocol Active</h4>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-gray-600">Your data is secured using Billion-Dollar 256-bit architectural encryption.</p>
                  </div>
               </div>
               <button className="text-[9px] uppercase tracking-[0.5em] text-luxury-gold hover:text-white transition-colors font-black border-b border-luxury-gold/30 pb-1">Reset Passkeys</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
