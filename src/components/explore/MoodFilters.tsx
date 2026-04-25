import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { haptics } from '../../lib/haptics';
import { sounds } from '../../lib/sounds';

export const MoodFilters: React.FC = () => {
  const navigate = useNavigate();
  
  const moods = [
    { 
      id: 'romance', 
      label: 'Romance', 
      emoji: '🍷', 
      gradient: 'from-pink-500/20 to-rose-500/5', 
      border: 'hover:border-pink-500/40',
      textcolor: 'text-pink-300'
    },
    { 
      id: 'adventure', 
      label: 'Aventura', 
      emoji: '🎒', 
      gradient: 'from-amber-500/20 to-orange-500/5', 
      border: 'hover:border-amber-500/40',
      textcolor: 'text-amber-300'
    },
    { 
      id: 'chill', 
      label: 'Chill', 
      emoji: '🛋️', 
      gradient: 'from-sky-500/20 to-blue-500/5', 
      border: 'hover:border-sky-500/40',
      textcolor: 'text-sky-300'
    },
    { 
      id: 'economic', 
      label: 'Econômico', 
      emoji: '💸', 
      gradient: 'from-emerald-500/20 to-green-500/5', 
      border: 'hover:border-emerald-500/40',
      textcolor: 'text-emerald-300'
    },
  ];

  const handleMoodClick = (mood: any) => {
    haptics.selection();
    sounds.play('pop');
    // Navega para aba de destinos ou filtro específico se existir
    navigate('/explore/all-destinations');
  };

  return (
    <section className="px-6 pt-6 pb-12">
      <div className="mb-6">
        <h3 className="section-title">A vibe de hoje</h3>
        <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-mono">Como você está se sentindo?</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood, i) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodClick(mood)}
            className={`relative flex flex-col items-center justify-center p-6 h-28 rounded-3xl bg-gradient-to-br ${mood.gradient} border border-white/5 ${mood.border} transition-all duration-300 overflow-hidden group`}
          >
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-white/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            
            <motion.span 
              className="text-3xl mb-2 filter drop-shadow-lg z-10"
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.15 }}
              transition={{ duration: 0.5 }}
            >
              {mood.emoji}
            </motion.span>
            
            <span className={`text-[12px] font-bold uppercase tracking-[0.15em] z-10 ${mood.textcolor}`}>
              {mood.label}
            </span>
            
            <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${mood.gradient} opacity-50`} />
          </motion.button>
        ))}
      </div>
    </section>
  );
};
