import { create } from 'zustand';
import { UserProfile, Trip, Destination } from '../types';

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  updateTripCosts: (costs: Partial<Trip['costs']>) => void;
  deleteTrip: (id: string) => void;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  searchHistory: string[];
  addToHistory: (query: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  exploreDestinations: Destination[];
  setExploreDestinations: (destinations: Destination[]) => void;
  
  // Real Data State
  currencyRates: CurrencyRates;
  setCurrencyRates: (rates: CurrencyRates) => void;
  searchResults: {
    flights: FlightOffer[];
    hotels: HotelOffer[];
  };
  setSearchResults: (results: { flights: FlightOffer[]; hotels: HotelOffer[] }) => void;
  
  // Travel Finance State
  budget: number;
  expenses: Array<{
    id: string;
    title: string;
    amount: number;
    category: 'Hotel' | 'Comida' | 'Voos' | 'Passeios' | 'Compras' | 'Outros';
    date: string;
    description?: string;
  }>;
  setBudget: (budget: number) => void;
  addExpense: (expense: any) => void;
  deleteExpense: (id: string) => void;
}

import { CurrencyRates } from '../services/currencyService';
import { FlightOffer } from '../services/flightService';
import { HotelOffer } from '../services/hotelService';

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  trips: [],
  setTrips: (trips) => set({ trips }),
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  updateTrip: (updatedTrip) => set((state) => ({
    trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t),
    currentTrip: state.currentTrip?.id === updatedTrip.id ? updatedTrip : state.currentTrip
  })),
  updateTripCosts: (costs: Partial<Trip['costs']>) => set((state) => {
    if (!state.currentTrip) return state;
    const newCosts = { ...state.currentTrip.costs, ...costs };
    newCosts.total = newCosts.hotel + newCosts.food + newCosts.transport + newCosts.activities;
    return {
      currentTrip: {
        ...state.currentTrip,
        costs: newCosts
      }
    };
  }),
  deleteTrip: (id) => set((state) => ({
    trips: state.trips.filter(t => t.id !== id)
  })),
  currentTrip: null,
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  searchHistory: [],
  addToHistory: (query) => set((state) => ({
    searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10)
  })),
  favorites: [],
  toggleFavorite: (id) => set((state) => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter(fid => fid !== id)
      : [...state.favorites, id]
  })),
  exploreDestinations: [],
  setExploreDestinations: (exploreDestinations) => set({ exploreDestinations }),

  // Real Data Initial State
  currencyRates: { 'BRL': 5.42, 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.78 },
  setCurrencyRates: (currencyRates) => set({ currencyRates }),
  searchResults: { flights: [], hotels: [] },
  setSearchResults: (searchResults) => set({ searchResults }),

  // Travel Finance Initial State
  budget: 5000.00,
  expenses: [
    { id: '1', title: 'Hotel Paris', amount: 1200.00, category: 'Hotel', date: '2024-03-20', description: 'Hospedagem centro' },
    { id: '2', title: 'Almoço Louvre', amount: 340.00, category: 'Comida', date: '2024-03-21', description: 'Restaurante museu' },
    { id: '3', title: 'Torre Eiffel', amount: 150.00, category: 'Passeios', date: '2024-03-22', description: 'Ingresso topo' }
  ],
  setBudget: (budget) => set({ budget }),
  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
  deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) })),
}));
