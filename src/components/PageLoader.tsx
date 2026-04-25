import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 w-full h-full absolute inset-0 z-50 text-white"
    >
      <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
      <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400/70">
        Carregando...
      </p>
    </motion.div>
  );
};
