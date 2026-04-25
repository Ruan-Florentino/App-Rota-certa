import { motion } from 'motion/react';
import { useTravelDNA } from '../hooks/useTravelDNA';
import { Text } from '@/components/ui/Text';

export const TravelDNA = () => {
  const dna = useTravelDNA();

  const traits = [
    { label: 'Aventura', value: dna.adventure, color: 'bg-orange-500' },
    { label: 'Cultura', value: dna.culture, color: 'bg-purple-500' },
    { label: 'Natureza', value: dna.nature, color: 'bg-emerald-500' },
    { label: 'Urbano', value: dna.urban, color: 'bg-blue-500' }
  ];

  return (
    <section className="py-12">
      <h2 className="flex items-center gap-4 text-[#D4AF37] mb-12">
        <Text variant="label-lg" color="#D4AF37">Travel DNA</Text>
        <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
        {/* Background Helixes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 4, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-full h-[1px] bg-[#D4AF37]"
              style={{ top: `${(i + 1) * 10}%`, transform: `rotate(${i * 15}deg)` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-center md:text-left">
            <Text variant="label-md" color="white/50" className="mb-2 block">O seu arquétipo é:</Text>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-6">
              <Text variant="display-sm" as="h3">{dna.archetype}</Text>
            </div>
            <Text variant="body-sm" color="white/60" className="max-w-sm mx-auto md:mx-0 block">
              O algoritmo analisou seu histórico. Você tem uma inclinação forte para explorar lugares que oferecem este tipo de experiência.
            </Text>
          </div>

          <div className="flex-1 w-full space-y-6">
            {traits.map((t, i) => (
              <div key={t.label}>
                <div className="flex justify-between mb-2">
                  <Text variant="label-sm" color="white/80">{t.label}</Text>
                  <Text variant="mono-sm" color="white/40">{t.value}%</Text>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${t.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                    className={`h-full ${t.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
