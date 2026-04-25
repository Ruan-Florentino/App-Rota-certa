import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Award, Sparkles, Trophy } from 'lucide-react';
import { PremiumButton } from './PremiumButton';

interface LevelUpEffectProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpEffect: React.FC<LevelUpEffectProps> = ({ level, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="relative z-10 w-full max-w-sm glass-card p-10 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Rays effect */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[conic-gradient(from_0deg,transparent,rgba(0,229,255,0.1),transparent)] opacity-50"
            />
            
            <div className="relative mb-8">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.4)]"
              >
                <Trophy className="w-12 h-12 text-black" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-white text-black font-black text-xl w-10 h-10 rounded-full flex items-center justify-center shadow-2xl"
              >
                {level}
              </motion.div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-white tracking-tighter uppercase mb-2"
            >
              LEVEL UP!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 mb-8 uppercase tracking-widest text-[10px] font-black"
            >
              Você desbloqueou novos recursos voyager
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full space-y-3 mb-10"
            >
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-black text-xs uppercase">Novos Badges</p>
                  <p className="text-white/40 text-[8px] uppercase tracking-widest">+5 slots de conquistas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-black text-xs uppercase">AI Turbo</p>
                  <p className="text-white/40 text-[8px] uppercase tracking-widest">vendas de viagens AI 15% mais rápidas</p>
                </div>
              </div>
            </motion.div>
            
            <PremiumButton onClick={onClose} className="w-full" size="lg">
              Continuar Jornada
            </PremiumButton>
          </motion.div>
          
          {/* Confetti simulation with motion */}
          <ConfettiLayer />
        </div>
      )}
    </AnimatePresence>
  );
};

const ConfettiLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            top: '120%', 
            left: `${(Math.random() * 100) + (Math.random() - 0.5) * 20}%`,
            rotate: Math.random() * 360 * 4,
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            repeat: i < 15 ? Infinity : 0,
            delay: Math.random() * 0.5,
            ease: 'linear'
          }}
          className={`absolute w-3 h-3 rounded-full ${['bg-primary', 'bg-secondary', 'bg-accent', 'bg-white', 'bg-purple-500'][Math.floor(Math.random() * 5)]}`}
        />
      ))}
    </div>
  );
};
