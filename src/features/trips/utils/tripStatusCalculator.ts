import { Trip } from '../types/trips.types';

export const calculateTripStatus = (trip: Trip): Trip['status'] => {
  if (!trip.startDate || !trip.endDate) return 'planned';
  const now = new Date();
  if (now > trip.endDate) return 'completed';
  if (now >= trip.startDate && now <= trip.endDate) return 'ongoing';
  
  const diffInDays = Math.ceil((trip.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays <= 30 ? 'upcoming' : 'planned';
};
