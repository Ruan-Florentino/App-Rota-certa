import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';

export const CompassIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.circle 
      cx="12" cy="12" r="10" 
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
    <motion.path 
      d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
      variants={{ hover: { rotate: [0, -10, 10, 0] } }}
    />
  </BaseIcon>
);

export const PlaneIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.6.5-1.3 1.3l2.2 4.6L3 15.7V17l3-1 2 2h1.3l3.1-3.2 4.6 2.2c.8.3 1.5-.4 1.3-1.3z"
      variants={{ hover: { x: [0, 2, 0], y: [0, -2, 0] } }}
    />
  </BaseIcon>
);

export const HotelIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 21h18M3 7h18M5 21V7m14 14V7" />
    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M10 11V9m4 2V9" />
  </BaseIcon>
);

export const GlobeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.circle 
      cx="12" cy="12" r="10"
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </BaseIcon>
);

export const LuggageIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="16" y2="15" />
  </BaseIcon>
);
