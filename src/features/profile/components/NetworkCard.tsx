import React from 'react';
import { mockProfileData as profile } from '../data/mockProfile';

export default function NetworkCard() {
  return (
    <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[20px] p-[20px] mt-[16px]">
      <h3 className="text-white text-[12px] font-bold mb-[16px] uppercase tracking-wider">
        🌐 Rede Right Way
      </h3>
      
      <div className="grid grid-cols-2 gap-[20px] mb-[20px]">
        <div>
          <span className="text-white text-[36px] font-bold leading-none block" style={{ fontFamily: '"Fraunces", serif' }}>
            {profile.network.following}
          </span>
          <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">
            Seguindo
          </span>
        </div>
        <div>
          <span className="text-white text-[36px] font-bold leading-none block" style={{ fontFamily: '"Fraunces", serif' }}>
            {profile.network.followers}
          </span>
          <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">
            Seguidores
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-[12px] pt-[16px] border-t border-white/5">
        <div className="flex -space-x-3">
          {profile.network.friends.slice(0, 4).map((f, i) => (
            <img key={i} src={f.avatar} alt={f.name} className="w-[32px] h-[32px] rounded-full border-2 border-[#141928] object-cover" />
          ))}
        </div>
        <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">
          {profile.network.friends.length} amigos usam o Right Way
        </span>
      </div>
    </div>
  );
}
