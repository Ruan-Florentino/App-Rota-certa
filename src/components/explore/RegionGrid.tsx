import React from 'react';
import { motion } from 'motion/react';
import { SafeImage } from '../ui/SafeImage';

interface Region {
  id: string;
  name: string;
  image: string;
  count: number;
  gradient: string;
}

const REGIONS: Region[] = [
  { id: 'br', name: 'Brasil', count: 25, gradient: 'from-green-500 to-yellow-500', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=600&q=80' },
  { id: 'sa', name: 'América do Sul', count: 12, gradient: 'from-emerald-500 to-teal-600', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80' },
  { id: 'eu', name: 'Europa', count: 25, gradient: 'from-blue-500 to-purple-600', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 'as', name: 'Ásia', count: 18, gradient: 'from-red-500 to-orange-500', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  { id: 'af', name: 'África', count: 8, gradient: 'from-orange-500 to-amber-700', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80' },
  { id: 'oc', name: 'Oceania', count: 6, gradient: 'from-cyan-400 to-blue-600', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80' },
];

export const RegionGrid: React.FC = () => {
  return (
    <section className="space-y-6 px-6 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
          🌍 Por continente
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {REGIONS.map((region, i) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
          >
            <SafeImage 
              src={region.image} 
              alt={region.name} 
              fallbackGradient={region.gradient}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <h4 className="text-[20px] font-black text-white uppercase tracking-tight leading-none mb-1 shadow-black drop-shadow-md line-clamp-2">
                {region.name}
              </h4>
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{region.count} destinos</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
