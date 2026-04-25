import { Trip } from '../types/trips.types';

export const calculateStats = (trips: Trip[]) => {
  const completedTrips = trips.filter(t => t.status === 'completed');
  const countries = new Set(completedTrips.map(t => t.country));
  
  return {
    countriesVisited: countries.size,
    totalTrips: completedTrips.length,
    totalDaysTraveling: completedTrips.reduce((acc, t) => acc + t.duration, 0),
    totalSpent: completedTrips.reduce((acc, t) => acc + (t.spent || t.budget), 0),
  };
};
