import React from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from '../hooks/useOnboarding';
import { stylesOptions } from '../data/onboardingData';
import { NavigationButton } from '../components/CommonComponents';

export const StyleScreen = () => {
  const { state, toggleStyle, nextStep } = useOnboarding();
  return (
    <div className="flex flex-col h-full gap-5">
      <h2 className="text-3xl font-bold">Qual seu estilo de viagem?</h2>
      <p className="text-gray-400">Pode escolher mais de um</p>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {stylesOptions.map(s => (
          <motion.button 
            key={s.id}
            onClick={() => toggleStyle(s.id)}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl border ${state.styles.includes(s.id) ? 'border-[#A855F7] bg-[#A855F7]/10' : 'border-white/10 bg-white/5'}`}
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-bold">{s.label}</div>
          </motion.button>
        ))}
      </div>
      <NavigationButton onClick={nextStep} label="PRÓXIMO" disabled={state.styles.length === 0} />
    </div>
  );
};
