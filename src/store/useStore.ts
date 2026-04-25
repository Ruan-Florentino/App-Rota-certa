import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, Trip, Destination, DestinationSuggestion } from "../types";
import { useProfileStore } from "./profileStore";

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  completeTrip: (id: string) => void;
  updateTripCosts: (costs: Partial<Trip["costs"]>) => void;
  deleteTrip: (id: string) => void;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  togglePackingItem: (categoryIndex: number, itemIndex: number) => void;
  updateItineraryActivity: (dayIndex: number, activityIndex: number, updatedActivity: any) => void;
  deleteItineraryActivity: (dayIndex: number, activityIndex: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  searchHistory: string[];
  addToHistory: (query: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  exploreDestinations: DestinationSuggestion[];
  setExploreDestinations: (destinations: DestinationSuggestion[]) => void;

  // Real Data State
  currencyRates: CurrencyRates;
  setCurrencyRates: (rates: CurrencyRates) => void;
  searchResults: {
    flights: FlightOffer[];
    hotels: any[];
  };
  setSearchResults: (results: {
    flights: FlightOffer[];
    hotels: any[];
  }) => void;

  // Travel Finance State
  budget: number;
  expenses: Array<{
    id: string;
    title: string;
    amount: number;
    category: "Hotel" | "Comida" | "Voos" | "Passeios" | "Compras" | "Outros";
    date: string;
    description?: string;
  }>;
  setBudget: (budget: number) => void;
  addExpense: (expense: any) => void;
  deleteExpense: (id: string) => void;
}

import { CurrencyRates } from "../services/currencyService";

export interface FlightOffer {
  id: string;
  airline: string;
  price: number;
  currency: string;
  duration: string;
  stops: number;
  departureTime: string;
  arrivalTime: string;
  logo?: string;
  link?: string;
  isMock?: boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      trips: [],
      setTrips: (trips) => set({ trips }),
      addTrip: (trip) => {
        set((state) => ({ trips: [trip, ...state.trips] }));
        
        // Sync with Profile Map as "Planned"
        const profileStore = useProfileStore.getState();
        profileStore.addVisitedPlace({
          id: `planned-${trip.id}`,
          cityId: trip.id || `trip-${Date.now()}`,
          cityName: trip.destination,
          country: trip.country || "Desconhecido",
          countryCode: "US",
          coordinates: { lat: trip.lat || 0, lng: trip.lng || 0 },
          visitedAt: trip.startDate,
          duration: trip.itinerary?.length || 1,
          rating: 5,
          photos: [],
          highlights: [],
          status: 'planned'
        } as any);
      },
      updateTrip: (updatedTrip) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === updatedTrip.id ? updatedTrip : t,
          ),
          currentTrip:
            state.currentTrip?.id === updatedTrip.id
              ? updatedTrip
              : state.currentTrip,
        })),
      completeTrip: (id) => {
        const trip = get().trips.find(t => t.id === id);
        if (!trip) return;

        // Mark as completed
        const profileStore = useProfileStore.getState();
        
        // Remove planned version
        profileStore.removeVisitedPlace(`planned-${id}`);
        
        // Add as visited
        profileStore.addVisitedPlace({
          id: `visited-${id}`,
          cityId: id,
          cityName: trip.destination,
          country: trip.country || "Desconhecido",
          countryCode: "US",
          coordinates: { lat: trip.lat || 0, lng: trip.lng || 0 },
          visitedAt: new Date().toISOString(),
          duration: trip.itinerary?.length || 1,
          rating: 5,
          photos: trip.images || [],
          highlights: [],
          status: 'visited'
        } as any);

        // Add photos to memories
        if (trip.images) {
          trip.images.forEach(img => {
            profileStore.addMemory({
              url: img,
              city: trip.destination,
              country: trip.country || "Desconhecido",
              date: new Date().toISOString(),
              caption: `Viagem para ${trip.destination} concluída! 🚀`
            });
          });
        }

        // Update trip status in main store
        set((state) => ({
          trips: state.trips.map(t => t.id === id ? { ...t, status: 'concluída' } : t),
          currentTrip: state.currentTrip?.id === id ? { ...state.currentTrip, status: 'concluída' } : state.currentTrip
        }));
      },
      updateTripCosts: (costs: Partial<Trip["costs"]>) =>
        set((state) => {
          if (!state.currentTrip) return state;
          const newCosts = { ...state.currentTrip.costs, ...costs };
          newCosts.total =
            newCosts.hotel +
            newCosts.food +
            newCosts.transport +
            newCosts.activities;
          return {
            currentTrip: {
              ...state.currentTrip,
              costs: newCosts,
            },
          };
        }),
      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
        })),
      currentTrip: null,
      setCurrentTrip: (trip) => set({ currentTrip: trip }),
      togglePackingItem: (categoryIndex, itemIndex) =>
        set((state) => {
          if (!state.currentTrip || !state.currentTrip.packingList) return state;
          
          const newPackingList = [...state.currentTrip.packingList];
          const category = { ...newPackingList[categoryIndex] };
          const items = [...category.items];
          
          items[itemIndex] = {
            ...items[itemIndex],
            checked: !items[itemIndex].checked
          };
          
          category.items = items;
          newPackingList[categoryIndex] = category;
          
          const updatedTrip = {
            ...state.currentTrip,
            packingList: newPackingList
          };

          return {
            currentTrip: updatedTrip,
            trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
          };
        }),
      updateItineraryActivity: (dayIndex, activityIndex, updatedActivity) =>
        set((state) => {
          if (!state.currentTrip) return state;
          const newItinerary = [...state.currentTrip.itinerary];
          const day = { ...newItinerary[dayIndex] };
          const activities = [...day.activities];
          activities[activityIndex] = updatedActivity;
          day.activities = activities;
          newItinerary[dayIndex] = day;
          const updatedTrip = { ...state.currentTrip, itinerary: newItinerary };
          return {
            currentTrip: updatedTrip,
            trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
          };
        }),
      deleteItineraryActivity: (dayIndex, activityIndex) =>
        set((state) => {
          if (!state.currentTrip) return state;
          const newItinerary = [...state.currentTrip.itinerary];
          const day = { ...newItinerary[dayIndex] };
          const activities = day.activities.filter((_, i) => i !== activityIndex);
          day.activities = activities;
          newItinerary[dayIndex] = day;
          const updatedTrip = { ...state.currentTrip, itinerary: newItinerary };
          return {
            currentTrip: updatedTrip,
            trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
          };
        }),
      loading: false,
      setLoading: (loading) => set({ loading }),
      searchHistory: [],
      addToHistory: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query),
          ].slice(0, 10),
        })),
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fid) => fid !== id)
            : [...state.favorites, id],
        })),
      exploreDestinations: [],
      setExploreDestinations: (exploreDestinations) => set({ exploreDestinations }),

      // Real Data Initial State
      currencyRates: { BRL: 5.42, USD: 1.0, EUR: 0.92, GBP: 0.78 },
      setCurrencyRates: (currencyRates) => set({ currencyRates }),
      searchResults: { flights: [], hotels: [] },
      setSearchResults: (searchResults) => set({ searchResults }),

      // Travel Finance Initial State
      budget: 5000.0,
      expenses: [],
      setBudget: (budget) => set({ budget }),
      addExpense: (expense) =>
        set((state) => ({ expenses: [expense, ...state.expenses] })),
      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
    }),
    {
      name: 'rota-certa-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ 
        user: state.user,
        trips: state.trips,
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        budget: state.budget,
        expenses: state.expenses,
        currencyRates: state.currencyRates
      }),
    }
  )
);
