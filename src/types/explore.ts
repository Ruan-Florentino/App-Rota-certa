export interface MapDestination {
  id: string;
  cityName: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  category: 'city' | 'beach' | 'mountain' | 'historical' | 'adventure' | 'island';
  popularity: number;
  trending: boolean;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  tagline: string;
  bestSeason: string;
  travelersThisMonth: number;
}

export interface FlightRoute {
  id: string;
  from: {
    lat: number;
    lng: number;
    city: string;
  };
  to: {
    lat: number;
    lng: number;
    city: string;
  };
  color: string;
  flights: number;
}
