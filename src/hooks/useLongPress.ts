import { useRef } from 'react';

export function useLongPress(
  onLongPress: () => void,
  duration = 3000
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const start = () => {
    timerRef.current = setTimeout(onLongPress, duration);
  };
  
  const cancel = () => {
    clearTimeout(timerRef.current);
  };
  
  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  };
}
