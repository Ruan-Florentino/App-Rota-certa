import { Destination } from '../types/explore.types';

export const calculateMatch = (destination: Destination, userProfile: any): number => {
  let score = 50;
  
  const styleMatches = destination.tags.filter(tag =>
    userProfile.travelStyles.includes(tag)
  ).length;
  score += styleMatches * 15;
  
  const budgetDiff = Math.abs(destination.stats.avgBudget - userProfile.averageBudget);
  if (budgetDiff < 1000) score += 20;
  else if (budgetDiff < 3000) score += 10;
  
  return Math.min(score, 99);
};
