import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useUserStore } from '../../../stores/userStore';

import { OptimizedImage } from '../../../components/common/OptimizedImage';
import { getUserAvatar } from '../../../lib/avatar';

export const HomeHeader = () => {
  const user = useUserStore((s) => s.user);
  const avatarUrl = user ? getUserAvatar(user.name, user.avatarUrl || user.avatar) : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky';

  return (
    <div className="sticky top-0 z-[50] h-[60px] flex items-center justify-between px-5 bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/5">
      <OptimizedImage 
        src={avatarUrl} 
        alt="User" 
        category="avatar"
        className="w-10 h-10 rounded-full border-2 border-[#A855F7]" 
      />
      
      <span className="font-Fraunces font-bold text-white text-xl">Right Way</span>
      
      <div className="flex gap-4">
        <Bell className="text-white relative" />
        <Settings className="text-white" />
      </div>
    </div>
  );
};
