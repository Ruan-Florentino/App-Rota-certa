import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  ArrowRightLeft, 
  Search, 
  Calendar, 
  Users
} from 'lucide-react';
import { Airport } from '../../data/airports';
import { AirportAutocomplete } from './AirportAutocomplete';
import { AirlineResults } from './AirlineResults';
import { toast } from 'sonner';

export function FlightSearch() {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      toast.error('Preencha origem, destino e data de ida para buscar.');
      return;
    }
    if (tripType === 'roundtrip' && !returnDate) {
      toast.error('Preencha a data de volta.');
      return;
    }
    setShowResults(true);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col">
      {/* Trip type toggle */}
      <div className="flex gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${tripType === 'roundtrip' ? 'bg-primary text-background shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
          onClick={() => {
            setTripType('roundtrip');
            setShowResults(false);
          }}
        >
          Ida e volta
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${tripType === 'oneway' ? 'bg-primary text-background shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
          onClick={() => {
            setTripType('oneway');
            setReturnDate('');
            setShowResults(false);
          }}
        >
          Só ida
        </button>
      </div>
      
      {/* Form */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6  flex flex-col gap-6 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-4 items-center w-full z-10">
            <AirportAutocomplete
                label="De onde?"
                icon={<Plane className="text-white/50" />}
                value={origin}
                onChange={(v) => { setOrigin(v); setShowResults(false); }}
                placeholder="Ex: São Paulo, GRU..."
            />
            
            {/* Swap button */}
            <button 
                className="mt-6 md:mt-6 w-10 h-10 shrink-0 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-background hover:scale-110 active:scale-95 transition-all shadow-lg"
                onClick={() => {
                    const temp = origin;
                    setOrigin(destination);
                    setDestination(temp);
                    setShowResults(false);
                }}
            >
                <ArrowRightLeft size={16} />
            </button>
            
            <AirportAutocomplete
                label="Para onde?"
                icon={<Plane className="text-white/50 rotate-90" />}
                value={destination}
                onChange={(v) => { setDestination(v); setShowResults(false); }}
                placeholder="Ex: Paris, CDG..."
            />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end w-full z-10">
          <div className="w-full flex-1">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Ida</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-14">
                <Calendar className="text-primary mr-3 flex-shrink-0" size={20} />
                <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => { setDepartureDate(e.target.value); setShowResults(false); }}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-transparent border-none outline-none text-white w-full uppercase text-sm tracking-wider [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
            </div>
          </div>
          
          <AnimatePresence>
            {tripType === 'roundtrip' && (
                <motion.div 
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, width: "100%", marginLeft: 0 }}
                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                    className="w-full flex-1 overflow-hidden"
                >
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Volta</label>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-14">
                        <Calendar className="text-primary mr-3 flex-shrink-0" size={20} />
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => { setReturnDate(e.target.value); setShowResults(false); }}
                            min={departureDate || new Date().toISOString().split('T')[0]}
                            className="bg-transparent border-none outline-none text-white w-full uppercase text-sm tracking-wider [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full md:w-32">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Passageiros</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-14">
                <Users className="text-primary mr-3 flex-shrink-0" size={20} />
                <input
                    type="number"
                    min={1}
                    max={9}
                    value={passengers}
                    onChange={(e) => { setPassengers(parseInt(e.target.value) || 1); setShowResults(false); }}
                    className="bg-transparent border-none outline-none text-white w-full text-center font-bold"
                />
            </div>
          </div>
          
          <motion.button
            className="w-full md:w-auto h-14 px-8 bg-primary text-background font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:pointer-events-none shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate)}
          >
            <Search size={18} />
            Buscar Voos
          </motion.button>
        </div>
      </div>
      
      {/* Results - Airlines oficiais */}
      <AnimatePresence>
        {showResults && origin && destination && (
          <AirlineResults
            origin={origin}
            destination={destination}
            departureDate={departureDate}
            returnDate={tripType === 'roundtrip' ? returnDate : undefined}
            passengers={passengers}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
