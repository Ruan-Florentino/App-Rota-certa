import React from 'react';
import { motion, Variants } from 'motion/react';
import { Home, PlusCircle, Compass, Map, Users, UserCircle } from 'lucide-react';

interface NavIconProps {
  name: string;
  isActive: boolean;
}

const iconMap: Record<string, any> = {
  home: Home,
  plus: PlusCircle,
  explore: Compass,
  map: Map,
  social: Users,
  profile: UserCircle,
};

export const NavIcon: React.FC<NavIconProps> = ({ name, isActive }) => {
  const Icon = iconMap[name];

  const variants: Variants = {
    active: {
      scale: [0.85, 1.15, 1.0],
      rotate: [-8, 8, 0],
      transition: { duration: 0.5, ease: "easeOut" as any }
    },
    inactive: {
      scale: 1,
      rotate: 0
    }
  };

  const getSpecificAnimation = (): any => {
    switch (name) {
      case 'home':
        return isActive ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 4 } } : {};
      case 'plus':
        return isActive ? { rotate: 90, scale: [1, 1.1, 1], transition: { rotate: { duration: 0.5 }, scale: { repeat: Infinity, duration: 2 } } } : {};
      case 'explore':
        return isActive ? { rotate: 360, transition: { repeat: Infinity, duration: 20, ease: "linear" } } : {};
      case 'map':
        return isActive ? { y: [0, -2, 0], transition: { repeat: Infinity, duration: 2 } } : {};
      case 'social':
        return isActive ? { x: [-1, 1, -1], transition: { repeat: Infinity, duration: 3 } } : {};
      case 'profile':
        return isActive ? { rotate: 360, transition: { repeat: Infinity, duration: 15, ease: "linear" } } : {};
      default:
        return {};
    }
  };

  return (
    <motion.div
      variants={variants}
      animate={isActive ? "active" : "inactive"}
      className="relative flex items-center justify-center w-6 h-6"
    >
      <motion.div animate={getSpecificAnimation()}>
        <Icon
          size={24}
          strokeWidth={isActive ? 2.2 : 1.8}
          className={`transition-colors duration-300 ${
            isActive ? 'text-[#A855F7]' : 'text-[#8B92A8]'
          }`}
          style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' } : {}}
        />
      </motion.div>
      
      {/* Active Dot / Particles Placeholder */}
      {isActive && (
        <motion.div
          layoutId="icon-active-dot"
          className="absolute -bottom-1 w-1 h-1 bg-[#A855F7] rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.div>
  );
};
