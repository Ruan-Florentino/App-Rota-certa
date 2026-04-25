import { Post } from '../types/community.types';
import { users } from './users';

export const posts: Post[] = [
  {
    id: 'p1',
    author: users[0],
    type: 'photo',
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80', type: 'image' }],
    caption: 'Tóquio é incrível! 🇯🇵',
    hashtags: ['#tokyo', '#japan'],
    location: 'Tóquio, Japão',
    mentions: [],
    likes: 120,
    comments: [],
    saves: 20,
    createdAt: new Date(),
    isLiked: false,
    isSaved: false,
    isFollowing: true,
  }
];
