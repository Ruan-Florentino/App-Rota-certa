import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';
import * as Nav from './NavigationIcons';

export const BeachIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </BaseIcon>
);

export const MountainIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M8 20L12 4l9 16H8z"
      variants={{ hover: { scale: 1.05 } }}
    />
    <path d="M2 20h20" />
    <path d="M12 4l-4 12" />
  </BaseIcon>
);

export const CityIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
  </BaseIcon>
);

export const NatureIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M12 2L3 9l9 7 9-7-9-7z"
      variants={{ hover: { y: -2 } }}
    />
    <path d="M12 22V16" />
  </BaseIcon>
);

// Fallback mappings for more categories
export const CultureIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 21h18M3 7l9-5 9 5v14H3V7z" />
    <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
  </BaseIcon>
);

export const HistoryIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      variants={{ hover: { rotate: -360 } }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </BaseIcon>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      variants={{ hover: { rotate: 15 } }}
    />
  </BaseIcon>
);

export const ShoppingIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </BaseIcon>
);

export const GastronomyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V2h12v6z" />
    <path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
  </BaseIcon>
);

export const UtensilsIcon = GastronomyIcon;
export const FamilyIcon = Nav.SocialIcon;
