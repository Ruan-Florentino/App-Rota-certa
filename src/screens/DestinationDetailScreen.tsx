import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
  CloudSnow,
  Heart,
  Share2,
  Map as MapIcon,
  MessageSquare,
  Glasses
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MobileContainer, NeonCard, GlowButton, BlurCard } from '../components/MobileUI';
import axios from 'axios';

import { getCityImage, getHotelImage, getPlaceImage, getAirlineLogo } from '../services/imageService';

export const DestinationDetailScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/destination/${id}`);
        const data = res.data;
        
        // Fetch dynamic images for everything
        const cityImage = await getCityImage(data.name, data.country);
        
        const hotelsWithImages = await Promise.all(
          data.hotels.map(async (hotel: any) => ({
            ...hotel,
            image: await getHotelImage(hotel.name, data.name)
          }))
        );
        
        const activitiesWithImages = await Promise.all(
          data.activities.map(async (activity: any) => ({
            ...activity,
            image: await getPlaceImage(activity.name, data.name)
          }))
        );
        
        setDestination({
          ...data,
          image: cityImage,
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
        <div className="flex flex-col items-center justify-center h-full space-y-4 bg-[#0A1128]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-subtext font-medium">Carregando detalhes...</p>
        </div>
      </MobileContainer>
    );
  }

  if (error || !destination) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#0A1128]">
          <Info className="w-12 h-12 text-subtext mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Destino não encontrado</h2>
          <p className="text-subtext mb-6">Não conseguimos carregar as informações deste destino no momento.</p>
          <GlowButton onClick={() => navigate('/suggestions')}>
            Voltar para Sugestões
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

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col -mx-4 overflow-y-auto pb-40 bg-[#0A1128]">
        
        {/* Hero Header (55% height) */}
        <div className="relative h-[55vh] w-full">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/40 to-transparent" />
          
          {/* Top Controls */}
          <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-20">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Floating Buttons on Hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 w-[85%] z-20">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-black/40 backdrop-blur-xl border border-primary/50 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <Glasses className="w-5 h-5 text-primary" />
              <span className="text-white font-bold text-[14px]">Explorar em Realidade Aumentada</span>
            </motion.button>
            <motion.button 
              onClick={handlePlanTrip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-teal-400 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              <span className="text-[#0A1128] font-black text-[15px]">Planejar Viagem com IA</span>
            </motion.button>
          </div>

          {/* Glassmorphism Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-[#0A1128] to-transparent z-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">América</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">Neve</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">Cultura</span>
            </div>
            
            <h1 className="text-[44px] font-black text-white tracking-tighter leading-none mb-2 drop-shadow-lg">
              {destination.name}, {destination.country}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-xl">
                <span className="text-[14px] font-black text-primary">A partir de R$ {destination.avgPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-[12px] font-medium">
                <Calendar className="w-4 h-4" />
                {destination.recommendedDays} dias sugeridos
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/90 text-[13px] font-medium">
                <CloudSnow className="w-5 h-5 text-blue-300 animate-pulse" />
                Agora 8°C · Neve leve
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-bold text-white">{destination.rating.toFixed(1)} <span className="text-white/50 font-normal">(1.2k avaliações)</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-10 mt-6">
          
          {/* Section: Por que visitar agora */}
          <section>
            <h3 className="text-[20px] font-black text-white tracking-tight mb-2">Por que visitar agora</h3>
            <p className="text-[13px] text-white/60 leading-relaxed mb-4">
              {destination.description || "A temporada de neve está no auge, oferecendo as melhores condições para esportes de inverno e paisagens deslumbrantes."}
            </p>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scroll-hide">
              {destination.activities.map((activity: any, idx: number) => (
                <motion.div 
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  className="w-[220px] flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/10"
                >
                  <div className="h-28 relative">
                    <img 
                      src={activity.image} 
                      alt={activity.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="font-bold text-white text-[13px] leading-tight line-clamp-2">{activity.name}</h4>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-[11px] text-primary font-bold">R$ 150</span>
                    <span className="text-[10px] text-white/50 flex items-center gap-1"><Clock className="w-3 h-3" /> 2h</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Mapa Interativo 3D Widget */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-black text-white tracking-tight">Mapa 3D</h3>
              <button className="text-[12px] font-bold text-primary flex items-center gap-1">
                Abrir completo <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="relative h-[200px] rounded-[32px] overflow-hidden border border-white/10 bg-[#050814]">
              {/* Fake Map Background */}
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(120%)' }} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1128]/80" />
              
              {/* Fake 3D Pins */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#00F5FF] animate-pulse" />
                  <div className="absolute -top-12 -left-16 w-36 bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-xl shadow-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={destination.image} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="text-[10px] font-bold text-white leading-tight">{destination.name}</p>
                        <p className="text-[8px] text-primary">Rota otimizada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <button className="w-full py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-2">
                  <MapIcon className="w-4 h-4" /> Explorar mapa 3D
                </button>
              </div>
            </div>
          </section>

          {/* Roteiro IA Automático */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-black text-white tracking-tight">Roteiro IA</h3>
              <button className="text-[12px] font-bold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                <MessageSquare className="w-3 h-3" /> Personalizar
              </button>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {[1, 2, 3].map((day) => (
                <div key={day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0A1128] text-white font-bold text-[12px] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    D{day}
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[24px] bg-white/5 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={destination.activities[day % destination.activities.length]?.image || destination.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-white text-[13px]">{destination.activities[day % destination.activities.length]?.name || 'Exploração'}</h4>
                        <p className="text-[10px] text-white/50">Manhã • 3h</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-[11px] font-bold text-primary">Est. R$ 120</span>
                      <button className="text-[10px] text-white/70 underline">Ver detalhes</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Fixed Bottom Actions (Above Nav) */}
      <div className="absolute bottom-[80px] left-0 right-0 p-4 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 text-white">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex-1 h-14 bg-primary text-[#0A1128] rounded-2xl flex items-center justify-center font-black text-[14px] shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            Ver todos os voos + hotéis
          </button>
        </div>
      </div>
    </MobileContainer>
  );
};
