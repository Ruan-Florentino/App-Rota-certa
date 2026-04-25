import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, Story, Comment, Notification, SocialUser } from '../types/social';
import { MOCK_POSTS, MOCK_STORIES, MOCK_USERS, MOCK_NOTIFICATIONS } from '../data/socialMock';

interface SocialStore {
  posts: Post[];
  stories: Story[];
  users: SocialUser[];
  notifications: Notification[];
  following: string[]; // userIds
  
  // Posts
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'liked' | 'comments' | 'commentsCount' | 'saved' | 'shares'>) => void;
  deletePost: (id: string) => void;
  
  // Social
  toggleFollow: (userId: string) => void;
  markStoryViewed: (storyId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Queries
  getFeedPosts: () => Post[];
  getPostById: (id: string) => Post | undefined;
  getUserById: (id: string) => SocialUser | undefined;
  getUserPosts: (userId: string) => Post[];
  getSavedPosts: () => Post[];
  getUnreadNotifications: () => Notification[];
  getSuggestedUsers: () => SocialUser[];
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      posts: MOCK_POSTS,
      stories: MOCK_STORIES,
      users: MOCK_USERS,
      notifications: MOCK_NOTIFICATIONS,
      following: [],
      
      toggleLike: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
              : p
          ),
        })),
      
      toggleSave: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, saved: !p.saved } : p
          ),
        })),
      
      addComment: (postId, text) => {
        const newComment: Comment = {
          id: `c-${Date.now()}`,
          userId: 'user-1',
          user: {
            id: 'user-1',
            name: 'Você',
            username: 'voce',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
          },
          text,
          likes: 0,
          liked: false,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [newComment, ...p.comments],
                  commentsCount: p.commentsCount + 1,
                }
              : p
          ),
        }));
      },
      
      toggleCommentLike: (postId, commentId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id === commentId
                      ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                      : c
                  ),
                }
              : p
          ),
        })),
      
      createPost: (postData) => {
        const newPost: Post = {
          ...postData,
          id: `p-${Date.now()}`,
          createdAt: new Date().toISOString(),
          likes: 0,
          liked: false,
          comments: [],
          commentsCount: 0,
          saved: false,
          shares: 0,
        };
        
        set((state) => ({ posts: [newPost, ...state.posts] }));
      },
      
      deletePost: (id) =>
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
      
      toggleFollow: (userId) =>
        set((state) => {
          const isFollowing = state.following.includes(userId);
          return {
            following: isFollowing
              ? state.following.filter((id) => id !== userId)
              : [...state.following, userId],
            users: state.users.map((u) =>
              u.id === userId
                ? { ...u, isFollowing: !isFollowing, followers: u.followers + (isFollowing ? -1 : 1) }
                : u
            ),
          };
        }),
      
      markStoryViewed: (storyId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, viewed: true } : s
          ),
        })),
      
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      
      // Queries
      getFeedPosts: () => {
        const posts = [...get().posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return posts;
      },
      
      getPostById: (id) => get().posts.find((p) => p.id === id),
      
      getUserById: (id) => get().users.find((u) => u.id === id),
      
      getUserPosts: (userId) => get().posts.filter((p) => p.userId === userId),
      
      getSavedPosts: () => get().posts.filter((p) => p.saved),
      
      getUnreadNotifications: () => get().notifications.filter((n) => !n.read),
      
      getSuggestedUsers: () => {
        const { users, following } = get();
        return users
          .filter((u) => !following.includes(u.id) && u.id !== 'user-1')
          .sort((a, b) => b.followers - a.followers)
          .slice(0, 10);
      },
    }),
    {
      name: 'rightway-social',
      version: 1,
    }
  )
);
