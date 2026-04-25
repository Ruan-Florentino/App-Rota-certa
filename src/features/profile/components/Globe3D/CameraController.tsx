import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { useIntelStore } from '../../../intel-panel/store';

interface CameraControllerProps {
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export function CameraController({
  autoRotate = true,
  enableZoom = true,
  enablePan = false,
}: CameraControllerProps) {
  const selectedAssetId = useIntelStore(state => state.selectedAssetId);
  const shouldAutoRotate = autoRotate && !selectedAssetId;

  return (
    <OrbitControls
      enableZoom={enableZoom}
      enablePan={enablePan}
      autoRotate={shouldAutoRotate}
      autoRotateSpeed={0.5}
      minDistance={1.05}
      maxDistance={4}
      rotateSpeed={0.5}
      zoomSpeed={0.5}
      enableDamping
      dampingFactor={0.05}
      makeDefault
    />
  );
}

