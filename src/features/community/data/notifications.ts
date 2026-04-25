import { Notification } from '../types/community.types';
import { users } from './users';

export const notifications: Notification[] = [
  { id: 'n1', type: 'like', actor: users[1], message: 'curtiu seu post', read: false, createdAt: new Date() }
];
