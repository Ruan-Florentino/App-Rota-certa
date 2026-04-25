import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Heart } from 'lucide-react';

interface SOSTabProps {
  emergencyInfo: any | null;
  handleGenerateEmergencyInfo: () => void;
  isGeneratingEmergency: boolean;
  destination: string;
}

export const SOSTab: React.FC<SOSTabProps> = ({
  emergencyInfo,
  handleGenerateEmergencyInfo,
  isGeneratingEmergency,
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
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Emergência & SOS</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Segurança em {destination}</p>
          </div>
        </div>

        {!emergencyInfo ? (
          <button
            onClick={handleGenerateEmergencyInfo}
            disabled={isGeneratingEmergency}
            className="w-full h-14 bg-red-500 text-white font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            {isGeneratingEmergency ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Gerar Contatos de Emergência <ShieldAlert className="w-4 h-4" /></>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[rgba(255,255,255,0.05)] border border-red-500/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                <ShieldAlert className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Polícia</span>
                <span className="text-lg font-bold text-white">{emergencyInfo.police}</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] border border-red-500/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Ambulância</span>
                <span className="text-lg font-bold text-white">{emergencyInfo.ambulance}</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] border border-red-500/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                <ShieldAlert className="w-6 h-6 text-orange-400" />
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Bombeiros</span>
                <span className="text-lg font-bold text-white">{emergencyInfo.fire}</span>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mt-4">
              <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Frase de Emergência</h5>
              <p className="text-lg font-bold text-white mb-1">"{emergencyInfo.phrase.local}"</p>
              <p className="text-sm text-white/80 italic mb-3">Pronúncia: {emergencyInfo.phrase.pronunciation}</p>
              <p className="text-xs text-white/60 font-semibold uppercase tracking-widest">Tradução: {emergencyInfo.phrase.translation}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
