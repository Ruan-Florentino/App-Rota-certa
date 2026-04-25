import { useProfileStore } from '../store/profileStore';

export function seedProfileData() {
  const store = useProfileStore.getState();
  
  // Se já tem dados, não faz nada
  if (store.visitedPlaces.length > 0) return;
  
  const samplePlaces = [
    {
      cityId: 'rio-de-janeiro', cityName: 'Rio de Janeiro', country: 'Brasil', countryCode: 'BR',
      coordinates: { lat: -22.9068, lng: -43.1729 },
      visitedAt: '2023-06-15', duration: 5, rating: 5,
      photos: ['https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=400&h=400'],
      highlights: ['Cristo Redentor', 'Copacabana'],
      status: 'visited' as const,
    },
    {
      cityId: 'paris', cityName: 'Paris', country: 'França', countryCode: 'FR',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      visitedAt: '2023-09-20', duration: 7, rating: 5,
      photos: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&h=400'],
      highlights: ['Torre Eiffel', 'Louvre'],
      status: 'visited' as const,
    },
    {
      cityId: 'toquio', cityName: 'Tóquio', country: 'Japão', countryCode: 'JP',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      visitedAt: '2024-03-10', duration: 10, rating: 5,
      photos: ['https://images.unsplash.com/photo-1540959733332-e946670b24b1?auto=format&fit=crop&w=400&h=400'],
      highlights: ['Shibuya', 'Shinjuku'],
      status: 'visited' as const,
    },
    {
      cityId: 'nova-york', cityName: 'Nova York', country: 'EUA', countryCode: 'US',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      visitedAt: '2024-07-01', duration: 6, rating: 4,
      photos: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&h=400'],
      highlights: ['Central Park', 'Times Square'],
      status: 'visited' as const,
    },
    {
      cityId: 'bali', cityName: 'Bali', country: 'Indonésia', countryCode: 'ID',
      coordinates: { lat: -8.3405, lng: 115.0920 },
      visitedAt: '', duration: 10, rating: 0, photos: [],
      highlights: [], status: 'planned' as const,
    },
    {
      cityId: 'santorini', cityName: 'Santorini', country: 'Grécia', countryCode: 'GR',
      coordinates: { lat: 36.3932, lng: 25.4615 },
      visitedAt: '', duration: 5, rating: 0, photos: [],
      highlights: [], status: 'wishlist' as const,
    },
  ];
  
  samplePlaces.forEach(place => store.addVisitedPlace(place));
  
  // Atualiza achievements
  const castedAchievements = store.achievements.map(ach => {
    let current = ach.current;
    if (ach.id === 'first-trip') current = 4;
    if (ach.id === 'explorer') current = 4;
    if (ach.id === 'collector') current = 4;
    if (ach.id === 'globetrotter') current = 3;
    const progress = Math.min(100, (current / ach.target) * 100);
    return { ...ach, current, progress };
  });
  
  // Update the store with new achievements
  useProfileStore.setState({ achievements: castedAchievements });
  store.recalculateStats();
}
