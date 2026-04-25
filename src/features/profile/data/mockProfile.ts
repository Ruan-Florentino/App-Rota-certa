import { UserProfile, Trip } from '../types/profile.types';

export const mockProfileData: UserProfile = {
  id: 'u123',
  name: 'FABIANA ARAUJO FERREIRA OLIVEIRA',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300',
  level: 1,
  xp: 0,
  xpMax: 1000,
  status: 'FREE_EXPLORER',
  country: 'BR',
  streaks: 12,
  referralCode: 'ROTALKY6B',
  stats: {
    trips: 12,
    countries: 1,
    kilometers: 240,
    savings: 8000,
  },
  plan: {
    type: 'FREE',
    roteirosUsed: 12,
    roteirosLimit: 3,
  },
  network: {
    following: 42,
    followers: 87,
    friends: [
      { id: 'f1', name: 'User 1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100' },
      { id: 'f2', name: 'User 2', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100' },
      { id: 'f3', name: 'User 3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100' },
      { id: 'f4', name: 'User 4', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&h=100' },
    ],
  },
  wrapped: {
    percentile: 78,
    topDestination: 'Paris, França',
    distance: 25200,
    topMonth: 'Janeiro',
    style: 'normal',
  },
};

export const mockTripsData: Trip[] = [
  {
    id: 't1',
    destination: 'Paris',
    date: '13/04/2026',
    days: 5,
    cost: 8000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=200&h=200',
  }
];
