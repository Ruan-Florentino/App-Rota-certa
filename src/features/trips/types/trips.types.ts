export interface CheckListItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface DayItinerary {
  title: string;
  activities: { time: string; title: string; desc: string; }[];
}

export interface Accommodation {
  name: string;
  price: number;
  rating: number;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  countryCode: string;
  image: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  budget: number;
  spent?: number;
  status: 'planned' | 'upcoming' | 'ongoing' | 'completed';
  itinerary: DayItinerary[];
  companions: string;
  accommodation: Accommodation | null;
  preparationChecklist: CheckListItem[];
  notes: string;
  photos: string[];
  unlockedBadges: string[];
  rating?: number;
  createdAt: Date;
}

export interface TripsState {
  trips: Trip[];
  activeTab: 'upcoming' | 'planned' | 'past';
  selectedTrip: Trip | null;
}

export interface TripsActions {
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => void;
  setActiveTab: (tab: 'upcoming' | 'planned' | 'past') => void;
  selectTrip: (trip: Trip | null) => void;
  toggleChecklistItem: (tripId: string, itemId: string) => void;
}
