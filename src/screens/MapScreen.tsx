import React from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Plus, 
  Minus, 
  LocateFixed, 
  Star, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  Hotel,
  Camera,
  Utensils,
  Plane,
  Filter,
  Globe,
  Palmtree,
  Snowflake,
  Heart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SearchDestino, CitySuggestion } from '../components/SearchDestino';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { getPlacesNearby, Place } from '../services/placeService';
import { getCityImage } from '../services/imageService';
import { motion, AnimatePresence } from 'motion/react';
import { MobileContainer, BlurCard, GlowButton } from '../components/MobileUI';

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

// Premium Cities Data
const PREMIUM_CITIES = [
  { id: 'paris', name: 'Paris', country: 'França', price: 3200, days: 7, lat: 48.8566, lng: 2.3522, category: 'Internacional' },
  { id: 'santiago', name: 'Santiago', country: 'Chile', price: 1800, days: 5, lat: -33.4489, lng: -70.6693, category: 'Neve' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', price: 1500, days: 4, lat: -34.6037, lng: -58.3816, category: 'Romântico' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japão', price: 4500, days: 10, lat: 35.6762, lng: 139.6503, category: 'Internacional' },
  { id: 'dubai', name: 'Dubai', country: 'EAU', price: 3800, days: 6, lat: 25.2048, lng: 55.2708, category: 'Internacional' },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brasil', price: 1200, days: 5, lat: -22.9068, lng: -43.1729, category: 'Praia' },
  { id: 'lisboa', name: 'Lisboa', country: 'Portugal', price: 2800, days: 6, lat: 38.7223, lng: -9.1393, category: 'Internacional' },
  { id: 'roma', name: 'Roma', country: 'Itália', price: 3000, days: 7, lat: 41.9028, lng: 12.4964, category: 'Romântico' },
  { id: 'barcelona', name: 'Barcelona', country: 'Espanha', price: 2900, days: 6, lat: 41.3851, lng: 2.1734, category: 'Praia' },
  { id: 'new-york', name: 'New York', country: 'EUA', price: 4200, days: 8, lat: 40.7128, lng: -74.0060, category: 'Internacional' },
];

// Custom Price Bubble Pin
const createPricePin = (price: number, isActive: boolean = false) => {
  const color = isActive ? '#00FFA3' : '#00E5FF';
  const glow = isActive ? 'rgba(0, 255, 163, 0.6)' : 'rgba(0, 229, 255, 0.6)';

  return L.divIcon({
    html: `
      <div class="relative -translate-x-1/2 -translate-y-1/2 group">
        <div class="px-3 py-1.5 rounded-full bg-[#020B1A] border-2 border-[${color}] flex items-center justify-center shadow-[0_0_15px_${glow}] transition-all duration-300 group-hover:scale-110" style="color: ${color}; border-color: ${color}; box-shadow: 0 0 15px ${glow};">
          <span class="text-[11px] font-black tracking-tighter">R$ ${price}</span>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#020B1A] border-r-2 border-b-2 border-[${color}] rotate-45" style="border-color: ${color};"></div>
      </div>
    `,
    className: 'price-bubble-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// User Location Icon
const userIcon = L.divIcon({
  html: `
    <div class="relative">
      <div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,229,255,0.8)]"></div>
      <div class="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-50"></div>
    </div>
  `,
  className: 'user-location-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const MapControls: React.FC<{ 
  onZoomIn: () => void; 
  onZoomOut: () => void; 
  onLocate: () => void;
  onCenter: () => void;
}> = ({ onZoomIn, onZoomOut, onLocate, onCenter }) => {
  return (
    <div className="absolute right-6 bottom-32 flex flex-col gap-3 z-[1000]">
      <button 
        onClick={onLocate}
        className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-primary shadow-2xl active:scale-95 transition-all"
      >
        <LocateFixed className="w-6 h-6" />
      </button>
      <button 
        onClick={onCenter}
        className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-accent shadow-2xl active:scale-95 transition-all"
      >
        <Navigation className="w-6 h-6" />
      </button>
      <div className="flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={onZoomIn}
          className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/5 active:bg-white/10 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
        <div className="h-[1px] bg-white/10 mx-3" />
        <button 
          onClick={onZoomOut}
          className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/5 active:bg-white/10 transition-all"
        >
          <Minus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

export const MapScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrip, setCurrentTrip } = useStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([20, 0]); // Global view
  const [zoom, setZoom] = React.useState(3);
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [selectedCity, setSelectedCity] = React.useState<any | null>(null);
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [cityImage, setCityImage] = React.useState<string | null>(null);

  const FILTERS = [
    { id: 'all', label: 'Explorar', icon: <Globe className="w-4 h-4" /> },
    { id: 'Barato', label: 'Barato', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'Internacional', label: 'Internacional', icon: <Globe className="w-4 h-4" /> },
    { id: 'Praia', label: 'Praia', icon: <Palmtree className="w-4 h-4" /> },
    { id: 'Neve', label: 'Neve', icon: <Snowflake className="w-4 h-4" /> },
    { id: 'Romântico', label: 'Romântico', icon: <Heart className="w-4 h-4" /> },
  ];

  const filteredCities = PREMIUM_CITIES.filter(city => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Barato') return city.price < 2000;
    return city.category === activeFilter;
  });

  React.useEffect(() => {
    if (selectedCity) {
      getCityImage(selectedCity.name, selectedCity.country).then(setCityImage);
    } else {
      setCityImage(null);
    }
  }, [selectedCity]);

  // Get user location
  const handleLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setZoom(15);
      });
    }
  };

  const handleSelectCity = (city: CitySuggestion) => {
    setSearchValue(`${city.name}, ${city.country}`);
    setMapCenter([city.lat, city.lng]);
    setZoom(13);
    setSelectedCity(null);
  };

  const handlePlanTrip = (city: any) => {
    navigate('/plan', { state: { destination: `${city.name}, ${city.country}` } });
  };

  return (
    <MobileContainer className="p-0 overflow-hidden h-screen">
      {/* Search Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-6 pt-12 bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="max-w-[420px] mx-auto space-y-4">
          <SearchDestino 
            value={searchValue}
            onChange={setSearchValue}
            onSelect={handleSelectCity}
            placeholder="Buscar cidade no mundo..."
            className="shadow-2xl"
          />
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-2 px-4 h-10 rounded-full whitespace-nowrap transition-all active:scale-95 ${
                  activeFilter === f.id 
                    ? 'bg-primary text-background font-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                    : 'glass-card text-white/70 font-bold border border-white/5'
                }`}
              >
                {f.icon}
                <span className="text-[12px]">{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full relative z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <MapUpdater center={mapCenter} zoom={zoom} />

          {/* User Location */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon} />
          )}

          {/* Cluster Group */}
          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            maxClusterRadius={40}
            spiderfyOnMaxZoom={true}
          >
            {filteredCities.map((city) => (
              <Marker 
                key={city.id} 
                position={[city.lat, city.lng]} 
                icon={createPricePin(city.price, selectedCity?.id === city.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedCity(city);
                    setMapCenter([city.lat, city.lng]);
                    setZoom(10);
                  }
                }}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Controls */}
        <MapControls 
          onZoomIn={() => setZoom(z => Math.min(z + 1, 18))}
          onZoomOut={() => setZoom(z => Math.max(z - 1, 3))}
          onLocate={handleLocate}
          onCenter={() => {
            setMapCenter([20, 0]);
            setZoom(3);
          }}
        />

        {/* Selected City Card */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-6 left-6 right-6 z-[1000] max-w-[420px] mx-auto"
            >
              <BlurCard className="p-0 overflow-hidden rounded-[32px] border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                <div className="relative h-48">
                  {cityImage ? (
                    <img 
                      src={cityImage} 
                      alt={selectedCity.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
                      <Globe className="w-10 h-10 text-white/10" />
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedCity(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                  <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-[11px] font-bold text-white">Destaque</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-[24px] font-black text-white tracking-tight leading-tight">{selectedCity.name}</h3>
                      <p className="text-subtext text-[12px] font-bold uppercase tracking-widest">{selectedCity.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Preço Médio</p>
                      <p className="text-[20px] font-black text-primary tracking-tighter">R$ {selectedCity.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-subtext text-[12px] font-bold mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-secondary fill-secondary" />
                      <span>4.9</span>
                    </div>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-accent" />
                      <span>{selectedCity.days} Dias recomendados</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigate(`/destination/${selectedCity.id}`)}
                      className="h-14 rounded-2xl glass-card flex items-center justify-center gap-2 text-white font-bold hover:bg-white/5 transition-all"
                    >
                      Ver roteiro
                    </button>
                    <GlowButton 
                      onClick={() => handlePlanTrip(selectedCity)}
                      className="h-14 rounded-2xl"
                    >
                      <span className="text-[14px]">PLANEJAR</span>
                      <ArrowRight className="w-4 h-4" />
                    </GlowButton>
                  </div>
                </div>
              </BlurCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  );
};
