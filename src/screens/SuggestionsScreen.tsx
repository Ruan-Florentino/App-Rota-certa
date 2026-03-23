import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter,
  Map,
  Calendar,
  Navigation,
  Plane
} from 'lucide-react';
import { 
  MobileContainer, 
  AnimatedContainer
} from '../components/MobileUI';
import { motion, AnimatePresence } from 'motion/react';
import { getCityImage } from '../services/imageService';
import { useNavigate } from 'react-router-dom';

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
  <div className="h-[480px] rounded-[32px] bg-white/5 animate-pulse border border-white/10 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute top-6 left-6 flex gap-2">
      <div className="w-20 h-8 bg-white/10 rounded-full" />
      <div className="w-24 h-8 bg-white/10 rounded-full" />
    </div>
    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
      <div className="w-1/3 h-6 bg-white/10 rounded-lg" />
      <div className="w-2/3 h-12 bg-white/10 rounded-lg" />
      <div className="flex justify-between items-end">
        <div className="w-1/2 h-10 bg-white/10 rounded-lg" />
        <div className="w-1/4 h-10 bg-white/10 rounded-2xl" />
      </div>
      <div className="flex gap-3 mt-2">
        <div className="flex-1 h-14 bg-white/10 rounded-2xl" />
        <div className="flex-[1.5] h-14 bg-white/10 rounded-2xl" />
      </div>
    </div>
  </div>
);

export const SuggestionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tudo');
  const [images, setImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      const newImages: Record<string, string> = {};
      const batchSize = 5;
      for (let i = 0; i < DESTINATIONS.length; i += batchSize) {
        const batch = DESTINATIONS.slice(i, i + batchSize);
        await Promise.all(batch.map(async (dest) => {
          const img = await getCityImage(dest.city, `${dest.country} skyline`);
          newImages[dest.city] = img;
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

  return (
    <MobileContainer>
      <div className="pb-32 pt-12">
        
        {/* HEADER */}
        <AnimatedContainer delay={0.1}>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[36px] font-black text-white tracking-tighter leading-tight mb-1">
                Explorar destinos
              </h1>
              <p className="text-[16px] font-medium text-subtext">
                Encontre sua próxima viagem
              </p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 glass-card rounded-full flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
            >
              <Filter className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </AnimatedContainer>

        {/* BUSCA MELHORADA */}
        <AnimatedContainer delay={0.15}>
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative glass-card rounded-3xl border border-white/10 p-5 flex items-center gap-4">
              <Search className="w-6 h-6 text-primary" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cidade ou país (ex: Paris, Tokyo)"
                className="bg-transparent border-none outline-none text-white text-[16px] w-full font-bold placeholder:text-subtext/50"
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
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`snap-start shrink-0 px-6 py-3 rounded-full border transition-all text-[14px] font-bold ${
                  activeFilter === filter 
                    ? 'bg-primary text-background border-primary shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                    : 'glass-card text-white border-white/10 hover:border-white/30'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </AnimatedContainer>

        {/* LISTA DESTINOS - CARDS GRANDES */}
        <div className="flex flex-col gap-10">
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
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(`/destination/${dest.id}`)}
                    className="relative h-[480px] rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_0_40px_rgba(0,229,255,0.15)] transition-all duration-500 border border-white/10"
                  >
                    {/* Imagem Grande 100% */}
                    <img 
                      src={images[dest.city]} 
                      alt={`${dest.city} skyline`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay Escuro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    
                    {/* Conteúdo sobre a imagem */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-auto pt-2">
                        {dest.tags.map(tag => (
                          <span key={tag} className="glass-card px-4 py-1.5 rounded-full text-[12px] font-bold text-white border border-white/20 bg-white/10 backdrop-blur-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Info Principal */}
                      <div className="mb-6">
                        <p className="text-[14px] font-bold text-white/80 uppercase tracking-widest mb-1">
                          {dest.country}
                        </p>
                        <h2 className="text-[44px] font-black text-white tracking-tighter leading-none mb-4">
                          {dest.city}
                        </h2>
                        
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[12px] font-bold text-subtext uppercase tracking-widest mb-1">
                              A partir de
                            </p>
                            <p className="text-[28px] font-black text-primary leading-none">
                              R$ {dest.price.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
                            <Calendar className="w-4 h-4 text-white" />
                            <span className="text-[14px] font-bold text-white">{dest.days} dias</span>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/destination/${dest.id}`); }}
                          className="flex-1 h-14 glass-card rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-[15px] border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          <Navigation className="w-4 h-4" /> Detalhes
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate('/plan', { state: { destination: `${dest.city}, ${dest.country}` } }); }}
                          className="flex-[1.5] h-14 bg-primary text-background rounded-2xl flex items-center justify-center gap-2 font-black text-[15px] hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                        >
                          <Plane className="w-5 h-5" /> Planejar viagem
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
              <MapPin className="w-12 h-12 text-subtext mx-auto mb-4 opacity-50" />
              <h3 className="text-[18px] font-bold text-white mb-2">Nenhum destino encontrado</h3>
              <p className="text-[14px] text-subtext">Tente buscar por outra cidade ou alterar os filtros.</p>
            </div>
          )}
        </div>

      </div>

      {/* BOTÃO FLOAT MAPA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/map')}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 h-14 px-8 bg-white text-background rounded-full flex items-center gap-3 font-black text-[15px] shadow-[0_10px_30px_rgba(255,255,255,0.2)] z-50 border border-white/20"
      >
        <Map className="w-5 h-5" />
        Mapa
      </motion.button>
    </MobileContainer>
  );
};
