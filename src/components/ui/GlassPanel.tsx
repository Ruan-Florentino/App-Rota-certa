import React from 'react';
import { motion } from 'motion/react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy' | 'frosted';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = "",
  intensity = 'medium'
}) => {
  const backgrounds = {
    light: 'bg-white/5',
    medium: 'bg-white/10',
    heavy: 'bg-black/40',
    frosted: 'bg-white/5 backdrop-blur-2xl'
  };

  return (
    <div className={`backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden ${backgrounds[intensity]} ${className}`}>
      {children}
    </div>
  );
};
