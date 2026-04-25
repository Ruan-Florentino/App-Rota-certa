import React from 'react';
import { motion } from 'motion/react';
import { achievementsData } from '../data/achievements';

export default function AchievementsSection() {
  const unlockedCount = achievementsData.filter(a => a.unlocked).length;

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold flex items-center gap-2" style={{ fontFamily: '"Fraunces", serif' }}>
          🏆 CONQUISTAS
        </h3>
        <span className="text-[#A855F7] text-[10px] font-bold tracking-widest">
          {unlockedCount}/{achievementsData.length} DESBLOQUEADAS
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x hide-scrollbar pb-4 -mx-5 px-5">
        {achievementsData.map((ach) => (
          <div key={ach.id} className="perspective-1000 shrink-0 snap-center">
            <motion.div
              style={{ transformStyle: 'preserve-3d' }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ rotateY: 180 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={`relative w-[120px] h-[150px] rounded-[24px] cursor-pointer transition-all duration-500`}
            >
              {/* Front Side */}
              <div className={`absolute inset-0 backface-hidden rounded-[24px] p-4 flex flex-col items-center justify-center text-center border ${
                ach.unlocked 
                  ? 'bg-[#141928]/90 border-[#A855F7]/40 shadow-[0_10px_30px_rgba(168,85,247,0.2)]' 
                  : 'bg-[#141928]/40 border-white/5 opacity-80'
              }`}>
                <div className={`text-[32px] mb-3 z-10 transition-transform duration-500 ${ach.unlocked ? '' : 'filter grayscale opacity-50'}`}>
                  {ach.icon}
                </div>
                <span className="text-[11px] text-white font-bold uppercase z-10 mb-1 leading-tight line-clamp-1">
                  {ach.name}
                </span>
                <span className="text-[9px] text-[#5A6178] font-bold uppercase z-10 leading-tight line-clamp-2">
                  {ach.description}
                </span>
              </div>

              {/* Back Side (180deg Rotated) */}
              <div 
                style={{ transform: 'rotateY(180deg)' }}
                className={`absolute inset-0 backface-hidden rounded-[24px] p-4 flex flex-col items-center justify-center text-center border bg-gradient-to-br from-[#A855F7] to-[#7DD3FC] border-white/20`}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl mb-2">
                   RW
                </div>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                  LEGACY
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
