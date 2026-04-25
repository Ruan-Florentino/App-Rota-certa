import { 
  db, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  addDoc
} from '../firebase';

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  media?: string[];
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  createdAt: any;
  location?: string;
  tripId?: string; // Link to a trip if applicable
  isPro?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  media: string;
  viewed: boolean;
  createdAt: any;
}

export const socialService = {
  getFeed: async (userId?: string) => {
    try {
      // For now, get all public posts
      const q = query(
        collection(db, 'social_posts'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialPost));
    } catch (e) {
      console.error("Error fetching feed:", e);
      return [];
    }
  },

  getStories: async () => {
    try {
      const q = query(
        collection(db, 'stories'),
        where('createdAt', '>', new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24h
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
    } catch (e) {
      console.error("Error fetching stories:", e);
      return [];
    }
  },

  likePost: async (postId: string, userId: string) => {
    const likeRef = doc(db, 'social_posts', postId, 'likes', userId);
    await setDoc(likeRef, { createdAt: serverTimestamp() });
    // In a real app, use a cloud function to increment the counter
  },

  unlikePost: async (postId: string, userId: string) => {
    const likeRef = doc(db, 'social_posts', postId, 'likes', userId);
    await deleteDoc(likeRef);
  },

  createPost: async (post: Omit<SocialPost, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'social_posts'), {
      ...post,
      createdAt: serverTimestamp()
    });
  }
};
