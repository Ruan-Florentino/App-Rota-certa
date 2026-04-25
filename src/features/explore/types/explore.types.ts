export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  image: string;
  images: string[];
  description: string;
  tags: string[];
  categories: string[];
  stats: {
    avgBudget: number;
    bestMonth: string;
    flightHours: number;
    temperature: number;
    currency: string;
  };
  highlights: string[];
  bestMonths: number[];
  matchScore?: number;
}
