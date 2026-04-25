import { Trip } from '../types/trips.types';

export const mockTrips: Trip[] = [
    {
        id: 'trip1',
        destination: 'Tóquio',
        country: 'Japão',
        countryCode: '🇯🇵',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80',
        startDate: new Date(2026, 6, 15),
        endDate: new Date(2026, 6, 25),
        duration: 10,
        budget: 15000,
        status: 'upcoming',
        itinerary: [],
        companions: 'Sozinho',
        accommodation: { name: 'Park Hotel', price: 5000, rating: 4.8 },
        preparationChecklist: [{ id: '1', label: 'Passaporte', completed: true }],
        notes: 'Viagem incrível',
        photos: [],
        unlockedBadges: [],
        createdAt: new Date()
    }
];
