import { useMemo } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { useTripsStore } from '@/stores/tripsStore';
import { MILESTONES } from '../utils/milestones';
import { COUNTRIES } from '../../../data/countries';
import { UserProfile } from '@/types/profile';

export interface TravelStats {
  totalCountries: number;
  totalCities: number;
  totalDays: number;
  totalKm: number;
  totalContinents: number;
  totalTrips: number;
  progress: number;
  remaining: number;
  coverage: number;
  nextMilestone: { km: number; label: string; reference: string };
  visitedCountries: any[];
  plannedCountries: any[];
  wishlistCountries: any[];
  joinYear: number;
  user: UserProfile;
}

export const useTravelStats = (): TravelStats => {
  const { profile: user } = useProfileStore();
  const { trips } = useTripsStore();

  return useMemo(() => {
    const visitedOnly = trips.filter(t => t.status === 'visited');
    const plannedOnly = trips.filter(t => t.status === 'planned');
    const wishlistOnly = trips.filter(t => t.status === 'wishlist');

    const totalCountries = new Set(visitedOnly.map(t => t.countryCode)).size;
    const totalCities = visitedOnly.reduce((acc, t) => acc + (t.city ? 1 : 0), 0);
    
    // Estimate KM: 1200 per trip
    const totalKm = visitedOnly.reduce((acc, t) => acc + 1000, 0);

    const totalDays = visitedOnly.reduce((acc, t) => acc + 5, 0);
    
    const getCountryInfo = (code: string) => COUNTRIES.find(c => c.code === code);
    
    const totalContinents = new Set(
      visitedOnly.map(t => {
        const info = getCountryInfo(t.countryCode);
        return info ? info.continent : 'Outro';
      })
    ).size;
    
    const totalTrips = trips.length;
    const progress = (totalKm / 40075) * 100;
    const remaining = Math.max(0, 40075 - totalKm);
    const coverage = (totalCountries / 195) * 100;

    const findNextMilestone = (km: number) => {
      const milestone = MILESTONES.find(m => m.km > km) || MILESTONES[MILESTONES.length - 1];
      return {
        km: milestone.km,
        label: milestone.reference,
        reference: milestone.reference
      };
    };

    const nextMilestone = findNextMilestone(totalKm);
    const joinYear = new Date(user.joinedAt || Date.now()).getFullYear();

    const formatTrip = (t: any) => {
      const info = getCountryInfo(t.countryCode);
      return {
        ...t,
        flag: info?.flag || '🏳️',
        name: info?.name || 'Desconhecido',
        lat: info?.lat || 0,
        lng: info?.lng || 0
      };
    };

    return {
      totalCountries,
      totalCities,
      totalDays,
      totalKm,
      totalContinents,
      totalTrips,
      progress: Math.min(100, progress),
      remaining,
      coverage,
      nextMilestone,
      visitedCountries: visitedOnly.map(formatTrip).sort((a, b) => b.year - a.year),
      plannedCountries: plannedOnly.map(formatTrip),
      wishlistCountries: wishlistOnly.map(formatTrip),
      joinYear,
      user
    };
  }, [trips, user]);
};
