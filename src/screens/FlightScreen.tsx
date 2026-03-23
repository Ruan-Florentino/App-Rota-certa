import React from 'react';
import { 
  Plane, 
  ChevronLeft, 
  ArrowRight, 
  Clock, 
  Calendar,
  MapPin,
  Search,
  Filter,
  ArrowRightLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { searchFlights, FlightOffer } from '../services/flightService';
import { getAirlineLogo } from '../services/imageService';
import { 
  MobileContainer, 
  AnimatedContainer, 
  NeonCard, 
  GlowButton 
} from '../components/MobileUI';
import { motion, AnimatePresence } from 'motion/react';

export const FlightScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentTrip, setCurrentTrip, setLoading, budget } = useStore();
  const [flights, setFlights] = React.useState<FlightOffer[]>([]);
  const [origin, setOrigin] = React.useState('SAO'); // Default GRU/CGH
  const [destination, setDestination] = React.useState('');
  const [date, setDate] = React.useState('');

  const flightBudget = budget * 0.4; // 40% for flights as per logic

  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  React.useEffect(() => {
    if (currentTrip) {
      setDestination(currentTrip.destination.split(',')[0].substring(0, 3).toUpperCase()); // Mock IATA
      setDate(currentTrip.startDate.split('T')[0]);
    }
  }, [currentTrip]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchFlights(origin, destination, date);
      setFlights(results);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: FlightOffer) => {
    if (!currentTrip) return;
    
    const updatedTrip = { ...currentTrip };
    if (!updatedTrip.flights) updatedTrip.flights = [];
    
    // Convert FlightOffer to Flight
    const newFlight = {
      airline: flight.airline,
      price: flight.price,
      duration: flight.duration,
      stops: flight.stops,
      times: `${flight.departureTime} - ${flight.arrivalTime}`,
      logo: flight.logo,
      link: flight.link
    };

    updatedTrip.flights = [newFlight];
    setCurrentTrip(updatedTrip);
    useStore.getState().updateTripCosts({ transport: flight.price });
    navigate('/results');
  };

  return (
    <MobileContainer>
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 glass-card rounded-[18px] flex items-center justify-center border border-primary/20"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-[24px] font-black text-white tracking-tight">Voos Reais</h1>
      </div>

      <div className="flex flex-col gap-6 pb-32">
        {/* Search Form */}
        <AnimatedContainer delay={0.1}>
          <NeonCard className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Origem</label>
                <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Plane className="w-5 h-5 text-primary rotate-45" />
                  <input 
                    type="text" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    placeholder="GRU"
                    className="bg-transparent text-white font-black text-[18px] w-full outline-none"
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="mt-6">
                <ArrowRightLeft className="w-6 h-6 text-subtext opacity-30" />
              </div>
              <div className="flex-1 flex flex-col gap-2 text-right">
                <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Destino</label>
                <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.toUpperCase())}
                    placeholder="CDG"
                    className="bg-transparent text-white font-black text-[18px] w-full outline-none text-right"
                    maxLength={3}
                  />
                  <Plane className="w-5 h-5 text-accent -rotate-45" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Data de Partida</label>
              <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-white font-black text-[16px] w-full outline-none"
                />
              </div>
            </div>

            <GlowButton onClick={handleSearch} className="h-14 rounded-2xl">
              <Search className="w-5 h-5" />
              <span className="text-[14px]">BUSCAR VOOS AGORA</span>
            </GlowButton>
          </NeonCard>
        </AnimatedContainer>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {flights.map((flight, index) => {
              const logoUrl = getAirlineLogo(flight.airline);
              return (
                <AnimatedContainer key={index} delay={0.2 + index * 0.1}>
                  <NeonCard className="p-6 border-white/5 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center p-2 overflow-hidden">
                          {logoUrl ? (
                            <img 
                              src={logoUrl} 
                              alt={flight.airline} 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Plane className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-[18px] font-black text-white tracking-tight">{flight.airline}</h4>
                          <p className="text-[11px] font-black text-subtext uppercase tracking-widest">Direto</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[24px] font-black ${flight.price <= flightBudget ? 'text-secondary' : 'text-primary'}`}>
                          R$ {flight.price.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-[10px] font-black text-subtext uppercase tracking-widest">
                          {flight.price <= flightBudget ? 'Dentro do Orçamento' : 'Acima do Orçamento'}
                        </p>
                      </div>
                    </div>

                  <div className="flex items-center justify-between gap-8 relative">
                    <div className="flex-1">
                      <p className="text-[20px] font-black text-white">{flight.departureTime}</p>
                      <p className="text-[12px] font-bold text-subtext">{origin}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <p className="text-[10px] font-black text-subtext uppercase tracking-widest">{flight.duration}</p>
                      <div className="w-full h-[2px] bg-white/10 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(0,229,255,1)]" />
                      </div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {flight.stops === 0 ? 'Sem escalas' : `${flight.stops} escala${flight.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-[20px] font-black text-white">{flight.arrivalTime}</p>
                      <p className="text-[12px] font-bold text-subtext">{destination}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-subtext">
                      <Clock className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Check-in Online Disponível</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => openLink(flight.link)}
                        className="text-[10px] font-black text-secondary uppercase tracking-widest border border-secondary/30 px-3 py-1 rounded-full hover:bg-secondary/10 transition-all"
                      >
                        Ver no site
                      </button>
                      <button 
                        onClick={() => handleSelectFlight(flight)}
                        className="text-primary font-black text-[12px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all"
                      >
                        Selecionar <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </NeonCard>
              </AnimatedContainer>
            );
          })}
        </AnimatePresence>

          {flights.length === 0 && !date && (
            <div className="glass-card p-12 rounded-[32px] text-center border border-dashed border-white/10">
              <Plane className="w-12 h-12 text-subtext opacity-20 mx-auto mb-4" />
              <p className="text-subtext font-bold uppercase tracking-widest opacity-40">Busque voos para seu destino</p>
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
};
