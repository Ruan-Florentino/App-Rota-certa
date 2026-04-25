import React from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { easing } from '../styles/motion';

const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95,
    filter: 'blur(20px)',
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: easing.expoOut,
      filter: { duration: 0.4 },
    } as any,
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 1.05,
    filter: 'blur(20px)',
    transition: {
      duration: 0.4,
      ease: easing.expoIn,
    } as any,
  },
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
