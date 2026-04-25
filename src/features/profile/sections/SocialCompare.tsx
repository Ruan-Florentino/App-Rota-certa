import { motion } from 'motion/react';
import { Users2 } from 'lucide-react';

export const SocialCompare = () => {
  return (
    <section className="py-12">
      <h2 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs mb-12 flex items-center gap-4">
        Social Layer <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="border border-white/10 rounded-3xl p-8 bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden group">
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />

        <div className="w-16 h-16 rounded-full bg-[#1A1F35] border border-white/20 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
          <Users2 className="w-6 h-6 text-white/50" />
        </div>

        <h3 className="text-2xl font-black text-white tracking-tighter mb-2 relative z-10">Versus Mode</h3>
        <p className="text-white/50 text-sm max-w-xs mx-auto mb-8 relative z-10">
          Compare seu mapa com amigos. Descubra territórios em comum e veja quem explora mais o mundo.
        </p>

        <button className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors relative z-10">
          Encontrar Amigos
        </button>
      </div>
    </section>
  );
};
