import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
import { latLngToVector3 } from './utils/latLngToVector3';

interface CountryPinProps {
  lat: number;
  lng: number;
  color?: string;
  label?: string;
}

export function CountryPin({ lat, lng, color = '#A855F7', label }: CountryPinProps) {
  const pinRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = latLngToVector3(lat, lng, 1.02);
  
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 2) * 0.15;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <group position={position}>
      {/* Pin sólido */}
      <mesh
        ref={pinRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Glow pulsante */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      
      {/* Label (aparece no hover) */}
      {hovered && label && (
        <Html distanceFactor={8}>
          <div className="px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-purple-500/50 text-white text-xs whitespace-nowrap pointer-events-none">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
