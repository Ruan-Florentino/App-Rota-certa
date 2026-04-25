import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWebGLSupport } from './hooks/useWebGLSupport';
import { Globe3DFallback } from './Globe3DFallback';
import { Globe3DErrorBoundary } from './Globe3DErrorBoundary';
import { Earth } from './Earth';
import { Stars } from './Stars';
import { CameraController } from './CameraController';
import { Loader2 } from 'lucide-react';
import { AssetPins } from './AssetPins';
import { CameraAnimator } from './CameraAnimator';
import { IntelLayout } from '../../../intel-panel/components/IntelLayout';

interface Globe3DProps {
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
}

export function Globe3D({
  className,
  autoRotate = true,
  interactive = true,
}: Globe3DProps) {
  const webGLSupported = useWebGLSupport();
  
  if (!webGLSupported) {
    return <Globe3DFallback countryCount={5} className={className} />;
  }

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className || ''}`}
      style={{ minHeight: '400px' }}
    >
      <Globe3DErrorBoundary countryCount={5}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ 
            background: 'transparent',
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          onCreated={({ gl, size }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <Stars count={1500} />
            <Earth />
            <AssetPins />
            <CameraAnimator />
            <CameraController 
              autoRotate={autoRotate}
              enableZoom={interactive}
              enablePan={false}
            />
          </Suspense>
        </Canvas>
      </Globe3DErrorBoundary>
      
      <Suspense fallback={<GlobeLoader />}>
        <div />
      </Suspense>
      
      <IntelLayout />
    </div>
  );
}

function GlobeLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
    </div>
  );
}



