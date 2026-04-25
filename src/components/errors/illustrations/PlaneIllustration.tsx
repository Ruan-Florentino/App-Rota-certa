// src/components/errors/illustrations/PlaneIllustration.tsx
import React from 'react';
import { motion } from 'motion/react';

export const PlaneIllustration = () => (
    <motion.svg viewBox="0 0 200 200" className="w-48 h-48">
        <motion.path
            d="M50 100 Q 100 50 150 100"
            stroke="#A855F7"
            fill="none"
            strokeWidth="4"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
    </motion.svg>
);
