import { Trip } from '../../trips/types/trips.types';
import { UserProfile } from '../../../types/user.types';

export const calculateLevel = (xp: number): number => Math.floor(xp / 1000) + 1;

export const getLevelTitle = (xp: number): string => {
  const level = calculateLevel(xp);
  if (level <= 2) return "Novato 🌱";
  if (level <= 5) return "Explorador Bronze 🥉";
  if (level <= 10) return "Explorador Prata 🥈";
  if (level <= 20) return "Explorador Ouro 🥇";
  if (level <= 30) return "Viajante Elite 💎";
  return "Lenda das Viagens 👑";
};

export const calculateWorldPercentage = (trips: Trip[]): number => {
  const uniqueCountries = new Set(trips.filter(t => t.status === 'completed').map(t => t.country));
  return Math.min(Math.round((uniqueCountries.size / 195) * 100), 100);
};
