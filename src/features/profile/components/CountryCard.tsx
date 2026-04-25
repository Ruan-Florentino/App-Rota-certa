import React from 'react';
import { motion } from 'motion/react';

interface CountryCardProps {
  trip: {
    countryCode: string;
    flag: string;
    name: string;
    year: number;
    status: string;
  };
}

export const CountryCard = ({ trip }: CountryCardProps) => {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="group relative aspect-[4/5] rounded-[28px] bg-rw-surface border border-rw-border 
                 p-5 flex flex-col items-center justify-center overflow-hidden
                 hover:border-rw-sky/50 transition-all duration-300 shadow-xl"
    >
      {/* Dynamic background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-500 pointer-events-none
                      bg-gradient-to-br from-rw-sky/20 via-transparent to-transparent" />
      
      {/* Shadow accent */}
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-rw-sky/5 blur-xl group-hover:bg-rw-sky/10 transition-colors" />

      {/* Flag Emoji */}
      <span className="text-5xl mb-4 relative z-10 filter drop-shadow-lg select-none transform group-hover:scale-110 transition-transform duration-500">
        {trip.flag}
      </span>
      
      {/* Tech code display */}
      <p className="text-sm font-black text-rw-text tracking-[0.25em] relative z-10 mb-1 uppercase">
        {trip.countryCode}
      </p>
      
      {/* Subtitle / Year */}
      <div className="flex items-center gap-1.5 relative z-10">
        <div className="w-1 h-1 rounded-full bg-rw-sky" />
        <p className="text-[10px] text-rw-muted font-black uppercase tracking-[0.2em] opacity-80">
          {trip.year}
        </p>
      </div>
      
      {/* Status indicator pin */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rw-success shadow-rw-glow-sm" />
    </motion.button>
  );
};
