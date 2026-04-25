import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';

import { OptimizedImage } from '../common/OptimizedImage';

interface SafeImageProps extends Omit<HTMLMotionProps<"img">, "src" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  src?: string;
  alt: string;
  fallback?: string;
  category?: 'destination' | 'avatar' | 'post' | 'generic';
  emoji?: string; // Legacy
  fallbackGradient?: string; // Legacy
}

export function SafeImage({ 
  src, 
  alt, 
  className = '', 
  fallback, 
  category = 'generic',
  ...props 
}: SafeImageProps) {
  const { 
    emoji: _emoji, 
    fallbackGradient: _fallbackGradient, 
    ...cleanProps 
  } = props;

  return (
    <OptimizedImage
      {...(cleanProps as any)}
      src={src || ''}
      alt={alt}
      className={className}
      fallbackSrc={fallback}
      category={category}
    />
  );
}
