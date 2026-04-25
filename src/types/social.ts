export interface SocialUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  isFollowing?: boolean;
  followers: number;
  following: number;
  tripsCount: number;
  countriesCount: number;
}

export interface Post {
  id: string;
  userId: string;
  user: SocialUser;
  
  // Conteúdo
  photos: string[];
  caption: string;
  
  // Localização
  location: {
    cityName: string;
    country: string;
    countryCode: string;
    coordinates?: { lat: number; lng: number };
  };
  
  // Metadata
  tripId?: string;
  tags: string[];
  mood?: 'adventurous' | 'romantic' | 'chill' | 'cultural' | 'foodie' | 'party';
  
  // Engagement
  likes: number;
  liked: boolean;
  comments: Comment[];
  commentsCount: number;
  saved: boolean;
  shares: number;
  
  // Timestamps
  createdAt: string;
  visitedAt?: string; // data da visita
}

export interface Comment {
  id: string;
  userId: string;
  user: Pick<SocialUser, 'id' | 'name' | 'username' | 'avatar'>;
  text: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  user: Pick<SocialUser, 'id' | 'name' | 'username' | 'avatar'>;
  items: StoryItem[];
  createdAt: string;
  expiresAt: string;
  viewed: boolean;
}

export interface StoryItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  duration: number; // ms
  location?: string;
  caption?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  userId?: string;
  user?: Pick<SocialUser, 'id' | 'name' | 'username' | 'avatar'>;
  postId?: string;
  text: string;
  createdAt: string;
  read: boolean;
}
