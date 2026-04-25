export interface Activity {
  time: 'manhã' | 'tarde' | 'noite';
  activity: string;
  placeName?: string;
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

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  photos?: string[];
  insight?: string;
}

export interface Expense {
  id?: string;
  title: string;
  date: string;
  description: string;
  amount: number;
  category: 'Hotel' | 'Comida' | 'Voos' | 'Passeios' | 'Compras' | 'Outros' | 'food' | 'transport' | 'activities' | 'shopping' | 'other';
}

export interface TripMessage {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any;
}

export interface Trip {
  id?: string;
  userId: string;
  destination: string;
  summary?: string;
  country?: string;
  images?: string[];
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
  sharedAt?: any;
  info?: {
    bestTime: string;
    timezone: string;
    language: string;
    currency: string;
    survivalGuide?: {
      emergencyNumbers: { name: string; number: string }[];
      phrases: { original: string; translated: string; pronunciation: string }[];
      tipping: string;
    };
    hiddenGems?: {
      name: string;
      description: string;
      tip: string;
      category: string;
    }[];
  };
  packingList?: {
    category: string;
    items: { name: string; checked?: boolean }[];
  }[];
  journal?: JournalEntry[];
  expenses?: Expense[];
  createdAt: any;
  isFavorite?: boolean;
  isPublic?: boolean;
  heroImage?: string;
  likes?: number;
  likedBy?: string[];
  clones?: number;
  authorName?: string;
  authorPhoto?: string;
  status?: 'planejada' | 'em_andamento' | 'concluída';
  collaborators?: string[];
  distance?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  tripsMade?: number;
  countriesVisited?: number;
  points?: number;
  rank?: string;
  averageIncome?: number;
  favoriteDestination?: string;
  travelStyle?: string;
  travelPace?: string;
  travelInterests?: string[];
  defaultBudget?: number;
  preferences?: {
    currency: string;
    language: string;
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
  referralCode?: string;
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
  images?: string[];
  avgPrice: number;
  recommendedDays: number;
  category: string[];
  description: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
