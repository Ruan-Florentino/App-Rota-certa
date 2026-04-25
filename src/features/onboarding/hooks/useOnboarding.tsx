import { createContext, useContext, useState, ReactNode } from 'react';
import { useUserStore } from '../../../stores/userStore';
import { buildProfileFromOnboarding } from '../utils/profileBuilder';

interface OnboardingState {
  currentStep: number;
  styles: string[];
  destinations: string[];
  customDestination: string;
  budget: number;
  frequency: string;
}

interface OnboardingContextType {
  state: OnboardingState;
  nextStep: () => void;
  prevStep: () => void;
  toggleStyle: (style: string) => void;
  toggleDestination: (dest: string) => void;
  setCustomDestination: (dest: string) => void;
  setBudget: (budget: number) => void;
  setFrequency: (freq: string) => void;
  finishOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    styles: [],
    destinations: [],
    customDestination: '',
    budget: 5000,
    frequency: '',
  });

  const setUser = useUserStore((s) => s.setUserFromOnboarding);

  const nextStep = () => setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  const prevStep = () => setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  
  const toggleStyle = (style: string) => setState(prev => ({
    ...prev,
    styles: prev.styles.includes(style) ? prev.styles.filter(s => s !== style) : [...prev.styles, style]
  }));

  const toggleDestination = (dest: string) => setState(prev => ({
    ...prev,
    destinations: prev.destinations.includes(dest) ? prev.destinations.filter(d => d !== dest) : [...prev.destinations, dest]
  }));

  const setCustomDestination = (custom: string) => setState(prev => ({ ...prev, customDestination: custom }));
  const setBudget = (budget: number) => setState(prev => ({ ...prev, budget }));
  const setFrequency = (frequency: string) => setState(prev => ({ ...prev, frequency }));

  const finishOnboarding = () => {
    const profile = buildProfileFromOnboarding(state);
    setUser(profile);
  };

  const contextValue = { 
    state, 
    nextStep, 
    prevStep, 
    toggleStyle, 
    toggleDestination, 
    setCustomDestination, 
    setBudget, 
    setFrequency, 
    finishOnboarding 
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
    return context;
};
