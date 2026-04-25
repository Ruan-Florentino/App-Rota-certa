import { useState, useCallback, useRef } from 'react';

export function useTapCounter(
  targetCount: number,
  onReach: () => void,
  resetMs = 2000
) {
  const [count, setCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const tap = useCallback(() => {
    clearTimeout(timerRef.current);
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount === targetCount) {
      onReach();
      setCount(0);
    } else {
      timerRef.current = setTimeout(() => setCount(0), resetMs);
    }
  }, [count, targetCount, onReach, resetMs]);
  
  return { tap, count };
}
