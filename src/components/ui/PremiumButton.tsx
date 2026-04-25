import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface RippleInfo {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient' | 'premium' | 'danger' | 'glass' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magnetic?: boolean;
  ripple?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  disabled = false,
  leftIcon,
  rightIcon,
  magnetic = false,
  ripple = true
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RippleInfo[]>([]);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || disabled || loading) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    setMagneticPos({ x, y });
  };

  const addRipple = (e: React.MouseEvent) => {
    if (!ripple || disabled || loading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent) => {
    addRipple(e);
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const baseClasses = "relative flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all duration-300 rounded-2xl border active:scale-95 overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]",
    secondary: "bg-white/5 border-white/10 text-white hover:bg-white/10",
    ghost: "bg-transparent border-transparent text-white/70 hover:text-white hover:bg-white/5",
    outline: "bg-transparent border-white/20 text-white hover:border-white/40",
    gradient: "bg-gradient-to-r from-primary via-accent to-purple-500 text-white border-transparent shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    premium: "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black border-transparent shadow-[0_0_25px_rgba(251,191,36,0.4)]",
    danger: "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    glass: "glass border-white/10 text-white",
    glow: "bg-primary text-black shadow-[0_0_25px_rgba(var(--primary),0.5)] border-transparent",
  };

  const sizes = {
    sm: "h-10 px-4 text-[9px]",
    md: "h-14 px-6 text-[11px]",
    lg: "h-16 px-8 text-[12px]",
    xl: "h-20 px-10 text-[14px]",
    icon: "w-12 h-12 p-0",
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMagneticPos({ x: 0, y: 0 })}
      animate={magneticPos}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      onClick={handleClick}
      disabled={disabled || loading}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''} 
        ${className}
      `}
    >
      {/* Shine effect animation */}
      {!disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}

      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            borderRadius: '50%',
            background: variant.includes('premium') || variant === 'primary' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" 
          />
        ) : success ? (
          <motion.div
            key="success"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-5 h-5 flex items-center justify-center bg-green-500 text-white rounded-full">
              ✓
            </div>
            <span>Sucesso!</span>
          </motion.div>
        ) : (
          <motion.div 
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 w-full"
          >
            {leftIcon && <span className="opacity-80">{leftIcon}</span>}
            <span className="relative z-10">{children}</span>
            {rightIcon && <span className="opacity-80">{rightIcon}</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
