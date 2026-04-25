import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIBadge() {
  return (
    <div className="flex justify-center">
      <div className="relative rounded-full p-[1px] bg-gradient-to-r from-transparent via-[#A855F7]/50 to-transparent overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.1)]">
        {/* Animated border effect wrapper goes here if needed, or simple static radial */}
        <div className="bg-[#0F1420]/80 backdrop-blur-md px-[16px] py-[8px] rounded-full flex items-center gap-[8px]">
          <Sparkles className="text-[#A855F7]" size={14} />
          <span className="text-[11px] text-white uppercase font-bold tracking-[0.15em]">
            Inteligência Artificial Right Way Ativa
          </span>
        </div>
      </div>
    </div>
  );
}
