import React from 'react';
import { motion } from 'motion/react';

interface LiquidPillProps {
  layoutId: string;
}

export const LiquidPill: React.FC<LiquidPillProps> = ({ layoutId }) => {
  return (
    <motion.div
      layoutId={layoutId}
      className="absolute inset-0 liquid-pill rounded-[24px] z-0"
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8
        },
        scaleX: { duration: 0.4, ease: "circOut" },
        scaleY: { duration: 0.4, ease: "circOut" },
      }}
      animate={{
        scaleX: [1, 1.15, 1],
        scaleY: [1, 0.85, 1],
      }}
    />
  );
};
