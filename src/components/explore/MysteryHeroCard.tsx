import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { haptics } from '../../lib/haptics';
import { sounds } from '../../lib/sounds';
import { Destination } from '../../types/destination';
import { SafeImage } from '../ui/SafeImage';

interface Props {
  destination: Destination;
}

export const MysteryHeroCard: React.FC<Props> = ({ destination }) => {
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  const handleReveal = () => {
    if (revealed) {
      haptics.selection();
      navigate(`/destination/${destination.id}`);
      return;
    }
    
    haptics.heavy();
    sounds.play('success');
    setRevealed(true);
    
    // Confetti effect
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22D3EE', '#A855F7']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22D3EE', '#A855F7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="px-6 mb-12">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="mystery"
            layoutId="hero-card"
            onClick={handleReveal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ rotateY: 90, opacity: 0 }}
            className="relative w-full h-56 rounded-[24px] overflow-hidden cursor-pointer group shadow-2xl"
          >
            {/* Background Image with blur */}
            <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
              <SafeImage 
                src="https://images.unsplash.com/photo-1516483638261-f40af5afca29?auto=format&fit=crop&q=80&w=800" 
                alt="Mystery"
                className="w-full h-full object-cover blur-md scale-110 opacity-40 group-hover:opacity-50 group-hover:scale-100 transition-all duration-1000"
              />
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* UI Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">✨ DESTINO DO DIA</span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <ArrowRight size={18} className="text-white group-hover:text-primary transition-colors" />
                </div>
              </div>
              
              <div className="mt-auto pointer-events-none">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">
                  UM MISTÉRIO<br/>TE AGUARDA
                </h3>
                <p className="text-sm font-medium text-white/70">
                  Toque para revelar
                </p>
              </div>
            </div>
            
            {/* Animated Particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{animationDuration: '2s'}}/>
              <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{animationDuration: '3s'}}/>
              <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-cyan-300 animate-pulse" style={{animationDuration: '1.5s'}}/>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            layoutId="hero-card"
            onClick={handleReveal}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative w-full h-56 rounded-[24px] overflow-hidden cursor-pointer group shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-primary/30"
          >
            <div className="absolute inset-0 bg-neutral-900">
              <SafeImage 
                src={destination.heroImage} 
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                <div className="px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full border border-green-500/30">
                  <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">REVELADO!</span>
                </div>
              </div>

              <div className="mt-auto flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{destination.country}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none line-clamp-1">
                    {destination.name}
                  </h3>
                </div>
                
                <div className="text-right pb-1">
                   <div className="flex items-center gap-1 justify-end mb-1">
                     <Star size={12} className="text-yellow-400 fill-yellow-400" />
                     <span className="text-sm font-bold text-white">{destination.rating}</span>
                   </div>
                   <div className="text-[9px] text-white/50 uppercase font-bold tracking-widest text-right">Estimativa*</div>
                   <div className="text-lg font-black text-primary">R$ {destination.priceFrom.toLocaleString('pt-BR')} - {Math.round(destination.priceFrom * 1.4).toLocaleString('pt-BR')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
