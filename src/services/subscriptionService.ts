import { create } from "zustand";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

type Plan = "free" | "pro";

interface SubscriptionState {
  plan: Plan;
  generationsUsed: number;
  limit: number;
  isPro: boolean;
  isLoading: boolean;
  upgrade: () => Promise<void>;
  canGenerate: () => boolean;
  useGeneration: () => Promise<void>;
  addGenerations: (amount: number) => Promise<void>;
  sync: () => Promise<void>;
}

export const PLAN_LIMITS = {
  free: {
    maxTrips: 3,
    aiQueriesPerDay: 5,
  },
  pro: {
    maxTrips: Infinity,
    aiQueriesPerDay: Infinity,
  }
};

export const canAccessFeature = (plan: Plan, feature: string): boolean => {
  if (plan === 'pro') return true;
  
  const basicFeatures = ['basic_trips', 'community_feed'];
  return basicFeatures.includes(feature);
};

export const checkSubscriptionStatus = async (userSub: { plan: Plan; expiresAt?: string }): Promise<'active' | 'expired'> => {
  if (!userSub.expiresAt) return 'active';
  return new Date(userSub.expiresAt) < new Date() ? 'expired' : 'active';
};

export const useSubscription = create<SubscriptionState>((set, get) => ({
  plan: "free",
  generationsUsed: 0,
  limit: 3,
  isPro: false,
  isLoading: true, // starts loading

  sync: async () => {
    if (!auth || !db) {
      set({ isLoading: false });
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      set({ isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        set({
          isPro: data.isPro || false,
          plan: data.isPro ? "pro" : "free",
          generationsUsed: data.generationsUsed || 0,
          limit: data.limit || 3,
          isLoading: false
        });
      } else {
         set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error syncing subscription:", error);
      set({ isLoading: false });
    }
  },

  upgrade: async () => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        isPro: true,
        plan: "pro",
        limit: 9999
      });
    }
    set({ plan: "pro", isPro: true, limit: 9999 });
  },

  canGenerate: () => {
    const { isPro, generationsUsed, limit } = get();
    if (isPro) return true;
    return generationsUsed < limit;
  },

  useGeneration: async () => {
    const { generationsUsed, isPro } = get();
    if (isPro) return;
    
    const newCount = generationsUsed + 1;
    set({ generationsUsed: newCount });
    
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        generationsUsed: newCount
      });
    }
  },

  addGenerations: async (amount: number) => {
    const { limit } = get();
    const newLimit = limit + amount;
    set({ limit: newLimit });
    
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        limit: newLimit
      });
    }
  },
}));

// Helper for backward compatibility or direct checks
export const checkLimit = async (_uid: string, feature: 'trip' | 'lens' | 'pdf' | 'social'): Promise<boolean> => {
  const state = useSubscription.getState();
  await state.sync(); // Ensure we have latest from server
  
  if (useSubscription.getState().isPro) return true;

  switch (feature) {
    case 'trip':
      return useSubscription.getState().canGenerate();
    case 'lens':
    case 'pdf':
    case 'social':
      return false; // Pro only features
    default:
      return false;
  }
};
