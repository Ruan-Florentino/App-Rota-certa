import React from 'react';
import { motion } from 'motion/react';

export const LenteAIIcon: React.FC<{ active?: boolean, size?: number, className?: string }> = ({ active, size = 48, className }) => {
  return (
    <div className={`relative flex items-center justify-center group ${className}`} style={{ width: size, height: size }}>
      {/* Glow Effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-cyan-500/30 blur-[20px] rounded-full"
      />
      
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <defs>
          <linearGradient id="lens-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          
          <filter id="lens-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbiting Particles */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="24" cy="4" r="1.5" fill="white" fillOpacity="0.8" />
          <circle cx="44" cy="24" r="1" fill="white" fillOpacity="0.6" />
          <circle cx="4" cy="24" r="1.2" fill="white" fillOpacity="0.7" />
        </motion.g>

        {/* Outer Ring */}
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke="url(#lens-grad)"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Main Lens Body */}
        <motion.path
          d="M24 8C15.1634 8 8 15.1634 8 24C8 32.8366 15.1634 40 24 40C32.8366 40 40 32.8366 40 24C40 15.1634 32.8366 8 24 8ZM24 36C17.3726 36 12 30.6274 12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24C36 30.6274 30.6274 36 24 36Z"
          fill="url(#lens-grad)"
          filter="url(#lens-glow)"
          whileHover={{ scale: 1.05 }}
        />

        {/* Inner Magic Core */}
        <motion.circle
          cx="24"
          cy="24"
          r="6"
          fill="white"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Energy Rays */}
        <motion.path
          d="M24 18V22M24 26V30M18 24H22M26 24H30"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
        />
      </svg>
    </div>
  );
};
