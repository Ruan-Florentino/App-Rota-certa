import React from 'react';
import { Navigation, Compass, Plane } from 'lucide-react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'gradient';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  variant = 'default'
}) => {
  const sizes = {
    sm: { icon: 16, text: 'text-lg' },
    md: { icon: 24, text: 'text-2xl' },
    lg: { icon: 32, text: 'text-3xl' },
    xl: { icon: 48, text: 'text-5xl' }
  };

  const currentSize = sizes[size];

  const iconColor = variant === 'white' ? 'text-white' : 'text-primary';
  const textColor = variant === 'white' ? 'text-white' : 'text-white';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div 
        initial={{ rotate: -15, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`relative flex items-center justify-center`}
      >
        <div className={`absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse`} />
        <div className={`relative p-2 rounded-xl ${variant === 'gradient' ? 'bg-gradient-to-br from-primary to-accent' : 'bg-white/5'} border border-white/10 shadow-2xl`}>
          <Navigation 
            size={currentSize.icon} 
            className={`${variant === 'gradient' ? 'text-background' : iconColor} fill-current`}
          />
        </div>
        
        {/* Decorative path line */}
        <svg 
          className="absolute -top-1 -right-1 w-6 h-6 text-accent/40 pointer-events-none" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeDasharray="4 4"
        >
          <path d="M2 22C2 22 10 18 12 12C14 6 22 2 22 2" />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.text} font-black tracking-tighter ${textColor}`}>
            Rota<span className="text-primary">Certa</span>
          </span>
          {size === 'xl' && (
            <span className="text-[10px] font-bold text-subtext uppercase tracking-[0.4em] mt-1">
              Premium Travel AI
            </span>
          )}
        </div>
      )}
    </div>
  );
};
