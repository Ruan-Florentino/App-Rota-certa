import React from 'react';
import { Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { mockProfileData as profile } from '../data/mockProfile';

export default function ReferralCard() {
  const handleCopy = () => {
    navigator.clipboard.writeText(profile.referralCode);
    toast.success('Copiado!', { 
      style: { 
        background: 'rgba(168, 85, 247, 0.9)', 
        backdropFilter: 'blur(10px)',
        color: 'white', 
        border: '1px solid rgba(255,255,255,0.1)' 
      } 
    });
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[20px] p-[20px]">
      <div className="flex items-center gap-[12px] mb-[8px]">
        <div className="w-[32px] h-[32px] rounded-full bg-[#A855F7]/10 flex items-center justify-center">
          <Share2 size={16} className="text-[#A855F7]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-[14px]">Indique e Ganhe</h3>
          <p className="text-[#5A6178] text-[10px] uppercase font-bold">Ganhe 500 pts por amigo</p>
        </div>
      </div>

      <div className="mt-[20px]">
        <span className="text-[#5A6178] text-[10px] uppercase font-bold mb-[8px] block">Seu Código</span>
        <div 
          onClick={handleCopy}
          className="bg-[#0F1420] border border-white/5 rounded-[14px] p-[16px] flex items-center justify-between cursor-pointer hover:border-white/20 transition-colors"
        >
          <span className="text-white text-[22px] font-bold tracking-widest" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            {profile.referralCode}
          </span>
          <Copy size={20} className="text-[#5A6178]" />
        </div>
      </div>

      <button className="w-full mt-[16px] py-[12px] rounded-[14px] border border-white/10 text-white text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-white/5 transition-colors">
        Inserir Código de Convite
      </button>
    </div>
  );
}
