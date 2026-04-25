export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string;
  location: string;
  links: {
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
  travelStyles: string[];
  dreamDestinations: string[];
  customDestination?: string;
  averageBudget: number;
  travelFrequency: string;
  level: number;
  xp: number;
  initialBadges: string[];
  matchTags: string[];
  onboardingCompleted: boolean;
  onboardingCompletedAt: Date;
  hasSeenWelcome: boolean;
  joinedAt: Date;
  settings: {
    theme: 'dark' | 'light' | 'auto';
    accentColor: 'purple' | 'cyan' | 'blue';
    fontSize: 'small' | 'medium' | 'large';
    language: 'pt-BR' | 'en' | 'es';
    currency: 'BRL' | 'USD' | 'EUR';
    measurement: 'metric' | 'imperial';
    notifications: {
      push: boolean;
      tripReminders: boolean;
      offers: boolean;
      aiTips: boolean;
      community: boolean;
    };
    privacy: {
      publicProfile: boolean;
      showTrips: boolean;
      allowMessages: boolean;
      analytics: boolean;
    };
  };
}
