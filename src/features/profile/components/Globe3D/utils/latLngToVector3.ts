import { Vector3 } from 'three';

/**
 * Converte coordenadas geográficas (lat, lng) em vetor 3D
 * na superfície de uma esfera de raio dado.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 1
): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new Vector3(x, y, z);
}
