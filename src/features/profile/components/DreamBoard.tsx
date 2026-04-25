import React from 'react';
import { Bookmark } from 'lucide-react';

export default function DreamBoard() {
  const dreams = [
    { country: 'Japão', label: 'Viagem', bg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=300&fit=crop' },
    { country: 'Grécia', label: 'Viagem', bg: 'https://images.unsplash.com/photo-1542640244-7e672d6cb461?w=200&h=300&fit=crop' },
    { country: 'Islândia', label: 'Viagem', bg: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=200&h=300&fit=crop' },
  ];

  return (
    <div className="pt-[16px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h3 className="text-white text-[16px] font-bold uppercase" style={{ fontFamily: '"Fraunces", serif' }}>
          ✨ Dream Board
        </h3>
        <button className="text-[#00E5D4] text-[12px] font-bold uppercase">
          Adicionar +
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-[10px]">
        {dreams.map((d, i) => (
          <div key={i} className="relative w-full h-[100px] rounded-[14px] overflow-hidden group cursor-pointer border border-white/5">
             <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors" />
             <img src={d.bg} alt={d.country} className="absolute inset-0 w-full h-full object-cover" />
             <div className="absolute inset-0 z-20 flex flex-col justify-end p-[8px]">
               <span className="text-white text-[10px] font-bold uppercase leading-tight drop-shadow-md">{d.country}</span>
               <span className="text-white/80 text-[9px] uppercase drop-shadow-md">{d.label}</span>
             </div>
          </div>
        ))}
        
        <div className="w-full h-[100px] rounded-[14px] bg-[#141928]/60 border border-white/5 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
          <Bookmark size={16} className="text-[#5A6178] mb-[4px]" />
          <span className="text-[#5A6178] text-[9px] font-bold uppercase text-center px-2">Salvar<br/>Destino</span>
        </div>
      </div>
    </div>
  );
}
