import React, { useMemo } from 'react';
import { Globe, MapPin, Calendar, Route } from 'lucide-react';
import { useTripsStore } from '@/stores/tripsStore';
import { StatCell } from './StatCell';
import { WorldTourProgress } from './WorldTourProgress';

export const JourneySoFar = () => {
  const trips = useTripsStore(state => state.trips);
  
  const stats = useMemo(() => {
    const visited = trips.filter(t => t.status === 'visited');
    const totalCountries = new Set(visited.map(t => t.countryCode)).size;
    const totalCities = visited.reduce((acc, t) => acc + (t.city ? 1 : 0), 0);
    const totalDays = visited.reduce((acc, t) => acc + 7, 0); // Placeholder
    const totalKm = visited.reduce((acc, t) => acc + 1000, 0); // Placeholder
    
    return {
      totalCountries,
      totalCities,
      totalDays,
      totalKm,
      totalTrips: trips.length,
      progress: Math.min(100, (totalKm / 40075) * 100),
      remaining: Math.max(0, 40075 - totalKm),
      nextMilestone: { km: 5000, label: 'Explorador Iniciante', reference: '5000km' }
    };
  }, [trips]);

  return (
    <section className="relative mx-4 mt-12">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-rw-sky/5 blur-[120px] pointer-events-none" />
      
      <header className="relative mb-8 px-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rw-sky shadow-rw-glow-sm" />
          <p className="text-[10px] tracking-[0.25em] uppercase text-rw-sky font-black">
            Visão Geral
          </p>
        </div>
        <h2 className="text-3xl font-black text-rw-text tracking-tighter uppercase leading-none">
          A jornada até aqui
        </h2>
        <p className="text-sm text-rw-muted mt-2 font-bold uppercase tracking-wider">
          Seu panorama completo de exploração pelo globo.
        </p>
      </header>
      
      <div className="relative rounded-[40px] bg-rw-surface border border-rw-border 
                      shadow-2xl overflow-hidden p-2">
        {/* Top accent light */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r 
                        from-transparent via-rw-sky/60 to-transparent opacity-60" />
        
        <div className="grid grid-cols-2 gap-2">
          <StatCell 
            icon={<Globe />}
            value={stats.totalCountries}
            label="países"
            trend={``}
            accent="sky"
          />
          <StatCell 
            icon={<MapPin />}
            value={stats.totalCities}
            label="cidades"
            trend={``}
            accent="sky-deep"
          />
          <StatCell 
            icon={<Calendar />}
            value={stats.totalDays}
            label="dias viajando"
            trend={`${stats.totalTrips} jornadas`}
            accent="lavender"
          />
          <StatCell 
            icon={<Route />}
            value={Math.round(stats.totalKm)}
            label="quilômetros"
            trend={`${(stats.totalKm/400.75).toFixed(1)}% da orbita`}
            accent="sky"
          />
        </div>
      </div>
      
      <WorldTourProgress 
        className="mt-8"
        progress={stats.progress}
        totalKm={stats.totalKm}
        remaining={stats.remaining}
        nextMilestone={stats.nextMilestone}
      />
    </section>
  );
};
