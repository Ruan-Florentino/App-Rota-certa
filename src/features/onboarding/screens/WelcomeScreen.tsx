import React from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from '../hooks/useOnboarding';
import { NavigationButton } from '../components/CommonComponents';

export const WelcomeScreen = () => {
  const { nextStep } = useOnboarding();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl">🌍</motion.div>
      <h1 className="text-4xl font-black" style={{ fontFamily: '"Fraunces", serif' }}>Sua próxima aventura começa aqui</h1>
      <p className="text-gray-400">Vamos personalizar sua experiência em 30 segundos</p>
      <NavigationButton onClick={nextStep} label="COMEÇAR →" />
    </div>
  );
};
