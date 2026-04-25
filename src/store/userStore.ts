import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  username: string;           // @handle
  bio: string;                // até 160 chars
  city: string;
  country: string;            // código ISO
  instagram?: string;         // só o handle, sem @
  avatarUrl?: string;
  coverUrl?: string;          // fundo customizado
  joinedAt: string;           // ISO date
}

interface UserStore {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  // Note: Upload logic would typically be handled by a service, 
  // but we'll simulate the state update here.
  uploadAvatar: (url: string) => void;
  uploadCover: (url: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Fabiana Exploradora',
  username: 'fabiana_globetrotter',
  bio: '✈️ Desenhando novas rotas e colecionando horizontes pelo mundo. Apaixonada por montanhas e cafés locais.',
  city: 'São Paulo',
  country: 'BR',
  instagram: 'fabiana.travels',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200&h=400',
  joinedAt: new Date('2023-01-15').toISOString(),
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (partial) =>
        set((state) => ({ profile: { ...state.profile, ...partial } })),
      uploadAvatar: (url) =>
        set((state) => ({ profile: { ...state.profile, avatarUrl: url } })),
      uploadCover: (url) =>
        set((state) => ({ profile: { ...state.profile, coverUrl: url } })),
    }),
    {
      name: 'rw-user-storage',
    }
  )
);
