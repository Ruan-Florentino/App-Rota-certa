import React from 'react';
import { BackSide } from 'three';

export function Atmosphere() {
  const isMobile = window.innerWidth < 768;
  return (
    <mesh>
      <sphereGeometry args={[1.15, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
      <shaderMaterial
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(0.66, 0.33, 0.97, 1.0) * intensity;
          }
        `}
        side={BackSide}
        transparent
        blending={2}
      />
    </mesh>
  );
}
