import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Destination } from '../types/explore.types';

interface ExploreState {
  activeFilter: string;
  searchQuery: string;
  favorites: string[];
  setFilter: (f: string) => void;
  setSearch: (q: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useExploreStore = create<ExploreState>()(
  persist(
    (set) => ({
      activeFilter: 'Todos',
      searchQuery: '',
      favorites: [],
      setFilter: (activeFilter) => set({ activeFilter }),
      setSearch: (searchQuery) => set({ searchQuery }),
      toggleFavorite: (id) => set((s) => ({
        favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id]
      }))
    }),
    { name: 'rightway_explore_store' }
  )
);
