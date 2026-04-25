import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, User, Clock } from 'lucide-react';
import { db, auth, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from '../firebase';
import { Trip, TripMessage } from '../types';
import { SafeImage } from './ui/SafeImage';

interface TripChatProps {
  trip: Trip;
  onClose: () => void;
}

export const TripChat: React.FC<TripChatProps> = ({ trip, onClose }) => {
  const [messages, setMessages] = useState<TripMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!trip.id || !db) return;

    const q = query(
      collection(db, 'trips', trip.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TripMessage));
      setMessages(msgs);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }, (error) => {
      console.error("TripChat snapshot error:", error);
    });

    return () => unsubscribe();
  }, [trip.id]);

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser || !trip.id) return;

    const user = auth.currentUser;
    const newMessage = {
      userId: user.uid,
      userName: user.displayName || 'Viajante',
      userPhoto: user.photoURL || '',
      text: input.trim(),
      createdAt: serverTimestamp()
    };

    setInput('');
    try {
      await addDoc(collection(db, 'trips', trip.id, 'messages'), newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 right-6 w-[calc(100vw-48px)] max-w-[380px] h-[500px] bg-[#1A1A1A] rounded-[32px] shadow-2xl border border-white/10 flex flex-col z-[70] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Chat da Viagem</h4>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{trip.destination}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-5 h-5 text-white/40" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/40 text-sm">Nenhuma mensagem ainda. Comece o planejamento com seus parceiros!</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.userId === auth.currentUser?.uid ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/10">
                <SafeImage 
                  src={m.userPhoto || `https://ui-avatars.com/api/?name=${m.userName}&background=random`}
                  alt={m.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`flex flex-col ${m.userId === auth.currentUser?.uid ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] font-bold text-white/40 mb-1">{m.userName}</span>
                <div className={`p-3 rounded-2xl text-sm ${
                  m.userId === auth.currentUser?.uid 
                    ? 'bg-accent text-[#020617] font-medium rounded-tr-none' 
                    : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mensagem para o grupo..."
            className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent/50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-1 top-1 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-[#020617] disabled:opacity-50 transition-all active:scale-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
