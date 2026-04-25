import React from 'react';
import { motion } from 'motion/react';
import { BookHeart, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';

interface EtiquetteTabProps {
  culturalEtiquette: any | null;
  handleGenerateEtiquette: () => void;
  isGeneratingEtiquette: boolean;
  destination: string;
}

export const EtiquetteTab: React.FC<EtiquetteTabProps> = ({
  culturalEtiquette,
  handleGenerateEtiquette,
  isGeneratingEtiquette,
  destination
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-pink-400">
            <BookHeart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Etiqueta & Cultura</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Como agir em {destination}</p>
          </div>
        </div>

        {!culturalEtiquette ? (
          <button
            onClick={handleGenerateEtiquette}
            disabled={isGeneratingEtiquette}
            className="w-full h-14 bg-pink-500 text-white font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            {isGeneratingEtiquette ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Descobrir Costumes Locais <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-[rgba(255,255,255,0.05)] border border-green-500/30 rounded-2xl p-5">
              <h5 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" /> O que FAZER
              </h5>
              <ul className="space-y-3">
                {culturalEtiquette.dos.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] border border-red-500/30 rounded-2xl p-5">
              <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ThumbsDown className="w-4 h-4" /> O que NÃO fazer
              </h5>
              <ul className="space-y-3">
                {culturalEtiquette.donts.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
