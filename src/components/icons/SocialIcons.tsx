import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';

export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({ filled, ...props }) => (
  <BaseIcon {...props} variant={filled ? 'filled' : 'outline'}>
    <motion.path 
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      variants={{ hover: { scale: 1.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      fill={filled ? props.color || '#F43F5E' : 'none'}
      stroke={filled ? 'none' : props.color || 'currentColor'}
    />
  </BaseIcon>
);

export const CommentIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      variants={{ hover: { scale: 1.05 } }}
    />
  </BaseIcon>
);

export const FireIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 3.5 6.5 1.5 2 2 4 2 6a7 7 0 1 1-14 0c0-1.28.26-2.52.74-3.64C5.52 14.06 7.5 14.5 8.5 14.5z"
      variants={{ hover: { y: [0, -2, 0], scale: [1, 1.1, 1] } }}
      transition={{ duration: 1, repeat: Infinity }}
      stroke="none"
      fill="#FB923C"
    />
  </BaseIcon>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M12 3l1.912 5.813L21 12l-7.088 3.187L12 21l-1.912-5.813L3 12l7.088-3.187L12 3z"
      variants={{ hover: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle cx="18" cy="5" r="1" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
    <motion.circle cx="5" cy="18" r="1" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
  </BaseIcon>
);
