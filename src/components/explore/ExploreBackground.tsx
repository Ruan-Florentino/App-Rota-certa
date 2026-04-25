import { motion } from 'motion/react';
import { useMemo } from 'react';

export function ExploreBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 2,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5,
    })), []
  );
  
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1E1B4B_0%,#020617_70%)]" />
      
      {/* Deep Space Nebula Orbs */}
      <motion.div 
        className="absolute top-[-20%] left-[-20%] w-[120%] h-[60%] bg-primary/10 rounded-[100%] blur-[120px]"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-purple-600/5 rounded-[100%] blur-[100px]"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing Space Particles */}
      <div className="absolute inset-0">
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Distant Planet silhouette (Atmosphere) */}
      <div className="absolute bottom-[-40%] left-[50%] -translate-x-1/2 w-[200%] h-[100%] rounded-[100%] bg-linear-to-t from-primary/10 via-transparent to-transparent blur-[80px]" />
    </div>
  );
}
