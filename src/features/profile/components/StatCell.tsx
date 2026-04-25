import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

interface StatCellProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend: string;
  accent: 'sky' | 'sky-deep' | 'lavender';
}

export const StatCell = ({ icon, value, label, trend, accent }: StatCellProps) => {
  const accentColor = {
    sky: 'text-rw-sky',
    'sky-deep': 'text-rw-sky-deep',
    lavender: 'text-rw-lavender',
  }[accent];
  
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  const [isString, setIsString] = useState(false);
  
  useEffect(() => {
    if (typeof value === 'string') {
      const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
      if (!isNaN(numeric)) {
        setIsString(true);
        const controls = animate(motionValue, numeric, {
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        });
        const unsubscribe = rounded.on('change', setDisplay);
        return () => {
          controls.stop();
          unsubscribe();
        };
      } else {
        // Just display the string
        return;
      }
    } else {
      const controls = animate(motionValue, value, {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      });
      const unsubscribe = rounded.on('change', setDisplay);
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [value]);
  
  return (
    <div className="p-6 relative group">
      <div className={`w-12 h-12 rounded-[18px] bg-rw-elevated border border-rw-border 
                      flex items-center justify-center mb-5 ${accentColor} shadow-xl`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
      </div>
      
      <p className="text-4xl font-black text-rw-text tabular-nums tracking-tighter uppercase leading-none">
        {isString ? value.toString().replace(/[0-9.]+/, display.toLocaleString('pt-BR')) : display.toLocaleString('pt-BR')}
      </p>
      
      <p className="text-[10px] text-rw-muted mt-2 font-black uppercase tracking-[0.2em]">
        {label}
      </p>
      
      <p className={`text-[9px] ${accentColor} mt-3 font-black tracking-[0.1em] uppercase`}>
        {trend}
      </p>
      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                      transition-opacity duration-500 pointer-events-none"
           style={{ background: `radial-gradient(circle at center, ${
             accent === 'sky' ? 'rgba(138,180,248,0.1)' :
             accent === 'sky-deep' ? 'rgba(106,155,235,0.1)' :
             'rgba(180,167,240,0.1)'
           } 0%, transparent 70%)` }} />
    </div>
  );
};
