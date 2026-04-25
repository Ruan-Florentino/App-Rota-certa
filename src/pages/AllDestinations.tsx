import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Users, 
  Compass, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { ALL_DESTINATIONS } from '../data/destinations';
import { ExploreBackground } from '../components/explore/ExploreBackground';
import { SafeImage } from '../components/ui/SafeImage';
import { DestinationCard } from '../components/explore/DestinationCard';

const CATEGORIES = [
  { id: 'all', label: 'Tudo', icon: '🌍' },
  { id: 'praia', label: 'Praias', icon: '🏖️' },
  { id: 'aventura', label: 'Aventura', icon: '🧗' },
  { id: 'cidade', label: 'Cidades', icon: '🏙️' },
  { id: 'natureza', label: 'Natureza', icon: '🌿' },
  { id: 'romance', label: 'Romance', icon: '💖' },
  { id: 'história', label: 'História', icon: '🏛️' },
];

export function AllDestinationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'rating'>('popular');
  const [filter, setFilter] = useState<string>('all');
  
  const sorted = useMemo(() => {
    let result = [...ALL_DESTINATIONS];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
      );
    }
    
    if (filter !== 'all') {
      result = result.filter(d => d.categories.includes(filter));
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'price': return (a.priceFrom || 0) - (b.priceFrom || 0);
        default: return (b.reviews || 0) - (a.reviews || 0);
      }
    });
    
    return result;
  }, [search, sortBy, filter]);
  
  return (
    <div className="min-h-screen relative text-white pb-20">
      <ExploreBackground />
      
      <header className="sticky top-0 z-50 px-6 py-6 flex items-center gap-4 bg-black/20 backdrop-blur-xl border-b border-white/5 pt-safe">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter italic">Explorar Tudo</h1>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {sorted.length} destinos encontrados
          </p>
        </div>
      </header>
      
      <div className="px-6 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cidade, país ou clima..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                filter === cat.id 
                  ? 'bg-primary text-background' 
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* Sorting */}
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-primary" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none"
          >
            <option value="popular">Mais Populares</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="price">Menor Preço</option>
          </select>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-6">
          {sorted.map((dest, i) => (
            <DestinationCard 
              key={dest.id} 
              destination={dest} 
              variant="grid" 
              index={i}
              onClick={() => navigate(`/destination/${dest.id}`)}
            />
          ))}
          
          {sorted.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="text-4xl">🌑</div>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Nenhum destino encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
