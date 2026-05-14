import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Sparkles, ShieldCheck, RefreshCcw } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Timestamp;
  isAI?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    const q = query(
      collection(db, 'customer_chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
    });

    return unsubscribe;
  }, [isOpen, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const text = message.trim();
    setMessage('');

    try {
      await addDoc(collection(db, 'customer_chats'), {
        text,
        senderId: user.uid,
        senderName: user.displayName || 'Architect',
        participants: [user.uid, 'ADMIN_ID'], // In a real app, this would be a specific admin or a general inbox
        timestamp: Timestamp.now(),
        isAI: false
      });

      // Simulate AI Bot Initial Response for "Fully Enterprise" feel
      if (messages.length === 0) {
        setLoading(true);
        setTimeout(async () => {
          await addDoc(collection(db, 'customer_chats'), {
            text: "Welcome to Luxe Doow Concierge. An elite partner has been alerted and will be with you shortly. How may I assist your procurement today?",
            senderId: 'SYSTEM_BOT',
            senderName: 'Maison Bot',
            participants: [user.uid, 'ADMIN_ID'],
            timestamp: Timestamp.now(),
            isAI: true
          });
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-6 w-[380px] h-[550px] glass overflow-hidden flex flex-col border-luxury-gold/20 shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-white text-black flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-luxury-gold relative">
                    <Sparkles size={18} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">Maison Concierge</h4>
                    <p className="text-[8px] uppercase tracking-widest text-gray-500">Global Priority Support</p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={18} />
               </button>
            </div>

            {/* Invariants Message */}
            <div className="px-6 py-2 bg-luxury-gold/5 border-b border-luxury-gold/10 flex items-center gap-3">
               <ShieldCheck size={12} className="text-luxury-gold" />
               <span className="text-[8px] uppercase tracking-widest text-luxury-gold/80">Secured via Billion-Dollar Encryption</span>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                   <MessageSquare size={32} strokeWidth={1} />
                   <div className="text-[10px] uppercase tracking-widest">Awaiting Direct Link...</div>
                </div>
              )}
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.senderId === user.uid ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 text-[11px] leading-relaxed",
                    msg.senderId === user.uid 
                      ? "bg-white text-black" 
                      : msg.isAI ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20" : "bg-white/5 text-gray-300 border border-white/10"
                  )}>
                    {msg.text}
                  </div>
                  <span className="mt-2 text-[8px] uppercase tracking-widest text-gray-600 font-mono">
                    {msg.senderName} • {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="mr-auto items-start max-w-[80%]">
                   <div className="p-4 bg-white/5 border border-white/10 flex gap-2">
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 pt-0 border-t border-white/5 mt-auto">
               <div className="relative group">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Procurement Directive..."
                    className="w-full bg-white/5 border border-white/10 p-4 pr-12 text-[10px] uppercase tracking-widest outline-none focus:border-luxury-gold transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-gold hover:text-white transition-colors"
                  >
                    <Send size={16} />
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-white text-black shadow-2xl flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <div className="relative z-10">
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </div>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold border-4 border-black rounded-full animate-pulse z-20" />
        )}
      </motion.button>
    </div>
  );
}
