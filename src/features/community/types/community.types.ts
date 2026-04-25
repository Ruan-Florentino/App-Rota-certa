export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  followersCount: number;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface Comment {
  id: string;
  author: Author;
  text: string;
  likes: number;
  replies: Comment[];
  createdAt: Date;
  isLiked: boolean;
}

export interface Post {
  id: string;
  author: Author;
  type: 'photo' | 'carousel' | 'video' | 'itinerary' | 'text';
  media: Media[];
  caption: string;
  hashtags: string[];
  location: string | null;
  mentions: string[];
  itineraryId?: string;
  likes: number;
  comments: Comment[];
  saves: number;
  createdAt: Date;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
}

export interface Story {
  id: string;
  author: Author;
  media: string;
  viewed: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'save' | 'milestone';
  actor: Author;
  targetPost?: Post;
  message: string;
  read: boolean;
  createdAt: Date;
}
