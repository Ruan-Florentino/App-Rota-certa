import React from 'react';
import { motion } from 'motion/react';

export const MundoIcon: React.FC<{ active?: boolean, size?: number, className?: string }> = ({ active, size = 48, className }) => {
  return (
    <div className={`relative flex items-center justify-center group ${className}`} style={{ width: size, height: size }}>
      {/* Global Glow */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px 0px rgba(14, 165, 233, 0.2)",
            "0 0 40px 10px rgba(14, 165, 233, 0.4)",
            "0 0 20px 0px rgba(14, 165, 233, 0.2)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-24 h-24 rounded-full"
      />

      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <defs>
          <linearGradient id="earth-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <mask id="globe-mask">
            <circle cx="24" cy="24" r="18" fill="white" />
          </mask>
        </defs>

        {/* Ocean Body */}
        <circle cx="24" cy="24" r="18" fill="url(#earth-ocean)" />

        {/* Continents (Moving) */}
        <motion.g 
          mask="url(#globe-mask)"
          animate={{ x: [-40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {/* Group of continents repeated for wrap-around feeling */}
          {[0, 40].map((offset) => (
            <g key={offset} transform={`translate(${offset}, 0)`}>
              <path d="M10 20C12 18 16 18 18 22S24 24 22 28S14 32 12 30S8 24 10 20Z" fill="#10b981" fillOpacity="0.8" />
              <path d="M28 14C30 14 34 16 34 20S30 26 26 26S22 22 22 18S26 14 28 14Z" fill="#10b981" fillOpacity="0.6" />
              <path d="M5 28C7 28 10 32 8 36S2 36 2 32S3 28 5 28Z" fill="#10b981" fillOpacity="0.7" />
            </g>
          ))}
        </motion.g>

        {/* Atmosphere Shine */}
        <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        <path d="M10 12C14 8 20 8 26 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />

        {/* Destination Pins */}
        <motion.circle cx="32" cy="20" r="1.5" fill="#f43f5e" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="18" cy="30" r="1" fill="#f43f5e" animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />

        {/* Orbiting Plane */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ originX: '24px', originY: '24px' }}
        >
          <g transform="translate(42, 24) rotate(90)">
             <path d="M0 -4L2 2L0 1L-2 2L0 -4Z" fill="white" />
             <path d="M-4 0H4" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};
