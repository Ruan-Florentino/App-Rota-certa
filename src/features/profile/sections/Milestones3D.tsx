import { motion } from 'motion/react';
import { useTravelStats } from '../hooks/useTravelStats';
import { Award, Lock } from 'lucide-react';

export const Milestones3D = () => {
  const stats = useTravelStats();

  const achievements = [
    { id: 'first_trip', title: 'O Primeiro Passo', desc: 'Sua primeira viagem registrada.', condition: stats.totalCountries >= 1 },
    { id: 'five_countries', title: 'Explorador Nato', desc: 'Visitou 5 países.', condition: stats.totalCountries >= 5 },
    { id: 'three_continents', title: 'Cidadão do Mundo', desc: '3 continentes diferentes.', condition: stats.totalContinents >= 3 },
    { id: 'globe_trotter', title: 'Globe Trotter', desc: 'Viajou mais de 40.000km.', condition: stats.totalKm >= 40075 },
    { id: 'veteran', title: 'Veterano', desc: 'Registrou 20 viagens.', condition: stats.totalTrips >= 20 },
    { id: 'secret', title: '???', desc: 'Continue viajando para descobrir.', condition: false, isSecret: true },
  ];

  return (
    <section className="py-12">
      <h2 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs mb-12 flex items-center gap-4">
        Conquistas <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={ach.condition ? { scale: 1.02, boxShadow: '0 0 20px rgba(212,175,55,0.3)' } : {}}
            className={`relative p-6 rounded-3xl border flex flex-col items-center text-center transition-all duration-500 cursor-pointer ${
              ach.condition 
                ? 'bg-gradient-to-b from-[#D4AF37]/20 to-transparent border-[#D4AF37]/30 hover:border-[#D4AF37]' 
                : 'bg-white/5 border-white/5 grayscale opacity-50'
            }`}
          >
            <div className={`w-20 h-20 rounded-full mb-6 relative flex items-center justify-center perspective-1000 ${
              ach.condition ? 'bg-gradient-to-br from-[#FFF8D6] to-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]' : 'bg-white/10'
            }`}>
              {ach.condition ? (
                <Award className="w-10 h-10 text-black drop-shadow-md" />
              ) : (
                <Lock className="w-8 h-8 text-white/30" />
              )}
            </div>
            
            <h3 className={`text-sm font-black mb-1 ${ach.condition ? 'text-white' : 'text-white/50'}`}>
              {ach.title}
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold leading-relaxed px-2">
              {ach.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
