import React from 'react';
import { ChevronRight } from 'lucide-react';
import { mockTripsData } from '../data/mockProfile';

export default function TravelTimeline() {
  return (
    <div className="pt-[16px]">
      <h3 className="text-[#00E5D4] text-[14px] font-bold mb-[16px] uppercase tracking-wider">
        📅 Timeline de Viagens
      </h3>
      
      <div className="relative pl-[24px]">
        <div className="absolute top-0 bottom-0 left-[7px] w-[2px] bg-gradient-to-b from-[#00E5D4] to-transparent" />
        
        {mockTripsData.map((trip) => (
          <div key={trip.id} className="relative mb-[16px]">
            {/* Dot */}
            <div className="absolute -left-[24px] top-[50%] -translate-y-1/2 w-[16px] h-[16px] bg-[#0A0E1A] rounded-full border-[4px] border-[#00E5D4]" />
            
            <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[20px] p-[12px] flex items-center gap-[12px]">
               <img src={trip.image} className="w-[80px] h-[80px] rounded-[14px] object-cover bg-white/10" alt={trip.destination} />
               
               <div className="flex-1 flex flex-col justify-center">
                 <h4 className="text-white text-[16px] font-bold uppercase">{trip.destination}</h4>
                 <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider mb-[4px]">
                   {trip.date} • {trip.days} DIAS
                 </span>
                 <div className="flex gap-[8px]">
                    <span className="bg-[#00E5D4]/10 text-[#00E5D4] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                      R$ {trip.cost.toLocaleString('pt-BR')}
                    </span>
                    <span className="bg-white/5 text-white/80 text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                      ⭐ {trip.rating}
                    </span>
                 </div>
               </div>
               
               <ChevronRight size={20} className="text-[#5A6178] mr-[4px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
