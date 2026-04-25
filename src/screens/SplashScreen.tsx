import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Globe } from "lucide-react";
import { Logo } from "../components/Logo";

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({
  onFinish,
}) => {
  const [exiting, setExiting] = useState(false);
  const isReturning = localStorage.getItem("hasSeenOnboarding") === "true";
  
  // Returning users get a quicker transition (less boring), new users get the full 4.5s cinematic experience
  const DURATION = isReturning ? 2500 : 4500;

  useEffect(() => {
    // Start exit animation a bit before unmounting
    const exitTimer = setTimeout(() => setExiting(true), DURATION - 600);
    const finishTimer = setTimeout(onFinish, DURATION);
    
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, DURATION]);

  // Pre-calculate stars to avoid hydration/render mismatches
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
    }));
  }, []);

  return (
    <motion.div
      key="epic-splash"
      className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[9999] overflow-hidden cursor-pointer"
      onClick={() => { if(!exiting) onFinish(); }} // Click anywhere to skip
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Deep Glows */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none mix-blend-screen"
        initial={{ opacity: 0, scale: 0.5, background: "radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(0,0,0,0) 70%)" }}
        animate={{ 
          opacity: [0, 0.8, 0.4, 0], 
          scale: [0.5, 1, 1.5, 2.5],
          background: [
            "radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(0,0,0,0) 70%)",
            "radial-gradient(circle, rgba(0,119,255,0.15) 0%, rgba(0,0,0,0) 70%)"
          ] 
        }}
        transition={{ duration: DURATION / 1000, ease: "easeInOut" }}
      />
      
      {/* Starfield / Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full opacity-0"
            style={{ 
              left: `${star.x}%`, 
              top: `${star.y}%`, 
              width: star.size, 
              height: star.size 
            }}
            animate={{ 
              opacity: [0, Math.random() * 0.8 + 0.2, 0], 
              scale: [0, 1.5, 0],
              y: [0, -30] 
            }}
            transition={{ 
              duration: star.duration, 
              delay: star.delay, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Core Logo Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -20, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.2, type: "spring", bounce: 0.3 }}
        >
          {/* We use a large logo with the gradient variant */}
          <Logo size="xl" showText={false} variant="gradient" />
          
          {/* Orbital Comets around logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 pointer-events-none rounded-full border border-white/5"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
          </motion.div>
        </motion.div>

        {/* Text Reveal "Right Way" */}
        <div className="mt-8 overflow-hidden pb-4">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 50, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.0, delay: 0.8, type: "spring", bounce: 0.4 }}
          >
            <span className="text-5xl font-black text-white tracking-tighter">Right</span>
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-emerald-400 to-indigo-400 tracking-tighter">
              Way
            </span>
          </motion.div>
        </div>

        {/* Tagline / Action Text */}
        <div className="mt-2 h-8 overflow-hidden">
          <motion.p 
            className="text-[10px] sm:text-xs font-black text-white/50 uppercase tracking-[0.4em] flex items-center gap-2"
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
            {isReturning ? "Bem-vindo de volta" : "Sua jornada começa aqui"}
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          </motion.p>
        </div>
      </div>
      
      {/* Loading Progress Line (Only show if full duration) */}
      {!isReturning && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/5 overflow-hidden rounded-full z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-transparent via-primary to-transparent w-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.95)_100%)] z-20" />
      
      {/* Skip Hint */}
      <motion.div 
        className="absolute bottom-6 text-[9px] font-bold text-white/20 uppercase tracking-widest z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        Toque para pular
      </motion.div>
    </motion.div>
  );
};
