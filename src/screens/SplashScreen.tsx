import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe } from 'lucide-react';
import { Logo } from '../components/Logo';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2800),
      setTimeout(onFinish, 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
      />

      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-12"
        >
          <Logo size="xl" showText={false} variant="gradient" />
          
          {/* Orbiting Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
          </motion.div>
        </motion.div>
        
        {/* Text Animation */}
        <div className="text-center relative h-24 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Logo size="xl" showText={true} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-2"
              >
                <Sparkles className="w-6 h-6 text-primary" />
                <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Planeje sua próxima viagem</p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-2"
              >
                <Globe className="w-6 h-6 text-accent" />
                <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Em segundos</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-24 left-12 right-12 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-primary to-blue-600 origin-left"
        />
      </div>
    </div>
  );
};
