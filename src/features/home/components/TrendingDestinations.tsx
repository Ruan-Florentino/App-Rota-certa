import React from 'react';
import { motion } from 'motion/react';
import { getDestinationByName } from '../../../data/destinationImages';
import { OptimizedImage } from '../../../components/common/OptimizedImage';

const trending = [
    { name: 'Lisboa', country: 'Portugal', tag: '🔥 Em alta' },
    { name: 'Miami', country: 'Estados Unidos', tag: '💎 Elite' },
    { name: 'Roma', country: 'Itália', tag: '✨ Desejo' },
    { name: 'Cancún', country: 'México', tag: '🌊 Relax' },
];

export const TrendingDestinations = () => {
  return (
    <div className="px-5">
      <h2 className="text-xl font-bold text-white mb-4">🔥 Explore novos horizontes</h2>
      <div className="grid grid-cols-2 gap-4">
        {trending.map((d, i) => {
          const dest = getDestinationByName(d.name);
          return (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.98 }}
              className="aspect-[3/4] rounded-2xl relative overflow-hidden group cursor-pointer"
            >
              <OptimizedImage
                src={dest?.cover}
                alt={d.name}
                category="destination"
                className="absolute inset-0 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-[#A855F7] bg-white/10 w-max px-2 py-0.5 rounded-full backdrop-blur-md mb-1 uppercase tracking-wider">{d.tag}</span>
                <h3 className="font-bold text-white text-lg leading-tight">{d.name}</h3>
                <p className="text-xs text-white/60">{d.country}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
