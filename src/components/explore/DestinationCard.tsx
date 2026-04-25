import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Bookmark, Compass, Flame } from 'lucide-react';
import { Destination } from '../../types/destination';
import { formatCurrency } from '../../utils';
import { SafeImage } from '../ui/SafeImage';

interface Props {
  destination: Destination;
  variant?: 'grid' | 'carousel';
  index?: number;
  onClick?: () => void;
}

export const DestinationCard: React.FC<Props> = ({ destination, variant = 'carousel', index = 0, onClick }) => {
  const navigate = useNavigate();
  const isGrid = variant === 'grid';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/destination/${destination.id}`);
    }
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };
  
  if (isGrid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="w-full cursor-pointer group"
      >
        <div className="glass-card p-0 overflow-hidden relative border-white/5 bg-white/5 shadow-2xl transition-all duration-300 group-hover:border-primary/30 h-40 flex">
          {/* Image Section */}
          <div className="w-1/3 relative overflow-hidden">
            <SafeImage 
              src={destination.heroImage} 
              alt={destination.name}
              emoji={destination.fallbackEmoji || '🌍'}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-black text-white">{destination.rating}</span>
            </div>

            <h4 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {destination.name}
            </h4>
            
            <div className="flex items-center gap-1 text-white/40 mb-3">
              <MapPin size={10} />
              <span className="text-[10px] font-bold uppercase tracking-widest line-clamp-1">
                {destination.state ? `${destination.state}, ` : ''}{destination.country}
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-tight">Estimativa histórica*</span>
                <span className="text-sm font-black text-primary tracking-widest">{formatCurrency(destination.priceFrom)} - {formatCurrency(destination.priceFrom * 1.4)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Carousel variant (Full height overlay)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="w-72 h-96 flex-shrink-0 cursor-pointer group rounded-3xl overflow-hidden relative shadow-2xl border border-white/5"
    >
      <SafeImage 
        src={destination.heroImage} 
        alt={destination.name}
        emoji={destination.fallbackEmoji || '🌍'}
        className="absolute inset-0 w-full h-full transform group-hover:scale-105 transition-transform duration-700"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/90 pointer-events-none" />

      {/* TOP */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        {destination.trending ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 backdrop-blur-md rounded-full shadow-lg border border-red-500/30">
            <Flame size={12} className="text-red-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Trending</span>
          </div>
        ) : <div />}

        <button 
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all active:scale-90"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-white">{destination.rating}</span>
          <span className="text-xs text-white/50">({destination.reviews || 0} reviews)</span>
          <div className="h-[2px] w-8 bg-gradient-to-r from-cyan-400 to-transparent ml-2 rounded-full" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {destination.name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-white/60 mb-4">
          <MapPin size={12} />
          <span className="text-[11px] font-bold uppercase tracking-widest line-clamp-1">
            {destination.state ? `${destination.state}, ` : ''}{destination.country}
          </span>
        </div>

        <div className="h-px bg-white/10 w-full mb-3" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Estimativa Histórica*</span>
            <span className="text-lg font-black text-primary">{formatCurrency(destination.priceFrom)} - {formatCurrency(destination.priceFrom * 1.4)}</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Compass size={18} className="group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
