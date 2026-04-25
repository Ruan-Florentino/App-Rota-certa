import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Flame } from 'lucide-react';
import { searchAirports, Airport } from '../../data/airports';

interface AirportAutocompleteProps {
  label: string;
  icon: React.ReactNode;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
}

export function AirportAutocomplete({ 
  label, 
  icon, 
  value, 
  onChange, 
  placeholder 
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : '');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Sync internal search field with external value
  useEffect(() => {
    if (value) {
      setQuery(`${value.city} (${value.code})`);
    } else {
      setQuery('');
    }
  }, [value]);

  useEffect(() => {
    // Only search if we're not just displaying the currently selected value
    if (!value || query !== `${value.city} (${value.code})`) {
        const res = searchAirports(query);
        setResults(res);
    } else if (!query) {
        const res = searchAirports('');
        setResults(res);
    }
  }, [query, value]);
  
  const selectAirport = (airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.city} (${airport.code})`);
    setOpen(false);
    inputRef.current?.blur();
  };
  
  return (
    <div className="relative w-full">
      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">{label}</label>
      
      <div className={`relative flex items-center bg-white/5 border ${focused ? 'border-primary' : 'border-white/10'} rounded-xl px-4 py-3 transition-colors h-14`}>
        <div className="text-primary mr-3 flex-shrink-0">
            {icon}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (value) onChange(null); // Clear selection if typing
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
            if (!query) {
              setResults(searchAirports(''));
            }
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setOpen(false), 200);
          }}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20 font-medium"
        />
        
        {query && (
          <button 
            className="text-white/40 hover:text-white transition-colors ml-2 flex-shrink-0 p-1"
            onClick={(e) => {
              e.preventDefault();
              setQuery('');
              onChange(null);
              inputRef.current?.focus();
              setOpen(true);
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            className="absolute left-0 right-0 top-[calc(100%+8px)] bg-[#0f172a] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 max-h-[300px] overflow-y-auto no-scrollbar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {!query && (
              <div className="text-xs font-bold tracking-wider text-white/40 uppercase mb-2 px-3 pt-2 flex items-center gap-1.5 flex-shrink-0">
                <Star size={12} /> Populares
              </div>
            )}
            
            {results.map((airport, i) => (
              <motion.button
                key={airport.code}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 rounded-xl transition-colors group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={(e) => {
                    e.preventDefault();
                    selectAirport(airport);
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg shadow-sm border border-white/5 pb-0.5">
                  {getCountryFlag(airport.countryCode)}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">{airport.city}</span>
                    <span className="text-xs font-bold text-primary px-1.5 py-0.5 rounded-md bg-primary/10">
                        {airport.code}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    {airport.name} · {airport.country}
                  </div>
                </div>
                {airport.popular && (
                  <Flame size={16} className="text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getCountryFlag(code: string): string {
  const OFFSET = 127397;
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(char.charCodeAt(0) + OFFSET))
    .join('');
}
