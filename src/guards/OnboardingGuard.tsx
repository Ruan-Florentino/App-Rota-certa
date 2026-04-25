import React from 'react';
import { useUserStore } from '../stores/userStore';
import { OnboardingFlow } from '../features/onboarding/OnboardingFlow';
import { OnboardingProvider } from '../features/onboarding/hooks/useOnboarding';
import { WelcomeModal } from '../components/WelcomeModal';

export const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((s) => s.user);

  if (!user || user.onboardingCompleted !== true) {
    return (
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    );
  }

  return (
    <>
      {!user.hasSeenWelcome && <WelcomeModal />}
      {children}
    </>
  );
};
