import { useEffect } from 'react';

export function useShakeDetection(
  onShake: () => void,
  threshold = 15
) {
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = Date.now();
    let shakeCount = 0;
    
    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      
      const now = Date.now();
      if (now - lastTime < 100) return;
      
      const deltaX = Math.abs((acc.x ?? 0) - lastX);
      const deltaY = Math.abs((acc.y ?? 0) - lastY);
      const deltaZ = Math.abs((acc.z ?? 0) - lastZ);
      
      if (deltaX + deltaY + deltaZ > threshold) {
        shakeCount++;
        if (shakeCount >= 3) {
          onShake();
          shakeCount = 0;
        }
      }
      
      lastX = acc.x ?? 0;
      lastY = acc.y ?? 0;
      lastZ = acc.z ?? 0;
      lastTime = now;
    };
    
    // iOS 13+ requires user permission
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission();
    }
    
    window.addEventListener('devicemotion', handler as any);
    return () => window.removeEventListener('devicemotion', handler as any);
  }, [onShake, threshold]);
}
