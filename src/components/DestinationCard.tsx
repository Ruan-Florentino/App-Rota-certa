import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils';
import { OptimizedImage } from './OptimizedImage';

interface DestinationCardProps {
  name: string;
  country: string;
  category: string;
  price: number;
  rating: number;
  imageUrl?: string;
  onClick?: () => void;
}

export function DestinationCard({
  name,
  country,
  category,
  price,
  rating,
  imageUrl,
  onClick,
}: DestinationCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-[280px] flex-shrink-0 overflow-hidden rounded-3xl 
                 bg-slate-900/50 backdrop-blur-xl border border-white/10 
                 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/50
                 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      {/* Container da imagem com OptimizedImage */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <OptimizedImage
          src={imageUrl}
          alt={`${name}, ${country}`}
          destinationName={name}
          className="w-full h-full group-hover:scale-110"
        />

        {/* Overlay gradiente para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />

        {/* Badge de rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full 
                        bg-slate-900/80 backdrop-blur-md px-2.5 py-1 border border-white/20">
          <Star className="h-3 w-3 fill-cyan-400 text-cyan-400" />
          <span className="text-xs font-semibold text-white">{rating}</span>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 text-left">
        {/* Tag de categoria */}
        <span className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 
                         text-[10px] font-bold uppercase tracking-wider text-cyan-300">
          {category}
        </span>

        {/* Nome do destino */}
        <h3 className="mt-3 text-xl font-bold text-white tracking-tight">
          {name.toUpperCase()}
        </h3>

        {/* País */}
        <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>{country}</span>
        </div>

        {/* Footer com preço e CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Preço médio
            </p>
            <p className="text-base font-bold text-white">
              {formatCurrency(price)}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full 
                          bg-white/5 transition-transform group-hover:scale-110 
                          group-hover:bg-primary group-hover:text-slate-900 text-white/40">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  );
}
