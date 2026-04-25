import React from 'react';
import { Globe2, MapPin } from 'lucide-react';

interface Globe3DFallbackProps {
  countryCount: number;
  className?: string;
}

export function Globe3DFallback({ countryCount, className }: Globe3DFallbackProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/40 rounded-2xl overflow-hidden ${className || ''}`}>
      {/* Grid de fundo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Globo animado CSS */}
      <div className="relative z-10 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
            <Globe2 className="w-16 h-16 text-white animate-spin-slow" />
          </div>
          <div className="absolute -inset-2 rounded-full bg-purple-500/30 blur-xl animate-pulse" />
        </div>
        
        <p className="text-white font-bold text-2xl mb-2">
          {countryCount}
        </p>
        <p className="text-white/80 text-sm uppercase tracking-widest mb-4">
          {countryCount === 1 ? 'País visitado' : 'Países visitados'}
        </p>
      </div>
    </div>
  );
}
