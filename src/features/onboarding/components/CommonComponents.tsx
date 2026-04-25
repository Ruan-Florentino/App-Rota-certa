import React from 'react';
import { motion } from 'motion/react';

export const ProgressDots = ({ current, total }: { current: number, total: number }) => (
  <div className="flex gap-2 justify-center py-6">
    {[...Array(total)].map((_, i) => (
      <motion.div
        key={i}
        className={`h-2 rounded-full ${i <= current ? 'bg-[#A855F7]' : 'bg-white/10'}`}
        initial={{ width: 8 }}
        animate={{ width: i === current ? 24 : 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    ))}
  </div>
);

export const NavigationButton = ({ onClick, label, disabled = false, variant = 'primary' }: { onClick: () => void, label: string, disabled?: boolean, variant?: 'primary' | 'secondary' }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileTap={{ scale: 0.96 }}
    className={`w-full py-4 rounded-xl font-bold text-lg ${
      variant === 'primary' 
        ? 'bg-gradient-to-r from-[#A855F7] to-[#7DD3FC] text-white' 
        : 'bg-white/5 text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {label}
  </motion.button>
);
