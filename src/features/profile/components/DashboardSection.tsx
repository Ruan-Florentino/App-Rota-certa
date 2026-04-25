import React from 'react';
import { motion } from 'motion/react';

export default function DashboardSection() {
  const cards = [
    { label: 'TOTAL GASTO', value: 'R$ 12.450', sub: 'ESTIMATIVA', color: 'text-[#A855F7]' },
    { label: 'DESTINO TOP', value: 'Paris, FR', sub: '3 VISITAS', color: 'text-[#7DD3FC]' },
    { label: 'ESTILO FAVORITO', value: 'Aventura', sub: '100% DAS TRIPS', color: 'text-[#A855F7]' },
    { label: 'MÉDIA/DIA', value: 'R$ 1.200', sub: 'BASEADO EM 12 DIAS', color: 'text-[#7DD3FC]' },
  ];

  return (
    <div className="pt-6">
      <h3 className="text-white text-lg font-bold mb-4 uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: '"Fraunces", serif' }}>
        <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
        DASHBOARD ANALYST
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/0 to-[#A855F7]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[#5A6178] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">{c.label}</span>
            <span className="text-white text-2xl font-bold leading-none mb-1" style={{ fontFamily: '"Fraunces", serif' }}>{c.value}</span>
            <span className={`text-[10px] font-bold ${c.color}`}>{c.sub}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* Expenditure Mini Chart */}
        <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 h-[160px] flex flex-col relative overflow-hidden">
           <span className="text-[#5A6178] text-[9px] uppercase font-bold tracking-[0.2em] mb-4">Fluxo de Gastos</span>
           
           <div className="flex items-end justify-between h-full gap-1.5 px-1 relative z-10">
             {[30, 45, 25, 60, 40, 85, 55].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 whileInView={{ height: `${h}%` }}
                 transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                 className={`w-full rounded-t-md relative group`}
                 style={{ 
                   background: i === 5 ? 'linear-gradient(to top, #A855F7, #7DD3FC)' : 'rgba(255,255,255,0.05)'
                 }}
               >
                 {i === 5 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#7DD3FC] whitespace-nowrap">MAX</div>
                 )}
               </motion.div>
             ))}
           </div>
        </div>

        {/* Travel Style Radar */}
        <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
           <span className="absolute top-4 left-4 text-[#5A6178] text-[9px] uppercase font-bold tracking-[0.2em]">Travel Style</span>
           
           <div className="relative w-24 h-24 mt-4">
             {/* Circular Rings */}
             <div className="absolute inset-0 rounded-full border border-white/5" />
             <div className="absolute inset-4 rounded-full border border-white/5" />
             <div className="absolute inset-8 rounded-full border border-white/5" />
             
             {/* Radar Polygon Overlay */}
             <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-18 relative z-10">
               <motion.path
                 initial={{ pathLength: 0, opacity: 0 }}
                 whileInView={{ pathLength: 1, opacity: 0.6 }}
                 transition={{ duration: 1.5 }}
                 d="M50 10 L85 40 L70 85 L30 85 L15 40 Z"
                 fill="rgba(168, 85, 247, 0.2)"
                 stroke="#A855F7"
                 strokeWidth="1.5"
               />
               <circle cx="50" cy="10" r="3" fill="#7DD3FC" />
               <circle cx="85" cy="40" r="3" fill="#A855F7" />
             </svg>
             
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-white/20 rounded-full animate-ping" />
             </div>
           </div>
           
           <div className="mt-4 text-[9px] font-bold text-white uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
              Explorer Soul
           </div>
        </div>
      </div>
    </div>
  );
}
