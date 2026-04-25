import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DestinationCard } from './DestinationCard';

interface Destination {
  id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  rating: number;
  imageUrl?: string;
}

interface Props {
  destinations: Destination[];
  onSelect: (id: string) => void;
}

export function DestinationsCarousel({ destinations, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between px-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">EXPLORAR</h2>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
            Destinos que combinam com você
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-cyan-400 
                           transition-colors hover:text-cyan-300 cursor-pointer">
          VER TODOS <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Carrossel com botões de navegação */}
      <div className="relative group">
        {/* Botão esquerdo */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 
                     items-center justify-center rounded-full bg-slate-900/80 
                     backdrop-blur-md border border-white/10 text-white cursor-pointer
                     opacity-0 transition-all group-hover:opacity-100 
                     hover:bg-cyan-500 hover:text-slate-900 md:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Container scrollável */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 
                     snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {destinations.map((dest) => (
            <div key={dest.id} className="snap-start">
              <DestinationCard
                {...dest}
                onClick={() => onSelect(dest.id)}
              />
            </div>
          ))}
        </div>

        {/* Botão direito */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 
                     items-center justify-center rounded-full bg-slate-900/80 
                     backdrop-blur-md border border-white/10 text-white cursor-pointer
                     opacity-0 transition-all group-hover:opacity-100 
                     hover:bg-cyan-500 hover:text-slate-900 md:flex"
          aria-label="Próximo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
