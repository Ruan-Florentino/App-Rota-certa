import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  MapPin, 
  Star, 
  Clock, 
  Plane, 
  Hotel, 
  Receipt, 
  ArrowRight, 
  Camera, 
  Utensils, 
  Info,
  ExternalLink,
  DollarSign,
  Activity,
  Calendar,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { formatCurrency } from '../utils';
import { MobileContainer, NeonCard, GlowButton } from '../components/MobileUI';
import { OptimizedImage } from '../components/OptimizedImage';
import axios from 'axios';

import { getLocationImages, getHotelImage, getPlaceImage } from '../services/imageService';
import { destinationService } from '../services/destinationService';
import { AirlineLogo } from '../components/airline/AirlineLogo';

export const DestinationDetailScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useStore(
    useShallow((s) => ({
      favorites: s.favorites,
      toggleFavorite: s.toggleFavorite
    }))
  );
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(false);
        
        let data: any = null;
        
        // Try the API first
        try {
          const res = await axios.get(`/api/destination/${id}`);
          data = res.data;
        } catch (apiErr) {
          console.warn('API fetch failed, falling back to local data:', apiErr);
          // Fallback to the local service if API fails or returns 404
          const localDest = await destinationService.getById(id || '');
          if (localDest) {
            // Transform local data to match the expected detail format
            data = {
              ...localDest,
              rating: 4.8,
              reviews: 1200,
              activities: [
                { name: `Passeio em ${localDest.name}`, description: 'Uma experiência única.', category: 'Geral' }
              ],
              flights: [
                { airline: 'LATAM', price: localDest.priceFrom * 0.4, times: '08:00 - 12:00', link: '#' }
              ],
              hotels: [
                { name: `${localDest.name} Hotel`, price: localDest.priceFrom * 0.2, rating: 4.5, link: '#' }
              ],
              costs: {
                flights: localDest.priceFrom * 0.4,
                hotel: localDest.priceFrom * 0.3,
                food: localDest.priceFrom * 0.2,
                total: localDest.priceFrom
              }
            };
          }
        }

        if (!data || !data.name) {
          throw new Error('Destination not found');
        }
        
        // Fetch multiple images for the carousel
        const cityImages = await getLocationImages(data.name, data.country || '', 5);
        
        const hotelsWithImages = await Promise.all(
          (data.hotels || []).map(async (hotel: any) => ({
            ...hotel,
            image: await getHotelImage(hotel.name, data.name)
          }))
        );
        
        const activitiesWithImages = await Promise.all(
          (data.activities || []).map(async (activity: any) => ({
            ...activity,
            image: await getPlaceImage(activity.name, data.name)
          }))
        );
        
        setDestination({
          ...data,
          images: cityImages && cityImages.length > 0 ? cityImages : [data.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'],
          hotels: hotelsWithImages,
          activities: activitiesWithImages
        });
      } catch (err) {
        console.error('Error fetching destination details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-400 font-semibold">Carregando detalhes...</p>
        </div>
      </MobileContainer>
    );
  }

  if (error || !destination || !destination.name) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Info className="w-12 h-12 text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Destino não encontrado</h2>
          <p className="text-zinc-400 mb-6">Não conseguimos carregar as informações deste destino no momento.</p>
          <GlowButton onClick={() => navigate(-1)}>
            Voltar
          </GlowButton>
        </div>
      </MobileContainer>
    );
  }

  const handlePlanTrip = () => {
    navigate('/plan', { 
      state: { 
        destination: `${destination.name}, ${destination.country}`,
        budget: destination.avgPrice,
        days: destination.recommendedDays
      } 
    });
  };

  const openLink = (url?: string, type?: 'flight' | 'hotel') => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noreferrer');
      return;
    }
    
    // Generate intelligent deep links for missing URLs
    if (type === 'flight' && destination?.name) {
      const gFlightsUrl = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination.name)}`;
      window.open(gFlightsUrl, '_blank', 'noreferrer');
    } else if (type === 'hotel' && destination?.name) {
      const bookingUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${encodeURIComponent(destination.name)}`;
      window.open(bookingUrl, '_blank', 'noreferrer');
    }
  };

  const nextImg = () => {
    if (!destination.images || destination.images.length === 0) return;
    setCurrentImg((prev) => (prev + 1) % destination.images.length);
  };
  
  const prevImg = () => {
    if (!destination.images || destination.images.length === 0) return;
    setCurrentImg((prev) => (prev - 1 + destination.images.length) % destination.images.length);
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col -mx-4 overflow-y-auto pb-32 no-scrollbar">
        {/* Hero Header Carousel */}
        <div className="relative h-[450px] w-full group overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <OptimizedImage
                src={destination.images?.[currentImg]}
                alt={destination.name || 'Destino'}
                destinationName={destination.name}
                className="w-full h-full"
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none z-20" />
          
          {/* Carousel Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={prevImg} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImg} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-1.5">
            {destination.images?.map((_: any, i: number) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImg ? 'bg-emerald-500 w-4' : 'bg-white/30'}`} 
              />
            ))}
          </div>

          {/* Top Controls */}
          <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => destination.id && toggleFavorite(destination.id)}
                className={`w-12 h-12 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all ${isFavorite ? 'text-red-500' : 'text-white'}`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 h-12">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-black text-white">{(destination.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Title Info */}
          <div className="absolute bottom-8 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">{destination.country}</span>
            </div>
            <h1 className="text-[42px] font-black text-white tracking-tighter leading-none mb-4">
              {destination.name}
            </h1>
            <p className="text-[14px] text-zinc-400 leading-relaxed line-clamp-3">
              {destination.description}
            </p>
          </div>
        </div>

        <div className="px-6 space-y-10 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
              <div className="flex items-center text-zinc-500 text-xs mb-1">
                <Clock size={12} className="mr-1" />
                Recomendado
              </div>
              <div className="text-white font-bold">{destination.recommendedDays} dias</div>
            </div>
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
              <div className="flex items-center text-zinc-500 text-xs mb-1">
                <DollarSign size={12} className="mr-1" />
                Custo Médio
              </div>
              <div className="text-emerald-400 font-bold">{formatCurrency(destination.avgPrice || 0)}</div>
            </div>
          </div>

          {/* Section: O que fazer */}
          {destination.activities && destination.activities.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-[20px] font-black text-white tracking-tight">O que fazer</h3>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
                {destination.activities.map((activity: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    className="w-[280px] flex-shrink-0 bg-zinc-900/50 rounded-[24px] overflow-hidden border border-white/5 snap-center"
                  >
                    <div className="h-40 relative">
                      <OptimizedImage 
                        src={activity.image} 
                        alt={activity.name} 
                        destinationName={destination.name}
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest z-20">
                        {activity.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white text-[15px] mb-1">{activity.name}</h4>
                      <p className="text-[11px] text-zinc-500 leading-tight line-clamp-2">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Voos Estimados */}
          {destination.flights && destination.flights.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Plane className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-[20px] font-black text-white tracking-tight">Voos Estimados</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Previsões históricas da IA</p>
                </div>
              </div>

              <div className="space-y-4">
                {destination.flights.map((flight: any, idx: number) => (
                    <NeonCard key={idx} className="!p-4 border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <AirlineLogo airline={flight.airline} size="sm" variant="rounded" showName />
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <span className="text-[16px] font-black text-blue-500">R$ {flight.price}</span>
                          <button 
                            onClick={() => openLink(flight.link, 'flight')}
                            className="text-[10px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/10 transition-all"
                          >
                            Ver ofertas reais
                          </button>
                        </div>
                      </div>
                    </NeonCard>
                ))}
              </div>
            </section>
          )}

          {/* Section: Hotéis Estimados */}
          {destination.hotels && destination.hotels.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Hotel className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-[20px] font-black text-white tracking-tight">Hotéis Estimados</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Baseado em estadias médias</p>
                </div>
              </div>

              <div className="space-y-4">
                {destination.hotels.map((hotel: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900/50 rounded-[24px] overflow-hidden flex border border-white/5">
                    <div className="w-32 h-32 flex-shrink-0 relative">
                      <OptimizedImage 
                        src={hotel.image} 
                        alt={hotel.name} 
                        destinationName={destination.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white text-[14px] line-clamp-1">{hotel.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-[11px] font-bold text-white">{hotel.rating}</span>
                          </div>
                        </div>
                        <span className="text-[16px] font-black text-purple-500">R$ {hotel.price} <span className="text-[10px] font-normal text-zinc-500">/noite</span></span>
                      </div>
                      <button 
                        onClick={() => openLink(hotel.link, 'hotel')}
                        className="w-full h-8 bg-purple-500/10 rounded-lg text-[10px] font-black text-purple-500 uppercase tracking-widest hover:bg-purple-500/20 transition-all font-bold flex items-center justify-center gap-2"
                      >
                        Ver ofertas reais <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Custo Estimado */}
          {destination.costs && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[20px] font-black text-white tracking-tight">Custo Estimado</h3>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-[24px] space-y-4 border border-white/5">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[11px]">Voos</span>
                  <span className="text-white font-black">R$ {destination.costs.flights}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[11px]">Hotel ({destination.recommendedDays} noites)</span>
                  <span className="text-white font-black">R$ {destination.costs.hotel}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[11px]">Alimentação</span>
                  <span className="text-white font-black">R$ {destination.costs.food}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white font-black uppercase tracking-[0.2em] text-[12px]">Total Estimado</span>
                  <span className="text-[24px] font-black text-emerald-500">R$ {destination.costs.total}</span>
                </div>
              </div>
            </section>
          )}

          {/* Action Button & Disclaimer */}
          <div className="pt-4 pb-8">
            <GlowButton onClick={handlePlanTrip}>
              GERAR ROTEIRO PERSONALIZADO <ArrowRight className="w-6 h-6 ml-2" />
            </GlowButton>
            <p className="text-center text-[11px] text-zinc-500 mt-4 font-bold uppercase tracking-widest">
              Iremos auto-preencher os dados para você
            </p>
            
            {/* Global Disclaimer Phase 2 */}
            <div className="mt-8 p-4 bg-zinc-900/40 rounded-2xl border border-white/5 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-500/70 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-1">Sobre os Preços</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed">
                  Os valores exibidos são <strong>estimativas inteligentes</strong> baseadas no histórico da nossa IA e servem apenas como referência para planejamento. Preços estão sujeitos a volatilidade. <strong>Toque em "Ver ofertas reais"</strong> para conferir cotações atualizadas com nossos parceiros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};
