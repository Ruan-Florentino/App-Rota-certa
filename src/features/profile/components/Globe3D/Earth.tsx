import React, { useRef } from 'react';
import { Mesh } from 'three';

export function Earth() {
  const meshRef = useRef<Mesh>(null);
  const isMobile = window.innerWidth < 768;
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
      <meshStandardMaterial
        color="#080b18"
        wireframe={true}
        emissive="#0f172a"
      />
    </mesh>
  );
}
