import React from 'react';
import { motion } from 'motion/react';

export const AlertasIcon: React.FC<{ active?: boolean, size?: number, className?: string }> = ({ active, size = 48, className }) => {
  return (
    <div className={`relative flex items-center justify-center group ${className}`} style={{ width: size, height: size }}>
      {/* Red Pulse Glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.4, 0.1],
          boxShadow: [
            "0 0 10px 0px rgba(239, 68, 68, 0.1)",
            "0 0 25px 5px rgba(239, 68, 68, 0.3)",
            "0 0 10px 0px rgba(239, 68, 68, 0.1)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-20 h-20 rounded-full"
      />

      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <defs>
          <linearGradient id="bell-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Sound Waves */}
        {[1, 2].map((i) => (
          <motion.path
            key={i}
            d={i === 1 ? "M36 20C38 22 39 25 39 28" : "M32 24C33 25 34 26 34 28"}
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              opacity: [0, 1, 0],
              x: [0, 2, 4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Bell Body */}
        <motion.g
          animate={{
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          style={{ originX: '24px', originY: '12px' }}
        >
          {/* Bell Top */}
          <circle cx="24" cy="12" r="2" fill="url(#bell-grad)" />
          {/* Main Bell */}
          <path
            d="M24 14C18 14 14 18 14 26V32H34V26C34 18 30 14 24 14Z"
            fill="url(#bell-grad)"
          />
          {/* Bell Base */}
          <path
            d="M12 32H36V34C36 35 35 36 34 36H14C13 36 12 35 12 34V32Z"
            fill="url(#bell-grad)"
            fillOpacity="0.8"
          />
          {/* Clapper */}
          <motion.circle
            cx="24"
            cy="38"
            r="3"
            fill="url(#bell-grad)"
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.g>

        {/* Notification Badge */}
        <motion.circle
          cx="36"
          cy="14"
          r="5"
          fill="#ef4444"
          stroke="#020617"
          strokeWidth="2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="36"
          cy="14"
          r="1.5"
          fill="white"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};
