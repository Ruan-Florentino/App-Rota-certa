import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';

export const SuccessIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
    />
    <motion.polyline 
      points="22 4 12 14.01 9 11.01"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }}
    />
  </BaseIcon>
);

export const ErrorIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </BaseIcon>
);

export const WarningIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
);

export const TrophyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" />
    <path d="M12 2v12" />
    <motion.path 
      d="M6 4v7a6 6 0 0 0 12 0V4H6z"
      variants={{ hover: { y: -2 } }}
    />
  </BaseIcon>
);
