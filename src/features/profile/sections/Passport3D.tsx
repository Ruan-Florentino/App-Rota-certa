import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTravelStats } from '../hooks/useTravelStats';

export const Passport3D = () => {
  const stats = useTravelStats();
  const [currentPage, setCurrentPage] = useState(0);

  const stamps = stats.visitedCountries;
  const totalPages = Math.max(1, Math.ceil(stamps.length / 4));

  const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const prevPage = () => setCurrentPage(p => Math.max(0, p - 1));

  return (
    <section className="py-12">
      <h2 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs mb-12 flex items-center gap-4">
        Passaporte Digital <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="relative w-full max-w-md mx-auto aspect-[1/1.4] perspective-[2000px]">
        {/* The Passport Book */}
        <div className="relative w-full h-full transform-style-3d transition-transform duration-700" 
             style={{ transform: currentPage === 0 ? 'rotateY(0deg)' : 'rotateY(-10deg) translateX(10%)' }}>
          
          {/* Cover */}
          <AnimatePresence>
            {currentPage === 0 && (
              <motion.div 
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1, originX: 0 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-[#1A233A] rounded-r-3xl rounded-l-md shadow-2xl border-l-[8px] border-[#0F1525] flex flex-col items-center justify-center overflow-hidden z-20 cursor-pointer"
                onClick={nextPage}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-multiply" />
                <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/50 flex items-center justify-center mb-8 relative z-10">
                   <span className="text-[#D4AF37] text-3xl font-serif">RW</span>
                </div>
                <h3 className="text-[#D4AF37] font-black tracking-[0.5em] text-xl uppercase relative z-10 text-center px-4">
                  Passaporte<br/>Oficial
                </h3>
                <p className="mt-2 text-[#D4AF37]/60 text-xs font-mono uppercase tracking-widest">República dos Exploradores</p>
                
                <div className="absolute bottom-8 text-white/30 text-xs uppercase tracking-widest animate-pulse">
                  Tocar para abrir
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inner Pages Container */}
          <div className="absolute inset-0 bg-[#FFF8E7] rounded-r-3xl rounded-l-md shadow-inner overflow-hidden z-10 flex flex-col">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
            
            {/* Pages Content */}
            <div className="flex-1 p-6 relative">
               <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
                 <span className="text-black/30 font-mono text-xs font-bold uppercase rounded-full border border-black/10 px-2 py-0.5">Vistos / Visas</span>
                 <span className="text-black/30 font-mono text-xs">{currentPage}</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 h-full pt-4">
                 {stamps.length === 0 && currentPage === 1 && (
                    <div className="col-span-2 flex flex-col items-center justify-center text-center opacity-50 pt-20">
                      <span className="text-4xl mb-4">✈️</span>
                      <p className="text-black text-sm font-bold uppercase tracking-widest">Página em branco</p>
                      <p className="text-black text-xs font-mono mt-2">Sua jornada começa aqui.</p>
                    </div>
                 )}
                 {stamps.slice((currentPage - 1) * 4, currentPage * 4).map((stamp, i) => (
                   <motion.div 
                     key={stamp.id}
                     initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                     animate={{ scale: 1, opacity: 1, rotate: Math.sin(i) * 10 }}
                     transition={{ delay: i * 0.1, type: 'spring' }}
                     className="w-24 h-24 mx-auto rounded-full border-4 border-dashed flex flex-col items-center justify-center p-2 relative"
                     style={{ 
                       borderColor: i % 2 === 0 ? 'rgba(212,40,40,0.6)' : 'rgba(30,60,200,0.6)',
                       color: i % 2 === 0 ? 'rgba(212,40,40,0.8)' : 'rgba(30,60,200,0.8)',
                       transform: `rotate(${Math.random() * 20 - 10}deg)`
                     }}
                   >
                     <span className="text-2xl mb-1">{stamp.flag}</span>
                     <span className="text-[10px] font-black uppercase text-center leading-none">{stamp.countryCode}</span>
                     <span className="text-[8px] font-mono mt-1 opacity-70">{new Date(stamp.createdAt).toLocaleDateString('pt-BR', {month:'short', year:'numeric'})}</span>
                     <div className="absolute inset-0 bg-white/20 rounded-full mix-blend-overlay" />
                   </motion.div>
                 ))}
               </div>
            </div>

            {/* Pagination Controls */}
            <div className="h-16 flex items-center justify-between px-4 shrink-0 relative z-20">
              <button 
                onClick={prevPage}
                className="text-black/40 font-bold text-xs uppercase tracking-widest p-2 hover:bg-black/5 rounded"
              >
                Anterior
              </button>
              <button 
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="text-black/40 font-bold text-xs uppercase tracking-widest p-2 hover:bg-black/5 rounded disabled:opacity-30"
              >
                Próxima
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
