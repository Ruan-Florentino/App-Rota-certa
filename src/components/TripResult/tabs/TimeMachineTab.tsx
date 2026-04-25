import React from 'react';
import { motion } from 'motion/react';
import { Hourglass, Sparkles, Camera, Volume2, Info } from 'lucide-react';

interface TimeMachineTabProps {
  timeMachineEra: string;
  setTimeMachineEra: (v: string) => void;
  handleGenerateTimeMachine: () => void;
  isGeneratingTimeMachine: boolean;
  timeMachineResult: { vision: string; sounds: string; fact: string } | null;
  destination: string;
}

export const TimeMachineTab: React.FC<TimeMachineTabProps> = ({
  timeMachineEra,
  setTimeMachineEra,
  handleGenerateTimeMachine,
  isGeneratingTimeMachine,
  timeMachineResult,
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
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-purple-400">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Máquina do Tempo</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Viaje pelo passado e futuro de {destination}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {['Antiguidade', 'Idade Média', '100 Anos Atrás', 'Futuro (2100)'].map(era => (
              <button
                key={era}
                onClick={() => setTimeMachineEra(era)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                  timeMachineEra === era 
                    ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white/60 hover:bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                {era}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateTimeMachine}
            disabled={isGeneratingTimeMachine}
            className="w-full h-14 bg-purple-500 text-white font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            {isGeneratingTimeMachine ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Viajar no Tempo <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {timeMachineResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 space-y-4">
              <div>
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Camera className="w-3 h-3" /> O que você vê
                </p>
                <p className="text-sm text-white/90 leading-relaxed">{timeMachineResult.vision}</p>
              </div>
              
              <div className="h-px w-full bg-white/10" />
              
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> O que você ouve
                </p>
                <p className="text-sm text-white/90 leading-relaxed">{timeMachineResult.sounds}</p>
              </div>

              <div className="h-px w-full bg-white/10" />
              
              <div>
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Fato Chocante
                </p>
                <p className="text-sm text-white/90 leading-relaxed italic">"{timeMachineResult.fact}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
