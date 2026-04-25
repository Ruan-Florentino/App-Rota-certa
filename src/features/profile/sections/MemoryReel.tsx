import { motion } from 'motion/react';
import { useTravelStats } from '../hooks/useTravelStats';
import { Text } from '@/components/ui/Text';

export const MemoryReel = () => {
  const stats = useTravelStats();
  const trips = stats.visitedCountries;

  if (trips.length === 0) return null;

  return (
    <section className="py-12 overflow-hidden">
      <h2 className="flex items-center gap-4 px-4 md:px-0 mb-12">
        <Text variant="label-lg" color="#D4AF37">Memory Reel</Text>
        <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-4 md:px-0">
        {trips.map((trip, i) => {
          let tripYear = new Date().getFullYear();
          if (trip.createdAt && !isNaN(new Date(trip.createdAt).valueOf())) {
            tripYear = new Date(trip.createdAt).getFullYear();
          } else if (trip.year) {
            tripYear = trip.year;
          } else if (trip.visitedAt && !isNaN(new Date(trip.visitedAt).valueOf())) {
            tripYear = new Date(trip.visitedAt).getFullYear();
          }
          
          return (
          <motion.div
            key={trip.id || trip.countryCode || i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            className="snap-center shrink-0 w-72 h-[400px] rounded-3xl bg-black relative overflow-hidden group cursor-pointer border border-white/10"
          >
            {/* Cinematic Gradient / Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-[#1A1F35] opacity-50 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            
            {/* Film grain effect */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay z-20 pointer-events-none" />

            <div className="absolute inset-0 p-6 z-30 flex flex-col justify-end">
              <span className="mb-2 bg-black/50 px-2 py-1 rounded w-fit backdrop-blur-md">
                <Text variant="mono-sm" color="#D4AF37">{String(tripYear)}</Text>
              </span>
              <Text variant="display-sm" className="mb-1 leading-none">{trip.name}</Text>
              <div className="flex items-center gap-2">
                <span className="text-xl">{trip.flag}</span>
                <Text variant="mono-md" color="white/60">{trip.countryCode}</Text>
              </div>
            </div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
               <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md">
                  <span className="ml-1 text-white">▶</span>
               </div>
            </div>
          </motion.div>
        )})}
      </div>
    </section>
  );
};
