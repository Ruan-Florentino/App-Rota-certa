// src/features/profile/WorldMap/mockPlaces.ts
import { VisitedPlace } from './types';

export const MOCK_PLACES: VisitedPlace[] = [
  {
    id: '1',
    name: 'Paris',
    country: 'França',
    coordinates: [2.3522, 48.8566],
    visitedAt: new Date('2024-03-15'),
    type: 'visited',
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
  },
  {
    id: '2',
    name: 'Tóquio',
    country: 'Japão',
    coordinates: [139.6503, 35.6762],
    visitedAt: new Date('2024-06-20'),
    type: 'visited',
    cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
  },
];
