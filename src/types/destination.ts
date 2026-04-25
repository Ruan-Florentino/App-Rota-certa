export type PriceRange = 'budget' | 'medium' | 'premium' | 'luxury';
export type Climate = 'tropical' | 'temperado' | 'frio' | 'desértico' | 'mediterrâneo' | 'subtropical';

export interface Destination {
  id: string;
  name: string;
  country: string;
  state?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  categories: string[];
  rating: number;
  reviews: number;
  priceRange?: PriceRange;
  priceFrom: number;
  currency: string;
  bestSeason?: string[];
  duration?: string;
  heroImage: string;
  fallbackEmoji?: string;
  gallery?: string[];
  description: string;
  highlights?: string[];
  climate?: Climate;
  language?: string;
  currency_local?: string;
  timezone?: string;
  tags?: string[];
  trending?: boolean;
  featured?: boolean;
  continent?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  destinationIds: string[];
  count: number;
  curator: string;
}
