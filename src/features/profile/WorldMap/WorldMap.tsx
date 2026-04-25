import { useEffect, useRef, useState, memo } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plane, Heart } from 'lucide-react';
import { VisitedPlace } from './types';

interface WorldMapProps {
  places: VisitedPlace[];
  onPlaceClick?: (place: VisitedPlace) => void;
  height?: string;
}

export const WorldMap = memo(function WorldMap({
  places,
  onPlaceClick,
  height = '400px',
}: WorldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<VisitedPlace | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    
    // Fallback if no key
    const tilesUrl = import.meta.env.VITE_MAPTILER_KEY
      ? `https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`
      : `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [tilesUrl],
            tileSize: 256,
            attribution: '© MapTiler © OpenStreetMap contributors',
          },
        },
        layers: [{
          id: 'osm',
          type: 'raster',
          source: 'osm',
        }],
      },
      center: [0, 20],
      zoom: 1.5,
      attributionControl: false,
    });
    
    map.on('load', () => setLoaded(true));
    mapRef.current = map;
    
    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
    };
  }, []);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    
    places.forEach(place => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = getMarkerHTML(place.type);
      
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(place.coordinates)
        .addTo(map);
      
      el.addEventListener('click', () => {
        setSelectedPlace(place);
        onPlaceClick?.(place);
      });
      
      markersRef.current.push(marker);
    });
  }, [places, loaded, onPlaceClick]);
  
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
});

function getMarkerHTML(type: VisitedPlace['type']): string {
    const colors = { visited: '#A855F7', wishlist: '#00E5D4', planned: '#7DD3FC' };
    return `<div style="background:${colors[type]}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>`;
}
