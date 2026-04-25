import React from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useLocation } from 'react-router-dom';

const variants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 30 : -30,
    scale: 1.04,
    filter: 'blur(8px)'
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.32, 0.72, 0, 1] as any
    }
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -30 : 30,
    scale: 0.96,
    filter: 'blur(8px)',
    transition: {
      duration: 0.35,
      ease: [0.32, 0.72, 0, 1] as any
    }
  })
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Simplified direction detection for demo purposes
  // In a real app, you'd track the previous index
  const direction = 1; 

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
