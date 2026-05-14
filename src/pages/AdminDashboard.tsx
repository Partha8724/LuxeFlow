import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, Package, Shield, Activity, 
  TrendingUp, AlertCircle, Globe, Zap, Bot, 
  Search, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Lock, LayoutGrid, Settings, LogOut, Bell, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // Simulated metrics
  const stats = [
    { label: 'Global Revenue', value: '£2.4M', trend: '+12.5%', up: true, icon: BarChart3 },
    { label: 'Active Partners', value: '842', trend: '+4.2%', up: true, icon: Users },
    { label: 'Dispatches', value: '12.4K', trend: '-2.1%', up: false, icon: Package },
    { label: 'AI Agent Efficiency', value: '98.4%', trend: '+0.5%', up: true, icon: Bot }
  ];

  const adminTabs = ['Overview', 'Partners', 'Assets', 'AI Governance', 'Security'];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 xl:w-64 border-r border-white/5 bg-[#050505] flex flex-col z-50">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-display tracking-tighter hidden xl:block">
            LUXE<span className="text-luxury-gold italic">SOVEREIGN</span>
          </h2>
          <div className="xl:hidden w-8 h-8 bg-luxury-gold rounded-sm" />
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-8">
          {adminTabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all group",
                activeTab === tab ? "bg-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "text-gray-500 hover:text-white"
              )}
            >
              <LayoutGrid size={20} />
              <span className="text-[10px] uppercase tracking-widest font-black hidden xl:block">{tab}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white transition-colors">
            <Settings size={20} />
            <span className="text-[10px] uppercase tracking-widest font-black hidden xl:block">Config</span>
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-4 py-3 text-red-500/50 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="text-[10px] uppercase tracking-widest font-black hidden xl:block">Exit Sovereign</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pl-20 xl:pl-64 min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-400">Sovereign Layer</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Systems Nominal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
              <input 
                type="text" 
                placeholder="PROBE NETWORK..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-[9px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold/50 transition-all"
              />
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
               <Bell size={20} strokeWidth={1.5} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-luxury-gold rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
              <User size={18} strokeWidth={1} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-10">
          <div className="mb-12">
            <h1 className="text-4xl font-display text-white tracking-tighter italic">Platform <span className="text-luxury-gold not-italic">Meta-Analytics</span></h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2">Real-time aggregate data from the global commerce mesh.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#080808] border border-white/5 p-8 group hover:border-luxury-gold/30 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 text-luxury-gold">
                    <stat.icon size={20} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold",
                    stat.up ? "text-green-500" : "text-red-500"
                  )}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">{stat.label}</p>
                <p className="text-3xl font-display text-white tracking-tighter">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Agent Status */}
            <div className="lg:col-span-2 bg-[#080808] border border-white/5 p-10 space-y-10">
               <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.5em] text-white font-black">Autonomous Agents</h4>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-2">Active neural subprocesses monitoring platform health.</p>
                  </div>
                  <button className="text-luxury-gold text-[9px] uppercase tracking-widest font-black flex items-center gap-2 hover:text-white transition-colors">
                    View Logs <ArrowUpRight size={12} />
                  </button>
               </div>
                <div className="space-y-6">
                  {[
                    { name: 'Marketing Architect', status: 'Optimizing Ads', health: 98, color: 'text-purple-400' },
                    { name: 'Logistics Prophecy', status: 'Predicting ETAs', health: 99, color: 'text-blue-400' },
                    { name: 'Fraud Sentinel', status: 'Scanning Transactions', health: 100, color: 'text-red-400' },
                    { name: 'Growth Catalyst', status: 'Analyzing Trends', health: 95, color: 'text-green-400' }
                  ].map((agent, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-6 flex items-center justify-between group hover:border-white/20 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", agent.color.replace('text', 'bg'))} />
                          <div>
                            <p className="text-xs font-display text-white italic">{agent.name}</p>
                            <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">{agent.status}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-mono text-white">{agent.health}%</p>
                          <div className="w-24 h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${agent.health}%` }}
                               className={cn("h-full", agent.color.replace('text', 'bg'))}
                             />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 bg-white/[0.01] border border-white/10 p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="text-[10px] uppercase tracking-[0.5em] text-white font-black">Buyer Retention Funnel</h4>
                    <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">Growth Vector: 14.2%</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { l: 'Impressions', v: '1.2M', p: 100, c: 'bg-white/10' },
                      { l: 'Product Views', v: '450K', p: 37, c: 'bg-white/20' },
                      { l: 'Cart Additions', v: '82K', p: 18, c: 'bg-luxury-gold/40' },
                      { l: 'Conversions', v: '12K', p: 8.5, c: 'bg-luxury-gold' }
                    ].map((step, idx) => (
                      <div key={idx} className="relative group overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-20", step.c)} />
                        <div className="relative p-5 flex justify-between items-center px-10 border-l-2 border-transparent hover:border-luxury-gold transition-all">
                           <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">{step.l}</span>
                           <div className="flex items-center gap-10">
                              <span className="text-[10px] font-mono text-white font-black">{step.v}</span>
                              <span className="text-[10px] font-mono text-luxury-gold font-bold w-12 text-right">{step.p}%</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 p-6 bg-luxury-gold/10 border border-luxury-gold/20 flex items-center gap-4">
                     <TrendingUp className="text-luxury-gold" size={20} />
                     <p className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold font-black leading-relaxed">
                        AI Insight: Optimizing checkout flow in the "Switzerland" node will increase conversion by 2.4%.
                     </p>
                  </div>
               </div>
            </div>


            {/* Security Pulse */}
            <div className="bg-luxury-gold/5 border border-luxury-gold/10 p-10 flex flex-col justify-between">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <Shield className="text-luxury-gold font-black" size={32} />
                    <h4 className="text-xs uppercase tracking-[0.4em] text-luxury-gold font-black underline underline-offset-8">Security Perimeter</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="p-4 bg-black/40 border border-luxury-gold/20 flex flex-col gap-2">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest">DDoS Mitigation</span>
                        <span className="text-[10px] text-white font-mono tracking-widest">Active - 0 Attacks Identified</span>
                     </div>
                     <div className="p-4 bg-black/40 border border-luxury-gold/20 flex flex-col gap-2">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest">API Health</span>
                        <span className="text-[10px] text-white font-mono tracking-widest">99.999% Service Integrity</span>
                     </div>
                  </div>
               </div>
               
               <div className="pt-10 border-t border-luxury-gold/10 mt-10">
                  <p className="text-3xl font-display text-luxury-gold italic tracking-tighter">Verified Sovereign</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] mt-2 font-black">All protocols are under architect supervision.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
