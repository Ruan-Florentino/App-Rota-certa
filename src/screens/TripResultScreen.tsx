import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  Share2, 
  Bookmark, 
  Clock, 
  DollarSign, 
  Sun, 
  Plane, 
  Hotel, 
  Navigation, 
  Info,
  Star,
  ArrowRight,
  Sparkles,
  Utensils,
  Camera,
  Bus,
  CheckCircle2,
  Globe,
  Languages,
  Coins,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getWeather, WeatherData } from '../services/weatherService';
import { getCityImage, getHotelImage, getPlaceImage, getAirlineLogo } from '../services/imageService';
import { AnimatedContainer, BlurCard } from '../components/MobileUI';

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

const createCustomIcon = (text: string, category?: string) => {
  const getIconHtml = () => {
    let iconClass = "w-3 h-3";
    let icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-3 h-3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
    
    if (category === 'restaurante') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils w-3 h-3"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';
    if (category === 'turismo') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera w-3 h-3"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>';
    if (category === 'transporte') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus w-3 h-3"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.1 19.1 5 18 5H4c-1.1 0-2.1 1.1-2.4 2.1l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="17" cy="18" r="2"/></svg>';

    return `
      <div class="relative -translate-x-1/2 -translate-y-full group">
        <div class="bg-[#00E5FF] text-white p-2 rounded-xl shadow-xl border-2 border-white flex items-center gap-2 whitespace-nowrap">
          ${icon}
          <span class="text-[10px] font-bold">${text}</span>
        </div>
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#00E5FF] mx-auto"></div>
      </div>
    `;
  };

  return L.divIcon({
    html: getIconHtml(),
    className: 'custom-div-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

export const TripResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentTrip, user, addTrip, toggleFavorite, favorites, setCurrentTrip } = useStore();
  const [weather, setWeather] = React.useState<WeatherData[]>([]);
  const [activeTab, setActiveTab] = React.useState<'itinerary' | 'flights' | 'hotels' | 'info'>('itinerary');
  const [saving, setSaving] = React.useState(false);
  const [heroImage, setHeroImage] = React.useState('');

  React.useEffect(() => {
    if (currentTrip) {
      getWeather(currentTrip.destination).then(setWeather);
      getCityImage(currentTrip.destination).then(setHeroImage);

      // Fetch images for hotels and activities if they don't have real ones
      const fetchImages = async () => {
        let changed = false;
        const updatedTrip = { ...currentTrip };

        if (currentTrip.hotels && currentTrip.hotels.length > 0) {
          const updatedHotels = await Promise.all(currentTrip.hotels.map(async (hotel) => {
            if (!hotel.image || hotel.image.includes('placeholder') || hotel.image.includes('images.unsplash.com/photo-1500000000000')) {
              const image = await getHotelImage(hotel.name, currentTrip.destination);
              if (image !== hotel.image) changed = true;
              return { ...hotel, image };
            }
            return hotel;
          }));
          updatedTrip.hotels = updatedHotels;
        }

        // Fetch images for activities
        const updatedItinerary = await Promise.all(currentTrip.itinerary.map(async (day) => {
          const updatedActivities = await Promise.all(day.activities.map(async (act) => {
            if (!act.image) {
              const image = await getPlaceImage(act.activity, currentTrip.destination);
              changed = true;
              return { ...act, image };
            }
            return act;
          }));
          return { ...day, activities: updatedActivities };
        }));
        updatedTrip.itinerary = updatedItinerary;
        
        if (changed) {
          setCurrentTrip(updatedTrip);
        }
      };
      fetchImages();
    }
  }, [currentTrip, setCurrentTrip]);

  if (!currentTrip) {
    navigate('/');
    return null;
  }

  const isFavorite = currentTrip.id ? favorites.includes(currentTrip.id) : false;
  
  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleSave = async () => {
    if (!user) {
      alert('Por favor, faça login para salvar sua viagem.');
      return;
    }
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...currentTrip,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      addTrip({ ...currentTrip, id: docRef.id });
      alert('Viagem salva com sucesso!');
      navigate('/saved');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Erro ao salvar viagem.');
    } finally {
      setSaving(false);
    }
  };

  const mapCenter: [number, number] = currentTrip.lat && currentTrip.lng 
    ? [currentTrip.lat, currentTrip.lng]
    : currentTrip.itinerary[0]?.activities[0]?.location 
      ? [currentTrip.itinerary[0].activities[0].location.lat, currentTrip.itinerary[0].activities[0].location.lng]
      : [-12.9714, -38.5014];

  return (
    <div className="flex flex-col gap-8 -mt-6 -mx-4">
      {/* Header Over Map */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none max-w-[420px] mx-auto">
        <button 
          onClick={() => navigate('/plan')}
          className="w-12 h-12 glass-card rounded-[20px] flex items-center justify-center pointer-events-auto hover:bg-white/10 transition-all active:scale-95 ios-shadow"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => openLink('https://www.latam.com')}
            className="px-4 h-12 glass-card rounded-[20px] flex items-center justify-center pointer-events-auto hover:bg-white/10 transition-all active:scale-95 ios-shadow text-[10px] font-black text-white uppercase tracking-widest"
          >
            Teste Link
          </button>
          <button className="w-12 h-12 glass-card rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 ios-shadow">
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => currentTrip.id && toggleFavorite(currentTrip.id)}
            className={`w-12 h-12 glass-card rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 ios-shadow ${isFavorite ? 'text-red-500' : 'text-white'}`}
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-12 h-12 glass-card rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 ios-shadow disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-[45vh] w-full relative overflow-hidden rounded-b-[40px] ios-shadow z-0">
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt={currentTrip.destination} 
              className="w-full h-full object-cover opacity-30 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
          </div>
        )}
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {currentTrip.itinerary.map((day) => 
            day.activities.map((act, idx) => act.location && (
              <Marker 
                key={`${day.day}-${idx}`}
                position={[act.location.lat, act.location.lng]}
                icon={createCustomIcon(act.activity, act.category)}
              >
                <Popup>
                  <div className="font-bold">{act.activity}</div>
                  <div className="text-xs">{act.description}</div>
                </Popup>
              </Marker>
            ))
          )}
          <ChangeView center={mapCenter} />
        </MapContainer>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-[1000] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="px-4 space-y-8">
        {/* Title Card */}
        <AnimatedContainer delay={0.1}>
          <BlurCard className="rounded-[32px] ios-shadow">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Roteiro de Viagem Personalizado</span>
            </div>
            <h1 className="text-[32px] font-black text-white tracking-tighter leading-tight mb-4">{currentTrip.destination}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-subtext text-[12px] font-bold">
                <Calendar className="w-4 h-4" />
                <span>{currentTrip.itinerary.length} Dias</span>
              </div>
              <div className="flex items-center gap-2 text-subtext text-[12px] font-bold">
                <DollarSign className="w-4 h-4" />
                <span>R$ {currentTrip.budget}</span>
              </div>
              <div className="flex items-center gap-2 text-subtext text-[12px] font-bold">
                <Navigation className="w-4 h-4" />
                <span className="capitalize">{currentTrip.type}</span>
              </div>
            </div>
          </BlurCard>
        </AnimatedContainer>

        {/* Budget Summary */}
        <AnimatedContainer delay={0.25}>
          <BlurCard className="rounded-[32px] ios-shadow bg-secondary/5 border-secondary/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-black text-white tracking-tight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-secondary" />
                Resumo do Orçamento
              </h2>
              <div className="text-right">
                <span className="text-[24px] font-black text-secondary tracking-tighter">R$ {currentTrip.costs?.total || 0}</span>
                <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Total Estimado</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Plane className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">Voos</span>
                </div>
                <span className="text-white font-black text-[16px]">R$ {currentTrip.costs?.transport || 0}</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Hotel className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">Hospedagem</span>
                </div>
                <span className="text-white font-black text-[16px]">R$ {currentTrip.costs?.hotel || 0}</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Utensils className="w-3 h-3 text-orange-400" />
                  <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">Alimentação</span>
                </div>
                <span className="text-white font-black text-[16px]">R$ {currentTrip.costs?.food || 0}</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">Atividades</span>
                </div>
                <span className="text-white font-black text-[16px]">R$ {currentTrip.costs?.activities || 0}</span>
              </div>
            </div>
          </BlurCard>
        </AnimatedContainer>

        {/* Weather Section */}
        {weather.length > 0 && (
          <AnimatedContainer delay={0.2}>
            <h2 className="text-[18px] font-bold text-white mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-accent" />
              Clima na Viagem
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scroll-hide -mx-4 px-4">
              {weather.map((w, idx) => (
                <div key={idx} className="glass-card p-4 rounded-[24px] min-w-[100px] flex flex-col items-center gap-2 ios-shadow">
                  <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">{w.date}</span>
                  <img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`} alt="weather" className="w-10 h-10" />
                  <span className="text-[16px] font-black text-white">{w.temp}°C</span>
                </div>
              ))}
            </div>
          </AnimatedContainer>
        )}

        {/* Tabs */}
        <AnimatedContainer delay={0.3}>
          <div className="flex p-1 bg-white/5 rounded-[20px] border border-white/5 overflow-x-auto scroll-hide">
            {[
              { id: 'itinerary', label: 'Roteiro', icon: <Clock className="w-4 h-4" /> },
              { id: 'flights', label: 'Voos', icon: <Plane className="w-4 h-4" /> },
              { id: 'hotels', label: 'Hotéis', icon: <Hotel className="w-4 h-4" /> },
              { id: 'info', label: 'Info', icon: <Info className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[90px] h-12 rounded-[16px] flex items-center justify-center gap-2 font-bold text-[12px] transition-all active:scale-95 ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-subtext hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedContainer>

        {/* Tab Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'itinerary' && (
              <motion.div 
                key="itinerary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {currentTrip.itinerary.map((day, dIdx) => (
                  <div key={day.day} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-[16px] flex items-center justify-center text-primary font-black text-[20px]">
                        {day.day}
                      </div>
                      <h3 className="text-[22px] font-black text-white tracking-tight">Dia {day.day}</h3>
                    </div>
                    
                    <div className="space-y-4 ml-6 border-l-2 border-white/5 pl-8 py-2">
                      {day.activities.map((act, aIdx) => (
                        <div key={aIdx} className="glass-card p-6 rounded-[24px] relative ios-shadow">
                          <div className="absolute -left-[41px] top-8 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                              {act.time}
                            </span>
                            <span className="text-[11px] font-bold text-subtext">{act.duration}</span>
                          </div>
                          <h4 className="text-[16px] font-bold text-white mb-2 leading-tight">{act.activity}</h4>
                          {act.image && (
                            <div className="h-32 w-full rounded-xl overflow-hidden mb-3">
                              <img src={act.image} alt={act.activity} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <p className="text-[13px] text-subtext leading-relaxed mb-4">{act.description}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-secondary font-bold">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-[14px]">R$ {act.cost}</span>
                            </div>
                            <button className="text-primary text-[11px] font-bold flex items-center gap-1">
                              Ver no mapa <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'flights' && (
              <motion.div 
                key="flights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-[24px] border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                      <Plane className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-black text-white tracking-tight">Voos em Tempo Real</h4>
                      <p className="text-[11px] font-bold text-subtext uppercase tracking-widest">Encontre as melhores ofertas agora</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/flights')}
                    className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    BUSCAR VOOS REAIS <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {currentTrip.flights?.map((flight, idx) => {
                  const logoUrl = getAirlineLogo(flight.airline);
                  return (
                    <div key={idx} className="glass-card p-6 rounded-[24px] flex flex-col gap-4 ios-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                            {logoUrl ? (
                              <img 
                                src={logoUrl} 
                                alt={flight.airline} 
                                className="w-8 h-8 object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Plane className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-[14px]">{flight.airline}</h4>
                            <span className="text-[11px] text-subtext">{flight.times}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[18px] font-black text-secondary">R$ {flight.price}</span>
                          <p className="text-[10px] text-subtext uppercase font-bold tracking-widest">Ida e Volta</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-subtext border-t border-white/5 pt-4">
                        <span>Duração: {flight.duration}</span>
                        <button 
                          onClick={() => openLink(flight.link)}
                          className="text-secondary font-black uppercase tracking-widest hover:underline"
                        >
                          Ver no site
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'hotels' && (
              <motion.div 
                key="hotels"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-[24px] border border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                      <Hotel className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-black text-white tracking-tight">Hotéis em Tempo Real</h4>
                      <p className="text-[11px] font-bold text-subtext uppercase tracking-widest">Reserve as melhores estadias</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/hotels')}
                    className="w-full h-14 bg-accent text-white font-black rounded-2xl shadow-lg shadow-accent/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    BUSCAR HOTÉIS REAIS <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {currentTrip.hotels?.map((hotel, idx) => (
                  <div key={idx} className="glass-card rounded-[32px] overflow-hidden group ios-shadow">
                    <div className="h-48 relative overflow-hidden">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[11px] font-bold text-white">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[18px] font-bold text-white leading-tight">{hotel.name}</h4>
                        <div className="flex gap-0.5">
                          {[...Array(hotel.stars)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-subtext text-[12px] mb-4">
                        <MapPin className="w-3 h-3" />
                        <span>{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <span className="text-[20px] font-black text-secondary">R$ {hotel.price}</span>
                          <span className="text-[11px] text-subtext font-medium"> / noite</span>
                        </div>
                        <button 
                          onClick={() => openLink(hotel.link)}
                          className="bg-secondary/20 px-6 h-12 rounded-[16px] font-bold text-secondary text-[12px] shadow-lg shadow-secondary/10 active:scale-95 transition-all"
                        >
                          Ver no Airbnb
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-6 rounded-[24px] flex flex-col gap-2 ios-shadow">
                    <Sun className="w-6 h-6 text-accent" />
                    <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Melhor Época</span>
                    <span className="text-white font-bold text-[14px]">{currentTrip.info?.bestTime || 'N/A'}</span>
                  </div>
                  <div className="glass-card p-6 rounded-[24px] flex flex-col gap-2 ios-shadow">
                    <Globe className="w-6 h-6 text-primary" />
                    <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Fuso Horário</span>
                    <span className="text-white font-bold text-[14px]">{currentTrip.info?.timezone || 'N/A'}</span>
                  </div>
                  <div className="glass-card p-6 rounded-[24px] flex flex-col gap-2 ios-shadow">
                    <Languages className="w-6 h-6 text-secondary" />
                    <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Idioma</span>
                    <span className="text-white font-bold text-[14px]">{currentTrip.info?.language || 'N/A'}</span>
                  </div>
                  <div className="glass-card p-6 rounded-[24px] flex flex-col gap-2 ios-shadow">
                    <Coins className="w-6 h-6 text-yellow-500" />
                    <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Moeda</span>
                    <span className="text-white font-bold text-[14px]">{currentTrip.info?.currency || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-[24px] ios-shadow">
                  <h4 className="text-white font-bold mb-4 text-[16px]">Dicas de Viagem</h4>
                  <ul className="space-y-3">
                    {currentTrip.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[13px] text-subtext">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Budget Summary */}
        <AnimatedContainer delay={0.4}>
          <section className="pb-12">
            <h2 className="text-[18px] font-bold text-white mb-6">Resumo de Custos (Estimado)</h2>
            <div className="glass-card p-8 rounded-[32px] space-y-4 ios-shadow">
              {[
                { label: 'Voos', value: currentTrip.costs.transport, icon: <Plane className="w-4 h-4" /> },
                { label: 'Hospedagem', value: currentTrip.costs.hotel, icon: <Hotel className="w-4 h-4" /> },
                { label: 'Alimentação', value: currentTrip.costs.food, icon: <DollarSign className="w-4 h-4" /> },
                { label: 'Atividades', value: currentTrip.costs.activities, icon: <Sparkles className="w-4 h-4" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-subtext">
                    {item.icon}
                    <span className="font-medium text-[14px]">{item.label}</span>
                  </div>
                  <span className="font-bold text-white text-[14px]">R$ {item.value}</span>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[18px] font-black text-white">Total Estimado</span>
                <span className="text-[24px] font-black text-secondary">R$ {currentTrip.costs.total}</span>
              </div>
              <div className="bg-primary/5 p-4 rounded-[16px] flex items-start gap-3 mt-6">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-subtext leading-relaxed">
                  Os valores são estimativas baseadas no seu orçamento e preferências. Preços reais podem variar.
                </p>
              </div>
            </div>
          </section>
        </AnimatedContainer>
        {/* Quick Actions */}
        <AnimatedContainer delay={0.5}>
          <div className="grid grid-cols-2 gap-4 pb-12">
            <button 
              onClick={() => navigate('/plan')}
              className="glass-card p-6 rounded-[24px] flex flex-col items-center gap-3 hover:bg-white/10 transition-all active:scale-95 ios-shadow group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[12px] font-black text-white uppercase tracking-widest">Refazer Roteiro</span>
            </button>
            <button 
              onClick={() => navigate('/expenses')}
              className="glass-card p-6 rounded-[24px] flex flex-col items-center gap-3 hover:bg-white/10 transition-all active:scale-95 ios-shadow group"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[12px] font-black text-white uppercase tracking-widest">Ajustar Orçamento</span>
            </button>
            <button 
              onClick={() => navigate('/hotels')}
              className="glass-card p-6 rounded-[24px] flex flex-col items-center gap-3 hover:bg-white/10 transition-all active:scale-95 ios-shadow group"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                <Hotel className="w-6 h-6" />
              </div>
              <span className="text-[12px] font-black text-white uppercase tracking-widest">Trocar Hotel</span>
            </button>
            <button 
              onClick={() => navigate('/flights')}
              className="glass-card p-6 rounded-[24px] flex flex-col items-center gap-3 hover:bg-white/10 transition-all active:scale-95 ios-shadow group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-[12px] font-black text-white uppercase tracking-widest">Trocar Voo</span>
            </button>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};
