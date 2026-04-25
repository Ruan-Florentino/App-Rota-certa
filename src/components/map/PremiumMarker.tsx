import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface PremiumMarkerProps {
  name: string;
  price?: string;
  image?: string;
  onClick: () => void;
  featured?: boolean;
  delay?: number;
}

export function PremiumMarker({ name, price, image, onClick, featured = false, delay = 0 }: PremiumMarkerProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getInitials = (n: string) => {
    return n.split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ scale: 0, y: -50, opacity: 0 }}
      animate={{ 
        scale: 1, 
        y: 0, 
        opacity: 1,
      }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 400,
        damping: 15,
      }}
      className="relative w-14 h-14 cursor-pointer group origin-bottom" 
      onClick={onClick}
    >
      {/* Radar pulse layers */}
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-[marker-pulse_2s_infinite]" style={{ animationDelay: '0s' }} />
      <div className="absolute inset-0 rounded-full bg-primary/15 animate-[marker-pulse_2s_infinite]" style={{ animationDelay: '0.6s' }} />
      <div className="absolute inset-0 rounded-full bg-primary/10 animate-[marker-pulse_2s_infinite]" style={{ animationDelay: '1.2s' }} />
      
      {/* Container circular */}
      <div className="absolute inset-1.5 rounded-full border-[3px] border-[#22D3EE] overflow-hidden shadow-[0_0_0_2px_#0A0E1A,0_0_30px_rgba(34,211,238,0.6),0_8px_20px_rgba(0,0,0,0.4)] bg-[#0A0E1A] transform translate-z-0 transition-all duration-300 group-hover:scale-110 group-hover:border-white z-10 flex items-center justify-center">
        {image && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
            <img 
              src={image} 
              alt={name} 
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} 
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-xs font-black text-white/50 tracking-widest">{getInitials(name)}</span>
          </div>
        )}
        
        {/* Glow inner */}
        <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(34,211,238,0.3)] pointer-events-none" />
      </div>

      {featured && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#A855F7] rounded-full flex items-center justify-center border-2 border-[#0A0E1A] z-20 shadow-lg"
        >
          <Star className="w-3 h-3 text-white fill-white" />
        </motion.div>
      )}

      {/* Pointer triangle */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-t-[8px] border-t-[#22D3EE] drop-shadow-[0_4px_6px_rgba(34,211,238,0.4)] z-0" />
      
      {/* Label flutuante */}
      <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 bg-[rgba(10,14,26,0.95)] backdrop-blur-md px-3 py-1.5 rounded-lg border border-[rgba(34,211,238,0.3)] flex flex-col items-center whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none z-30 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <span className="text-xs font-semibold text-white max-w-[120px] truncate">{name}</span>
        {price && <span className="text-[10px] text-[#22D3EE] font-medium mt-0.5">{price}</span>}
      </div>
    </motion.div>
  );
}
