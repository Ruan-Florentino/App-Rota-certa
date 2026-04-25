import React from 'react';
import { motion } from 'motion/react';
import { LogoSymbol } from './brand/LogoSymbol';

interface LogoProps {
  variant?: 'full' | 'symbol' | 'horizontal' | 'gradient' | 'default';
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
  showText?: boolean;
  showIcon?: boolean;
}

/**
 * Right Way Logo Component
 * Rebranded from RotaCerta
 */
export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  animated = true,
  theme = 'dark',
  className = '',
  showIcon = true,
}) => {
  if (!showIcon) return null;

  // Map string sizes to numbers
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 96,
    xl: 192,
  };

  const numericSize = typeof size === 'number' ? size : sizeMap[size as keyof typeof sizeMap] || 48;
  
  // Map old variants to new ones
  const mappedVariant = variant === 'gradient' || variant === 'default' ? 'symbol' : variant;

  if (mappedVariant === 'symbol') {
    return <LogoSymbol size={numericSize} animated={animated} />;
  }
  
  if (mappedVariant === 'horizontal') {
    return <LogoHorizontal size={numericSize} animated={animated} theme={theme} className={className} />;
  }
  
  return <LogoFull size={numericSize} animated={animated} theme={theme} className={className} />;
};

// === INTERNAL COMPONENTS ===

function LogoHorizontal({ size, animated, theme, className }: any) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  
  return (
    <div className={`logo-horizontal flex items-center gap-3 ${className}`} style={{ height: size }}>
      <LogoSymbol size={size} animated={animated} />
      
      <div className="logo-text-wrap flex items-baseline gap-1.5 font-black tracking-[-0.04em] leading-none">
        <span className={`${textColor} text-[1.4em]`}>
          Right
        </span>
        <span className="logo-text-way text-[1.4em] bg-gradient-to-br from-cyan-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(34,211,238,0.4)]">
          Way
        </span>
      </div>
    </div>
  );
}

function LogoFull({ size, animated, theme, className }: any) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  
  return (
    <div className={`logo-full flex flex-col items-center gap-4 text-center ${className}`}>
      <LogoSymbol size={size} animated={animated} />
      
      <div className="logo-wordmark flex flex-col items-center">
        <span className={`${textColor} text-4xl font-black tracking-tight leading-8`}>Right</span>
        <span className="logo-text-way text-4xl font-black tracking-tight leading-8 bg-gradient-to-br from-cyan-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent">Way</span>
      </div>
      
      <div className="logo-tagline text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2 italic">
        your journey starts here
      </div>
    </div>
  );
}
