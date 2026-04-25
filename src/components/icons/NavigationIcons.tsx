import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';

export const HomeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      variants={{ hover: { scale: 1.05, y: -1 } }}
    />
    <path d="M9 22V12h6v10" />
  </BaseIcon>
);

export const ExploreIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.circle 
      cx="12" cy="12" r="10" 
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
    <motion.path 
      d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
      variants={{ hover: { rotate: [0, 15, -15, 0] } }}
    />
  </BaseIcon>
);

export const MapIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M1 6l7-3 8 3 7-3v14l-7 3-8-3-7 3V6z"
      variants={{ hover: { opacity: [1, 0.7, 1] } }}
    />
    <path d="M8 3v14M16 6v14" />
  </BaseIcon>
);

export const SocialIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      variants={{ hover: { x: -2 } }}
    />
    <motion.circle 
      cx="9" cy="7" r="4"
      variants={{ hover: { y: -1 } }}
    />
    <motion.path 
      d="M23 21v-2a4 4 0 0 0-3-3.87"
      variants={{ hover: { x: 2 } }}
    />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
);

export const ProfileIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      variants={{ hover: { scale: [1, 1.05, 1] } }}
    />
    <motion.circle 
      cx="12" cy="7" r="4"
      variants={{ hover: { y: -2 } }}
    />
  </BaseIcon>
);

export const AddIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.line 
      x1="12" y1="5" x2="12" y2="19"
      variants={{ hover: { rotate: 90 } }}
    />
    <motion.line 
      x1="5" y1="12" x2="19" y2="12"
      variants={{ hover: { rotate: 90 } }}
    />
  </BaseIcon>
);

export const MapPinIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      variants={{ hover: { y: -3 } }}
    />
    <motion.circle 
      cx="12" cy="10" r="3"
      variants={{ hover: { scale: 1.2 } }}
    />
  </BaseIcon>
);
