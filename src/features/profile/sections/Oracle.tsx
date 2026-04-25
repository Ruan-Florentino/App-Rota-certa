import { motion, AnimatePresence } from 'motion/react';
import { useOracleAI } from '../hooks/useOracleAI';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTripsStore } from '@/stores/tripsStore';
import { Text } from '@/components/ui/Text';

export const Oracle = () => {
  const { isThinking, suggestions, generateDestinations } = useOracleAI();
  const { addTrip } = useTripsStore();

  return (
    <section className="py-12">
      <h2 className="flex items-center gap-4 text-[#D4AF37] mb-12">
        <Text variant="label-lg" color="#D4AF37">O Oráculo</Text>
        <div className="h-px bg-white/10 flex-1" />
      </h2>

      <div className="bg-[#1A1F35] border border-[#D4AF37]/20 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center">
        {/* Mystic background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#1A1F35] to-black" />
        
        <button 
          onClick={generateDestinations}
          disabled={isThinking}
          className="relative group cursor-pointer z-10 my-8"
        >
          {/* Glowing Orb */}
          <motion.div 
            animate={{ 
              scale: isThinking ? [1, 1.2, 1] : 1,
              rotate: isThinking ? 360 : 0
            }}
            transition={{ 
              scale: { repeat: Infinity, duration: 1.5 },
              rotate: { repeat: Infinity, duration: 3, ease: 'linear' }
            }}
            className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-600 via-blue-500 to-[#D4AF37] shadow-[0_0_60px_rgba(123,97,255,0.4)] relative"
          >
            <div className="absolute inset-1 rounded-full bg-[#1A1F35]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-transparent to-[#D4AF37]/30 blur-md pointer-events-none" />
            <Sparkles className={`w-10 h-10 text-white ${isThinking ? 'animate-ping' : 'animate-pulse'}`} />
          </motion.div>
          {!isThinking && suggestions.length === 0 && (
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              <Text variant="label-sm" color="#D4AF37">Consultar o destino</Text>
            </p>
          )}
        </button>

        <AnimatePresence>
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center mt-4 h-6"
            >
              <Text variant="mono-sm" color="white/60">Analisando seu DNA de viagem...</Text>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isThinking && suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-8 space-y-4 relative z-10"
            >
              {suggestions.map((s, i) => (
                <motion.div 
                  key={s.countryCode}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-colors"
                >
                  <span className="text-4xl">{s.flag}</span>
                  <div className="flex-1">
                    <Text variant="h4" color="white" className="mb-1 block">{s.countryName}</Text>
                    <Text variant="body-xs" color="white/50">{s.reason}</Text>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-purple-500 to-[#D4AF37]" style={{ width: `${s.matchScore}%` }} />
                      </div>
                      <Text variant="mono-sm" color="white/40">{s.matchScore}% match</Text>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                       addTrip({ countryCode: s.countryCode, status: 'wishlist' });
                       // Maybe show a toast
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
