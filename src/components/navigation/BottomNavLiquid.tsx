import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { NavItem } from './NavItem';

export default function BottomNavLiquid({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) {
  const navRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'plus', label: 'Add' },
    { id: 'explore', label: 'Explorar' },
    { id: 'map', label: 'Mapa' },
    { id: 'social', label: 'Social' },
    { id: 'profile', label: 'Perfil' },
  ];

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = (e as React.TouchEvent).touches[0].clientX - rect.left;
      y = (e as React.TouchEvent).touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }
    navRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    navRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[500px] z-[100]">
      <motion.div
        ref={navRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="liquid-glass rounded-[32px] px-2 py-2 flex items-center justify-between relative overflow-hidden h-[64px]"
      >
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            id={item.id}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}
