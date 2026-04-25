import React, { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';

export function Stars({ count = 2000 }: { count?: number }) {
  const isMobile = window.innerWidth < 768;
  const actualCount = isMobile ? Math.min(count, 500) : count;

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(actualCount * 3);
    
    for (let i = 0; i < actualCount; i++) {
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geo;
  }, [actualCount]);
  
  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.03} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}
