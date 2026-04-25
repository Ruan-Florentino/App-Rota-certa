import React from 'react';
import { motion } from 'motion/react';
import { Aperture, Sparkles, Sun, Camera } from 'lucide-react';

interface PhotoSpotsTabProps {
  photoSpots: any[];
  handleGeneratePhotoSpots: () => void;
  isGeneratingPhotoSpots: boolean;
  destination: string;
}

export const PhotoSpotsTab: React.FC<PhotoSpotsTabProps> = ({
  photoSpots,
  handleGeneratePhotoSpots,
  isGeneratingPhotoSpots,
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
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-teal-400">
            <Aperture className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Spots de Fotos</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Lugares instagramáveis em {destination}</p>
          </div>
        </div>

        {!photoSpots.length ? (
          <button
            onClick={handleGeneratePhotoSpots}
            disabled={isGeneratingPhotoSpots}
            className="w-full h-14 bg-teal-500 text-white font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_20px_rgba(20,184,166,0.4)]"
          >
            {isGeneratingPhotoSpots ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Descobrir Melhores Ângulos <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {photoSpots.map((spot, idx) => (
              <div key={idx} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-5">
                <h5 className="text-base font-bold text-teal-400 mb-2">{spot.name}</h5>
                <p className="text-sm text-white/80 mb-3 leading-relaxed">{spot.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                    <Sun className="w-3 h-3 text-yellow-400" /> Melhor horário: {spot.bestTime}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                    <Camera className="w-3 h-3 text-primary" /> Dica: {spot.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
