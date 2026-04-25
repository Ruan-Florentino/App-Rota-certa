import { UserProfile } from '../../../types/user.types';

export const buildProfileFromOnboarding = (onboardingData: any): UserProfile => {
  const { styles, destinations, budget, frequency } = onboardingData;

  // 1. Level & XP
  let level = 1;
  let xp = 100;
  if(frequency === '3-5') { level = 3; xp = 500; }
  else if(frequency === '6-10') { level = 5; xp = 1200; }
  else if(frequency === '10+') { level = 8; xp = 2500; }

  // 2. Badges
  const badges = ['Primeiro Passo 🏆'];
  if(styles.includes('praia')) badges.push('Amante do Mar 🏖️');
  if(styles.includes('aventura')) badges.push('Explorador 🏔️');
  if(styles.includes('cultural')) badges.push('Curioso Cultural 🏛️');
  if(styles.includes('gastronomia')) badges.push('Food Lover 🍜');
  if(frequency === '10+') badges.push('Nômade Digital 🌍');
  if(budget > 10000) badges.push('Premium Traveler 💎');

  // 3. Bio
  const bio = `Apaixonado(a) por ${styles.join(', ')}. Sonhando com ${destinations[0] || 'novos destinos'} ✨`;

  return {
    username: onboardingData.username || 'viajante',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    coverUrl: null,
    location: '',
    links: {},
    joinedAt: new Date(),
    settings: {
      theme: 'dark',
      accentColor: 'purple',
      fontSize: 'medium',
      language: 'pt-BR',
      currency: 'BRL',
      measurement: 'metric',
      notifications: {
        push: true,
        tripReminders: true,
        offers: false,
        aiTips: true,
        community: true
      },
      privacy: {
        publicProfile: true,
        showTrips: true,
        allowMessages: true,
        analytics: true
      }
    },
    id: '', 
    name: 'Viajante',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    bio,
    travelStyles: styles,
    dreamDestinations: destinations,
    averageBudget: budget,
    travelFrequency: frequency,
    level,
    xp,
    initialBadges: badges,
    matchTags: [...styles, ...destinations.map((d: string) => d.toLowerCase())],
    onboardingCompleted: true,
    onboardingCompletedAt: new Date(),
    hasSeenWelcome: false
  };
};
