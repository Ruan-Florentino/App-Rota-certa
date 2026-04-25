import React, { useMemo } from 'react';
import { motion } from 'motion/react';

/**
 * Premium Ambient Background 
 * Features an animated gradient mesh and floating particles.
 */
export const AmbientBackground: React.FC = () => {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 30,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0E1A]">
      {/* Animated Gradient Mesh */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(at 20% 30%, rgba(34, 211, 238, 0.15), transparent 50%),
            radial-gradient(at 80% 70%, rgba(168, 85, 247, 0.15), transparent 50%),
            radial-gradient(at 50% 50%, rgba(16, 245, 160, 0.08), transparent 50%)
          `,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -1000],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Subtle Aurora Fog */}
      <motion.div 
        className="absolute inset-0 opacity-20 blur-[100px]"
        animate={{
          x: ['-20%', '20%', '-20%'],
          skewX: [-5, 5, -5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: 'linear-gradient(45deg, #22D3EE, #A855F7, #10F5A0)',
        }}
      />

      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};
