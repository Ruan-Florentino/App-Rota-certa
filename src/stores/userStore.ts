import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types/user.types';

interface UserStore {
  user: UserProfile | null;
  setUserFromOnboarding: (data: Partial<UserProfile>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<UserProfile['settings']>) => void;
  resetProfile: () => void;
  setHasSeenWelcome: (value: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
  setUserFromOnboarding: (data) => set((state) => ({ 
        user: { 
          ...state.user, 
          ...data,
          id: data.id || 'user_' + Math.random().toString(36).substr(2, 9),
          username: data.username || 'viajante_' + Math.random().toString(36).substr(2, 4),
          avatarUrl: null,
          coverUrl: null,
          location: 'Brasil',
          links: {},
          joinedAt: new Date(),
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          hasSeenWelcome: false,
          settings: {
            theme: 'dark',
            accentColor: 'purple',
            fontSize: 'medium',
            language: 'pt-BR',
            currency: 'BRL',
            measurement: 'metric',
            notifications: { push: true, tripReminders: true, offers: true, aiTips: true, community: true },
            privacy: { publicProfile: true, showTrips: true, allowMessages: true, analytics: true }
          }
        } as UserProfile 
      })),
      updateProfile: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
      updateSettings: (settings) => set((state) => ({ user: state.user ? { ...state.user, settings: { ...state.user.settings, ...settings } } : null })),
      resetProfile: () => set({ user: null }),
      setHasSeenWelcome: (value) => set((state) => ({ user: state.user ? { ...state.user, hasSeenWelcome: value } : null })),
    }),
    {
      name: 'rightway_user_profile',
    }
  )
);
