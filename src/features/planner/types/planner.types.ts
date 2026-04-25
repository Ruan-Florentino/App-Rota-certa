export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  type: 'text' | 'card' | 'quick-reply' | 'date-picker' | 'budget-slider' | 'multi-select';
  data?: any;
  timestamp: Date;
}

export interface TripAnswers {
  destination?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  travelerType?: string;
  budget?: number;
  styles?: string[];
  accommodation?: string;
  priority?: string;
}

export interface Question {
  id: string;
  text: string;
  type: Message['type'];
  options?: any[];
}

export interface Itinerary {
  id: string;
  destination: string;
  country: string;
  totalDays: number;
  budget: number;
  matchScore: number;
  days: {
    title: string;
    activities: { time: string; title: string; desc: string; }[];
  }[];
  accommodation: { name: string; price: number; rating: number; }[];
  priceBreakdown: Record<string, number>;
}
