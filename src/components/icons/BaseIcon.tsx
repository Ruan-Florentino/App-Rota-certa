import React from 'react';
import { motion, SVGMotionProps } from 'motion/react';

export interface IconProps extends Omit<SVGMotionProps<SVGSVGElement>, 'children'> {
  size?: number | string;
  color?: string;
  variant?: 'outline' | 'duotone' | 'filled';
  animated?: boolean;
}

export const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({ 
  size = 24, 
  color = 'currentColor', 
  variant = 'outline', 
  animated = false, 
  children,
  ...props 
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={variant === 'filled' ? 'none' : color}
      strokeWidth={variant === 'outline' ? 1.5 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="rest"
      animate="rest"
      whileHover={animated ? 'hover' : undefined}
      {...props}
    >
      {children}
    </motion.svg>
  );
};
