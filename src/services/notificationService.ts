import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export type NotificationType = 'like' | 'clone' | 'reminder' | 'tip';

export interface AppNotification {
  id?: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

export const createNotification = async (uid: string, type: NotificationType, message: string) => {
  if (!db) return;
  try {
    await addDoc(collection(db, 'notifications', uid, 'items'), {
      type, message, read: false, createdAt: Timestamp.now()
    });
  } catch {}
};

export const subscribeToNotifications = (uid: string, callback: (notifs: AppNotification[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, 'notifications', uid, 'items'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
  }, (error) => {
    console.error("Notification snapshot error:", error);
  });
};

export const markAllRead = async (uid: string, notifications: AppNotification[]) => {
  const unread = notifications.filter(n => !n.read && n.id);
  await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', uid, 'items', n.id!), { read: true })));
};
