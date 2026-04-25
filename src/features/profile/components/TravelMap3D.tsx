import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture, Line, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { mockTripsData } from '../data/mockProfile';

const Globe = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Using placeholder textures that work out of the box
  // For production, these should be high quality local assets
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-night.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png',
    'https://unpkg.com/three-globe/example/img/earth-clouds.png'
  ]);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001; // Base rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0013; // Clouds move slightly faster
    }
  });

  return (
    <group>
      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#00E5D4" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Interactive Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={15}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// Helper to convert lat/lng to 3D Cartesian coords
const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const Markers = ({ trips }: { trips: any[] }) => {
  return (
    <>
      <Sparkles count={50} scale={1.2} size={2} speed={0.4} color="#D4AF37" />
      {trips.map((trip, i) => {
        // Paris approx coordinates
        const pos = latLngToVector3(48.8566, 2.3522, 1.02);
        
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshBasicMaterial color="#00E5D4" />
            </mesh>
            <mesh>
              <ringGeometry args={[0.03, 0.04, 32]} />
              <meshBasicMaterial color="#00E5D4" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
            <Html center distanceFactor={1.5}>
              <div className="bg-[#0F1420]/80 backdrop-blur-md px-[8px] py-[4px] rounded-[6px] border border-white/10 text-white text-[8px] font-bold uppercase whitespace-nowrap transform -translate-y-8 pointer-events-none">
                {trip.destination}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
};

export default function TravelMap3D() {
  return (
    <div className="pt-[16px]">
      <div className="flex justify-between items-end mb-[16px]">
        <div>
          <h3 className="text-white text-[14px] font-bold uppercase tracking-wider">
            🌍 Seu Mapa de Viagens
          </h3>
          <div className="flex gap-[12px] mt-[4px]">
             <span className="text-[#00E5D4] text-[10px] uppercase font-bold tracking-widest tabular-nums font-mono">1 PAÍS EXPLORADO</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-full bg-[#D4AF37]" />
            <span className="text-white/60 text-[8px] uppercase tracking-wider">Visitado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-full bg-[#00E5D4] animate-pulse" />
            <span className="text-white/60 text-[8px] uppercase tracking-wider">Atual</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[280px] rounded-[24px] overflow-hidden bg-gradient-to-b from-[#0A0D14] to-[#05070A] relative border border-white/5 shadow-2xl">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
          <ambientLight intensity={0.2} color="#00E5D4" />
          <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-5, -3, -5]} intensity={0.5} color="#A855F7" />
          
          <React.Suspense fallback={null}>
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <group rotation={[0.2, 0, 0]}>
              <Globe />
              <Markers trips={mockTripsData} />
            </group>
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              autoRotate={true}
              autoRotateSpeed={0.5}
              minDistance={1.2}
              maxDistance={4}
            />
          </React.Suspense>
        </Canvas>

        {/* Map Overlay UI */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[24px] pointer-events-none z-20" />
        
        {/* Decorative Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />
      </div>
    </div>
  );
}
