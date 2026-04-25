import React, { useMemo } from 'react';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Map } from '../../../components/map/Map';
import { useTripsStore } from '@/stores/tripsStore';
import { getCountryByCode } from '@/data/countries';

export const WorldMap = () => {
  const trips = useTripsStore(state => state.trips);
  
  const markers = useMemo(() => trips.map(trip => {
      const country = getCountryByCode(trip.countryCode);
      const color = 
        trip.status === 'visited' ? '#8AB4F8' : 
        trip.status === 'planned' ? '#C4A6F8' : 
        '#8B8B9E';
      return {
        id: trip.id,
        lat: country?.lat || 0,
        lng: country?.lng || 0,
        label: country?.name || 'Desconhecido',
        color
      };
    }), [trips]);
    
  const stats = useMemo(() => {
    const visited = trips.filter(t => t.status === 'visited').length;
    const planned = trips.filter(t => t.status === 'planned').length;
    const wishlist = trips.filter(t => t.status === 'wishlist').length;
    const coverage = (visited / 195) * 100;
    return { visited, planned, wishlist, coverage };
  }, [trips]);

  return (
    <section className="mx-4 mt-20 mb-8">
      <header className="flex items-end justify-between mb-8 px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rw-sky" />
            <p className="text-[10px] tracking-[0.25em] uppercase text-rw-sky font-black">
              Cartografia
            </p>
          </div>
          <h2 className="text-3xl font-black text-rw-text tracking-tighter uppercase leading-none">
            Onde você esteve
          </h2>
        </div>
        
        <button className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-rw-sky transition-colors hover:text-rw-sky-soft bg-rw-sky/5 px-4 py-2.5 rounded-xl border border-rw-sky/20 shadow-rw-glow-sm">
          <Maximize2 className="w-4 h-4" />
          Focar Mapa
        </button>
      </header>
      
      <div className="relative h-[600px] rounded-[48px] overflow-hidden 
                      border border-rw-border shadow-2xl bg-rw-black">
        <Map 
          center={[0, 0]}
          zoom={1.8}
          markers={markers}
          interactive={true}
        />
        
        {/* Border inner glow shadow */}
        <div className="absolute inset-0 pointer-events-none rounded-[48px]
                        shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />
        
        {/* Legenda — canto superior esquerdo */}
        <div className="absolute top-3 left-3 bg-rw-dark/90 backdrop-blur-xl border border-rw-border rounded-xl p-2.5 max-w-[140px]">
          <p className="text-[9px] tracking-[0.2em] uppercase text-rw-muted font-semibold mb-2">
            Legenda
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rw-sky shrink-0 shadow-rw-glow-sm" />
              <span className="text-[11px] text-rw-text flex-1">Visitados</span>
              <span className="text-[11px] text-rw-muted tabular-nums">{stats.visited}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rw-lavender shrink-0" />
              <span className="text-[11px] text-rw-text flex-1">Planejados</span>
              <span className="text-[11px] text-rw-muted tabular-nums">{stats.planned}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rw-mist/60 shrink-0" />
              <span className="text-[11px] text-rw-text flex-1">Desejos</span>
              <span className="text-[11px] text-rw-muted tabular-nums">{stats.wishlist}</span>
            </div>
          </div>
        </div>
        
        {/* Cobertura — canto inferior esquerdo */}
        <div className="absolute bottom-12 left-3 bg-rw-dark/90 backdrop-blur-xl border border-rw-border rounded-full px-3 py-1.5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rw-sky shadow-rw-glow-sm animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-rw-muted font-semibold">
            Cobertura
          </span>
          <span className="text-sm font-bold text-rw-text tabular-nums">
            {stats.coverage.toFixed(1)}
            <span className="text-rw-muted text-[10px] ml-0.5">%</span>
          </span>
        </div>
        
        {/* Zoom Controls Overlay */}
        <div className="absolute bottom-12 right-3 flex flex-col bg-rw-dark/90 backdrop-blur-xl border border-rw-border rounded-xl overflow-hidden">
          <button 
            className="w-9 h-9 flex items-center justify-center text-rw-text hover:bg-rw-sky/10 hover:text-rw-sky transition-colors border-b border-rw-border font-bold"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            className="w-9 h-9 flex items-center justify-center text-rw-text hover:bg-rw-sky/10 hover:text-rw-sky transition-colors font-bold"
          >
            <ZoomOut size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
