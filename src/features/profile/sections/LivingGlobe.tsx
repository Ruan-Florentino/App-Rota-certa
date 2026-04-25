import { useState } from 'react';
import { motion } from 'motion/react';
import Hero3D from '../components/Hero3D';
import { useTravelStats } from '../hooks/useTravelStats';
import { Play } from 'lucide-react';

export const LivingGlobe = () => {
  const stats = useTravelStats();
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={`relative transition-all duration-700 ease-in-out ${
      fullscreen ? 'fixed inset-0 z-50 bg-[#0A0E1A]' : 'w-full h-[500px] mt-12 rounded-3xl overflow-hidden'
    }`}>
      
      {/* Fallback to existing Hero3D which provides the globe */}
      <Hero3D visitedPlaces={stats.visitedCountries} />
      
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-[#D4AF37] font-black uppercase tracking-widest text-xs mb-1">
           Mapeamento Global
        </h2>
        <p className="text-white/60 text-sm">Rotate, Pinch, Explore.</p>
      </div>

      <button 
        onClick={() => setFullscreen(!fullscreen)}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all"
      >
        <span className="text-xs">{fullscreen ? '×' : '⛶'}</span>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8942B] text-black font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          <Play size={14} fill="currentColor" /> Time Machine
        </button>
      </div>

      {fullscreen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 bg-black/60 pointer-events-none z-0" 
        />
      )}
    </div>
  );
};
