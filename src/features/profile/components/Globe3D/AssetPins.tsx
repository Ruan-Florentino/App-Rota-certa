import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useIntelStore } from '../../../intel-panel/store';
import { MOCK_ASSETS } from '../../../../lib/data/mock-assets';
import * as THREE from 'three';

// Convert lat/lng to 3D Cartesian coordinates
function getPosFromLatLng(lat: number, lng: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

export function AssetPins() {
  const { setSelectedAsset, selectedAssetId, setHighlightedAsset, highlightedAssetId } = useIntelStore();

  return (
    <>
      {MOCK_ASSETS.map(asset => {
        const pos = getPosFromLatLng(asset.location.lat, asset.location.lng, 1.01);
        const isSelected = selectedAssetId === asset.id;
        const isHighlighted = highlightedAssetId === asset.id || isSelected;

        return (
          <group key={asset.id} position={pos}>
            {/* The 3D hit area / marker core */}
            <mesh 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAsset(asset.id);
                setHighlightedAsset(asset.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
                if (!selectedAssetId) setHighlightedAsset(asset.id);
              }}
              onPointerOut={(e) => {
                document.body.style.cursor = 'auto';
                if (!selectedAssetId) setHighlightedAsset(null);
              }}
            >
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshBasicMaterial color={isHighlighted ? '#22D3EE' : '#38BDF8'} />
            </mesh>

            {/* Tactical UI Pin Overlay */}
            <Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
              <div 
                className={`flex flex-col items-center transition-all duration-300 ${isHighlighted ? 'scale-110 opacity-100' : 'scale-100 opacity-60 hover:opacity-100'}`}
              >
                {/* Status Indicator */}
                <div className={`text-[10px] uppercase font-mono tracking-widest px-1 rounded backdrop-blur-sm border mb-1 whitespace-nowrap transition-colors
                  ${isHighlighted ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}
                `}>
                  {asset.name}
                </div>

                {/* Tactical Pin Reticle */}
                <div className="relative flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${isHighlighted ? 'border-cyan-400 animate-ping absolute' : 'hidden'}`} />
                  <div className={`w-3 h-3 rounded-full border-2 ${isHighlighted ? 'border-cyan-400 bg-cyan-400/20' : 'border-sky-400 bg-sky-400/10'}`}>
                    <div className={`w-1 h-1 rounded-full m-0.5 ${isHighlighted ? 'bg-cyan-300' : 'bg-sky-300'}`} />
                  </div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}
