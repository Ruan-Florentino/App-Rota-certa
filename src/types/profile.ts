export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;       // Mantido por compatibilidade
  avatarUrl: string;     // Preferencial para data URL ou URL externa
  coverImage?: string;   // Mantido por compatibilidade
  coverUrl: string;      // Preferencial para data URL ou URL externa
  bio: string;
  location: string;      // Formato "Cidade, País"
  city: string;
  countryCode: string;   // ISO alpha-2, ex: 'BR'
  joinedAt: string;
  
  // Stats
  stats: {
    countriesVisited: number;
    citiesVisited: number;
    continentsVisited: number;
    totalDays: number;
    totalKm: number;
    photosShared: number;
  };
  
  // Preferências
  preferences: {
    travelStyle: string[];
    favoriteTypes: string[];
    languages: string[];
  };
  
  // Social
  instagram: string;     // Sem @
  social: {
    followers: number;
    following: number;
    twitter?: string;
  };
  
  referralCode?: string;
}

export interface VisitedPlace {
  id: string;
  cityId: string;
  cityName: string;
  country: string;
  countryCode: string;
  coordinates: { lat: number; lng: number };
  visitedAt: string;
  duration: number; // dias
  rating: number; // 1-5
  photos: string[];
  notes?: string;
  highlights: string[];
  status: 'visited' | 'planned' | 'wishlist';
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlockedAt?: string;
  progress: number; // 0-100
  target: number;
  current: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
