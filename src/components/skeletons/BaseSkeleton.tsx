import React from 'react';
import { motion } from 'motion/react';

interface BaseSkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

export const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ 
  className = '', 
  variant = 'rect', 
  width = '100%', 
  height = '1rem' 
}) => {
  const borderRadius = variant === 'circle' ? '50%' : variant === 'text' ? '4px' : '12px';
  
  return (
    <motion.div
      className={`relative overflow-hidden bg-white/5 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundImage: "linear-gradient(90deg, transparent, rgba(168,85,247,0.1), transparent)",
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "200% 0%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};
