import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavIcon } from './NavIcon';
import { LiquidPill } from './LiquidPill';

interface NavItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ id, label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer z-10 py-1"
    >
      <AnimatePresence>
        {isActive && <LiquidPill layoutId="nav-pill" />}
      </AnimatePresence>

      <div className="relative z-20 flex flex-col items-center gap-1">
        <NavIcon name={id} isActive={isActive} />
        
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-[10px] font-medium tracking-tight text-gradient-purple-sky"
              style={{ fontFamily: '"Geist", sans-serif' }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
