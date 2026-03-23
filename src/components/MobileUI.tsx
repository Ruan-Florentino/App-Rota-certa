import React from 'react';
import { motion } from 'motion/react';
import { Bell, Home, Compass, Map, Wallet, User, BarChart3, PlusCircle, Receipt } from 'lucide-react';
import { Logo } from './Logo';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-[420px] mx-auto min-h-screen bg-background relative flex flex-col ${className}`}>
      {/* Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" 
           style={{ 
             backgroundImage: 'linear-gradient(to bottom, transparent, var(--color-background)), linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '100% 100%, 40px 40px, 40px 40px'
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
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`glass-card rounded-[24px] p-6 border border-primary/10 relative overflow-hidden group ${className}`}
    >
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />
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
}> = ({ 
  children, 
  onClick, 
  className = "",
  variant = 'primary'
}) => {
  const colors = {
    primary: 'from-primary to-accent shadow-[0_0_20px_rgba(0,229,255,0.4)]',
    secondary: 'from-secondary to-primary shadow-[0_0_20px_rgba(0,255,163,0.4)]',
    accent: 'from-accent to-blue-600 shadow-[0_0_20px_rgba(0,179,255,0.4)]'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full h-16 bg-gradient-to-r ${colors[variant]} rounded-[20px] flex items-center justify-center gap-3 text-white font-black tracking-tight ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const HeaderMobile: React.FC<{ name: string; notificationCount?: number }> = ({ name, notificationCount = 0 }) => {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <Logo size="sm" />
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 glass-card rounded-[18px] flex items-center justify-center relative border border-primary/20"
        >
          <Bell className="w-6 h-6 text-primary" />
          {notificationCount > 0 && (
            <span className="absolute top-3 right-3 w-4 h-4 bg-accent rounded-full border-2 border-card neon-glow flex items-center justify-center text-[8px] font-black text-white">
              {notificationCount}
            </span>
          )}
        </motion.button>
      </div>

      <div className="flex flex-col">
        <h2 className="text-[24px] font-black text-white tracking-tight leading-tight">
          Olá, {name} 👋
        </h2>
        <p className="text-[12px] font-bold text-subtext uppercase tracking-[0.2em] mt-1">
          Sua próxima aventura
        </p>
      </div>
    </div>
  );
};

export const FloatingBottomBar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: 'home', icon: <Home className="w-6 h-6" />, label: 'Início' },
    { id: 'plan', icon: <PlusCircle className="w-6 h-6" />, label: 'Adicionar' },
    { id: 'map', icon: <Map className="w-6 h-6" />, label: 'Mapa' },
    { id: 'suggestions', icon: <Compass className="w-6 h-6" />, label: 'Sugestões' },
    { id: 'profile', icon: <User className="w-6 h-6" />, label: 'Perfil' }
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-50">
      <div className="glass-card rounded-full p-2 flex items-center justify-between border border-primary/20 neon-glow">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-full transition-all duration-300 ${
                isActive ? 'bg-primary/10 text-primary' : 'text-subtext'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                {tab.icon}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="w-1 h-1 bg-primary rounded-full neon-glow"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const BlurCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`glass-card rounded-[24px] p-6 ${className}`}>
      {children}
    </div>
  );
};
