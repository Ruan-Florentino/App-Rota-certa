import { useState, useEffect } from 'react';
import { db, doc, onSnapshot, setDoc, serverTimestamp, deleteDoc, collection, query, where, onAuthStateChanged, auth } from '../firebase';

export const usePresence = (roomType: string, roomId: string) => {
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribePresence: (() => void) | null = null;
    let interval: any = null;
    let currentPresenceRef: any = null;

    if (!auth || !db) return;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      // Cleanup previous state if user changes
      if (interval) clearInterval(interval);
      if (unsubscribePresence) unsubscribePresence();
      if (currentPresenceRef) {
        deleteDoc(currentPresenceRef).catch(() => {});
        currentPresenceRef = null;
      }

      if (!user || !roomId) {
        setActiveUsers([]);
        return;
      }

      const presenceId = `${roomType}_${roomId}_${user.uid}`;
      const presenceRef = doc(db, 'presence', presenceId);
      currentPresenceRef = presenceRef;

      // Set presence function
      const setPresence = async () => {
        try {
          await setDoc(presenceRef, {
            userId: user.uid,
            userName: user.displayName || 'Viajante',
            userPhoto: user.photoURL,
            lastActive: serverTimestamp(),
            roomId,
            roomType
          }, { merge: true });
        } catch (err: any) {
          // If Firestore internal error happens, we just log and ignore to prevent crash
          if (err?.message?.includes('INTERNAL ASSERTION FAILED')) {
            console.warn("Firestore Presence internal issue - ignoring heartbeat");
          } else {
            console.error("Presence error:", err);
          }
        }
      };

      // Initial call
      setPresence();

      // Heartbeat every 45s (slightly longer to reduce noise)
      interval = setInterval(setPresence, 45000);

      // Listen to others in the same room
      const q = query(collection(db, 'presence'), where('roomId', '==', roomId), where('roomType', '==', roomType));
      
      unsubscribePresence = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const now = Date.now();
        const freshUsers = users.filter((u: any) => {
          if (!u.lastActive) return true;
          const lastSeen = u.lastActive.toMillis ? u.lastActive.toMillis() : (u.lastActive?.seconds ? u.lastActive.seconds * 1000 : u.lastActive);
          return now - lastSeen < 150000; // 2.5 minutes
        });
        setActiveUsers(freshUsers);
      }, (err) => {
        console.warn("Presence snapshot error:", err);
      });
    });

    return () => {
      if (authUnsubscribe) authUnsubscribe();
      if (interval) clearInterval(interval);
      if (unsubscribePresence) unsubscribePresence();
      if (currentPresenceRef) {
        deleteDoc(currentPresenceRef).catch(() => {});
      }
    };
  }, [roomId, roomType]);

  return activeUsers;
};
