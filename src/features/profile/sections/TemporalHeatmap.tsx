import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTripsStore } from '@/stores/tripsStore';

export const TemporalHeatmap = () => {
  const { trips } = useTripsStore();

  const heatmapData = useMemo(() => {
    // Basic mock logic for generating a heatmap shape based on trips
    const data = Array(12).fill(0); // 12 columns mapping vaguely to months or years
    
    trips.forEach(t => {
       if (t.status === 'visited') {
         // Randomly distribute if timestamp is not accurate to months
         const val = new Date(t.createdAt).getMonth() % 12;
         data[val] += 1;
       }
    });
    
    return data;
  }, [trips]);

  const maxVal = Math.max(...heatmapData, 1);

  return (
    <section className="py-12">
      <h2 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs mb-12 flex items-center gap-4">
        Heatmap Temporal <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden">
        <div className="flex gap-2 items-end h-32 mb-6">
          {heatmapData.map((val, i) => {
            const heightPercentage = Math.max(10, (val / maxVal) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: `${heightPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className={`w-full rounded-sm ${val > 0 ? 'bg-[#D4AF37]' : 'bg-white/10 group-hover:bg-white/20'} transition-colors`}
                />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-widest mt-4 pt-4 border-t border-white/10">
          <span>{trips.filter(t => t.status === 'visited').length} Registros</span>
          <span>Atividade Recente</span>
        </div>
      </div>
    </section>
  );
};
