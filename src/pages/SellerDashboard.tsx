import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, RefreshCcw, Wand2, TrendingUp, Truck, ShieldCheck, AlertCircle, Play, Image as ImageIcon, Search, BarChart3, Globe, Zap, Bot, MessageSquare, Plus, Save, Power, Target, Braces } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { cn } from '../lib/utils';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 4500, orders: 12 },
  { name: 'Tue', revenue: 5200, orders: 15 },
  { name: 'Wed', revenue: 4800, orders: 11 },
  { name: 'Thu', revenue: 6100, orders: 18 },
  { name: 'Fri', revenue: 5900, orders: 16 },
  { name: 'Sat', revenue: 8400, orders: 24 },
  { name: 'Sun', revenue: 7600, orders: 20 },
];

const categoryData = [
  { name: 'Boutique', value: 45, color: '#D4AF37' },
  { name: 'Techwear', value: 25, color: '#404040' },
  { name: 'Home', value: 20, color: '#606060' },
  { name: 'Lifestyle', value: 10, color: '#a0a0a0' },
];

function PremiumSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#0a0a0a] border border-white/5", className)}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

function BotManagement() {
  const [bots, setBots] = useState([
    { id: 'inventory', name: 'Inventory Sentinel', desc: 'Auto-syncs stock levels from CJ/Spocket. Disables store products if out of stock.', active: true, icon: RefreshCcw },
    { id: 'pricing', name: 'Competitor Shadow', desc: 'Scans competitors and maintains price -0.50 lower than average.', active: false, icon: Target },
    { id: 'import', name: 'Crawler Import', desc: 'Scan supplier URLs and automatically import images, descriptions, and variants.', active: true, icon: Globe },
    { id: 'profit', name: 'Yield Maximizer', desc: 'Dynamically adjusts commission based on demand velocity and market trends.', active: true, icon: TrendingUp },
  ]);

  const toggleBot = (id: string) => {
    setBots(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h3 className="text-xl font-display font-light">Neural Logic Center</h3>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-2">Autonomous Partner Agents</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-luxury-gold/10 border border-luxury-gold/30 text-[9px] uppercase tracking-widest text-luxury-gold flex items-center gap-3">
              <Bot size={14} className="animate-pulse" /> All Bots Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bots.map((bot) => (
          <div key={bot.id} className={cn(
            "glass p-8 border hover:border-luxury-gold/50 transition-all duration-700 relative overflow-hidden group",
            bot.active ? "border-luxury-gold/20" : "border-white/5 opacity-60"
          )}>
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className={cn(
                 "p-4 border transition-colors",
                 bot.active ? "border-luxury-gold text-luxury-gold" : "border-white/10 text-gray-600"
               )}>
                 <bot.icon size={24} />
               </div>
               <button 
                 onClick={() => toggleBot(bot.id)}
                 className={cn(
                   "px-6 py-2 text-[9px] uppercase tracking-[0.2em] font-bold transition-all",
                   bot.active ? "bg-luxury-gold text-white" : "bg-white/5 text-gray-400"
                 )}
               >
                 {bot.active ? 'Active' : 'Disabled'}
               </button>
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-display font-light mb-3">{bot.name}</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed mb-8">{bot.desc}</p>
              
              <div className="flex items-center gap-6">
                 <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: bot.active ? '100%' : '0%' }}
                      className="h-full bg-luxury-gold"
                    />
                 </div>
                 <span className="text-[8px] uppercase tracking-widest text-gray-600 font-mono">Precision: 99.8%</span>
              </div>
            </div>
            
            {bot.active && (
               <div className="absolute top-0 right-0 p-8 pt-10">
                  <RefreshCcw size={64} className="text-luxury-gold/[0.03] animate-spin-slow rotate-12" />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Autonomous Pricing Console */}
      <div className="glass p-10 border-white/5 relative">
         <div className="absolute top-0 right-0 p-8">
            <Braces size={48} className="text-white/[0.02]" />
         </div>
         <h3 className="text-xl font-display font-light mb-10 border-b border-white/5 pb-6">Autonomous Global Pricing Engine</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-widest text-gray-500">Base Commission</label>
               <div className="flex items-center gap-4">
                  <input type="text" defaultValue="35%" className="bg-white/5 border border-white/10 p-4 text-xs font-mono w-full" />
                  <Save size={16} className="text-gray-600" />
               </div>
            </div>
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-widest text-gray-500">Competitor Delta</label>
               <div className="flex items-center gap-4">
                  <input type="text" defaultValue="-£0.50" className="bg-white/5 border border-white/10 p-4 text-xs font-mono w-full text-luxury-gold" />
                  <Target size={16} className="text-luxury-gold" />
               </div>
            </div>
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-widest text-gray-500">Auto-Import SKU Cap</label>
               <div className="flex items-center gap-4">
                  <input type="text" defaultValue="5000" className="bg-white/5 border border-white/10 p-4 text-xs font-mono w-full" />
                  <Package size={16} className="text-gray-600" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function SupportInbox() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for all chat requests
    const q = query(collection(db, 'customer_chats'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Group by participant (user)
      const grouped: any = {};
      chats.forEach((c: any) => {
        const userId = c.participants.find((p: string) => p !== 'ADMIN_ID');
        if (!grouped[userId]) grouped[userId] = [];
        grouped[userId].push(c);
      });
      setConversations(Object.keys(grouped).map(uid => ({
        uid,
        lastMessage: grouped[uid][0],
        allMessages: grouped[uid].reverse()
      })));
    });
    return unsubscribe;
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeChat) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'customer_chats'), {
        text: reply.trim(),
        senderId: 'ADMIN_ID',
        senderName: 'Luxe Doow Partner',
        participants: [activeChat, 'ADMIN_ID'],
        timestamp: Timestamp.now(),
        isAI: false
      });
      setReply('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedConv = conversations.find(c => c.uid === activeChat);

  return (
    <div className="h-[700px] flex gap-8">
      {/* List */}
      <div className="w-80 flex flex-col glass border-white/5">
        <div className="p-8 border-b border-white/5">
           <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold">Priority Support</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {conversations.map(conv => (
             <button 
               key={conv.uid}
               onClick={() => setActiveChat(conv.uid)}
               className={cn(
                 "w-full p-6 text-left border transition-all duration-500 group",
                 activeChat === conv.uid ? "bg-white/5 border-luxury-gold/50" : "border-white/5 hover:border-white/20"
               )}
             >
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] uppercase tracking-widest text-white">{conv.lastMessage.senderName}</span>
                   <span className="text-[8px] font-mono opacity-40">{conv.lastMessage.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[9px] text-gray-500 line-clamp-1 italic">"{conv.lastMessage.text}"</p>
             </button>
           ))}
           {conversations.length === 0 && (
             <div className="py-20 text-center opacity-30">
                <MessageSquare size={32} className="mx-auto mb-4" />
                <span className="text-[9px] uppercase tracking-widest">No active transmissions</span>
             </div>
           )}
        </div>
      </div>

      {/* View */}
      <div className="flex-1 flex flex-col glass border-white/5 relative">
        {!activeChat ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
            <Zap size={48} className="text-luxury-gold" />
            <div className="text-[10px] uppercase tracking-[0.4em]">Select Enterprise Link to Begin Support</div>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold border border-luxury-gold/30">
                     {selectedConv?.lastMessage.senderName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold">{selectedConv?.lastMessage.senderName}</h4>
                    <span className="text-[8px] uppercase tracking-widest text-green-500">Live External Socket</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="px-5 py-2 border border-white/10 text-[9px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Archive</button>
                  <button className="px-5 py-2 bg-luxury-gold text-white text-[9px] uppercase tracking-widest font-bold">Transfer to AI</button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col">
               {selectedConv?.allMessages.map((msg: any) => (
                 <div 
                   key={msg.id}
                   className={cn(
                     "flex flex-col max-w-[70%]",
                     msg.senderId === 'ADMIN_ID' ? "ml-auto items-end" : "mr-auto items-start"
                   )}
                 >
                   <div className={cn(
                     "p-6 text-xs leading-relaxed",
                     msg.senderId === 'ADMIN_ID' ? "bg-luxury-gold text-white" : "bg-white/5 border border-white/10 text-gray-300"
                   )}>
                     {msg.text}
                   </div>
                   <span className="mt-3 text-[9px] uppercase tracking-widest text-gray-600 font-mono">
                     {msg.senderName} • {msg.timestamp?.toDate().toLocaleTimeString()}
                   </span>
                 </div>
               ))}
            </div>

            <form onSubmit={handleSendReply} className="p-8 border-t border-white/5">
                <div className="relative">
                   <input 
                     type="text" 
                     value={reply}
                     onChange={(e) => setReply(e.target.value)}
                     placeholder="Deploy Official Protocol Response..."
                     className="w-full bg-white/[0.03] border border-white/10 p-6 pr-20 text-xs outline-none focus:border-luxury-gold transition-all"
                   />
                   <button 
                     type="submit"
                     disabled={loading}
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white text-black hover:bg-luxury-gold hover:text-white transition-all shadow-xl"
                   >
                     {loading ? <RefreshCcw className="animate-spin" size={16} /> : <Send size={16} />}
                   </button>
                </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function AnalyticsHub() {
  return (
    <div className="space-y-12">
      {/* AI Profit Advisor Strip */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 border-luxury-gold/30 bg-luxury-gold/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gold" />
        <div className="flex items-center gap-6 z-10">
          <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-white scale-110 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] mb-1">AI Profit Intelligence</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Autonomous pricing applied to 14 SKUs. Projected margin increase: <span className="text-luxury-gold">+£2,450 this week</span>.
            </p>
          </div>
        </div>
        <div className="flex gap-4 z-10 w-full md:w-auto">
          <div className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest">
            <span className="block text-gray-400 mb-1">Dynamic Ceiling</span>
            <span className="font-mono text-white">£4.2k Protected</span>
          </div>
          <div className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest">
            <span className="block text-gray-400 mb-1">Yield Opt.</span>
            <span className="font-mono text-luxury-gold">Active</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Weekly Gross Revenue', value: '£42,500', change: '+12.5%', trend: 'up' },
          { label: 'Acquisition Velocity', value: '4.2%', change: '+0.8%', trend: 'up' },
          { label: 'Active Reserve', value: '£184,000', change: 'Stable', trend: 'neutral' },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-none border-white/5 relative group cursor-default">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp size={14} className="text-luxury-gold" />
            </div>
            <div className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-4">{stat.label}</div>
            <div className="text-4xl font-display font-light mb-2">{stat.value}</div>
            <div className={cn(
              "text-[9px] uppercase tracking-widest font-bold",
              stat.trend === 'up' ? "text-green-500" : "text-gray-400"
            )}>
              {stat.change} <span className="font-light opacity-50 ml-1">vs/Prev Cycle</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass p-10 rounded-none border-white/5 h-[450px] relative">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-display italic font-light flex items-center gap-3">
              <BarChart3 className="text-luxury-gold" size={18} />
              Revenue Flux
            </h3>
            <div className="flex gap-4">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors">Wk</span>
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold border-b border-luxury-gold">Mo</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors">Yr</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666', letterSpacing: 2 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '0' }}
                  labelStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#666', marginBottom: '8px' }}
                  itemStyle={{ fontSize: '12px', color: '#D4AF37', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-none border-white/5 h-[450px] relative">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-display italic font-light flex items-center gap-3">
              <TrendingUp className="text-luxury-gold" size={18} />
              Catalog Composition
            </h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff05" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#fff', letterSpacing: 1 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2">Dominant Niche</div>
              <div className="text-xs font-mono text-luxury-gold">High-End Boutique Fashion</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2">Expansion Opportunity</div>
              <div className="text-xs font-mono text-white">UK Home Decor (+18.2%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaHub() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h3 className="text-xl font-display font-light">Media Studio</h3>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-2">Original Content Management</p>
        </div>
        <button className="px-8 py-3 bg-white text-black text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-luxury-gold hover:text-white transition-all">
          Upload Masterpiece
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-[3/4] glass relative overflow-hidden group">
            <PremiumSkeleton className="absolute inset-0 z-0" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="p-3 bg-white text-black rounded-full cursor-pointer hover:scale-110 transition-transform">
                <Play size={16} fill="black" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-10">
              <div className="text-[8px] uppercase tracking-widest text-white/60 mb-1">Campaign Assets</div>
              <div className="text-[10px] text-white font-mono">LNF-PRD-00{i}.mp4</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component for AI Generation
function AIServiceCard() {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!productName) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/ai/generate-description', { productName });
      setResult(res.data.description);
    } catch (e: any) {
      console.error(e);
      setError('The AI Content Engine is currently undergoing scheduled maintenance. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-none border-white/5 space-y-6 relative overflow-hidden group hover:border-luxury-gold/30 transition-colors duration-700 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-display font-light flex items-center gap-3">
          <Wand2 className="text-luxury-gold" size={20} />
          AI Content Atelier
        </h3>
      </div>
      <p className="text-sm text-gray-400 font-light relative z-10 leading-relaxed">
        Generate SEO-optimized, highly-converting luxury descriptions for global imports.
      </p>
      
      <div className="space-y-4 relative z-10">
        <input 
          type="text" 
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Product Title (e.g. Italian Leather Bag)"
          className="w-full bg-black/40 border border-white/10 p-4 rounded-none outline-none focus:border-luxury-gold transition-colors text-sm backdrop-blur-md"
        />
        {error && (
          <div className="flex items-center gap-2 text-[10px] text-red-500 uppercase tracking-widest bg-red-500/5 p-3 border border-red-500/20">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <button 
          onClick={generate}
          disabled={loading}
          className="w-full py-4 bg-white text-black uppercase tracking-[0.3em] text-xs font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden relative group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-yellow-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 flex items-center gap-2">
            {loading ? <RefreshCcw className="animate-spin" size={16} /> : 'Cultivate Luxury Copy'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {loading ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 space-y-3 relative z-10"
          >
            <PremiumSkeleton className="h-4 w-full rounded" />
            <PremiumSkeleton className="h-4 w-[90%] rounded" />
            <PremiumSkeleton className="h-4 w-[75%] rounded" />
          </motion.div>
        ) : result ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 bg-black/40 backdrop-blur-md border border-luxury-gold/20 rounded-none text-xs leading-relaxed text-gray-300 font-light max-h-[300px] overflow-y-auto relative z-10"
          >
            {result}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function GlobalResearchHub() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // Mocked CJ discovery for demo, in real it hits /api/supplier/cj/search
      setTimeout(() => {
        setResults([
          { name: 'Titanium Smart Valise', cost: '$124.00', shipping: '3-5 Days (UK)', variant: 'Premium' },
          { name: 'Obsidian Night Light', cost: '$42.50', shipping: '4-7 Days (US)', variant: 'Minimalist' },
          { name: 'Aurora Silk Scarf', cost: '$18.20', shipping: '2-4 Days (Global)', variant: 'Luxury' }
        ]);
        setLoading(false);
      }, 1500);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-10 rounded-none border-white/5 space-y-8 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display italic font-light flex items-center gap-3">
          <Search className="text-luxury-gold" size={18} />
          Global Sourcing Engine
        </h3>
        <Zap className="text-luxury-gold animate-pulse" size={14} />
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search UK/USA Warehouse Stock..."
          className="flex-1 bg-black/40 border border-white/10 p-4 outline-none focus:border-luxury-gold transition-colors text-xs font-mono"
        />
        <button 
          onClick={search}
          className="px-6 py-4 bg-luxury-gold text-white text-[10px] uppercase tracking-widest font-bold"
        >
          Discover
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <PremiumSkeleton className="h-20 w-full" />
            <PremiumSkeleton className="h-20 w-full" />
          </div>
        ) : results.length > 0 ? (
          results.map((res, i) => (
            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 group hover:border-luxury-gold/50 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-white font-medium">{res.name}</span>
                <span className="text-luxury-gold font-mono text-[10px]">{res.cost}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-2">
                  <Truck size={10} /> {res.shipping}
                </span>
                <span className="px-2 py-0.5 border border-white/10 group-hover:border-luxury-gold/30">Import to Store</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-600">
            <Globe size={24} className="opacity-20" />
            <span className="text-[10px] uppercase tracking-[0.4em]">Query Global Directives</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CJAuthCard() {
  const [apiKey, setApiKey] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = async () => {
    if (!apiKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/supplier/cj/auth', { apiKey });
      if (res.data.success) {
        setToken(res.data.accessToken);
      } else {
        setError(res.data.error || 'Authentication failed');
      }
    } catch (e: any) {
      setError(e.response?.data?.error || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-none border-white/5 space-y-6 relative overflow-hidden group hover:border-luxury-gold/30 transition-colors duration-700">
      <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-display font-light flex items-center gap-3">
          <ShieldCheck className="text-luxury-gold" size={20} />
          CJ Bridge Authorization
        </h3>
      </div>
      <p className="text-sm text-gray-400 font-light relative z-10 leading-relaxed">
        Establish a secure connection with CJ Dropshipping to enable autonomous fulfillment and inventory synchronization.
      </p>
      
      <div className="space-y-4 relative z-10">
        <input 
          type="password" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste API Key (e.g. CJ5414...)"
          className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-none outline-none focus:border-luxury-gold transition-colors text-sm font-mono"
        />
        <button 
          onClick={authenticate}
          disabled={loading}
          className="w-full py-4 border border-luxury-gold text-luxury-gold uppercase tracking-[0.3em] text-xs font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 z-0" />
          <span className="relative z-10 flex items-center gap-2">
            {loading ? <RefreshCcw className="animate-spin" size={16} /> : 'Authorize Bridge'}
          </span>
        </button>
      </div>

      {token && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-none space-y-3">
          <div className="flex items-center gap-2 text-green-500 text-[10px] uppercase tracking-widest">
            <ShieldCheck size={14} /> Bridge Established
          </div>
          <p className="text-[9px] text-gray-500 italic">This token is now active for logistics sync.</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-none text-[10px] text-red-500 uppercase tracking-widest">
          {error}
        </div>
      )}
    </div>
  );
}

function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (e) {
      console.error('Order fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const syncTracking = async (orderId: string, supplierOrderId: string) => {
    setSyncing(orderId);
    try {
      const res = await axios.post('/api/orders/sync-tracking', { orderId, supplierOrderId });
      if (res.data.success) {
        await fetchOrders();
      }
    } catch (e) {
      console.error('Tracking sync failed', e);
    } finally {
      setSyncing(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass p-10 rounded-none border-white/5 space-y-8">
        <PremiumSkeleton className="h-4 w-48 rounded" />
        <div className="space-y-4">
          <PremiumSkeleton className="h-16 w-full rounded" />
          <PremiumSkeleton className="h-16 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4 flex justify-between">
        Recent Acquisitions
        <button onClick={fetchOrders} className="hover:text-luxury-gold transition-colors flex items-center gap-2">
          <RefreshCcw size={10} /> Refresh
        </button>
      </div>
      <div className="glass rounded-none overflow-hidden border-white/5">
        <table className="w-full text-left text-[10px] uppercase tracking-[0.2em]">
          <thead className="bg-white/[0.03] border-b border-white/5 text-gray-400">
            <tr>
              <th className="p-8 font-medium">Order ID</th>
              <th className="p-8 font-medium">Status</th>
              <th className="p-8 font-medium text-right">Valuation</th>
              <th className="p-8 font-medium text-right">Tracking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light text-gray-500">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-all duration-700 group">
                <td className="p-8 text-white font-mono text-xs opacity-80">{order.id.substring(0, 12)}...</td>
                <td className="p-8">
                  <span className={cn(
                    "px-4 py-1.5 border rounded-none text-[8px] tracking-[0.3em]",
                    order.status === 'PAID' ? "border-green-500/30 text-green-500" :
                    order.status === 'SHIPPED' ? "border-luxury-gold/30 text-luxury-gold font-bold" :
                    "border-white/10 text-gray-500"
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="p-8 text-right font-mono text-white text-sm">£{order.total?.toLocaleString()}</td>
                <td className="p-8 text-right">
                  {order.trackingNumber ? (
                    <span className="text-white font-mono">{order.trackingNumber}</span>
                  ) : order.supplierOrderId ? (
                    <button 
                      onClick={() => syncTracking(order.id, order.supplierOrderId)}
                      className="text-luxury-gold hover:text-white transition-colors flex items-center gap-2 ml-auto"
                    >
                      <Truck size={10} /> Sync CJ Tracking
                    </button>
                  ) : (
                    <span className="opacity-30">Preparing...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryList() {
  const [inventory] = useState([
    { id: '1', name: "Architectural Silk Blazer", price: 1250, stock: 12, status: 'Active', supplier: 'CJ Dropshipping' },
    { id: '2', name: "Midnight Skeleton Tourbillon", price: 8400, stock: 3, status: 'Low Stock', supplier: 'Spocket Global' },
    { id: '3', name: "Obsidian Travel Valise", price: 950, stock: 24, status: 'Active', supplier: 'CJ Dropshipping' },
    { id: '4', name: "Cashmere Lounge Set", price: 680, stock: 0, status: 'Out of Stock', supplier: 'Spocket Global' },
  ]);

  return (
    <div className="space-y-6">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4 flex justify-between">
        Curated Stock Management
      </div>
      <div className="glass rounded-none overflow-hidden border-white/5">
        <table className="w-full text-left text-[10px] uppercase tracking-[0.2em]">
          <thead className="bg-white/[0.03] border-b border-white/5 text-gray-400">
            <tr>
              <th className="p-8 font-medium">Object Name</th>
              <th className="p-8 font-medium">Valuation</th>
              <th className="p-8 font-medium">Stock Level</th>
              <th className="p-8 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light text-gray-500">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-all duration-700 group cursor-pointer">
                <td className="p-8 text-white font-mono text-xs opacity-80">{item.name}</td>
                <td className="p-8 font-mono opacity-80">£{item.price.toLocaleString()}</td>
                <td className="p-8 font-mono">{item.stock} Units</td>
                <td className="p-8 text-right">
                  <span className={cn(
                    "px-4 py-1.5 border rounded-none text-[8px] tracking-[0.3em]",
                    item.status === 'Active' ? "border-green-500/30 text-green-500" :
                    item.status === 'Low Stock' ? "border-luxury-gold/30 text-luxury-gold" :
                    "border-red-500/30 text-red-500"
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="pt-40 px-12 pb-32 max-w-[1500px] mx-auto flex gap-16">
      {/* Sidebar */}
      <div className="w-72 space-y-2 hidden lg:block">
        <div className="px-5 mb-8">
          <div className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold opacity-80 mb-2">Partner Central</div>
          <h2 className="text-2xl font-display font-light italic">LUXE <span className="text-luxury-gold">DOOW</span></h2>
          <div className="text-[8px] uppercase tracking-[0.5em] text-gray-600 mt-1">Console v2.1</div>
        </div>
        {[
          { id: 'analytics', label: 'Elegance Analytics', icon: BarChart3 },
          { id: 'neural-logic', label: 'Neural Bot Center', icon: Zap },
          { id: 'support', label: 'Support Concierge', icon: MessageSquare },
          { id: 'research', label: 'Global Sourcing', icon: Search },
          { id: 'media', label: 'Media Studio', icon: ImageIcon },
          { id: 'inventory', label: 'Curated Stock', icon: Package },
          { id: 'fulfillment', label: 'Global Logistics', icon: Truck },
          { id: 'billing', label: 'Financial Reserve', icon: ShieldCheck },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-none text-[10px] uppercase tracking-[0.25em] transition-all duration-500 text-left",
              activeTab === item.id ? "bg-white/5 border-l-2 border-luxury-gold text-white" : "text-gray-500 hover:text-white"
            )}
          >
            <item.icon size={14} className={activeTab === item.id ? "text-luxury-gold" : ""} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-16">
        <div className="flex justify-between items-end border-b border-white/10 pb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-transparent opacity-50 z-0 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-light capitalize">Maison {activeTab}</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
              <span className="w-4 h-px bg-luxury-gold inline-block"></span>
              Global Hub / Headless Tier v2.1
            </p>
          </div>
          <div className="relative z-10 hidden md:flex items-center gap-4">
            <button className="px-8 py-3 glass border-white/10 hover:border-white transition-all text-[9px] uppercase tracking-[0.3em] font-medium flex items-center gap-3">
              <RefreshCcw size={12} /> Sync Global Reserve
            </button>
          </div>
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-12"
        >
          {activeTab === 'analytics' && <AnalyticsHub />}
          {activeTab === 'neural-logic' && <BotManagement />}
          {activeTab === 'support' && <SupportInbox />}
          {activeTab === 'research' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <GlobalResearchHub />
              <AIServiceCard />
            </div>
          )}
          {activeTab === 'media' && <MediaHub />}
          {activeTab === 'inventory' && <InventoryList />}
          {activeTab === 'fulfillment' && (
            <div className="space-y-12">
              <CJAuthCard />
              <OrderList />
            </div>
          )}
          {(activeTab === 'billing') && (
            <div className="glass p-10 rounded-none border-white/5 space-y-8 flex flex-col items-center justify-center min-h-[400px]">
               <ShieldCheck className="text-luxury-gold/50 mb-4" size={32} />
               <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Financial Reserve Data Locked for Security</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
