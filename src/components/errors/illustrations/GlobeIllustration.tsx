// src/components/errors/illustrations/GlobeIllustration.tsx
import React from 'react';
import { motion } from 'motion/react';

export const GlobeIllustration = () => (
    <motion.svg viewBox="0 0 200 200" className="w-48 h-48">
        <motion.circle
            cx="100" cy="100" r="80"
            stroke="#A855F7"
            fill="none"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <line x1="70" y1="70" x2="130" y2="130" stroke="#F87171" strokeWidth="4" />
        <line x1="130" y1="70" x2="70" y2="130" stroke="#F87171" strokeWidth="4" />
    </motion.svg>
);
