import React, { useState, useEffect, useRef } from 'react';
import { SafeImage } from '../components/ui/SafeImage';
import { 
  Search, 
  MapPin, 
  Filter,
  Map,
  Calendar,
  Navigation,
  Plane,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  MobileContainer, 
  AnimatedContainer,
  Modal
} from '../components/MobileUI';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { getLocationImages } from '../services/imageService';
import { generateItinerary } from '../services/geminiService';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router-dom';
import { useGenerationContext } from '../hooks/useGenerationContext';

const DESTINATIONS = [
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', days: 3, price: 1800, tags: ['América', 'Econômico', '3 dias'] },
  { id: 'santiago', city: 'Santiago', country: 'Chile', days: 4, price: 2200, tags: ['América', 'Neve'] },
  { id: 'rio-de-janeiro', city: 'Rio de Janeiro', country: 'Brasil', days: 5, price: 1500, tags: ['Brasil', 'Praia', 'Econômico', '5 dias'] },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brasil', days: 3, price: 1200, tags: ['Brasil', 'Econômico', '3 dias'] },
  { id: 'miami', city: 'Miami', country: 'EUA', days: 5, price: 5500, tags: ['América', 'Praia', 'Luxo', '5 dias'] },
  { id: 'orlando', city: 'Orlando', country: 'EUA', days: 7, price: 7000, tags: ['América', 'Luxo'] },
  { id: 'paris', city: 'Paris', country: 'França', days: 5, price: 8000, tags: ['Europa', 'Luxo', '5 dias'] },
  { id: 'roma', city: 'Roma', country: 'Itália', days: 4, price: 7500, tags: ['Europa', 'Luxo'] },
  { id: 'barcelona', city: 'Barcelona', country: 'Espanha', days: 5, price: 7000, tags: ['Europa', 'Praia', '5 dias'] },
  { id: 'lisboa', city: 'Lisboa', country: 'Portugal', days: 4, price: 6000, tags: ['Europa', 'Econômico'] },
  { id: 'londres', city: 'Londres', country: 'Reino Unido', days: 5, price: 9000, tags: ['Europa', 'Luxo', '5 dias'] },
  { id: 'tokyo', city: 'Tokyo', country: 'Japão', days: 7, price: 12000, tags: ['Ásia', 'Luxo'] },
  { id: 'dubai', city: 'Dubai', country: 'EAU', days: 5, price: 10000, tags: ['Ásia', 'Luxo', '5 dias'] },
  { id: 'bangkok', city: 'Bangkok', country: 'Tailândia', days: 6, price: 5000, tags: ['Ásia', 'Econômico'] },
  { id: 'bali', city: 'Bali', country: 'Indonésia', days: 7, price: 6500, tags: ['Ásia', 'Praia', 'Econômico'] },
  { id: 'sydney', city: 'Sydney', country: 'Austrália', days: 7, price: 11000, tags: ['Praia', 'Luxo'] },
  { id: 'cape-town', city: 'Cape Town', country: 'África do Sul', days: 5, price: 7000, tags: ['Praia', '5 dias'] },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Holanda', days: 3, price: 8000, tags: ['Europa', 'Luxo', '3 dias'] },
  { id: 'madrid', city: 'Madrid', country: 'Espanha', days: 4, price: 6500, tags: ['Europa', 'Econômico'] },
  { id: 'cancun', city: 'Cancun', country: 'México', days: 5, price: 5000, tags: ['América', 'Praia', 'Luxo', '5 dias'] },
];

const FILTERS = ['Tudo', 'Praia', 'Neve', 'Europa', 'América', 'Brasil', 'Luxo', 'Econômico', '3 dias', '5 dias'];

const SkeletonCard = () => (
  <div className="glass-card flex flex-col overflow-hidden animate-pulse">
    <div className="w-full h-[200px] bg-white/5" />
    <div className="p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-6 bg-white/10 rounded-lg" />
          <div className="w-24 h-4 bg-white/10 rounded-lg" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="w-20 h-6 bg-white/10 rounded-lg" />
          <div className="w-16 h-4 bg-white/10 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-16 h-6 bg-white/10 rounded-full" />
        <div className="w-20 h-6 bg-white/10 rounded-full" />
      </div>
      <div className="flex gap-3 mt-2">
        <div className="flex-1 h-12 bg-white/10 rounded-xl" />
        <div className="flex-[1.5] h-12 bg-white/10 rounded-xl" />
      </div>
    </div>
  </div>
);

const ImageCarousel = ({ images, city }: { images: string[], city: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / width);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative w-full h-[200px] overflow-hidden group/carousel">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
            <SafeImage 
              src={img} 
              alt={`${city} skyline ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SuggestionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, addTrip, setCurrentTrip } = useStore(
    useShallow((s) => ({
      user: s.user,
      addTrip: s.addTrip,
      setCurrentTrip: s.setCurrentTrip
    }))
  );
  const genContext = useGenerationContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tudo');
  const [images, setImages] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      const newImages: Record<string, string[]> = {};
      const batchSize = 5;
      for (let i = 0; i < DESTINATIONS.length; i += batchSize) {
        const batch = DESTINATIONS.slice(i, i + batchSize);
        await Promise.all(batch.map(async (dest) => {
          const result = await getLocationImages(dest.city, dest.country);
          newImages[dest.city] = result;
        }));
        setImages(prev => ({ ...prev, ...newImages }));
      }
      setIsLoading(false);
    };
    loadImages();
  }, []);

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Tudo' || dest.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const handleAutoPlan = async (e: React.MouseEvent, dest: any) => {
    e.stopPropagation();
    if (generatingFor) return;
    
    setGeneratingFor(dest.id);
    try {
      const itineraryData = await generateItinerary(
        `${dest.city}, ${dest.country}`,
        dest.days,
        dest.price,
        'normal',
        false,
        genContext
      );
      
      const newTrip = {
        id: Date.now().toString(),
        userId: user?.uid || 'anonymous',
        destination: `${dest.city}, ${dest.country}`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + dest.days * 24 * 60 * 60 * 1000).toISOString(),
        budget: dest.price,
        type: 'normal' as any,
        ...itineraryData,
        status: 'planejada' as any,
        createdAt: new Date().toISOString()
      } as any;
      
      addTrip(newTrip);
      setCurrentTrip(newTrip);
      navigate('/results');
    } catch (error) {
      console.error('Error auto-generating trip:', error);
      setErrorModalOpen(true);
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <MobileContainer>
      <div className="pb-32 pt-12">
        
        {/* HEADER */}
        <AnimatedContainer delay={0.1}>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight mb-1">
                Explorar destinos
              </h1>
              <p className="text-sm font-semibold text-white/60">
                Encontre sua próxima viagem
              </p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] flex items-center justify-center border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] active:bg-[rgba(255,255,255,0.2)] transition-all"
            >
              <Filter className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </AnimatedContainer>

        {/* BUSCA MELHORADA */}
        <AnimatedContainer delay={0.15}>
          <div className="relative group mb-8">
            <div className="relative bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] rounded-full border border-[rgba(255,255,255,0.08)] p-4 flex items-center gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
              <Search className="w-5 h-5 text-white/50" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cidade ou país (ex: Paris, Tokyo)"
                className="bg-transparent border-none outline-none text-white text-base w-full font-semibold placeholder:text-white/40"
              />
            </div>
          </div>
        </AnimatedContainer>

        {/* FILTROS */}
        <AnimatedContainer delay={0.2}>
          <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4 snap-x hide-scrollbar">
            {FILTERS.map((filter) => (
              <motion.button
                key={filter}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(filter)}
                className={`snap-start shrink-0 px-6 py-2.5 rounded-full transition-all text-[14px] font-semibold ${
                  activeFilter === filter 
                    ? 'bg-white text-black shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' 
                    : 'bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] text-white border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </AnimatedContainer>

        {/* LISTA DESTINOS - CARDS GRANDES */}
        <div className="flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest, idx) => (
              <AnimatedContainer key={dest.city} delay={0.1 + (idx * 0.05)}>
                {!images[dest.city] ? (
                  <SkeletonCard />
                ) : (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/destination/${dest.id}`)}
                    className="glass-card overflow-hidden flex flex-col cursor-pointer group"
                  >
                    {/* Carrossel de Imagens */}
                    <ImageCarousel images={images[dest.city]} city={dest.city} />
                    
                    {/* Conteúdo */}
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-white tracking-tight">{dest.city}</h3>
                          <p className="text-white/60 text-sm font-semibold flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {dest.country}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{formatCurrency(dest.price)}</p>
                          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">{dest.days} dias</p>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap">
                        {dest.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold text-white/80 uppercase tracking-wider backdrop-blur-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-3 mt-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/destination/${dest.id}`); }}
                          className="flex-1 h-12 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center gap-2 text-white font-semibold text-[11px] uppercase tracking-widest border border-white/10 active:bg-white/10 transition-all"
                        >
                          <Navigation className="w-4 h-4" /> Ver roteiro
                        </button>
                        <button 
                          onClick={(e) => handleAutoPlan(e, dest)}
                          disabled={generatingFor === dest.id}
                          className="flex-[1.5] h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                        >
                          {generatingFor === dest.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plane className="w-4 h-4" />
                          )}
                          {generatingFor === dest.id ? 'Gerando...' : 'Planejar viagem'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatedContainer>
            ))}
          </AnimatePresence>
          
          {filteredDestinations.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhum destino encontrado</h3>
              <p className="text-sm text-white/60">Tente buscar por outra cidade ou alterar os filtros.</p>
            </div>
          )}
        </div>

      </div>

      {/* BOTÃO FLOAT MAPA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/map')}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 h-12 px-8 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] text-white rounded-full flex items-center gap-3 font-semibold text-[15px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-50 border border-[rgba(255,255,255,0.15)]"
      >
        <Map className="w-5 h-5" />
        Mapa
      </motion.button>

      <Modal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} title="Erro">
        <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
            <Plane className="w-8 h-8" />
          </div>
          <p className="text-white font-semibold text-lg">Erro ao gerar roteiro</p>
          <p className="text-white/60 text-sm mb-4">Não foi possível gerar o roteiro automaticamente. Tente novamente.</p>
          <button 
            onClick={() => setErrorModalOpen(false)}
            className="w-full py-3 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
          >
            Entendi
          </button>
        </div>
      </Modal>
    </MobileContainer>
  );
};
