import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TripStatus = 'visited' | 'planned' | 'wishlist';

export interface Trip {
  id: string;
  countryCode: string;      // ISO alpha-2, ex: 'BR'
  status: TripStatus;
  city?: string;
  year?: number;
  notes?: string;
  createdAt: string;
}

interface TripsStore {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  removeTrip: (id: string) => void;
  updateTrip: (id: string, partial: Partial<Trip>) => void;
  clearAll: () => void;
  // Selectors
  getByStatus: (status: TripStatus) => Trip[];
  getByCountry: (countryCode: string) => Trip | undefined;
  getStats: () => {
    visited: number;
    planned: number;
    wishlist: number;
    total: number;
    coverage: number; // percentual (0-100)
  };
}

export const useTripsStore = create<TripsStore>()(
  persist(
    (set, get) => ({
      trips: [],
      
      addTrip: (trip) => {
        // Evitar duplicatas: se já existe mesmo country+status, ignorar
        const existing = get().trips.find(
          t => t.countryCode === trip.countryCode && t.status === trip.status
        );
        if (existing) {
          console.warn('Destino já existe:', trip.countryCode, trip.status);
          return;
        }
        
        const newTrip: Trip = {
          ...trip,
          id: `trip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ trips: [...state.trips, newTrip] }));
      },
      
      removeTrip: (id) =>
        set((state) => ({ trips: state.trips.filter(t => t.id !== id) })),
      
      updateTrip: (id, partial) =>
        set((state) => ({
          trips: state.trips.map(t => t.id === id ? { ...t, ...partial } : t)
        })),
      
      clearAll: () => set({ trips: [] }),
      
      getByStatus: (status) => get().trips.filter(t => t.status === status),
      
      getByCountry: (code) => 
        get().trips.find(t => t.countryCode?.toUpperCase() === code?.toUpperCase()),
      
      getStats: () => {
        const trips = get().trips;
        const visited = trips.filter(t => t.status === 'visited').length;
        const planned = trips.filter(t => t.status === 'planned').length;
        const wishlist = trips.filter(t => t.status === 'wishlist').length;
        const total = trips.length;
        const coverage = (visited / 195) * 100;
        return { visited, planned, wishlist, total, coverage };
      },
    }),
    {
      name: 'rw-trips',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          try {
            const oldRaw = localStorage.getItem('rw-trips-storage');
            if (oldRaw) {
              const old = JSON.parse(oldRaw);
              const oldTrips = old?.state?.trips ?? old?.trips ?? [];
              if (Array.isArray(oldTrips) && oldTrips.length > 0) {
                console.log('🔄 Migrando', oldTrips.length, 'trips do store antigo');
                const existing = persistedState?.trips ?? [];
                const merged = [...existing];
                oldTrips.forEach((t: any) => {
                  const dup = merged.find(
                    (m: any) => m.countryCode === t.countryCode && m.status === t.status
                  );
                  if (!dup) merged.push(t);
                });
                persistedState = { ...persistedState, trips: merged };
              }
              localStorage.removeItem('rw-trips-storage');
            }
          } catch (e) {
            console.warn('Falha ao migrar store antigo:', e);
          }
        }
        return persistedState;
      },
    }
  )
);
