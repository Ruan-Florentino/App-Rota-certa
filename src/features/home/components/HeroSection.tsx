import React from 'react';
import { useUserStore } from '../../../stores/userStore';

export const HeroSection = () => {
  const user = useUserStore((s) => s.user);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const progress = (1000 - ((user?.xp || 0) % 1000)) / 10;

  return (
    <div className="px-5 py-6">
      <h1 className="text-2xl font-Fraunces font-bold text-white">{getGreeting()}, {user?.name || 'Viajante'}! ☀️</h1>
      <p className="text-gray-400 italic font-Fraunces">Pronto pra próxima aventura?</p>

      <div className="grid grid-cols-3 gap-3 mt-6 bg-[#141928]/60 p-4 rounded-2xl border border-white/5">
        <div className="flex flex-col">
          <span className="text-lg font-Fraunces font-bold text-[#A855F7]">Level {user?.level || 1}</span>
          <div className="h-1 bg-white/10 rounded-full mt-1">
            <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#7DD3FC] rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[9px] text-gray-500 mt-1">{user?.xp || 0} XP</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white">🏆 {user?.initialBadges.length || 0}</span>
          <span className="text-[9px] text-gray-500">Conquistas</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white">🌍 {user?.dreamDestinations.length || 0}</span>
          <span className="text-[9px] text-gray-500">Sonhos</span>
        </div>
      </div>
    </div>
  );
};
