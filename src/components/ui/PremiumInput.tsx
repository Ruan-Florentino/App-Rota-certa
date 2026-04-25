import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { easing } from '../../styles/motion';

interface PremiumInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  className?: string;
  multiline?: boolean;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  icon,
  rightElement,
  error,
  className = "",
  multiline = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value !== "";

  return (
    <div className={`space-y-2 w-full ${className}`}>
      <div className="relative group pt-4">
        {/* Border Glow Gradient */}
        <div className={`absolute -inset-px rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${isFocused ? 'opacity-100' : ''} bg-gradient-to-r from-primary/30 via-accent/30 to-purple-500/30 blur-sm`} />
        
        {/* Input Container */}
        <div className={`
          relative flex items-center bg-white/5 backdrop-blur-md border rounded-2xl transition-all duration-300
          ${isFocused ? 'border-primary/50 bg-white/10' : 'border-white/10 group-hover:border-white/20'}
          ${error ? 'border-red-500/50' : ''}
        `}>
          {/* Floating Label */}
          <motion.label
            animate={{
              y: isFloating ? -28 : 0,
              x: isFloating ? 0 : icon ? 44 : 16,
              scale: isFloating ? 0.85 : 1,
              color: isFocused ? '#22D3EE' : isFloating ? '#64748B' : 'rgba(255,255,255,0.4)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute left-0 pointer-events-none text-[10px] font-black uppercase tracking-widest z-20"
          >
            {label}
          </motion.label>

          {icon && (
            <div className={`pl-4 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-white/30'}`}>
              {icon}
            </div>
          )}

          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? placeholder : ""}
              className="w-full bg-transparent px-4 py-4 text-white text-sm focus:outline-none min-h-[120px] resize-none placeholder:text-white/20 z-10"
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? placeholder : ""}
              className="w-full bg-transparent px-4 h-14 text-white text-sm focus:outline-none placeholder:text-white/20 z-10"
            />
          )}

          {rightElement && (
            <div className="pr-4 z-10">
              {rightElement}
            </div>
          )}
        </div>

        {/* Success/Focus Border Animation Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="absolute bottom-0 left-4 right-4 h-px bg-primary z-20 origin-center"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[10px] font-bold text-red-400 pl-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
