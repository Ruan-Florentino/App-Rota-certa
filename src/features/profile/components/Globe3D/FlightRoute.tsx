import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierCurve3, BufferGeometry, Line } from 'three';
import { latLngToVector3 } from './utils/latLngToVector3';

interface FlightRouteProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  color?: string;
}

export function FlightRoute({ from, to, color = '#7DD3FC' }: FlightRouteProps) {
  const lineRef = useRef<Line>(null);
  
  const { points, totalLength } = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng, 1.01);
    const end = latLngToVector3(to.lat, to.lng, 1.01);
    
    // Ponto médio elevado (curvatura)
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(1 + distance * 0.4);
    
    const curve = new QuadraticBezierCurve3(start, mid, end);
    const pts = curve.getPoints(50);
    
    return { points: pts, totalLength: pts.length };
  }, [from, to]);
  
  const geometry = useMemo(() => {
    const geo = new BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);
  
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const t = (clock.getElapsedTime() * 0.3) % 1;
      const drawCount = Math.floor(t * totalLength);
      geometry.setDrawRange(0, drawCount);
    }
  });
  
  return (
    // @ts-expect-error r3f conflicts with SVG line
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.8} />
    </line>
  );
}
