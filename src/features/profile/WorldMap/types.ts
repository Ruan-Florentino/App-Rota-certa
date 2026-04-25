// src/features/profile/WorldMap/types.ts
export interface VisitedPlace {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];  // [lng, lat]
  visitedAt: Date;
  type: 'visited' | 'wishlist' | 'planned';
  cover?: string;
}
