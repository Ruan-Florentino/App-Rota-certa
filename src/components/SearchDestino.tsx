import React from 'react';
import axios from 'axios';
import { MapPin, Loader2, Search, X, History } from 'lucide-react';
import { normalizeString } from '../utils/stringUtils';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import citiesData from '../data/cities.json';

export interface CitySuggestion {
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  population: number;
}

interface SearchDestinoProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (city: CitySuggestion) => void;
  placeholder?: string;
  className?: string;
}

export const SearchDestino: React.FC<SearchDestinoProps> = ({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Para onde você quer ir?",
  className = ""
}) => {
  const { searchHistory, addToHistory } = useStore();
  const [suggestions, setSuggestions] = React.useState<CitySuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Pre-process cities data for faster search
  const cities = React.useMemo(() => {
    if (!Array.isArray(citiesData)) return [];
    return (citiesData as any[]).map(c => ({
      name: c[0] || '',
      state: c[1] || '',
      country: c[2] || '',
      lat: c[3] || 0,
      lng: c[4] || 0,
      population: c[5] || 0,
      normalizedName: normalizeString(c[0] || ''),
      normalizedCountry: normalizeString(c[2] || ''),
      normalizedState: normalizeString(c[1] || '')
    }));
  }, []);

  const fetchSuggestions = async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/cities?search=${encodeURIComponent(input)}`);
      setSuggestions(response.data);
    } catch (error) {
      console.warn('Error fetching suggestions, falling back to local search:', error);
      // Fallback to local search if API fails
      const normalizedInput = normalizeString(input);
      const localFiltered = cities
        .filter(city => 
          city.normalizedName.includes(normalizedInput) || 
          city.normalizedCountry.includes(normalizedInput)
        )
        .slice(0, 10);
      setSuggestions(localFiltered);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (value && showDropdown) fetchSuggestions(value);
    }, 150); // Faster debounce for instant feel
    return () => clearTimeout(timer);
  }, [value, showDropdown]);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 rounded-[24px] blur-2xl group-focus-within:bg-primary/15 transition-all duration-500" />
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-6 h-6 text-subtext group-focus-within:text-primary transition-all duration-300" />
          <input 
            type="text"
            placeholder={placeholder}
            className="w-full h-20 pl-16 pr-14 bg-card/80 backdrop-blur-xl border border-white/5 rounded-[24px] text-white text-xl font-bold focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-2xl placeholder:text-subtext/50"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          <div className="absolute right-6 flex items-center gap-3">
            {loading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : value ? (
              <button 
                onClick={() => onChange('')}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-subtext" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] z-50 overflow-hidden ios-shadow"
          >
            <div className="p-2 max-h-[400px] overflow-y-auto scroll-hide">
              {suggestions.length > 0 ? (
                suggestions.map((s, idx) => (
                  <motion.button
                    key={`${s.name}-${s.lat}-${s.lng}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="w-full p-5 flex items-center gap-5 hover:bg-white/5 transition-all rounded-2xl text-left group"
                    onClick={() => {
                      onSelect(s);
                      addToHistory(`${s.name}, ${s.country}`);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-lg tracking-tight">{s.name}</span>
                      <span className="text-sm font-bold text-subtext uppercase tracking-widest text-[10px] mt-0.5">
                        {s.state ? `${s.state} — ` : ''}{s.country}
                      </span>
                    </div>
                  </motion.button>
                ))
              ) : !value && searchHistory.length > 0 ? (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <History className="w-4 h-4 text-subtext" />
                    <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Buscas Recentes</span>
                  </div>
                  {searchHistory.map((h, idx) => (
                    <button
                      key={idx}
                      className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-all rounded-xl text-left"
                      onClick={() => {
                        // For history, we might not have the full object, but we can search for it
                        const found = cities.find(c => `${c.name}, ${c.country}` === h);
                        if (found) {
                          onSelect(found);
                        } else {
                          onChange(h);
                        }
                        setShowDropdown(false);
                      }}
                    >
                      <MapPin className="w-4 h-4 text-subtext/50" />
                      <span className="text-white font-medium">{h}</span>
                    </button>
                  ))}
                </div>
              ) : value && !loading ? (
                <div className="p-10 text-center">
                  <p className="text-subtext font-bold">Nenhum destino encontrado</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

