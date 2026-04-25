import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export function HeaderParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 3,
      color: ['#22D3EE', '#10F5A0', '#A855F7', '#EC4899', '#FFFFFF'][
        Math.floor(Math.random() * 5)
      ],
    })), []
  );
  
  return (
    <div className="header-particles">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="header-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Shooting star ocasional */}
      <motion.div
        className="header-shooting-star"
        initial={{ opacity: 0, x: -50, y: -20 }}
        animate={{
          opacity: [0, 1, 1, 0],
          x: 400,
          y: 100,
        }}
        transition={{
          duration: 2,
          delay: 5,
          repeat: Infinity,
          repeatDelay: 15,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
}
