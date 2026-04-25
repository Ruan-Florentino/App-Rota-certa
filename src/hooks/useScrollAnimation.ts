import { useScroll, useTransform, useSpring, MotionValue } from 'motion/react';
import { useRef } from 'react';

/**
 * Hook for complex scroll-linked animations
 */
export const useScrollAnimation = (offset: any = ['start end', 'end start']) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return { ref, scrollYProgress: smoothProgress, rawProgress: scrollYProgress };
};

/**
 * Helper to create common transform values from scroll progress
 */
export const useScrollTransform = (
  value: MotionValue<number>, 
  inputRange: number[], 
  outputRange: any
) => {
  return useTransform(value, inputRange, outputRange);
};
