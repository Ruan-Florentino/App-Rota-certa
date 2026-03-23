export interface Activity {
  time: 'manhã' | 'tarde' | 'noite';
  activity: string;
  description: string;
  cost: number;
  duration: string;
  location?: { lat: number; lng: number };
  category?: 'turismo' | 'restaurante' | 'transporte' | 'lazer';
  image?: string;
}

export interface DayPlan {
  day: number;
  activities: Activity[];
}

export interface TripCosts {
  hotel: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
}

export interface Flight {
  airline: string;
  price: number;
  duration: string;
  stops: number;
  times: string;
  logo?: string;
  link?: string;
}

export interface Hotel {
  name: string;
  price: number;
  rating: number;
  stars: number;
  image: string;
  location: string;
  amenities?: string[];
  link?: string;
}

export interface Trip {
  id?: string;
  userId: string;
  destination: string;
  lat?: number;
  lng?: number;
  startDate: string;
  endDate: string;
  budget: number;
  type: 'economic' | 'normal' | 'luxury' | 'adventure' | 'family' | 'romantic' | 'bate-e-volta';
  itinerary: DayPlan[];
  costs: TripCosts;
  tips: string[];
  flights?: Flight[];
  hotels?: Hotel[];
  info?: {
    bestTime: string;
    timezone: string;
    language: string;
    currency: string;
  };
  createdAt: any;
  isFavorite?: boolean;
  status?: 'planejada' | 'em_andamento' | 'concluída';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  preferences?: {
    currency: string;
    language: string;
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  rating: number;
  priceLevel: number;
  category: string;
  lat: number;
  lng: number;
}

export interface DestinationSuggestion {
  id: string;
  name: string;
  country: string;
  image: string;
  avgPrice: number;
  recommendedDays: number;
  category: string[];
  description: string;
  lat: number;
  lng: number;
}
