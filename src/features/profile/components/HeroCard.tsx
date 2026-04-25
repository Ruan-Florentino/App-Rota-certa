import React from 'react';
import { motion } from 'motion/react';
import { Camera, Settings, MapPin, Trophy } from 'lucide-react';
import { mockProfileData as profile } from '../data/mockProfile';

export default function HeroCard() {
  return (
    <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[24px] p-[24px] flex flex-col items-center relative overflow-hidden">
      
      {/* Avatar Section */}
      <div className="relative mt-4">
        {/* Animated Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#A855F7] via-[#7DD3FC] to-[#A855F7] opacity-80 blur-md animate-[spin_8s_linear_infinite]" />
        <div className="absolute -inset-1 rounded-full p-[4px] bg-gradient-to-br from-[#A855F7] via-[#7DD3FC] to-[#A855F7] animate-[spin_8s_linear_infinite] shadow-[0_0_40px_rgba(168,85,247,0.4)]">
           <div className="w-full h-full bg-[#0F1420] rounded-full" />
        </div>
        
        {/* Actual Image */}
        <img 
          src={profile.avatar} 
          alt="Avatar"
          className="relative w-[160px] h-[160px] rounded-full object-cover z-10 border-4 border-[#0F1420] hover:scale-105 transition-transform cursor-pointer"
        />

        {/* Level Badge */}
        <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-br from-[#A855F7] to-[#7DD3FC] px-[10px] py-[4px] rounded-[8px] text-white text-[11px] font-bold shadow-lg">
          LVL {profile.level}
        </div>

        {/* Camera Button */}
        <button className="absolute bottom-2 right-2 z-20 w-[36px] h-[36px] bg-[#A855F7] rounded-full flex items-center justify-center shadow-lg border-2 border-[#141928] hover:scale-110 transition-transform">
          <Camera size={16} className="text-white fill-white" />
        </button>
      </div>

      {/* Identidade */}
      <h2 
        className="mt-[20px] text-white text-[22px] font-bold text-center uppercase tracking-[-0.02em] leading-tight" 
        style={{ fontFamily: '"Fraunces", serif', textWrap: 'balance' }}
      >
        {profile.name}
      </h2>
      
      <span className="mt-[6px] text-[#5A6178] text-[11px] uppercase tracking-[0.25em] font-bold">
        {profile.status.replace('_', ' ')}
      </span>

      {/* Settings Central */}
      <button className="mt-[14px] w-[36px] h-[36px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/10 transition-colors">
         <Settings size={16} className="text-gray-400" />
      </button>

      {/* XP Bar */}
      <div className="w-full mt-[20px] mb-[16px]">
        <div className="flex justify-between items-end mb-[6px]">
          <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">EXPERIÊNCIA</span>
          <span className="text-[#A855F7] text-[10px] font-bold">{profile.xp} / {profile.xpMax} XP</span>
        </div>
        <div className="w-full h-[6px] bg-[#1A1F2E] rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7DD3FC]"
            initial={{ width: 0 }}
            whileInView={{ width: `${(profile.xp / profile.xpMax) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Pills */}
      <div className="flex gap-[10px] justify-center mt-2">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-[16px] py-[8px] rounded-full backdrop-blur-md hover:bg-white/10 cursor-pointer transition-colors">
          <span className="text-xl">🇧🇷</span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-white">BRASIL</span>
        </div>
        <div className="flex items-center gap-2 border border-[#A855F7]/30 px-[16px] py-[8px] rounded-full bg-[#A855F7]/5 relative overflow-hidden group hover:scale-105 transition-transform cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A855F7]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <Trophy size={14} className="text-[#A855F7] relative z-10" />
          <span className="text-[12px] font-bold text-white relative z-10">{profile.streaks} STREAKS</span>
        </div>
      </div>

    </div>
  );
}
