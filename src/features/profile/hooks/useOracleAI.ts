import { useState } from 'react';
import { useTripsStore } from '@/stores/tripsStore';
import { COUNTRIES } from '@/data/countries';

export interface Suggestion {
  countryName: string;
  countryCode: string;
  matchScore: number;
  reason: string;
  flag: string;
}

export function useOracleAI() {
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { trips } = useTripsStore();

  const generateDestinations = async () => {
    setIsThinking(true);
    
    // Simulate AI thinking time
    await new Promise(r => setTimeout(r, 2000));
    
    const unvisited = COUNTRIES.filter(
      c => !trips.find(t => t.countryCode === c.code && t.status === 'visited')
    );
    
    // Pick 3 random unvisited countries
    const shuffled = [...unvisited].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3);
    
    const formatted: Suggestion[] = picked.map((c, i) => ({
      countryName: c.name,
      countryCode: c.code,
      flag: c.flag,
      matchScore: Math.floor(Math.random() * 20) + 80, // 80 - 100
      reason: i === 0 ? "O destino perfeito para sua próxima aventura urbana." 
        : i === 1 ? "Com base na sua inclinação cultural." 
        : "Uma joia escondida que você vai adorar explorar."
    }));

    setSuggestions(formatted);
    setIsThinking(false);
  };

  return { isThinking, suggestions, generateDestinations };
}
