import { create } from 'zustand';
import { Post, Story, Notification } from '../types/community.types';

interface CommunityState {
  feed: Post[];
  stories: Story[];
  reels: Post[];
  discover: Post[];
  notifications: Notification[];
  activeTab: 'feed' | 'reels' | 'discover' | 'notifications';
  setActiveTab: (tab: 'feed' | 'reels' | 'discover' | 'notifications') => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  feed: [],
  stories: [],
  reels: [],
  discover: [],
  notifications: [],
  activeTab: 'feed',
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleLike: (postId) => set((s) => ({
    feed: s.feed.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)
  })),
  toggleSave: (postId) => set((s) => ({
    feed: s.feed.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved, saves: p.isSaved ? p.saves - 1 : p.saves + 1 } : p)
  })),
}));
