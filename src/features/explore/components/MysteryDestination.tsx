import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Navigation, X } from 'lucide-react';
import { SafeImage } from '../../../components/ui/SafeImage';
import { MAP_DESTINATIONS } from '../../../data/mapDestinations';
import { MYSTERY_IMAGES } from '../../../data/destinationImages';

export const MysteryDestination: React.FC = () => {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState<typeof MAP_DESTINATIONS[0] | null>(null);

  const handleSurprise = () => {
    setIsSpinning(true);
    setRevealed(false);
    
    // Simula a "roleta"
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MAP_DESTINATIONS.length);
      setChosen(MAP_DESTINATIONS[randomIndex]);
      setIsSpinning(false);
      setRevealed(true);
    }, 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-slate-900 border border-white/10 shadow-2xl">
      {/* Background Dinâmico */}
      <div className="absolute inset-0 opacity-40">
        <SafeImage 
          src={MYSTERY_IMAGES[0]} 
          alt="Mystery background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950" />
      </div>

      <div className="relative p-8 md:p-12 flex flex-col items-center text-center">
        {!revealed ? (
          <>
            <motion.div
              animate={isSpinning ? { rotate: 360 } : {}}
              transition={isSpinning ? { repeat: Infinity, duration: 0.5, ease: "linear" } : {}}
              className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${isSpinning ? 'bg-primary shadow-[0_0_40px_rgba(34,211,238,0.4)]' : 'bg-white/5 border border-white/10'}`}
            >
              <Sparkles className={`w-10 h-10 ${isSpinning ? 'text-white' : 'text-primary'}`} />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              O inesperado te aguarda.
            </h2>
            <p className="text-white/60 max-w-md mb-8">
              Deixe o destino escolher por você. Clique abaixo e descubra sua próxima aventura surpresa pelo mundo.
            </p>

            <button
              onClick={handleSurprise}
              disabled={isSpinning}
              className="btn btn-primary px-8 py-4 rounded-2xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSpinning ? 'Sorteando...' : 'Sortear Destino Surpresa'}
                {!isSpinning && <Navigation className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Destino Específicado
              </span>
              <button 
                onClick={() => setRevealed(false)}
                className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={() => navigate(`/destination/${chosen?.id}`)}
              className="group cursor-pointer bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center text-left hover:border-primary/50 transition-colors shadow-2xl"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0">
                <SafeImage 
                  src={chosen?.image || ''} 
                  alt={chosen?.cityName || ''} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  {chosen?.country}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{chosen?.cityName}</h3>
                <p className="text-white/60 text-sm italic mb-4">"{chosen?.tagline}"</p>
                
                <div className="flex flex-wrap gap-4">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">A partir de</div>
                    <div className="text-primary font-black">R$ {chosen?.price}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Rating</div>
                    <div className="text-yellow-400 font-black">★ {chosen?.rating}</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-white/40 text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" />
              Sorteio processado via RightWay AI
            </p>
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
    </section>
  );
};
