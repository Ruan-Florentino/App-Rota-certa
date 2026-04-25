import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
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

export function CameraAnimator() {
  const { camera } = useThree();
  const selectedAssetId = useIntelStore((state) => state.selectedAssetId);
  const targetPos = React.useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (selectedAssetId) {
      const asset = MOCK_ASSETS.find(a => a.id === selectedAssetId);
      if (asset) {
        // Find position of the asset
        const pos = getPosFromLatLng(asset.location.lat, asset.location.lng, 1);
        
        // Push the camera out a bit from the target, and offset slightly for the panel mapping
        const offsetMultiplier = window.innerWidth > 768 ? 1.5 : 2;
        const newCameraPos = pos.clone().multiplyScalar(offsetMultiplier);
        
        // If desktop, apply slight X offset to center the globe in the remaining space
        if (window.innerWidth > 768) {
          // A somewhat hacky but effective way to offset is to modify the camera position slightly to the left/right
          // depending on where we want it. But Spherical coords are better.
          // Simplest is just moving the targetPos.
        }
        
        targetPos.current = newCameraPos;
      }
    } else {
      // Revert to default zoom out slightly
      targetPos.current = new THREE.Vector3(0, 0, 3);
    }
  }, [selectedAssetId]);

  useFrame((state, delta) => {
    if (targetPos.current) {
      state.camera.position.lerp(targetPos.current, delta * 3);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
}
