import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useProfileStore } from '@/store/profileStore';
import { useTravelStats } from '../hooks/useTravelStats';
import { drawGenerativeArt } from '../utils/generativeArt';
import { Text } from '@/components/ui/Text';

export const HeroCinematic = () => {
  const { profile } = useProfileStore();
  const stats = useTravelStats();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Typewriter subtitles
  const titles = [
    `Explorador de ${stats.totalCountries} países`,
    'Caçador de pôres do sol',
    'Colecionador de passaportes'
  ];
  const [titleIdx, setTitleIdx] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setTitleIdx(prev => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      // Setup canvas size
      const c = canvasRef.current;
      c.width = window.innerWidth;
      c.height = 500;
      drawGenerativeArt(c, stats.totalCountries || 1);
    }
  }, [stats.totalCountries]);

  return (
    <motion.div 
      style={{ y, opacity }}
      className="relative w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none" 
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0E1A]/50 to-[#0A0E1A] z-0" />

      <div className="z-10 flex flex-col items-center text-center space-y-4 px-4">
        {profile.avatarUrl ? (
           <div className="relative mb-4">
             {/* Neon Glow pulsando 0.6 -> 1 a cada 3s */}
             <motion.div
               animate={{ opacity: [0.6, 1, 0.6] }}
               transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute inset-0 rounded-full bg-[#D4AF37] blur-[20px]"
             />
             <motion.img 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: 'spring', damping: 20 }}
               src={profile.avatarUrl} 
               alt="Avatar" 
               className="relative w-24 h-24 rounded-full border-2 border-[#D4AF37] object-cover" 
             />
           </div>
        ) : null}
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37]"
          style={{ fontFamily: '"Fraunces", serif' }}
        >
          <Text variant="display-xl">{profile.name}</Text>
        </motion.div>
        
        <motion.div 
          key={titleIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="h-8"
        >
          <Text variant="label-lg" color="#8AB4F8">{titles[titleIdx]}</Text>
        </motion.div>
      </div>
    </motion.div>
  );
};
