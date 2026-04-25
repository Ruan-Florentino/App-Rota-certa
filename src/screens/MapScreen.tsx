import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MobileContainer } from '../components/MobileUI';
import { Globe3D } from '../components/Globe3D';
import { Map2D } from '../components/Map2D';
import { ChevronLeft, Map as MapIcon, Globe, Search } from 'lucide-react';

import { getDynamicImage, geocodePlace } from '../services/imageService';

import { MAP_DESTINATIONS, FLIGHT_ROUTES } from '../data/mapDestinations';

export const MapScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCity, setSelectedCity] = React.useState<any | null>(null);
  const [customPoints, setCustomPoints] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Tenta primeiro no nosso banco local de +80 destinos
      const localMatch = MAP_DESTINATIONS.find(d => 
        d.cityName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (localMatch) {
        const newPoint = {
          id: localMatch.id,
          lat: localMatch.lat,
          lng: localMatch.lng,
          name: localMatch.cityName,
          country: localMatch.country,
          price: `R$ ${localMatch.price}`,
          image: localMatch.image,
          type: 'default'
        };
        setCustomPoints(prev => [newPoint, ...prev.filter(p => p.id !== newPoint.id)]);
        setSelectedCity(newPoint);
        setIsSearching(false);
        return;
      }

      // Se não achar local, busca na API externa
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const newPoint = {
          id: Date.now().toString(),
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name.split(',')[0],
          country: data[0].display_name.split(',').pop()?.trim(),
          type: 'default',
          image: '',
        };
        
        try {
          newPoint.image = await getDynamicImage(newPoint.name, 'city', newPoint.name, newPoint.country);
        } catch (e) {}

        setCustomPoints(prev => [newPoint, ...prev]);
        setSelectedCity(newPoint);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (loc: any) => {
    setSelectedCity(loc);
  };

  useEffect(() => {
    const loadDefaultPoints = async () => {
      // Converte MAP_DESTINATIONS para o formato que o mapa espera
      const points = MAP_DESTINATIONS.map(d => ({
        id: d.id,
        lat: d.lat,
        lng: d.lng,
        name: d.cityName,
        country: d.country,
        price: `R$ ${d.price}`,
        image: d.image,
        type: d.category === 'historical' ? 'attraction' : d.category === 'beach' ? 'hotel' : 'default',
        rating: d.rating,
        tagline: d.tagline
      }));
      
      setCustomPoints(points);
    };

    if (location.state?.hotel) {
      const hotel = location.state.hotel;
      
      const fetchCoords = async () => {
        try {
          const query = `${hotel.name}, ${hotel.location}`;
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const data = await response.json();
          
          if (data && data.length > 0) {
            setCustomPoints([{
              id: '1',
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              name: hotel.name,
              country: hotel.location,
              price: `R$ ${hotel.price}`,
              image: hotel.image,
              type: 'hotel'
            }]);
          } else {
            // Fallback to just city
            const cityResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(hotel.location)}`);
            const cityData = await cityResponse.json();
            if (cityData && cityData.length > 0) {
              setCustomPoints([{
                id: '1',
                lat: parseFloat(cityData[0].lat),
                lng: parseFloat(cityData[0].lon),
                name: hotel.name,
                country: hotel.location,
                price: `R$ ${hotel.price}`,
                image: hotel.image,
                type: 'hotel'
              }]);
            }
          }
        } catch (error) {
          console.error('Error geocoding hotel:', error);
        }
      };
      
      fetchCoords();
    } else if (location.state?.itinerary) {
      const itinerary = location.state.itinerary;
      const destination = location.state.destination;
      
      const fetchItineraryCoords = async () => {
        setIsLoadingItinerary(true);
        const points: any[] = [];
        
        // First, get the destination center
        let destLat = 0, destLng = 0;
        try {
          const destCoords = await geocodePlace(destination);
          if (destCoords) {
            destLat = destCoords.lat;
            destLng = destCoords.lng;
          }
        } catch (e) {}

        for (const day of itinerary) {
          for (const act of day.activities) {
            const query = `${act.placeName || act.activity}, ${destination}`;
            let lat = destLat;
            let lng = destLng;
            
            try {
              // Add a small random offset if we can't geocode exactly, so pins don't overlap perfectly
              const coords = await geocodePlace(query);
              if (coords) {
                lat = coords.lat;
                lng = coords.lng;
              } else {
                lat += (Math.random() - 0.5) * 0.05;
                lng += (Math.random() - 0.5) * 0.05;
              }
            } catch (error) {
              lat += (Math.random() - 0.5) * 0.05;
              lng += (Math.random() - 0.5) * 0.05;
            }

            points.push({
              id: `${day.day}-${act.activity}`,
              lat,
              lng,
              name: act.activity,
              country: `Dia ${day.day} - ${act.time}`,
              price: `R$ ${act.cost}`,
              image: act.image,
              type: act.category === 'restaurante' ? 'hotel' : 'attraction',
              description: act.description
            });
          }
        }
        setCustomPoints(points);
        setIsLoadingItinerary(false);
      };
      
      fetchItineraryCoords();
    } else {
      // Load some default points if no specific hotel is passed
      loadDefaultPoints();
    }
  }, [location.state]);

  const globeCenter = React.useMemo(() => {
    return customPoints?.[0] ? { lat: customPoints[0].lat, lng: customPoints[0].lng } : undefined;
  }, [customPoints]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Overlay UI elements can be added here if needed */}
      <header className="flex-shrink-0 p-6 pointer-events-none z-10 flex flex-col gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pointer-events-auto"
        >
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* View Toggle */}
          <div className="flex bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-2xl">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${viewMode === '2d' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'}`}
            >
              <MapIcon className="w-4 h-4" /> 2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${viewMode === '3d' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'}`}
            >
              <Globe className="w-4 h-4" /> 3D
            </button>
          </div>
        </motion.div>

        {isLoadingItinerary && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-2xl pointer-events-auto"
          >
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm font-semibold">Mapeando seu roteiro...</span>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="pointer-events-auto relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cidade ou país..."
            className="w-full h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/40 outline-none focus:border-emerald-500/50 transition-colors shadow-2xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          )}
        </motion.form>
      </header>

      <main className="flex-1 min-h-0 relative z-0">
        {viewMode === '3d' ? (
          <Globe3D 
            onLocationSelect={handleLocationSelect} 
            customPoints={customPoints.length > 0 ? customPoints : undefined}
            initialCenter={globeCenter}
            initialZoom={customPoints?.[0] ? 1.5 : undefined}
            hideSearch={true}
          />
        ) : (
          <Map2D 
            points={customPoints}
            initialCenter={globeCenter}
            initialZoom={customPoints?.[0] ? 13 : 3}
            onPointClick={handleLocationSelect}
            isItinerary={!!location.state?.itinerary}
          />
        )}
      </main>
    </div>
  );
};
