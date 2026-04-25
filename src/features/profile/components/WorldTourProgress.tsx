import React from 'react';
import { motion } from 'motion/react';

interface WorldTourProgressProps {
  progress: number;
  totalKm: number;
  remaining: number;
  nextMilestone: { km: number; label: string };
  className?: string;
}

export const WorldTourProgress = ({ 
  progress, 
  totalKm, 
  remaining, 
  nextMilestone,
  className = '' 
}: WorldTourProgressProps) => {
  return (
    <div className={`rounded-[32px] bg-rw-surface border border-rw-border p-8 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Subtle radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rw-sky/5 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-rw-sky shadow-rw-glow-sm animate-pulse" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-rw-muted font-black">
              Exploração Global
            </p>
          </div>
          <p className="text-lg text-rw-text font-black uppercase tracking-tighter">Volta ao mundo</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-rw-text tabular-nums tracking-tighter">
            {progress.toFixed(1)}<span className="text-rw-sky text-xl ml-0.5">%</span>
          </p>
          <p className="text-[9px] text-rw-dim uppercase font-black tracking-[0.25em] mt-1">Concluído</p>
        </div>
      </div>
      
      <div className="relative h-4 bg-rw-elevated rounded-full overflow-hidden border border-rw-border p-[3px]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="h-full rounded-full bg-gradient-to-r from-rw-sky via-rw-sky-deep to-rw-lavender relative shadow-rw-glow-sm"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 translate-x-1
                          rounded-full bg-white shadow-rw-glow border-2 border-rw-sky z-10" />
        </motion.div>
      </div>
      
      <div className="flex items-center justify-between mt-6 relative z-10">
        <p className="text-xs text-rw-muted font-bold uppercase tracking-wider">
          <span className="tabular-nums text-rw-text font-black">{totalKm.toLocaleString('pt-BR')}</span> km percorridos
        </p>
        <p className="text-xs text-rw-muted font-bold uppercase tracking-wider">
          Faltam <span className="tabular-nums text-rw-sky font-black">{remaining.toLocaleString('pt-BR')}</span> km
        </p>
      </div>
      
      <div className="mt-6 pt-6 border-t border-rw-border relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rw-sky/10 border border-rw-sky/20 
                            flex items-center justify-center shadow-lg">
              <span className="text-rw-sky text-sm font-black">→</span>
            </div>
            <div>
              <p className="text-[10px] text-rw-dim uppercase font-black tracking-[0.2em]">Próximo Marco</p>
              <p className="text-xs text-rw-text font-black uppercase tracking-wider mt-1">
                {nextMilestone.label}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-rw-sky font-black tabular-nums tracking-widest uppercase">
             {nextMilestone.km.toLocaleString('pt-BR')} KM
          </p>
        </div>
      </div>
    </div>
  );
};
