import { motion } from 'motion/react';
import { useTravelStats } from '../hooks/useTravelStats';
import { Text } from '@/components/ui/Text';

export const RankAscension = () => {
  const stats = useTravelStats();
  
  const ranks = [
    { name: 'Novato', threshold: 0 },
    { name: 'Viajante', threshold: 5 },
    { name: 'Explorador', threshold: 15 },
    { name: 'Nômade', threshold: 30 },
    { name: 'Lenda', threshold: 50 }
  ];

  const currentRankIdx = [...ranks].reverse().findIndex(r => stats.totalCountries >= r.threshold);
  const currentRank = ranks[ranks.length - 1 - currentRankIdx];
  const nextRank = ranks[ranks.length - currentRankIdx] || ranks[ranks.length - 1];

  const progress = nextRank.threshold > currentRank.threshold 
    ? ((stats.totalCountries - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100
    : 100;

  return (
    <section className="py-12">
      <h2 className="flex items-center gap-4 text-[#D4AF37] mb-12">
        <Text variant="label-lg" color="#D4AF37">The Ascension</Text>
        <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="relative h-80 flex items-center justify-center">
        {/* Staircase representation */}
        <div className="absolute inset-0 flex flex-col justify-end items-center opacity-30 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="border-t border-x border-[#D4AF37]/50"
              style={{
                width: `${100 - i * 15}%`,
                height: '40px',
                transform: `perspective(500px) rotateX(60deg) translateZ(${i * 20}px)`,
                background: i <= (ranks.length - 1 - currentRankIdx) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#1A1F35] to-black border border-[#D4AF37]/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
          >
            {/* Liquid fill simulation */}
            <div className="absolute inset-2 rounded-full overflow-hidden">
               <div 
                 className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#D4AF37]/40 to-[#D4AF37]/10 transition-all duration-1000 ease-out"
                 style={{ height: `${progress}%` }}
               />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Text variant="label-md" color="#D4AF37" className="mb-1">Rank Atual</Text>
              <Text variant="display-sm" color="white">{currentRank.name}</Text>
            </div>
          </motion.div>

          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <Text variant="label-md" color="white/50">{stats.totalCountries} países</Text>
              <Text variant="label-md" color="#D4AF37">{nextRank.threshold} para {nextRank.name}</Text>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] shadow-[0_0_10px_rgba(212,175,55,1)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
