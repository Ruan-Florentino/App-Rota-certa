import React from 'react';
import { Crown } from 'lucide-react';
import { mockProfileData as profile } from '../data/mockProfile';

export default function PlanCard() {
  const percent = Math.min((profile.plan.roteirosUsed / profile.plan.roteirosLimit) * 100, 100);
  
  return (
    <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[20px] p-[20px]">
      <div className="flex justify-between items-center mb-[20px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-full bg-white/5 border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Crown size={20} className="text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-white text-[16px] font-bold uppercase" style={{ fontFamily: '"Fraunces", serif' }}>
              Plano {profile.plan.type}
            </h3>
            <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">
              Recursos Limitados
            </span>
          </div>
        </div>
        <button className="text-[#00E5D4] text-[12px] font-bold hover:underline">
          UPGRADE →
        </button>
      </div>

      <div className="space-y-[8px]">
        <div className="flex justify-between items-center">
          <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">
            Roteiros este mês
          </span>
          <span className="text-[#00E5D4] text-[12px] font-bold">
            {profile.plan.roteirosUsed}/{profile.plan.roteirosLimit}
          </span>
        </div>
        <div className="w-full h-[6px] bg-[#1A1F2E] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[#5A6178] text-[11px] italic mt-[8px]">
          Assine Premium para roteiros ilimitados, AI Lens e exportação PDF.
        </p>
      </div>
    </div>
  );
}
