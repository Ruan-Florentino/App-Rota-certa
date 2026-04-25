import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'globe' | 'skeleton';
  className?: string;
  size?: number | string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Carregando...', 
  type = 'spinner',
  className = "",
  size = 64
}) => {
  const sizeNum = typeof size === 'number' ? size : parseInt(size.toString()) || 64;
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-6 relative">
        {type === 'spinner' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="relative"
            style={{ width: sizeNum, height: sizeNum }}
          >
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <defs>
                <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <circle
                cx="25" cy="25" r="20"
                stroke="url(#spinner-grad)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="90 150"
                strokeLinecap="round"
              />
            </svg>
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-md bg-primary/20"
            />
          </motion.div>
        )}

        {type === 'dots' && (
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
            ))}
          </div>
        )}

        {type === 'pulse' && (
          <div className="w-20 h-20 flex items-center justify-center relative">
            <motion.div 
              animate={{ 
                scale: [1, 2.5], 
                opacity: [0.8, 0] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 border-2 border-primary rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-primary rounded-full shadow-[0_0_30px_rgba(34,211,238,0.8)]"
            />
          </div>
        )}

        {type === 'globe' && (
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 relative"
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/10 border-dashed" />
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl"
            />
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm" />
              </div>
            </div>
          </motion.div>
        )}

        {type === 'skeleton' && <Skeleton className="w-full h-8" />}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] pl-1"
      >
        {message}
      </motion.p>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`overflow-hidden bg-[#1E293B] relative rounded-2xl ${className}`}>
    <motion.div 
      animate={{ x: ['-200%', '200%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
    />
  </div>
);
