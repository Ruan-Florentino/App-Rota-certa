import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';

interface GemsTabProps {
  hiddenGems: any[];
  destination: string;
  handleGenerateHiddenGems: () => void;
  isGeneratingGems: boolean;
  canEdit: boolean;
}

export const GemsTab: React.FC<GemsTabProps> = ({
  hiddenGems,
  destination,
  handleGenerateHiddenGems,
  isGeneratingGems,
  canEdit
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-primary">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white tracking-tight">Segredos Locais</h4>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Hidden Gems em {destination}</p>
            </div>
          </div>
          {canEdit && hiddenGems.length === 0 && (
            <button 
              onClick={handleGenerateHiddenGems}
              disabled={isGeneratingGems}
              className="bg-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/30 transition-all disabled:opacity-50"
            >
              {isGeneratingGems ? 'Buscando...' : 'Descobrir'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {hiddenGems.length > 0 ? (
            hiddenGems.map((gem: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-white font-bold">{gem.name}</h5>
                  <span className="text-[8px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {gem.category}
                  </span>
                </div>
                <p className="text-xs text-white/80 mb-3 leading-relaxed">{gem.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-primary font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Dica: {gem.tip}</span>
                </div>
              </motion.div>
            ))
          ) : (
            !isGeneratingGems && (
              <div className="text-center py-8">
                <Compass className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 text-sm">Clique em "Descobrir" para encontrar lugares secretos que só os locais conhecem!</p>
              </div>
            )
          )}
          
          {isGeneratingGems && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
