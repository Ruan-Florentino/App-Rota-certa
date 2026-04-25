import React from 'react';
import { Globe3D } from './Globe3D';
import { useTripsStore } from '@/stores/tripsStore';

export default function TravelMap() {
  const visitedCount = useTripsStore((state) => state.trips.filter(t => t.status === 'visited').length);

  return (
    <div className="pt-[16px]">
      <h3 className="text-white text-[14px] font-bold mb-[16px] uppercase tracking-wider">
        🌍 Seu Mapa de Viagens
      </h3>
      
      <div className="relative w-full aspect-square max-w-lg mx-auto rounded-[20px] overflow-hidden bg-gradient-to-br from-purple-950/50 to-black border border-purple-500/20">
        <Globe3D autoRotate showRoutes interactive />
        
        {/* Overlay info */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
            <p className="text-xs text-white/60 uppercase tracking-wider">Meu Mundo</p>
            <p className="text-white font-bold text-lg">{visitedCount} países</p>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <p className="text-white/40 text-xs text-center">
            Arraste para girar • Pinch para zoom
          </p>
        </div>
        
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[20px] pointer-events-none z-20" />
      </div>
    </div>
  );
}
