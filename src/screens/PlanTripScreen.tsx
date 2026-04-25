import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Building2,
  Sparkles,
  ChevronLeft,
  Loader2,
  CheckCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { generateItinerary } from '../services/geminiService';
import { trackEvent } from '../services/analyticsService';
import { MobileContainer, GlowButton } from '../components/MobileUI';
import { useSubscription } from '../services/subscriptionService';
import { useGenerationContext } from '../hooks/useGenerationContext';
import { AirportAutocomplete } from '../components/flights/AirportAutocomplete';
import { Airport } from '../data/airports';
import { hotelChains, suggestHotelChains } from '../data/hotelBrands';
import { toast } from 'sonner';

import { AirlineLogo } from '../components/airline/AirlineLogo';

export const PlanTripScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentTrip, setLoading, user, budget } = useStore(
    useShallow((s) => ({
      setCurrentTrip: s.setCurrentTrip,
      setLoading: s.setLoading,
      user: s.user,
      budget: s.budget
    }))
  );
  const { canGenerate, useGeneration } = useSubscription();
  const genContext = useGenerationContext();
  
  // Step Management
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // Trip Data
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [economyMode, setEconomyMode] = useState(false);

  useEffect(() => {
    if (location.state && location.state.destination) {
      setDestination(location.state.destination);
    }
  }, [location.state]);

  const handleNext = () => {
    if (step === 1) {
      if (!origin || !destination || !departureDate || !returnDate) {
        toast.error('Preencha os dados básicos: origem, destino e datas.');
        return;
      }
      if (!canGenerate()) {
        navigate('/upgrade');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      generateTrip();
    }
  };

  const generateTrip = async () => {
    if (!destination) return;
    
    setIsGenerating(true);
    setLoadingMsg('Estudando seu destino...');
    
    try {
      setLoading(true);
      
      const tripBudget = budget > 0 ? budget : 5000;
      const type = economyMode ? 'economic' : 'luxury';
      
      const days = Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / (1000 * 60 * 60 * 24)));
      
      setLoadingMsg('Construindo o roteiro de ponta a ponta...');
      
      const result = await generateItinerary(destination.city, days, tripBudget, type, economyMode, genContext);
      
      useGeneration();
      
      const tripData = {
        userId: user?.uid || 'anonymous',
        destination: destination.city,
        startDate: departureDate,
        endDate: returnDate,
        budget: tripBudget,
        type: type,
        ...result,
        createdAt: new Date().toISOString(),
        economyMode
      };
      
      trackEvent('trip_flow_completed', { 
        destination: destination.city, 
        days 
      });
      
      setCurrentTrip(tripData as any);
      navigate('/results');
      
    } catch (error: any) {
      console.error('Error generating trip:', error);
      toast.error('Erro ao montar viagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  // UI Renderers
  const renderStep1 = () => (
    <motion.div 
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <AirportAutocomplete
          label="Partindo de"
          icon={<Plane className="text-white/50" />}
          value={origin}
          onChange={setOrigin}
          placeholder="Aeroporto ou cidade (ex: GRU)"
        />
        <AirportAutocomplete
          label="Indo para"
          icon={<MapPin className="text-white/50" />}
          value={destination}
          onChange={setDestination}
          placeholder="Destino final (ex: CDG, Paris)"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Ida</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-14">
            <Calendar className="text-primary mr-3 flex-shrink-0" size={20} />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-transparent border-none outline-none text-white w-full uppercase text-sm tracking-wider [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Volta</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-14">
            <Calendar className="text-primary mr-3 flex-shrink-0" size={20} />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departureDate || new Date().toISOString().split('T')[0]}
              className="bg-transparent border-none outline-none text-white w-full uppercase text-sm tracking-wider [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Passageiros</label>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-14">
          <Users className="text-primary mr-3 flex-shrink-0" size={20} />
          <input
            type="number"
            min={1}
            max={9}
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
            className="bg-transparent border-none outline-none text-white w-full text-center font-bold"
          />
        </div>
      </div>
      
      <div 
        onClick={() => setEconomyMode(!economyMode)}
        className={`mt-2 p-4 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${economyMode ? 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${economyMode ? 'bg-primary text-background' : 'bg-white/10 text-white/40'}`}>
          <Sparkles className={`w-6 h-6 ${economyMode ? 'fill-current' : ''}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold ${economyMode ? 'text-primary' : 'text-white'}`}>Modo Economia</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${economyMode ? 'bg-primary' : 'bg-white/10'}`}>
              <motion.div 
                animate={{ x: economyMode ? 20 : 2 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-lg"
              />
            </div>
          </div>
          <p className="text-[10px] text-white/40 font-medium leading-relaxed mt-0.5">
            Otimiza a viagem com foco máximo em custo-benefício.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => {
    const airlines = [
        { code: 'LA', name: 'LATAM Airlines', country: 'Brasil', color: '#ED1651', logo: '', alliance: 'Direto' },
        { code: 'G3', name: 'GOL Linhas Aéreas', country: 'Brasil', color: '#FF6B00', logo: '', alliance: 'Direto' },
        { code: 'AD', name: 'Azul Linhas Aéreas', country: 'Brasil', color: '#0077C8', logo: '', alliance: 'Direto' }
    ];
    return (
      <motion.div 
        key="step-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-6"
      >
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-center">
          <Plane className="text-primary w-8 h-8 shrink-0" />
          <p className="text-sm text-primary/90 font-medium leading-tight">
            Para <strong>{destination?.city}</strong>, recomendamos fechar voos direto nestas companhias oficiais, fugindo das taxas ocultas.
          </p>
        </div>
        
        <div className="space-y-3">
          {airlines.map((airline, i) => (
            <div key={i} className="flex bg-white/5 border border-white/10 rounded-xl p-3 items-center justify-between hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                 <AirlineLogo airline={airline.code} size="md" variant="rounded" />
                <div>
                  <p className="text-white font-bold text-sm tracking-tight">{airline.name}</p>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{airline.alliance || 'Direto'}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const url = `https://www.google.com/travel/flights?q=Flights%20to%20${destination!.city}%20from%20${origin!.city}`;
                  window.open(url, '_blank');
                  trackEvent('flight_book_flow', { airline: airline.code });
                }}
                className="h-8 px-3 rounded-md bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary hover:text-background transition-all"
              >
                Buscar <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderStep3 = () => {
    const chains = suggestHotelChains(economyMode ? 'economic' : 'mid');
    return (
      <motion.div 
        key="step-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-6"
      >
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex gap-4 items-center">
          <Building2 className="text-secondary w-8 h-8 shrink-0" />
          <p className="text-sm text-secondary/90 font-medium leading-tight">
            Antes de montarmos seu roteiro, confira as redes oficiais com a melhor cotação em <strong>{destination?.city}</strong>.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {chains.map((chain, i) => (
            <div key={i} className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-4 gap-3 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-colors" style={{ backgroundColor: chain.color }} />
              
              <div className="w-12 h-12 bg-white rounded-xl shadow-lg border border-black/5 flex items-center justify-center p-2 mb-1 z-10 shrink-0">
                  <img src={chain.logo} alt={chain.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              
              <div className="z-10 flex-1">
                <p className="text-white font-bold text-sm tracking-tight">{chain.name}</p>
                 <p className="text-white/40 text-[9px] mt-1 leading-snug">{chain.description}</p>
              </div>
              
              <button 
                onClick={() => {
                  window.open(chain.bookingUrl(destination!.city), '_blank');
                  trackEvent('hotel_chain_book_flow', { chain: chain.id });
                }}
                className="w-full mt-auto h-8 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-white hover:text-black transition-all z-10 border border-white/5"
              >
                Oficial <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderGenerating = () => (
    <motion.div
      key="loading-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full gap-8 py-20"
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
        <div className="absolute inset-2 border-4 border-secondary/40 rounded-full animate-spin-slow" />
        <div className="absolute inset-4 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.5)]">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-2xl font-bold text-white">
          Sintetizando tudo...
        </h3>
        <p className="text-white/60 animate-pulse">
          {loadingMsg}
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3 mt-8">
        <LoadingStep icon={<Plane />} text="Estruturando Voos Oficiais" active={true} />
        <LoadingStep icon={<Building2 />} text="Vinculando Hospedagem" active={loadingMsg.includes('roteiro')} />
        <LoadingStep icon={<CheckCircle2 />} text="Geração de Roteiro IA" active={loadingMsg.includes('roteiro')} />
      </div>
    </motion.div>
  );

  return (
    <MobileContainer>
      <div className="flex items-center justify-between py-6">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
          Fluxo de Planejamento <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full">{step}/3</span>
        </span>
      </div>

      <div className="flex flex-col flex-1 pb-32">
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div key="content" className="flex flex-col h-full">
              
              <div className="mb-6">
                <h2 className="text-3xl font-black tracking-tight text-white">
                  {step === 1 && "Start."}
                  {step === 2 && "Voos."}
                  {step === 3 && "Hospedagem."}
                </h2>
                <p className="text-white/50 text-sm mt-1 mb-2">
                  {step === 1 && "Defina a base da sua viagem de ponta a ponta."}
                  {step === 2 && "Links diretos das companhias para evitar taxas."}
                  {step === 3 && "Opções oficiais baseadas no seu perfil."}
                </p>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-secondary" 
                    initial={{ width: `${((step-1)/3)*100}%` }}
                    animate={{ width: `${(step/3)*100}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <GlowButton 
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {step === 3 ? "Gerar Roteiro c/ IA" : "Continuar"}
                  {step === 3 ? <Sparkles size={18} /> : <ArrowRight size={18} />}
                </GlowButton>
                {step > 1 && step < 4 && (
                  <button 
                    onClick={() => step === 2 ? setStep(3) : generateTrip()}
                    className="w-full h-12 flex items-center justify-center text-white/40 text-xs font-bold uppercase tracking-wider mt-2 hover:text-white transition-colors"
                  >
                    Pular etapa
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            renderGenerating()
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  );
};

const LoadingStep = ({ icon, text, active }: { icon: React.ReactNode, text: string, active: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${active ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-primary/20 text-primary' : 'bg-white/5'}`}>
      {active ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    </div>
    <span className="text-sm font-medium">{text}</span>
  </div>
);
