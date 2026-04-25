import { Post } from '../types/community.types';
import { users } from './users';

export const reels: Post[] = [
  {
    id: 'r1',
    author: users[1],
    type: 'video',
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80', type: 'video' }],
    caption: 'Sunset em Shibuya! 🌅',
    hashtags: ['#shibuya', '#sunset'],
    location: 'Shibuya Crossing',
    mentions: [],
    likes: 500,
    comments: [],
    saves: 100,
    createdAt: new Date(),
    isLiked: false,
    isSaved: false,
    isFollowing: false,
  }
];
