// src/components/errors/illustrations/SearchIllustration.tsx
import React from 'react';
import { motion } from 'motion/react';

export const SearchIllustration = () => (
    <motion.svg viewBox="0 0 200 200" className="w-48 h-48">
        <circle cx="100" cy="100" r="50" stroke="#7DD3FC" fill="none" strokeWidth="4" />
        <line x1="140" y1="140" x2="180" y2="180" stroke="#7DD3FC" strokeWidth="4" />
    </motion.svg>
);
