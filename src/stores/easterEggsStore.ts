import { create } from 'zustand';

interface EasterEggsState {
  discovered: string[];
  partyMode: boolean;
  devMode: boolean;
  secretTheme: boolean;
  
  discover: (id: string) => void;
  activatePartyMode: (active: boolean) => void;
  toggleDevMode: () => void;
  activateSecretTheme: (active: boolean) => void;
}

export const useEasterEggStore = create<EasterEggsState>((set) => ({
  discovered: [],
  partyMode: false,
  devMode: false,
  secretTheme: false,
  
  discover: (id) => set((s) => s.discovered.includes(id) ? s : ({ discovered: [...s.discovered, id] })),
  activatePartyMode: (active) => set({ partyMode: active }),
  toggleDevMode: () => set((s) => ({ devMode: !s.devMode })),
  activateSecretTheme: (active) => set({ secretTheme: active }),
}));
