import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Camera, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as turf from '@turf/turf';
import { OptimizedImage } from './OptimizedImage';
import { PremiumButton } from './ui/PremiumButton';
import { Map, MapMarker } from './map/Map';

interface Point {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: string;
  price?: string;
  image?: string;
  country?: string;
  description?: string;
}

interface Map2DProps {
  points: Point[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onPointClick?: (point: Point) => void;
  isItinerary?: boolean;
}

export const Map2D: React.FC<Map2DProps> = ({ points, initialCenter, initialZoom = 13, onPointClick, isItinerary = false }) => {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [currentCenter, setCurrentCenter] = useState<{lat: number, lng: number}>(initialCenter || (points.length > 0 ? { lat: points[0].lat, lng: points[0].lng } : { lat: -23.5505, lng: -46.6333 }));
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const navigate = useNavigate();

  // Route Logic Using Turf natively to generate the GeoJSON wrapper
  const routeData = useMemo(() => {
    if (isItinerary && points.length > 1) {
      let features: any[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        // Turf requires coordinates [lng, lat]
        const start = [points[i].lng, points[i].lat];
        const end = [points[i+1].lng, points[i+1].lat];
        const line = turf.lineString([start, end]);
        const mid = turf.midpoint(turf.point(start), turf.point(end));
        const length = turf.distance(start, end, { units: 'kilometers' });
        const bearing = turf.bearing(turf.point(start), turf.point(end));
        const offset = turf.destination(mid, length * 0.15, bearing + 90);
        const curve = turf.bezierSpline(turf.lineString([start, offset.geometry.coordinates, end]), { resolution: 100 });
        features.push(curve);
      }
      return turf.featureCollection(features);
    }
    return null;
  }, [isItinerary, points]);

  // Convert raw points into universal MapMarker definitions
  const markers = useMemo<MapMarker[]>(() => {
    return points.map(point => ({
      id: point.id,
      lng: point.lng,
      lat: point.lat,
      label: point.name,
      pulse: point.type === 'attraction',
      color: point.type === 'attraction' ? '#10F5A0' : '#22D3EE',
      onClick: () => {
        setSelectedPoint(point);
        setCurrentCenter({ lat: point.lat, lng: point.lng });
        setCurrentZoom(15);
        if (onPointClick) onPointClick(point);
      }
    }));
  }, [points, onPointClick]);

  useEffect(() => {
    if (initialCenter) {
      setCurrentCenter(initialCenter);
      setCurrentZoom(initialZoom);
    }
  }, [initialCenter, initialZoom]);

  return (
    <div className="relative w-full h-full bg-[#0A0E1A]">
      <Map 
        center={[currentCenter.lng, currentCenter.lat]} // Array conversion native [lng, lat] 
        zoom={currentZoom}
        style="dark"
        markers={markers}
        routeData={routeData}
        className="w-full h-full"
      />

      {/* Reorganized Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-3 z-10">
        <div className="glass flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <button 
            className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5"
            onClick={() => setCurrentZoom(z => Math.min(z + 1, 20))}
          >
            <span className="text-xl">+</span>
          </button>
          <button 
            className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setCurrentZoom(z => Math.max(z - 1, 1))}
          >
            <span className="text-2xl leading-none -mt-1">-</span>
          </button>
        </div>
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col gap-3 z-10">
        <button 
          className="glass w-11 h-11 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors shadow-2xl border border-white/10"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                setCurrentCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setCurrentZoom(15);
              });
            }
          }}
        >
          <Target className="w-5 h-5" />
        </button>
      </div>

      {/* Info Card - Simplified/Cleaned */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-[340px]"
          >
            <div className="glass-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="relative h-40">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                {selectedPoint.image ? (
                  <OptimizedImage 
                    src={selectedPoint.image} 
                    alt={selectedPoint.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center">
                    <Camera className="w-8 h-8 text-white/10" />
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="absolute top-4 right-4 w-8 h-8 glass rounded-full flex items-center justify-center text-white z-20"
                >
                  <span className="text-lg">×</span>
                </button>
                
                <div className="absolute top-4 left-4 px-2 py-1 glass rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10 z-20">
                  {selectedPoint.type}
                </div>
              </div>
              
              <div className="p-5 pt-2 relative z-20">
                <h3 className="text-lg font-bold text-white mb-0.5">{selectedPoint.name}</h3>
                <p className="text-white/40 text-[10px] mb-3 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <MapPin className="w-3 h-3 text-primary" /> {selectedPoint.country || 'Explorar'}
                </p>
                
                <div className="flex items-center justify-between gap-3 mt-4">
                  {selectedPoint.price && (
                    <div className="text-primary font-black text-sm">{selectedPoint.price}</div>
                  )}
                  <PremiumButton 
                    onClick={() => navigate('/plan', { state: { destination: `${selectedPoint.name}, ${selectedPoint.country}`, lat: selectedPoint.lat, lng: selectedPoint.lng } })}
                    size="sm"
                    className="flex-1"
                  >
                    Planejar
                  </PremiumButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
