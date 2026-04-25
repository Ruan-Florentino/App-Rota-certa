import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Trip, TripsState, TripsActions } from '../types/trips.types';

export const useTripsStore = create<TripsState & TripsActions>()(
  persist(
    (set) => ({
      trips: [],
      activeTab: 'upcoming',
      selectedTrip: null,
      addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip] })),
      updateTrip: (id, updates) => set((s) => ({
        trips: s.trips.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTrip: (id) => set((s) => ({ trips: s.trips.filter(t => t.id !== id) })),
      duplicateTrip: (id) => set((s) => {
        const trip = s.trips.find(t => t.id === id);
        if (!trip) return s;
        const newTrip = { ...trip, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
        return { trips: [...s.trips, newTrip] };
      }),
      setActiveTab: (activeTab) => set({ activeTab }),
      selectTrip: (selectedTrip) => set({ selectedTrip }),
      toggleChecklistItem: (tripId, itemId) => set((s) => ({
        trips: s.trips.map(t => t.id === tripId ? {
          ...t,
          preparationChecklist: t.preparationChecklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        } : t)
      })),
    }),
    { name: 'rightway_trips_store' }
  )
);
