import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Heart, Bell, Search, Mic } from 'lucide-react';
import { useExploreStore } from './stores/exploreStore';
import { destinations } from './data/destinations';
import { calculateMatch } from './utils/matchCalculator';
import { useUserStore } from '../../stores/userStore';

import { OptimizedImage } from '../../components/common/OptimizedImage';

const filters = ['Todos', '🏖️ Praia', '🏔️ Aventura', '🏛️ Cultural', '🍜 Gastronomia', '🌃 Urbano'];

export const ExploreScreen = () => {
    const { activeFilter, setFilter, toggleFavorite, favorites } = useExploreStore();
    const user = useUserStore((s) => s.user);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-[60px] flex items-center justify-between px-5 bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-2xl font-Fraunces font-bold text-white">Explorar 🌍</h1>
        <div className="flex gap-4 text-white">
            <Map size={24} />
            <Heart size={24} />
            <Bell size={24} />
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 bg-white/5 border border-[#A855F7]/20 rounded-full px-4 py-3">
            <Search className="text-gray-400" size={20} />
            <input className="flex-1 bg-transparent text-white placeholder:text-gray-500" placeholder="Busque destinos..." />
            <Mic className="text-[#7DD3FC]" size={20} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto px-5 mt-4 pb-2">
        {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full border ${activeFilter === f ? 'bg-gradient-to-r from-[#A855F7] to-[#00E5D4] border-transparent' : 'bg-white/5 border-white/10'}`}>
                <span className="text-sm text-white whitespace-nowrap">{f}</span>
            </button>
        ))}
      </div>

      {/* Feed */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-4">
        {destinations.map(d => {
            const isFav = favorites.includes(d.id);
            const match = calculateMatch(d, user || { travelStyles: [], averageBudget: 5000 });
            return (
                <motion.div key={d.id} layout className="rounded-2xl overflow-hidden relative aspect-[3/4] bg-white/5">
                    <OptimizedImage 
                      src={d.image} 
                      alt={d.name} 
                      category="destination"
                      className="w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                        <h3 className="font-bold text-white font-Fraunces">{d.name}</h3>
                        <p className="text-xs text-gray-300">{d.country}</p>
                        <span className="text-xs text-[#00E5D4] mt-1">{match}% Match</span>
                    </div>
                    <button onClick={() => toggleFavorite(d.id)} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full">
                        <Heart size={16} className={isFav ? 'fill-[#A855F7] text-[#A855F7]' : 'text-white'} />
                    </button>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
};
