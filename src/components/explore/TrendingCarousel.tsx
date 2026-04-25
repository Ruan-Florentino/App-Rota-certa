import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { Destination } from '../../types/destination';
import { DestinationCard } from './DestinationCard';

interface TrendingCarouselProps {
  destinations: Destination[];
  onSelect: (dest: Destination) => void;
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ destinations, onSelect }) => {
  return (
    <section className="space-y-6 pt-4">
      <div className="flex items-center justify-between px-6">
        <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
          🔥 Bombando agora
        </h3>
        <button className="text-[13px] font-semibold text-primary hover:text-cyan-300 transition-colors">
          Ver tudo &rarr;
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 px-6 scroll-hidden snap-x snap-mandatory">
        {destinations.map((dest, i) => (
          <div key={dest.id} className="snap-start">
            <DestinationCard 
              destination={dest} 
              variant="carousel" 
              index={i} 
              onClick={() => onSelect(dest)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
