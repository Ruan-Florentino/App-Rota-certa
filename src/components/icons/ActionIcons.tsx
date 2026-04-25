import React from 'react';
import { motion } from 'motion/react';
import { BaseIcon, IconProps } from './BaseIcon';

export const SearchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.circle 
      cx="11" cy="11" r="8"
      variants={{ hover: { scale: 1.1 } }}
    />
    <motion.path 
      d="M21 21l-4.35-4.35"
      variants={{ hover: { x: 2, y: 2 } }}
    />
  </BaseIcon>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </BaseIcon>
);

export const BookmarkIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
      variants={{ hover: { y: -2 } }}
    />
  </BaseIcon>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.circle 
      cx="12" cy="12" r="3"
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
    <motion.path 
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
  </BaseIcon>
);

export const ChevronIcon: React.FC<IconProps & { direction?: 'up' | 'down' | 'left' | 'right' }> = ({ direction = 'right', ...props }) => {
  const rotation = {
    up: -90,
    down: 90,
    left: 180,
    right: 0
  }[direction];

  return (
    <BaseIcon {...props} style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M9 18l6-6-6-6" />
    </BaseIcon>
  );
};

export const CloseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M18 6L6 18M6 6l12 12"
      variants={{ hover: { scale: 1.1, rotate: 90 } }}
    />
  </BaseIcon>
);

export const XIcon = CloseIcon;

export const CheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M20 6L9 17l-5-5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
  </BaseIcon>
);

export const ReceiptIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
    <path d="M16 8h-8M16 12h-8M13 16h-5" />
  </BaseIcon>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M23 4v6h-6M1 20v-6h6"
      variants={{ hover: { rotate: 180 } }}
    />
    <motion.path 
      d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
      variants={{ hover: { rotate: 360 } }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </BaseIcon>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </BaseIcon>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
);

export const ArrowIcon: React.FC<IconProps & { direction?: 'up' | 'down' | 'left' | 'right' }> = ({ direction = 'right', ...props }) => {
  const rotation = { up: -90, down: 90, left: 180, right: 0 }[direction];
  return (
    <BaseIcon {...props} style={{ transform: `rotate(${rotation}deg)` }}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </BaseIcon>
  );
};

export const MicIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
      variants={{ hover: { scale: 1.1 } }}
    />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </BaseIcon>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <motion.path 
      d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      variants={{ hover: { originY: 0, rotate: [0, -2, 2, 0] } }}
    />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </BaseIcon>
);

export const CopyIcon = BookmarkIcon; // Alias for old code
