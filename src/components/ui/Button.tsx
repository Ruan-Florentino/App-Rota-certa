import { motion, useAnimation } from 'motion/react';
import { haptics } from '../../lib/haptics';
import { sounds } from '../../lib/sounds';
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  soundEffect?: string;
  className?: string; // allow overrides
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  onClick,
  hapticFeedback = 'light',
  soundEffect = 'tap',
  className = ''
}: ButtonProps) {
  const controls = useAnimation();
  
  const handleClick = async (e: React.MouseEvent) => {
    if (loading) return;
    
    // Haptic
    haptics[hapticFeedback]();
    
    // Sound
    if (soundEffect) sounds.play(soundEffect);
    
    // Ripple effect could be refined here later, currently using CSS only approach
    
    // Callback
    onClick?.(e);
  };
  
  return (
    <motion.button
      className={`btn btn-${variant} btn-${size} ${className}`}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={loading}
    >
      {/* Ripple container */}
      <span className="btn-ripple-container" />
      
      {/* Content */}
      <span className="btn-content" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⟳
          </motion.span>
        ) : (
          <>
            {icon && <span className="btn-icon">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </span>
      
      {/* Shine on hover */}
      <span className="btn-shine" />
    </motion.button>
  );
}
