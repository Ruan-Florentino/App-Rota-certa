import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Info, Crown, Search } from 'lucide-react';
import { Airline } from '../../data/airlines';
import { AirlineLogo } from '../airline/AirlineLogo';
import { Airport } from '../../data/airports';
import { trackEvent } from '../../services/analyticsService';
import { toast } from 'sonner';

interface AirlineResultsProps {
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

// Dummy suggestion for demo until advanced suggestion engine is available
export function AirlineResults({ 
  origin, 
  destination, 
  departureDate, 
  returnDate, 
  passengers 
}: AirlineResultsProps) {
  const suggested: Airline[] = [
    { code: 'LA', name: 'LATAM Airlines', country: 'Brasil', color: '#ED1651', logo: '' },
    { code: 'G3', name: 'GOL Linhas Aéreas', country: 'Brasil', color: '#FF6B00', logo: '' },
    { code: 'AD', name: 'Azul Linhas Aéreas', country: 'Brasil', color: '#0077C8', logo: '' }
  ];
  
  const handleAirlineClick = (airline: Airline) => {
    // Analytics
    trackEvent('flight_search_airline_click', {
      airline: airline.code,
      route: `${origin.code}-${destination.code}`,
    });
    
    // Abre Google Flights em nova aba provisoriamente
    const url = `https://www.google.com/travel/flights?q=Flights%20to%20${destination.city}%20from%20${origin.city}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    
    toast.success(`Redirecionando pesquisa para ${airline.name}`, {
      icon: <ExternalLink size={16} />,
    });
  };
  
  return (
    <motion.div
      className="mt-8 pt-8 border-t border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-1 text-center md:text-left md:flex-row md:items-end md:justify-between">
        <div>
            <h3 className="section-title flex items-center justify-center md:justify-start gap-2">
            ✈️ Voos diretos oficiais
            </h3>
            <p className="text-sm text-white/50 mt-1">
            Recomendamos estas companhias para a rota {origin.code} ➔ {destination.code}.
            </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/30 uppercase">
            <Crown size={12} /> Melhor preço garantido
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggested.map((airline, i) => (
          <motion.button
            key={airline.code}
            className="group relative flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAirlineClick(airline)}
            style={{ '--airline-color': airline.color } as any}
          >
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                style={{ background: `linear-gradient(135deg, ${airline.color}, transparent)` }} 
            />

            <div className="flex items-center gap-4 relative z-10">
                <AirlineLogo airline={airline.code} size="md" variant="rounded" />
                <div className="flex flex-col">
                    <h4 className="font-bold text-white tracking-tight">{airline.name}</h4>
                    <span className="text-[10px] tracking-widest text-white/40 uppercase font-black">{airline.country}</span>
                </div>
            </div>

            <div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors"
                style={{ backgroundColor: `${airline.color}20`, color: airline.color }}
            >
                <Search size={16} />
            </div>
            
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
