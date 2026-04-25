// src/components/errors/illustrations/CompassIllustration.tsx
import React from 'react';
import { motion } from 'motion/react';

export const CompassIllustration = () => (
    <motion.svg viewBox="0 0 200 200" className="w-48 h-48">
        <motion.circle
            cx="100" cy="100" r="60"
            stroke="#A855F7"
            fill="none"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <line x1="100" y1="40" x2="100" y2="160" stroke="#00E5D4" strokeWidth="2" />
        <line x1="40" y1="100" x2="160" y2="100" stroke="#00E5D4" strokeWidth="2" />
    </motion.svg>
);
