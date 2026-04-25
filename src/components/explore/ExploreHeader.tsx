import React from 'react';
import { motion } from 'motion/react';
import { ALL_DESTINATIONS } from '../../data/destinations';

export const ExploreHeader: React.FC = () => {
  return (
    <header className="relative pt-5 pb-4 px-6 flex items-center justify-between z-10 w-full mb-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col"
      >
        <h1 className="text-[28px] font-extrabold tracking-tight text-white leading-tight">
          EXPLORAR
        </h1>
        <p className="text-[14px] text-white/50 font-medium">
          Descubra seu próximo destino
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md"
      >
        <span className="text-[14px]">🌍</span>
        <span className="text-[12px] font-bold text-white/80">{ALL_DESTINATIONS.length} destinos</span>
      </motion.div>
    </header>
  );
};

