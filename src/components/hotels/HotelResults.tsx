import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Building2, Crown, Info } from 'lucide-react';
import { hotelChains } from '../../data/hotelBrands';
import { trackEvent } from '../../services/analyticsService';
import { toast } from 'sonner';

interface HotelResultsProps {
  destination: string;
}

export function HotelResults({ destination }: HotelResultsProps) {
  const handleChainClick = (chain: typeof hotelChains[0]) => {
    const url = chain.bookingUrl(destination);
    
    // Analytics
    trackEvent('hotel_search_chain_click', {
      chain: chain.id,
      destination
    });
    
    // Abre em nova aba
    window.open(url, '_blank', 'noopener,noreferrer');
    
    toast.success(`Redirecionando para reservar direto com \${chain.name}`, {
      icon: <ExternalLink size={16} />,
    });
  };
  
  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-1 text-center md:text-left md:flex-row md:items-end md:justify-between">
        <div>
            <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
            🏨 Redes Oficiais Parceiras
            </h3>
            <p className="text-sm text-white/50 mt-1">
            Reserve a hospedagem evitando agentes terceirizados.
            </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
            <Crown size={14} /> Pontuação Garantida
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {hotelChains.map((chain, i) => (
          <motion.button
            key={chain.id}
            className="group relative flex flex-col p-5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChainClick(chain)}
            style={{ '--hotel-color': chain.color } as any}
          >
            {/* Ambient Background Glow */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                style={{ background: `linear-gradient(135deg, ${chain.color}, transparent)` }} 
            />

            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-16 h-16 bg-white rounded-xl shadow-lg border border-black/5 flex items-center justify-center p-3 overflow-hidden">
                <img 
                    src={chain.logo} 
                    alt={chain.name}
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg leading-tight">{chain.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                        <span>Padrão 
                          {chain.budgetLevel === 1 ? ' Econômico' : 
                          chain.budgetLevel === 2 ? ' Premium' : ' Luxo'}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-white/60 line-clamp-2 mt-2 mb-4">
              {chain.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10 w-full">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                  {destination}
                </span>
                
                <div 
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all text-white border"
                    style={{ backgroundColor: `${chain.color}40`, borderColor: `${chain.color}80` }}
                >
                    Buscar <ExternalLink size={12} />
                </div>
            </div>
            
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 flex gap-3 p-4 bg-white/5 border border-white/5 rounded-xl items-start">
        <Info className="text-secondary mt-0.5 flex-shrink-0" size={18} />
        <p className="text-xs leading-relaxed text-white/60">
          Você será redirecionado para o site oficial da rede de hotéis. 
          Reservando direto pela rede oficial, você ganha <strong>pontos no programa de fidelidade</strong> e garante flexibilidade nos check-ins/check-outs.
        </p>
      </div>
    </motion.div>
  );
}
