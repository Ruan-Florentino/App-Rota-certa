import React from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from './hooks/useOnboarding';
import { ProgressDots } from './components/CommonComponents';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { StyleScreen } from './screens/StyleScreen';
import { DestinationScreen } from './screens/DestinationScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { FrequencyScreen } from './screens/FrequencyScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { ResultScreen } from './screens/ResultScreen';

const screens = [
  WelcomeScreen,
  StyleScreen,
  DestinationScreen,
  BudgetScreen,
  FrequencyScreen,
  LoadingScreen,
  ResultScreen
];

export const OnboardingFlow = () => {
  const { state } = useOnboarding();
  const CurrentScreen = screens[state.currentStep];
  
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col p-5">
      {state.currentStep > 0 && state.currentStep < 5 && <ProgressDots current={state.currentStep - 1} total={4} />}
      
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          key={state.currentStep}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          <CurrentScreen />
        </motion.div>
      </div>
    </div>
  );
};
