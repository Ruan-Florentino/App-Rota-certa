import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, VisitedPlace, Achievement } from '../types/profile';

interface ProfileStore {
  profile: UserProfile;
  visitedPlaces: VisitedPlace[];
  achievements: Achievement[];
  
  updateProfile: (data: Partial<UserProfile>) => void;
  addVisitedPlace: (place: Omit<VisitedPlace, 'id'>) => void;
  removeVisitedPlace: (id: string) => void;
  updateVisitedPlace: (id: string, data: Partial<VisitedPlace>) => void;
  addMemory: (memory: { url: string; city: string; country: string; date: string; caption?: string }) => void;
  setAvatar: (dataUrl: string) => void;
  setCover: (dataUrl: string) => void;
  reset: () => void;
  
  // Queries
  getVisitedCountries: () => string[];
  getVisitedByStatus: (status: VisitedPlace['status']) => VisitedPlace[];
  recalculateStats: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-trip', icon: '🎒', title: 'Primeira Aventura', description: 'Complete sua primeira viagem', progress: 0, target: 1, current: 0, rarity: 'common' },
  { id: 'explorer', icon: '🗺️', title: 'Explorador', description: 'Visite 5 cidades diferentes', progress: 0, target: 5, current: 0, rarity: 'common' },
  { id: 'globetrotter', icon: '🌍', title: 'Cidadão do Mundo', description: 'Visite 3 continentes', progress: 0, target: 3, current: 0, rarity: 'epic' },
  { id: 'collector', icon: '🏆', title: 'Colecionador', description: 'Visite 10 países', progress: 0, target: 10, current: 0, rarity: 'rare' },
  { id: 'legend', icon: '👑', title: 'Lenda', description: 'Visite 25 países', progress: 0, target: 25, current: 0, rarity: 'legendary' },
];

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Viajante',
  username: 'viajante',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fabiana&backgroundColor=22d3ee',
  coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&h=900',
  bio: '✈️ Explorando o mundo, uma cidade por vez',
  location: 'São Paulo, Brasil',
  city: 'São Paulo',
  countryCode: 'BR',
  joinedAt: new Date().toISOString(),
  stats: {
    countriesVisited: 0,
    citiesVisited: 0,
    continentsVisited: 0,
    totalDays: 0,
    totalKm: 0,
    photosShared: 0,
  },
  preferences: {
    travelStyle: ['aventura', 'cultura'],
    favoriteTypes: ['praia', 'montanha', 'cidade'],
    languages: ['Português', 'Inglês'],
  },
  instagram: '',
  social: {
    followers: 0,
    following: 0,
  },
};

const sanitizeProfile = (p: Partial<UserProfile> | undefined): UserProfile => ({
  ...DEFAULT_PROFILE,
  ...(p ?? {}),
  name: p?.name ?? DEFAULT_PROFILE.name,
  username: p?.username ?? DEFAULT_PROFILE.username,
  bio: p?.bio ?? '',
  city: p?.city ?? '',
  countryCode: p?.countryCode ?? 'BR',
  instagram: p?.instagram ?? '',
  avatarUrl: p?.avatarUrl ?? '',
  coverUrl: p?.coverUrl ?? '',
  joinedAt: p?.joinedAt ?? new Date().toISOString(),
});

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      visitedPlaces: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      
      updateProfile: (data) =>
        set((state) => ({ profile: sanitizeProfile({ ...state.profile, ...data }) })),
      
      setAvatar: (dataUrl) =>
        set((state) => ({ profile: sanitizeProfile({ ...state.profile, avatarUrl: dataUrl ?? '' }) })),
        
      setCover: (dataUrl) =>
        set((state) => ({ profile: sanitizeProfile({ ...state.profile, coverUrl: dataUrl ?? '' }) })),

      reset: () => set({ profile: DEFAULT_PROFILE, visitedPlaces: [], achievements: DEFAULT_ACHIEVEMENTS }),
      
      addVisitedPlace: (place) => {
        // ... (existing logic)
        const newPlace: VisitedPlace = {
          cityId: `city-${Math.random().toString(36).slice(2, 8)}`,
          cityName: '',
          country: '',
          countryCode: 'XX',
          coordinates: { lat: 0, lng: 0 },
          visitedAt: new Date().toISOString(),
          duration: 1,
          rating: 5,
          photos: [],
          highlights: [],
          status: 'visited',
          ...place,
          id: (place as any).id || `place-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        } as VisitedPlace;
        
        set((state) => ({
          visitedPlaces: [...state.visitedPlaces, newPlace],
        }));
        
        get().recalculateStats();
      },
      
      removeVisitedPlace: (id) => {
        set((state) => ({
          visitedPlaces: state.visitedPlaces.filter((p) => p.id !== id),
        }));
        get().recalculateStats();
      },
      
      updateVisitedPlace: (id, data) =>
        set((state) => ({
          visitedPlaces: state.visitedPlaces.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
        

      addMemory: (memory) => {
        set((state) => ({
          visitedPlaces: state.visitedPlaces.map((p) =>
            p.cityName === memory.city
              ? { ...p, photos: [...p.photos, memory.url] }
              : p
          ),
        }));
      },
      
      getVisitedCountries: () => {
        const visited = get().visitedPlaces.filter((p) => p.status === 'visited');
        return Array.from(new Set(visited.map((p) => p.country)));
      },
      
      getVisitedByStatus: (status) =>
        get().visitedPlaces.filter((p) => p.status === status),
      
      recalculateStats: () => {
        const visited = get().visitedPlaces.filter((p) => p.status === 'visited');
        const countries = new Set(visited.map((p) => p.country));
        const cities = new Set(visited.map((p) => p.cityId));
        const totalDays = visited.reduce((acc, p) => acc + p.duration, 0);
        const photos = visited.reduce((acc, p) => acc + p.photos.length, 0);
        
        const continents = new Set(
          visited.map((p) => getContinent(p.countryCode))
        );
        
        set((state) => ({
          profile: sanitizeProfile({
            ...state.profile,
            stats: {
              ...state.profile.stats,
              countriesVisited: countries.size,
              citiesVisited: cities.size,
              continentsVisited: continents.size,
              totalDays,
              photosShared: photos,
              totalKm: Math.round(countries.size * 3500 + cities.size * 120),
            },
          }),
        }));
      },
    }),
    {
      name: 'rw-profile',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any) => {
        return { 
          profile: sanitizeProfile(persistedState?.profile),
          visitedPlaces: persistedState?.visitedPlaces || [],
          achievements: persistedState?.achievements || DEFAULT_ACHIEVEMENTS
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.profile = sanitizeProfile(state.profile);
        }
      },
    }
  )
);

function getContinent(countryCode: string): string {
  const map: Record<string, string> = {
    BR: 'SA', AR: 'SA', CL: 'SA', PE: 'SA', CO: 'SA', UY: 'SA',
    US: 'NA', CA: 'NA', MX: 'NA',
    FR: 'EU', IT: 'EU', ES: 'EU', DE: 'EU', GB: 'EU', PT: 'EU', NL: 'EU', GR: 'EU', CZ: 'EU', AT: 'EU', IE: 'EU', HR: 'EU', IS: 'EU', SE: 'EU', DK: 'EU', NO: 'EU', TR: 'EU', CH: 'EU', HU: 'EU',
    JP: 'AS', CN: 'AS', KR: 'AS', TH: 'AS', SG: 'AS', ID: 'AS', AE: 'AS', HK: 'AS', IN: 'AS', MY: 'AS', VN: 'AS', TW: 'AS', IL: 'AS', QA: 'AS', MV: 'AS',
    AU: 'OC', NZ: 'OC',
    ZA: 'AF', MA: 'AF', EG: 'AF', TZ: 'AF', KE: 'AF',
  };
  return map[countryCode] || 'OT';
}
