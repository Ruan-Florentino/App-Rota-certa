import React from 'react';
import { motion } from 'motion/react';
import { haptics } from '../../lib/haptics';

interface Category {
  id: string;
  label: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'Tudo', emoji: '🔍' },
  { id: 'beach', label: 'Praia', emoji: '🏖️' },
  { id: 'mountain', label: 'Montanha', emoji: '⛰️' },
  { id: 'city', label: 'Cidade', emoji: '🏙️' },
  { id: 'nature', label: 'Natureza', emoji: '🌿' },
  { id: 'culture', label: 'Cultura', emoji: '🏛️' },
  { id: 'adventure', label: 'Aventura', emoji: '🧭' },
  { id: 'romance', label: 'Romance', emoji: '❤️' },
];

interface CategoriesChipsProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const CategoriesChips: React.FC<CategoriesChipsProps> = ({ selected, onSelect }) => {
  return (
    <div className="relative w-full z-20">
      <div className="flex gap-2 overflow-x-auto px-6 py-2 pb-4 scroll-hidden snap-x snap-mandatory">
        {CATEGORIES.map((cat, i) => {
          const isActive = selected === cat.id;
          
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                haptics.selection();
                onSelect(cat.id);
              }}
              className={`relative flex-shrink-0 flex items-center justify-center gap-2 h-12 px-5 rounded-full transition-all duration-300 snap-start border ${
                isActive 
                  ? 'border-transparent text-black font-bold' 
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-category"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-[16px]">{cat.emoji}</span>
              <span className="relative z-10 text-[13px] tracking-wide">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Fades for scroll - subtle adjustments */}
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
};

