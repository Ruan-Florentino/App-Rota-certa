import React from 'react';
import { motion } from 'motion/react';

interface LogoSymbolProps {
  size?: number;
  animated?: boolean;
}

export function LogoSymbol({ size = 44, animated = true }: LogoSymbolProps) {
  return (
    <div 
      className="logo-planet-wrap"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="logo-planet-svg">
        <defs>
          {/* Gradient do planeta (Dourado/Cyan/Purple) */}
          <radialGradient id="planet-body" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="60%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </radialGradient>
          
          {/* Gradient do anel de Saturno */}
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
            <stop offset="30%" stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#A855F7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>

          <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          {/* Shine mask */}
          <radialGradient id="planet-shine" cx="30%" cy="25%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="40%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background Atmosphere */}
        {animated && (
          <motion.circle
            cx="32" cy="32" r="28"
            fill="url(#planet-body)"
            opacity="0.1"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
        
        {/* Back part of the ring */}
        <ellipse
          cx="32" cy="32"
          rx="24" ry="6"
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="3"
          transform="rotate(-25 32 32)"
          strokeDasharray="80 150"
          strokeDashoffset="115"
          opacity="0.8"
        />
        
        {/* Planet Core */}
        <motion.circle
          cx="32" cy="32" r="14"
          fill="url(#planet-body)"
          animate={animated ? {
            y: [0, -1, 0],
            rotate: [0, 360]
          } : {}}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 40, repeat: Infinity, ease: "linear" }
          }}
          filter="url(#glow-heavy)"
        />

        {/* Shine on top of planet */}
        <circle
          cx="32" cy="32" r="14"
          fill="url(#planet-shine)"
          opacity="0.5"
        />
        
        {/* Front part of the ring */}
        <ellipse
          cx="32" cy="32"
          rx="24" ry="6"
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="3"
          transform="rotate(-25 32 32)"
          strokeDasharray="80 150"
          strokeDashoffset="-35"
          opacity="0.9"
        />
        
        {/* Pulsing Pin (localization) */}
        <motion.g
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '38px 26px' }}
        >
          <circle cx="38" cy="26" r="3" fill="#00FFD1" filter="url(#glow-heavy)" />
          <circle cx="38" cy="26" r="1" fill="white" />
        </motion.g>
      </svg>
    </div>
  );
}
