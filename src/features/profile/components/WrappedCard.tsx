import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share, Download } from 'lucide-react';
import { mockProfileData as profile } from '../data/mockProfile';
import { toPng } from 'html-to-image';

const slides = [
  { title: "2026 FOI ÉPICO", sub: "Vamos relembrar sua jornada", bg: "from-[#A855F7] to-[#00E5D4]" },
  { title: `Viajou ${profile.stats.kilometers} km`, sub: "Dava pra dar meia volta ao mundo", bg: "from-[#22c55e] to-[#0ea5e9]" },
  { title: `Seu Estilo: ${profile.wrapped.style}`, sub: "E 100% autêntico", bg: "from-[#eab308] to-[#f43f5e]" },
  { title: `Top ${profile.wrapped.percentile}%`, sub: "Dos viajantes do Right Way", bg: "from-[#ec4899] to-[#8b5cf6]" },
];

export default function WrappedCard() {
  const { wrapped } = profile;
  const [showStory, setShowStory] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (storyRef.current) {
      try {
        const dataUrl = await toPng(storyRef.current, { quality: 0.95 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'right-way-wrapped.png', { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            title: 'Meu Right Way Wrapped',
            files: [file]
          });
        } else {
          const link = document.createElement('a');
          link.download = 'right-way-wrapped.png';
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.error('Failed to generate image', err);
      }
    }
  };

  const handleDownload = async () => {
    if (storyRef.current) {
      try {
        const dataUrl = await toPng(storyRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'right-way-wrapped.png';
        link.href = dataUrl;
        link.click();
      } catch (err) { }
    }
  };

  // Auto-advance logic for stories
  React.useEffect(() => {
    if (showStory) {
      const timer = setInterval(() => {
        setCurrentSlide(s => {
          if (s === slides.length - 1) {
            clearInterval(timer);
            return s;
          }
          return s + 1;
        });
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [showStory]);

  return (
    <div className="relative mt-[16px]">
      <div className="absolute -inset-[2px] rounded-[26px] bg-gradient-to-r from-[#00E5D4] via-[#A855F7] to-[#00E5D4] opacity-50 blur-sm animate-[gradient_4s_linear_infinite]" />
      
      <div className="relative bg-[#0F1420]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-[24px] overflow-hidden">
        {/* Glow sub-layer */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-[#00E5D4]/20 to-[#A855F7]/20 blur-[50px] rounded-full pointer-events-none" />

        <h3 className="text-white text-[14px] font-bold uppercase mb-[12px]" style={{ fontFamily: '"Fraunces", serif' }}>
          📊 Right Way Wrapped 2026
        </h3>
        
        <h2 className="text-white text-[20px] mb-[20px]" style={{ fontFamily: '"Fraunces", serif', textWrap: 'balance' }}>
          Você viajou mais que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5D4] to-[#A855F7] font-bold">{wrapped.percentile}%</span> dos usuários! ✨
        </h2>
        
        <div className="grid grid-cols-2 gap-[10px] mb-[24px]">
          <div className="bg-black/30 border border-white/5 rounded-[14px] p-[12px]">
            <span className="text-[#5A6178] text-[9px] uppercase font-bold tracking-wider block mb-[4px]">📍 Destino Top</span>
            <span className="text-white text-[14px] font-bold">{wrapped.topDestination}</span>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-[14px] p-[12px]">
            <span className="text-[#5A6178] text-[9px] uppercase font-bold tracking-wider block mb-[4px]">📏 Distância</span>
            <span className="text-[#00E5D4] text-[14px] font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              {wrapped.distance.toLocaleString('pt-BR')} km
            </span>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-[14px] p-[12px]">
            <span className="text-[#5A6178] text-[9px] uppercase font-bold tracking-wider block mb-[4px]">🗓️ Top Mês</span>
            <span className="text-white text-[14px] font-bold">{wrapped.topMonth}</span>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-[14px] p-[12px]">
            <span className="text-[#5A6178] text-[9px] uppercase font-bold tracking-wider block mb-[4px]">🏆 Seu Estilo</span>
            <span className="text-white text-[14px] font-bold uppercase">{wrapped.style}</span>
          </div>
        </div>
        
        <button 
          onClick={() => { setShowStory(true); setCurrentSlide(0); }}
          className="w-full bg-white text-black font-bold uppercase text-[12px] tracking-[0.1em] py-[14px] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-transform"
        >
          Ver Resumo Completo →
        </button>
      </div>

      {/* Wrapped Fullscreen Modal */}
      <AnimatePresence>
        {showStory && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
             {/* Dynamic background */}
             <div ref={storyRef} className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bg} opacity-80 mix-blend-screen transition-colors duration-1000`} />
             <div className="absolute inset-0 bg-[#0F1420]/50 backdrop-blur-3xl" />
             
             {/* Progress bars */}
             <div className="absolute top-[20px] left-[20px] right-[20px] flex gap-[4px] z-50">
               {slides.map((_, i) => (
                 <div key={i} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-white rounded-full"
                     initial={{ width: i < currentSlide ? '100%' : '0%' }}
                     animate={{ width: i === currentSlide ? '100%' : i < currentSlide ? '100%' : '0%' }}
                     transition={{ duration: i === currentSlide ? 4 : 0, ease: 'linear' }}
                   />
                 </div>
               ))}
             </div>

             {/* Close button */}
             <button onClick={() => setShowStory(false)} className="absolute top-[40px] right-[20px] z-50 w-[40px] h-[40px] bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
               <X size={20} />
             </button>

             {/* Tap targets */}
             <div className="absolute inset-y-0 left-0 w-1/3 z-40" onClick={() => setCurrentSlide(s => Math.max(0, s - 1))} />
             <div className="absolute inset-y-0 right-0 w-2/3 z-40" onClick={() => setCurrentSlide(s => {
               if(s === slides.length -1) setShowStory(false);
               return Math.min(slides.length - 1, s + 1);
             })} />

             {/* Slide Content */}
             <div ref={storyRef} className="relative z-30 flex-1 flex flex-col items-center justify-center p-[40px] text-center pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <h1 className="text-white text-[48px] font-bold leading-tight uppercase mb-[16px] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" style={{ fontFamily: '"Fraunces", serif', textWrap: 'balance' }}>
                      {slides[currentSlide].title}
                    </h1>
                    <p className="text-white/80 text-[18px] uppercase tracking-widest font-bold font-mono">
                      {slides[currentSlide].sub}
                    </p>
                  </motion.div>
                </AnimatePresence>
             </div>

             {/* Footer Actions (only on last slide) */}
             <AnimatePresence>
               {currentSlide === slides.length - 1 && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                   className="absolute bottom-[40px] left-[20px] right-[20px] z-50 flex gap-[12px]"
                 >
                   <button onClick={handleShare} className="flex-1 bg-white text-black py-[16px] rounded-full font-bold uppercase tracking-widest text-[12px] flex items-center justify-center gap-2">
                     <Share size={18} /> Share Story
                   </button>
                   <button onClick={handleDownload} className="w-[50px] h-[50px] bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center border border-white/20">
                     <Download size={20} />
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
