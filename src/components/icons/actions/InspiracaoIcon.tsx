import React from 'react';
import { motion } from 'motion/react';

export const InspiracaoIcon: React.FC<{ active?: boolean, size?: number, className?: string }> = ({ active, size = 48, className }) => {
  return (
    <div className={`relative flex items-center justify-center group ${className}`} style={{ width: size, height: size }}>
      {/* Background Glow */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-amber-400/20 blur-[15px] rounded-full"
      />

      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <defs>
          <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* Floating Sparks */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={i}
            cx={24 + Math.cos(i * 60 * Math.PI / 180) * 16}
            cy={24 + Math.sin(i * 60 * Math.PI / 180) * 16}
            r="1"
            fill="#fbbf24"
            animate={{
              y: [-2, 2, -2],
              x: [-1, 1, -1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Main Star */}
        <motion.path
          d="M24 6L29.5 18.5L43 20L33 29.5L35.5 43L24 36.5L12.5 43L15 29.5L5 20L18.5 18.5L24 6Z"
          fill="url(#star-grad)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner Shine */}
        <motion.path
          d="M24 10L27.5 18.5L36 19.5L30 25.5L31.5 34L24 30L16.5 34L18 25.5L12 19.5L20.5 18.5L24 10Z"
          fill="white"
          fillOpacity="0.3"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Subtle Flame Licks */}
        <motion.path
          d="M22 38C22 38 23 42 24 42C25 42 26 38 26 38"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            y: [0, -4, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};
