import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Wallet, 
  Sparkles, 
  ChevronLeft, 
  ArrowRight, 
  Mountain, 
  Crown, 
  Users2, 
  Heart, 
  Zap,
  MapPin,
  Clock,
  Navigation,
  DollarSign
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { generateItinerary } from '../services/geminiService';
import { SearchDestino, CitySuggestion } from '../components/SearchDestino';
import { 
  MobileContainer, 
  AnimatedContainer, 
  NeonCard, 
  GlowButton 
} from '../components/MobileUI';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

const TRIP_TYPES = [
  { id: 'economic', label: 'Econômica', icon: <Wallet className="w-6 h-6" />, color: 'text-green-400' },
  { id: 'luxury', label: 'Luxo', icon: <Crown className="w-6 h-6" />, color: 'text-yellow-400' },
  { id: 'family', label: 'Família', icon: <Users2 className="w-6 h-6" />, color: 'text-blue-400' },
  { id: 'romantic', label: 'Romântica', icon: <Heart className="w-6 h-6" />, color: 'text-pink-400' },
  { id: 'adventure', label: 'Aventura', icon: <Mountain className="w-6 h-6" />, color: 'text-orange-400' },
];

export const PlanTripScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentTrip, setLoading, user } = useStore();
  
  const [destination, setDestination] = React.useState('');
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null);
  const [days, setDays] = React.useState(3);
  const [budget, setBudget] = React.useState(2000);
  const [type, setType] = React.useState<any>('economic');

  React.useEffect(() => {
    if (location.state) {
      const { destination: dest, budget: b, days: d } = location.state as any;
      if (dest) setDestination(dest);
      if (b) setBudget(b);
      if (d) setDays(d);
    }
  }, [location.state]);

  const handlePlanTrip = async () => {
    if (!destination) return;
    
    setLoading(true);
    try {
      const result = await generateItinerary(destination, days, budget, type);
      const tripData = {
        userId: user?.uid || 'anonymous',
        destination,
        lat: coords?.lat,
        lng: coords?.lng,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        budget,
        type,
        ...result,
        createdAt: new Date().toISOString(),
      };
      setCurrentTrip(tripData as any);
      useStore.getState().setBudget(budget); // Update global budget
      navigate('/results');
    } catch (error) {
      console.error('Error planning trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city: CitySuggestion) => {
    setDestination(`${city.name}, ${city.country}`);
    setCoords({ lat: city.lat, lng: city.lng });
  };

  return (
    <MobileContainer>
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 glass-card rounded-[18px] flex items-center justify-center border border-primary/20"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-[24px] font-black text-white tracking-tight">Novo Destino</h1>
      </div>

      <div className="flex flex-col gap-8 pb-32">
        {/* Destination */}
        <AnimatedContainer delay={0.1}>
          <div className="flex items-center gap-2 mb-4 ml-1">
            <MapPin className="w-4 h-4 text-primary" />
            <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em]">Destino Mundial</label>
          </div>
          <SearchDestino 
            value={destination}
            onChange={setDestination}
            onSelect={handleSelectCity}
            placeholder="Digite uma cidade ou país"
          />

          {coords && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 rounded-[24px] overflow-hidden border border-white/10 h-48 relative z-0"
            >
              <MapContainer 
                center={[coords.lat, coords.lng]} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <Marker position={[coords.lat, coords.lng]} />
                <ChangeView center={[coords.lat, coords.lng]} />
              </MapContainer>
              <div className="absolute bottom-4 right-4 z-[1000] bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatedContainer>

        {/* Duration & Budget */}
        <AnimatedContainer delay={0.2}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 ml-1">
                <Calendar className="w-4 h-4 text-primary" />
                <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em]">Duração</label>
              </div>
              <NeonCard className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <input 
                    type="number" 
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="bg-transparent text-white text-[20px] font-black w-full outline-none"
                    min="1"
                    max="30"
                  />
                  <span className="text-[10px] text-subtext font-black uppercase tracking-widest">Dias</span>
                </div>
              </NeonCard>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 ml-1">
                <Wallet className="w-4 h-4 text-accent" />
                <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em]">Orçamento</label>
              </div>
              <NeonCard className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-white text-[12px] font-black mr-1">R$</span>
                    <input 
                      type="number" 
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                      className="bg-transparent text-white text-[20px] font-black w-full outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-subtext font-black uppercase tracking-widest">Total</span>
                </div>
              </NeonCard>
            </div>
          </div>
        </AnimatedContainer>

        {/* Trip Style */}
        <AnimatedContainer delay={0.3}>
          <div className="flex items-center gap-2 mb-6 ml-1">
            <Navigation className="w-4 h-4 text-secondary" />
            <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em]">Estilo da Viagem</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TRIP_TYPES.map((t) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setType(t.id)}
                className={`p-6 rounded-[24px] flex flex-col items-center gap-4 border transition-all text-center relative overflow-hidden group ${
                  type === t.id 
                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(0,229,255,0.2)]' 
                    : 'glass-card border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                  type === t.id ? 'bg-primary/20 text-primary' : 'bg-white/5 ' + t.color
                }`}>
                  {t.icon}
                </div>
                <span className={`font-black text-[13px] tracking-tight ${type === t.id ? 'text-white' : 'text-subtext'}`}>
                  {t.label}
                </span>
              </motion.button>
            ))}
          </div>
        </AnimatedContainer>

        {/* Action Button */}
        <AnimatedContainer delay={0.4}>
          <GlowButton 
            onClick={handlePlanTrip}
            className="h-20"
          >
            <Sparkles className="w-6 h-6 animate-pulse-glow" />
            <span className="text-[18px]">GERAR ROTEIRO DE VIAGEM</span>
            <ArrowRight className="w-5 h-5" />
          </GlowButton>
        </AnimatedContainer>
      </div>
    </MobileContainer>
  );
};
