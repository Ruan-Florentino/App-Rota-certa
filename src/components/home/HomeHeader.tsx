import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { BellIcon } from '../icons';
import { LogoSymbol } from '../brand/LogoSymbol';
import { HeaderParticles } from './HeaderParticles';

interface HomeHeaderProps {
  user: any;
  notificationCount?: number;
  onOpenNotifications?: () => void;
}

export function HomeHeader({ user, notificationCount = 0, onOpenNotifications }: HomeHeaderProps) {
  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Greeting dinâmico
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) { setGreeting('Bom dia'); setEmoji('☀️'); }
    else if (hour < 18) { setGreeting('Boa tarde'); setEmoji('🌤️'); }
    else { setGreeting('Boa noite'); setEmoji('🌙'); }
  }, []);
  
  const firstName = user?.displayName?.split(' ')[0] || 'Viajante';
  
  // Parallax com mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const glowX = useTransform(mouseX, [-1, 1], ['-30%', '30%']);
  const glowY = useTransform(mouseY, [-1, 1], ['-30%', '30%']);
  
  return (
    <motion.header 
      className="home-header"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background glow que segue o mouse */}
      <motion.div 
        className="header-glow"
        style={{ x: glowX, y: glowY }}
      />
      
      {/* Partículas ambientes */}
      <HeaderParticles />
      
      {/* Aurora top */}
      <div className="header-aurora" />
      
      {/* Top Row: Logo + Greeting + Bell */}
      <div className="relative z-10 px-6 pt-4 flex items-center justify-between">
        {/* Logo compacto animado */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 1, 
            type: 'spring',
            stiffness: 150,
            damping: 12,
          }}
        >
          <LogoSymbol size={48} animated />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-30 animate-pulse pointer-events-none" />
        </motion.div>
        
        {/* Greeting elegante */}
        <motion.div
          className="flex-1 px-4 text-left"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <motion.span 
              className="text-sm"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              {emoji}
            </motion.span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{greeting}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-black text-white tracking-tighter uppercase flex">
              {firstName.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.04 }}
                  className={i < 3 ? "text-primary filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </h2>
            <motion.span
              className="text-xs text-accent"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ✦
            </motion.span>
          </div>
        </motion.div>
        
        {/* Bell button with Glow */}
        <motion.button
          className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          whileHover={{ y: -2, border: '1px solid rgba(255, 255, 255, 0.2)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenNotifications}
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <motion.div
            animate={notificationCount > 0 ? {
              rotate: [0, -15, 15, -10, 10, 0],
            } : {}}
            transition={{
              duration: 1,
              repeat: notificationCount > 0 ? Infinity : 0,
              repeatDelay: 5,
            }}
          >
            <BellIcon size={22} className={notificationCount > 0 ? "text-primary" : "text-white/60"} />
          </motion.div>
          
          {notificationCount > 0 && (
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020617] relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            </div>
          )}
        </motion.button>
      </div>
      
      {/* Logo Word (Right Way) gigante */}
      <motion.div
        className="header-wordmark"
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="wordmark-right">
          {'Right'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="wordmark-char wordmark-char-right"
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.8 + i * 0.06,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
        
        <div className="wordmark-way">
          {'Way'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="wordmark-char wordmark-char-way"
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 1.1 + i * 0.06,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
          
          {/* Shimmer sweep contínuo */}
          <motion.div
            className="wordmark-shimmer"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
      
      {/* Tagline com linhas decorativas */}
      <motion.div
        className="header-tagline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <motion.div 
          className="tagline-line tagline-line-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        />
        
        <span className="tagline-text">
          your journey starts here
        </span>
        
        <motion.div 
          className="tagline-line tagline-line-right"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        />
      </motion.div>
      
      {/* Bottom gradient fade */}
      <div className="header-fade" />
    </motion.header>
  );
}
