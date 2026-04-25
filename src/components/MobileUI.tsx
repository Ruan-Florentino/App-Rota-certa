import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Home, Compass, Map, Wallet, User, BarChart3, PlusCircle, Receipt, Globe, MessageSquare, X, Sparkles, Send, Users } from 'lucide-react';
import { Logo } from './Logo';
import { simpleChat } from '../services/geminiService';
import { useGenerationContext } from '../hooks/useGenerationContext';
import Markdown from 'react-markdown';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-[420px] mx-auto min-h-screen bg-background relative flex flex-col ${className}`}>
      {/* Soft Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(125, 211, 252, 0.1), transparent 50%)',
           }} 
      />
      <div className="relative z-10 flex-1 flex flex-col safe-area-top safe-area-bottom overflow-y-auto scroll-hide">
        <div className="flex-1 px-4 pb-32">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AnimatedContainer: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const NeonCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ 
  children, 
  className = "",
  onClick
}) => {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      className={`glass-card relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export const GlowButton: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
}> = ({ 
  children, 
  onClick, 
  className = "",
  variant = 'primary',
  disabled = false
}) => {
  const colors = {
    primary: 'bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] border-[#A855F7]/50',
    secondary: 'bg-white/5 border-white/10 text-white hover:bg-white/10',
    accent: 'bg-[#7DD3FC] text-[#0F172A] shadow-[0_0_20px_rgba(125,211,252,0.3)] border-[#7DD3FC]/50'
  };

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`w-full h-14 backdrop-blur-md border rounded-2xl flex items-center justify-center gap-3 font-bold text-[11px] uppercase tracking-widest transition-all duration-300 ${colors[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const FloatingBottomBar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: 'home', icon: <Home className="w-6 h-6" />, label: 'Início', preload: () => import('../screens/HomeScreen') },
    { id: 'plan', icon: <PlusCircle className="w-6 h-6" />, label: 'Adicionar', preload: () => import('../screens/PlanTripScreen') },
    { id: 'explore', icon: <Globe className="w-6 h-6" />, label: 'Explorar', preload: () => import('../screens/ExploreScreen') },
    { id: 'map', icon: <Map className="w-6 h-6" />, label: 'Mapa', preload: () => import('../screens/MapScreen') },
    { id: 'community', icon: <Users className="w-6 h-6" />, label: 'Social', preload: () => import('../screens/CommunityScreen') },
    { id: 'profile', icon: <User className="w-6 h-6" />, label: 'Perfil', preload: () => import('../features/profile/ProfileScreen').then(m => ({ default: m.ProfileScreen })) }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[90]">
      <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full p-2 flex items-center justify-between border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              onMouseEnter={() => tab.preload()}
              onTouchStart={() => tab.preload()}
              onFocus={() => tab.preload()}
              aria-label={tab.label}
              className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-full transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-subtext hover:text-white/80'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const BlurCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-[#1A1A1A] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [chat, setChat] = React.useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const genContext = useGenerationContext();

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    
    const userMsg = message.trim();
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessage('');
    setLoading(true);

    try {
      const history = chat.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await simpleChat(userMsg, undefined, history, genContext);
      setChat(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setChat(prev => [...prev, { role: 'model', text: "Desculpe, tive um problema ao processar sua mensagem. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        aria-label="Assistente AI"
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#A855F7] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] z-[60] border-2 border-white/20"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative w-full max-w-md bg-[#0F172A] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[70vh]"
            >
              <div className="p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Assistente AI</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-hide">
                {chat.length === 0 && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 text-sm">Como posso ajudar na sua viagem hoje?</p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-black font-medium rounded-tr-none' 
                        : 'bg-white/5 text-white border border-white/10 rounded-tl-none markdown-body'
                    }`}>
                      {msg.role === 'user' ? (
                        msg.text
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-primary">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pergunte qualquer coisa..."
                    className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-6 pr-14 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="absolute right-2 top-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
