import { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';

export function useAppAnniversary() {
  const user = useUserStore((s) => s.user);
  
  useEffect(() => {
    if (!user) return;
    
    const createdAt = new Date(user.joinedAt);
    const now = new Date();
    
    if (createdAt.getDate() === now.getDate() && createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() < now.getFullYear()) {
      // Trigger Anniversary (Implement UI/toast)
      console.log('Happy Anniversary!');
    }
  }, [user]);
}
