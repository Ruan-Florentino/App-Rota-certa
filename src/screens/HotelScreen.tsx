import React from 'react';
import { 
  Building2, 
  ChevronLeft, 
  Star, 
  MapPin, 
  Search,
  Filter,
  ArrowRight,
  Wifi,
  Coffee,
  Waves
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { searchHotels, HotelOffer } from '../services/hotelService';
import { getHotelImage } from '../services/imageService';
import { 
  MobileContainer, 
  AnimatedContainer, 
  NeonCard, 
  GlowButton 
} from '../components/MobileUI';
import { motion, AnimatePresence } from 'motion/react';

export const HotelScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentTrip, setCurrentTrip, setLoading, budget } = useStore();
  const [hotels, setHotels] = React.useState<HotelOffer[]>([]);
  const [destination, setDestination] = React.useState('');
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');

  const hotelBudgetPerNight = (budget * 0.3) / (currentTrip?.itinerary.length || 1);

  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  React.useEffect(() => {
    if (currentTrip) {
      setDestination(currentTrip.destination.split(',')[0]);
      setCheckIn(currentTrip.startDate.split('T')[0]);
      setCheckOut(currentTrip.endDate.split('T')[0]);
    }
  }, [currentTrip]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchHotels(destination, checkIn, checkOut);
      
      // Fetch dynamic images for each hotel
      const hotelsWithImages = await Promise.all(results.map(async (hotel) => {
        const image = await getHotelImage(hotel.name, destination);
        return { ...hotel, image };
      }));
      
      setHotels(hotelsWithImages);
    } catch (error) {
      console.error('Error searching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHotel = (hotel: HotelOffer) => {
    if (!currentTrip) return;
    
    const updatedTrip = { ...currentTrip };
    if (!updatedTrip.hotels) updatedTrip.hotels = [];
    
    // Convert HotelOffer to Hotel
    const newHotel = {
      name: hotel.name,
      price: hotel.price,
      rating: hotel.rating,
      stars: 5, // Mock stars
      image: hotel.image,
      location: hotel.location,
      link: hotel.link
    };

    updatedTrip.hotels = [newHotel];
    setCurrentTrip(updatedTrip);
    
    // Calculate total hotel cost based on days
    const days = currentTrip.itinerary.length;
    useStore.getState().updateTripCosts({ hotel: hotel.price * days });
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
        <h1 className="text-[24px] font-black text-white tracking-tight">Hotéis Reais</h1>
      </div>

      <div className="flex flex-col gap-6 pb-32">
        {/* Search Form */}
        <AnimatedContainer delay={0.1}>
          <NeonCard className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Cidade de Destino</label>
              <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Paris, França"
                  className="bg-transparent text-white font-black text-[18px] w-full outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Check-in</label>
                <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent text-white font-black text-[14px] w-full outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Check-out</label>
                <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent text-white font-black text-[14px] w-full outline-none"
                  />
                </div>
              </div>
            </div>

            <GlowButton onClick={handleSearch} className="h-14 rounded-2xl">
              <Search className="w-5 h-5" />
              <span className="text-[14px]">BUSCAR ACOMODAÇÕES</span>
            </GlowButton>
          </NeonCard>
        </AnimatedContainer>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {hotels.map((hotel, index) => (
              <AnimatedContainer key={index} delay={0.2 + index * 0.1}>
                <NeonCard className="overflow-hidden border-white/5 hover:border-primary/20 transition-all group p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full flex items-center gap-1 border border-primary/30">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-[12px] font-black text-white">{hotel.rating}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
                  </div>

                  <div className="p-6 -mt-8 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-[20px] font-black text-white tracking-tight">{hotel.name}</h4>
                        <div className="flex items-center gap-1 text-subtext">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[11px] font-bold uppercase tracking-widest">{hotel.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[24px] font-black ${hotel.price <= hotelBudgetPerNight ? 'text-secondary' : 'text-primary'}`}>
                          R$ {hotel.price.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-[10px] font-black text-subtext uppercase tracking-widest">
                          {hotel.price <= hotelBudgetPerNight ? 'Dentro do Orçamento' : 'Acima do Orçamento'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-2 text-subtext">
                        <Wifi className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Free Wifi</span>
                      </div>
                      <div className="flex items-center gap-2 text-subtext">
                        <Coffee className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Café</span>
                      </div>
                      <div className="flex items-center gap-2 text-subtext">
                        <Waves className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Piscina</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => openLink(hotel.link)}
                          className="flex-1 h-12 glass-card rounded-xl border border-secondary/30 text-secondary text-[11px] font-black uppercase tracking-widest hover:bg-secondary/10 transition-all"
                        >
                          Ver no Airbnb
                        </button>
                        <button 
                          onClick={() => navigate('/map', { state: { hotel } })}
                          className="flex-1 h-12 glass-card rounded-xl border border-white/5 text-[11px] font-black uppercase tracking-widest hover:border-primary/30 transition-all"
                        >
                          Ver no Mapa
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSelectHotel(hotel)}
                        className="w-full h-12 bg-primary/10 rounded-xl border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 transition-all"
                      >
                        Selecionar para Roteiro <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </NeonCard>
              </AnimatedContainer>
            ))}
          </AnimatePresence>

          {hotels.length === 0 && !destination && (
            <div className="glass-card p-12 rounded-[32px] text-center border border-dashed border-white/10">
              <Building2 className="w-12 h-12 text-subtext opacity-20 mx-auto mb-4" />
              <p className="text-subtext font-bold uppercase tracking-widest opacity-40">Busque hotéis para sua estadia</p>
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
};
