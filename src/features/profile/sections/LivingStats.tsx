import { motion } from 'motion/react';
import { useTravelStats } from '../hooks/useTravelStats';
import { Globe, Plane, MapPin, Clock, CalendarDays, Compass, Camera } from 'lucide-react';
import { Text } from '@/components/ui/Text';
import { useEffect, useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { useProfileStore } from '@/store/profileStore';

const CountUp = ({ to, isDistance }: { to: number | string; isDistance?: boolean }) => {
  const [count, setCount] = useState(0);
  const target = typeof to === 'number' ? to : parseFloat(to as string) || 0;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target]);

  const value = typeof to === 'number' ? Math.round(count) : count;
  
  if (isDistance) {
    return (
      <span style={{ fontFamily: '"JetBrains Mono", monospace' }} className="tabular-nums">
        {Math.round(value).toLocaleString('pt-BR')} km
      </span>
    );
  }

  // Se nao for distancia, entao eh numero grande com Fraunces
  return (
    <span style={{ fontFamily: '"Fraunces", serif' }} className="tabular-nums">
      {typeof to === 'number' ? Math.round(value) : to}
    </span>
  );
};

export const LivingStats = () => {
  const stats = useTravelStats();
  const { profile } = useProfileStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const cards = [
    { label: 'Países', value: stats.totalCountries, icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Km Voados', value: stats.totalKm, isDistance: true, icon: Plane, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Continentes', value: stats.totalContinents, icon: Compass, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Cidades', value: stats.totalCities || 0, icon: MapPin, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Dias Fora', value: stats.totalDays || 0, icon: CalendarDays, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Viagens', value: stats.totalTrips, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-400/10' }
  ];

  const handleShare = async () => {
    if (!storyRef.current) return;
    setGenerating(true);
    
    // Mostra a ref temporariamente pra renderizar (absolute e off-screen)
    storyRef.current.style.display = 'flex';
    
    try {
      const dataUrl = await toPng(storyRef.current, {
        quality: 1,
        width: 1080,
        height: 1920,
        pixelRatio: 2
      });
      
      storyRef.current.style.display = 'none';
      
      const file = new File([await (await fetch(dataUrl)).blob()], 'rightway-wrapped-2026.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Meu Wrapped 2026',
          text: 'Confira minhas estatísticas no Right Way!'
        });
      } else {
        download(dataUrl, 'rightway-wrapped-2026.png');
      }
    } catch (err) {
      console.error(err);
      storyRef.current.style.display = 'none';
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="py-12 relative" ref={wrapperRef}>
      {/* Hidden Layout for Story Export 1080x1920 with 4 stats */}
      <div 
        ref={storyRef}
        style={{ width: '1080px', height: '1920px', display: 'none' }}
        className="absolute top-0 left-[-9999px] flex-col items-center justify-between p-24 bg-[#0A0E1A]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F35] to-black z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0" />
        
        <div className="relative z-10 w-full text-center mt-20">
          <span style={{ fontFamily: '"Fraunces", serif' }} className="text-[#D4AF37] text-7xl font-black uppercase tracking-widest block mb-8">
            RIGHT WAY WRAPPED 2026
          </span>
          <span className="text-white/60 text-4xl uppercase tracking-[0.3em] font-bold">Resumo da Jornada</span>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-12 w-[85%] mx-auto my-auto">
          {cards.slice(0, 4).map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
               <div className={`w-32 h-32 rounded-full ${s.bg} flex items-center justify-center mb-10`}>
                 <s.icon className={`w-16 h-16 ${s.color}`} />
               </div>
               <span style={s.isDistance ? { fontFamily: '"JetBrains Mono", monospace' } : { fontFamily: '"Fraunces", serif' }} className="text-white text-8xl font-black mb-4 tabular-nums">
                 {s.isDistance ? Math.round(s.value as number).toLocaleString('pt-BR') : s.value}
                 {s.isDistance && <span className="text-4xl">km</span>}
               </span>
               <span className="text-white/50 text-3xl font-bold uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>
        
        <div className="relative z-10 w-full flex items-center justify-between mb-10 border-t border-white/10 pt-16 mt-auto">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D4AF37]">
                {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : null}
              </div>
              <span style={{ fontFamily: '"Fraunces", serif' }} className="text-white text-5xl font-black">{profile.name}</span>
           </div>
           
           <div className="flex items-center gap-6">
             <span className="text-[#D4AF37] text-3xl font-bold border border-[#D4AF37] px-6 py-3 rounded-full">RW</span>
             <span className="text-white/40 text-3xl tracking-[0.3em] uppercase">RIGHTWAY.APP</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <h2 className="flex items-center gap-4 flex-1">
          <span 
            className="text-[#D4AF37] uppercase text-2xl md:text-3xl font-black"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            RIGHT WAY WRAPPED 2026
          </span>
          <div className="h-px bg-white/10 flex-1 hidden md:block" />
        </h2>
        
        <button 
          onClick={handleShare}
          disabled={generating}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] disabled:opacity-50"
        >
          <Camera size={16} />
          {generating ? 'GERANDO...' : '📸 COMPARTILHAR STORY'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center text-center cursor-pointer tabular-nums"
          >
            <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-12`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            
            <div className="text-3xl md:text-4xl font-black mb-1 text-white">
              <CountUp to={s.value} isDistance={s.isDistance} />
            </div>
            
            <Text variant="label-md" color="white/50">{s.label}</Text>
            
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

