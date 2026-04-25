import React from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Destination } from '../../types/destination';
import { haptics } from '../../lib/haptics';
import { Button } from '../ui/Button';

interface MiniMapExplorerProps {
  destinations?: Destination[];
}

export const MiniMapExplorer: React.FC<MiniMapExplorerProps> = ({ destinations }) => {
  const navigate = useNavigate();

  return (
    <section className="px-6 pt-4">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="relative h-44 rounded-[24px] overflow-hidden cursor-pointer group shadow-2xl border border-white/5"
        onClick={() => {
          haptics.medium();
          navigate('/map');
        }}
      >
        {/* Abstract Map Background */}
        <div className="absolute inset-0 bg-neutral-900">
           {/* Map texture */}
           <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/0,0,1,0/1200x600?access_token=pk.eyJ1IjoiYWlzdHVkaW8iLCJhIjoiY2x6cTNqZzlwMDAyZDJqcHBlbWJ6ejh0byJ9')] bg-cover bg-center grayscale opacity-80" />
           <div className="absolute inset-0 bg-linear-to-b from-[#0F172A]/80 via-black/40 to-black/90" />
           
           {/* Animated Particles (Destinations) */}
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
               transition={{ delay: i * 0.5, duration: 2, repeat: Infinity }}
               style={{ 
                 left: `${20 + (i * 12)}%`, 
                 top: `${20 + (Math.sin(i) * 30)}%` 
               }}
               className="absolute"
             >
               <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
             </motion.div>
           ))}
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <MapIcon size={40} />
            </div>
            <h4 className="text-[22px] font-black text-white tracking-tighter uppercase leading-none mb-1">Mapa Interativo</h4>
            <p className="text-[13px] font-medium text-white/70">Explore o mundo pelo globo</p>
          </div>
          
          <div className="w-full mt-auto">
             <Button
               variant="primary"
               onClick={(e) => {
                 e?.stopPropagation();
                 haptics.medium();
                 navigate('/map');
               }}
               className="w-full h-12 !text-[13px] tracking-widest uppercase !rounded-xl"
               hapticFeedback="medium"
             >
               Abrir Mapa Completo
             </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
