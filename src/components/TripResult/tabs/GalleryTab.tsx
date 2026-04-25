import React from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import { OptimizedImage } from '../../OptimizedImage';

interface GalleryTabProps {
  galleryImages: string[];
  destination: string;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  galleryImages,
  destination
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full flex items-center justify-center text-primary">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white tracking-tight">Galeria de Fotos</h4>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Inspire-se com {destination}</p>
          </div>
        </div>
      </div>

      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl overflow-hidden relative group ${idx % 3 === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'}`}
            >
              <OptimizedImage 
                src={img} 
                alt={`Gallery image ${idx + 1}`} 
                destinationName={destination}
                className="w-full h-full group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none" />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Carregando imagens...</p>
        </div>
      )}
    </motion.div>
  );
};
