import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Phone, Languages, BookHeart, RefreshCw, Sparkles } from 'lucide-react';
import { Trip } from '../../../types';

interface SurvivalGuideTabProps {
  currentTrip: Trip;
  isGeneratingSurvivalGuide: boolean;
  handleGenerateSurvivalGuide: () => void;
}

export const SurvivalGuideTab: React.FC<SurvivalGuideTabProps> = ({
  currentTrip,
  isGeneratingSurvivalGuide,
  handleGenerateSurvivalGuide
}) => {
  const guide = currentTrip.info?.survivalGuide;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" /> Guia de Sobrevivência
        </h3>
        <button 
          onClick={handleGenerateSurvivalGuide}
          disabled={isGeneratingSurvivalGuide}
          className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 active:scale-95 transition-all disabled:opacity-50"
        >
          {isGeneratingSurvivalGuide ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          Regerar Guia
        </button>
      </div>

      {guide ? (
        <div className="grid gap-6">
          <div className="glass-card p-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Números de Emergência
            </h4>
            <div className="grid gap-3">
              {guide.emergencyNumbers.map((num, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{num.name}</span>
                  <span className="text-sm font-black text-white">{num.number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Languages className="w-4 h-4 text-accent" /> Frases Essenciais
            </h4>
            <div className="grid gap-4">
              {guide.phrases.map((phrase, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm font-bold text-white">{phrase.original}</p>
                  <p className="text-xs text-accent font-medium">{phrase.translated}</p>
                  <p className="text-[10px] text-white/40 italic">Pronúncia: {phrase.pronunciation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookHeart className="w-4 h-4 text-secondary" /> Gorjetas e Etiqueta
            </h4>
            <p className="text-sm text-white/80 leading-relaxed">{guide.tipping}</p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 font-semibold uppercase tracking-widest text-xs">Nenhum guia gerado ainda</p>
        </div>
      )}
    </motion.div>
  );
};
