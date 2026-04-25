import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <motion.path 
      d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
      variants={{ hover: { opacity: [1, 0.5, 1] } }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </BaseIcon>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <motion.polyline 
      points="12 6 12 12 16 14"
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: '12px 12px' }}
    />
  </BaseIcon>
);

export const DollarIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </BaseIcon>
);

export const BellIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      variants={{ hover: { rotate: [-5, 5, -5, 5, 0] } }}
      transition={{ duration: 0.5 }}
    />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </BaseIcon>
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </BaseIcon>
);

export const LogoutIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <motion.polyline 
      points="16 17 21 12 16 7"
      variants={{ hover: { x: 3 } }}
    />
    <motion.line 
      x1="21" y1="12" x2="9" y2="12"
      variants={{ hover: { x: 3 } }}
    />
  </BaseIcon>
);
