import React from 'react';
import { Sparkles } from 'lucide-react';

interface ShareCardProps {
  destination: string;
  summary: string;
  itinerary: any[];
}

export const ShareCard: React.FC<ShareCardProps> = ({ destination, summary, itinerary }) => {
  return (
    <div 
      id="share-card" 
      className="w-[600px] p-8 bg-[#020617] text-white rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
      style={{ position: 'fixed', left: '-9999px' }} // Hide from view but keep in DOM for html2canvas
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -ml-20 -mb-20" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Right Way AI</span>
          </div>
          <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Roteiro Personalizado</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            🌍 Viagem para <span className="text-primary">{destination}</span>
          </h1>
          <p className="text-sm text-white/60 font-medium leading-relaxed max-w-[90%]">
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4">
          {itinerary.slice(0, 3).map((day, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                {i + 1}
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Dia {i + 1}</p>
                <p className="text-sm font-bold text-white">{day.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-black">RW</span>
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Created with Right Way ✈️</span>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">rightway.app</span>
        </div>
      </div>
    </div>
  );
};
