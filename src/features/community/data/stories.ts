import { Story } from '../types/community.types';
import { users } from './users';

export const stories: Story[] = [
  { id: 's1', author: users[0], media: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=200&q=80', viewed: false, createdAt: new Date() }
];
