import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import { HotelResults } from '../components/hotels/HotelResults';

export const HotelScreen: React.FC = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');

  return (
    <div className="min-h-screen bg-[#020617] pb-32 overflow-y-auto no-scrollbar pt-safe relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-secondary/10 rounded-b-[40px] blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-safe z-10 relative">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-widest uppercase">Redes Oficiais</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="px-6 space-y-8 mt-4 z-10 relative">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-colors h-14">
          <MapPin className="text-secondary mr-3 flex-shrink-0" size={20} />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Digite seu destino de hospedagem..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 font-medium"
          />
        </div>

        {destination.length > 2 ? (
          <HotelResults destination={destination} />
        ) : (
          <div className="text-center py-10 opacity-50">
            <p className="text-sm">Digite a cidade acima para mostrar as opções.</p>
          </div>
        )}
      </div>
    </div>
  );
};
