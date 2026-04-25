import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { ChevronLeft, Heart, X, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '../components/MobileUI';
import { SafeImage } from '../components/ui/SafeImage';
import { getDynamicImage } from '../services/imageService';

const DESTINATIONS = [
  { id: '1', name: 'Santorini', country: 'Grécia', type: 'romantic', desc: 'Pôr do sol inesquecível e águas cristalinas.' },
  { id: '2', name: 'Kyoto', country: 'Japão', type: 'cultural', desc: 'Templos antigos e tradição milenar.' },
  { id: '3', name: 'Machu Picchu', country: 'Peru', type: 'adventure', desc: 'A cidade perdida dos Incas.' },
  { id: '4', name: 'Maldivas', country: 'Maldivas', type: 'luxury', desc: 'Paraíso tropical com bangalôs sobre a água.' },
  { id: '5', name: 'Nova York', country: 'EUA', type: 'urban', desc: 'A cidade que nunca dorme.' },
];

export const SwipeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      const withImages = await Promise.all(DESTINATIONS.map(async (d) => {
        const img = await getDynamicImage(d.name, 'city', d.name, d.country);
        return { ...d, img };
      }));
      setCards(withImages);
    };
    loadImages();
  }, []);

  const handleSwipe = (direction: 'left' | 'right', destination: any) => {
    if (direction === 'right') {
      // Navigate to plan with this destination
      setTimeout(() => {
        navigate('/plan', { state: { destination: `${destination.name}, ${destination.country}` } });
      }, 500);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <MobileContainer>
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] flex items-center justify-center border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] active:bg-[rgba(255,255,255,0.2)] transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Modo Sonho</h1>
      </div>

      <div className="flex-1 relative flex items-center justify-center pb-32">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Buscando destinos incríveis...</p>
          </div>
        ) : currentIndex >= cards.length ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Sparkles className="w-12 h-12 text-primary" />
            <h2 className="text-2xl font-bold text-white">Você viu tudo!</h2>
            <p className="text-white/60 text-sm">Volte mais tarde para novas descobertas.</p>
            <button 
              onClick={() => setCurrentIndex(0)}
              className="mt-4 px-6 py-3 bg-primary/20 text-primary rounded-full font-bold"
            >
              Recomeçar
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-sm aspect-[3/4]">
            <AnimatePresence>
              {cards.slice(currentIndex, currentIndex + 2).reverse().map((card, idx) => {
                const isTop = idx === cards.slice(currentIndex, currentIndex + 2).length - 1;
                return (
                  <SwipeCard 
                    key={card.id} 
                    card={card} 
                    isTop={isTop} 
                    onSwipe={(dir) => handleSwipe(dir, card)} 
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MobileContainer>
  );
};

const SwipeCard = ({ card, isTop, onSwipe }: { card: any, isTop: boolean, onSwipe: (dir: 'left' | 'right') => void }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: 1 }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 rounded-3xl overflow-hidden bg-[#020617] border border-white/10 shadow-2xl"
    >
      <SafeImage src={card.img} alt={card.name} className="w-full h-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">{card.country}</span>
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter">{card.name}</h2>
        <p className="text-white/80 text-sm">{card.desc}</p>
      </div>

      {isTop && (
        <div className="absolute bottom-6 right-6 flex gap-4">
          <button 
            onClick={() => onSwipe('left')}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-red-500/20 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onSwipe('right')}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-background hover:scale-110 transition-transform"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
