export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpMax: number;
  status: 'FREE_EXPLORER' | 'PREMIUM' | 'LEGEND';
  country: string;
  streaks: number;
  referralCode: string;
  stats: {
    trips: number;
    countries: number;
    kilometers: number;
    savings: number;
  };
  plan: {
    type: 'FREE' | 'PREMIUM';
    roteirosUsed: number;
    roteirosLimit: number;
  };
  network: {
    following: number;
    followers: number;
    friends: Friend[];
  };
  wrapped: {
    percentile: number;
    topDestination: string;
    distance: number;
    topMonth: string;
    style: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Trip {
  id: string;
  destination: string;
  date: string;
  days: number;
  cost: number;
  rating: number;
  image?: string;
}
