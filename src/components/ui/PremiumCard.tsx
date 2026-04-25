import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { colors } from '../../styles/design-system';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'featured' | 'premium' | 'minimal';
  onClick?: () => void;
  delay?: number;
  tilt?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ 
  children, 
  className = "", 
  variant = 'default',
  onClick,
  delay = 0,
  tilt = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) * 200 - 100);
    y.set((mouseY / height) * 200 - 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = "relative overflow-hidden rounded-[32px] border transition-all duration-500 group";
  
  const variants = {
    default: "bg-white/5 backdrop-blur-md border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]",
    featured: "bg-gradient-to-br from-[#1E293B] to-[#0A0E1A] border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
    premium: `bg-gradient-to-br from-[#020617] via-primary/10 to-accent/10 border-primary/20 shadow-[0_0_25px_${colors.brand.cyan.glow}]`,
    minimal: "bg-transparent border-white/5",
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={onClick ? { y: -8, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {/* Border Glow Background - Only for Premium */}
      {variant === 'premium' && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      )}
      
      {/* Inner Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-12 -translate-x-full group-hover:translate-x-full pointer-events-none" />

      {/* 3D Glass Layer */}
      <div 
        className="relative z-10 w-full h-full"
        style={{ transform: tilt ? 'translateZ(50px)' : 'none' }}
      >
        {children}
      </div>
    </motion.div>
  );
};
