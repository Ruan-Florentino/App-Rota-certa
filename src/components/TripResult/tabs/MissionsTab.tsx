import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Trophy, Target, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../../types';

interface MissionsTabProps {
  secretMissions: any[];
  completedMissions: number[];
  toggleMission: (index: number) => void;
  handleGenerateMissions: () => void;
  isGeneratingMissions: boolean;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  secretMissions,
  completedMissions,
  toggleMission,
  handleGenerateMissions,
  isGeneratingMissions
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-yellow-400">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Missões Secretas</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Desafios na vida real</p>
          </div>
        </div>

        {!secretMissions.length ? (
          <button
            onClick={handleGenerateMissions}
            disabled={isGeneratingMissions}
            className="w-full h-14 bg-yellow-500 text-black font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            {isGeneratingMissions ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Gerar Missões <Target className="w-4 h-4" /></>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {secretMissions.map((mission, idx) => {
              const isCompleted = completedMissions.includes(idx);
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl p-5 transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                      : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                          mission.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-400' :
                          mission.difficulty === 'Médio' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {mission.difficulty}
                        </span>
                        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> {mission.xp} XP
                        </span>
                      </div>
                      <h5 className={`text-base font-bold mb-2 transition-colors ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>
                        {mission.title}
                      </h5>
                      <p className="text-sm text-white/80 leading-relaxed">{mission.description}</p>
                    </div>
                    <button
                      onClick={() => toggleMission(idx)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted 
                          ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-110' 
                          : 'bg-[rgba(255,255,255,0.1)] text-white/40 hover:bg-[rgba(255,255,255,0.2)] hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            {completedMissions.length === secretMissions.length && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-500 text-black p-4 rounded-2xl text-center font-bold shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              >
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                Você completou todas as missões! Lenda!
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
