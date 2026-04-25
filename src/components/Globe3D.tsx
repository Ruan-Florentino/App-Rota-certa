import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Navigation, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';

interface Globe3DProps {
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void;
  hideControls?: boolean;
  hideSearch?: boolean;
  hideInfoCard?: boolean;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  customPoints?: any[];
}

export const Globe3D: React.FC<Globe3DProps> = ({ 
  onLocationSelect, 
  hideControls = false, 
  hideSearch = false,
  hideInfoCard = false,
  initialCenter,
  initialZoom = 2.5,
  customPoints
}) => {
  const globeRef = useRef<GlobeMethods>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [points, setPoints] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [flightArcs, setFlightArcs] = useState<any[]>([]);

  // Popular destinations for pins
  const popularDestinations = useMemo(() => [
    { lat: 48.8566, lng: 2.3522, name: 'Paris', country: 'França', price: 'R$ 4.500' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo', country: 'Japão', price: 'R$ 7.200' },
    { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro', country: 'Brasil', price: 'R$ 1.200' },
    { lat: 40.7128, lng: -74.0060, name: 'New York', country: 'EUA', price: 'R$ 5.800' },
    { lat: 51.5074, lng: -0.1278, name: 'Londres', country: 'Reino Unido', price: 'R$ 5.100' },
    { lat: 25.2048, lng: 55.2708, name: 'Dubai', country: 'EAU', price: 'R$ 6.500' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney', country: 'Austrália', price: 'R$ 8.900' },
    { lat: 41.9028, lng: 12.4964, name: 'Roma', country: 'Itália', price: 'R$ 4.800' },
    { lat: 52.3676, lng: 4.9041, name: 'Amsterdam', country: 'Holanda', price: 'R$ 4.200' },
    { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires', country: 'Argentina', price: 'R$ 1.800' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapura', country: 'Singapura', price: 'R$ 7.500' },
    { lat: 30.0444, lng: 31.2357, name: 'Cairo', country: 'Egito', price: 'R$ 3.900' },
  ], []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load countries GeoJSON
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data.features))
      .catch(err => console.error('Error loading countries:', err));

    const loadImages = async () => {
      const sourcePoints = customPoints || popularDestinations;
      const pointsWithImages = await Promise.all(sourcePoints.map(async (dest) => {
        if (dest.image && !dest.image.includes('unsplash')) return dest; // Already has a real image
        try {
          const { getDynamicImage } = await import('../services/imageService');
          const image = await getDynamicImage(dest.name, dest.country || dest.name);
          return { ...dest, image };
        } catch (error) {
          console.error(`Error loading image for ${dest.name}:`, error);
          return { ...dest, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&h=300' };
        }
      }));
      setPoints(pointsWithImages);
      
      // If customPoints is provided and has 1 item, select it
      if (customPoints && customPoints.length === 1) {
        setSelectedPoint(pointsWithImages[0]);
      }

      // Generate random interesting flight arcs between popular destinations
      const arcs = [];
      const numArcs = hideControls ? 5 : 15; // less arcs if it's just a background widget
      for (let i = 0; i < numArcs; i++) {
        const start = sourcePoints[Math.floor(Math.random() * sourcePoints.length)];
        let end = sourcePoints[Math.floor(Math.random() * sourcePoints.length)];
        while (end.name === start.name) {
          end = sourcePoints[Math.floor(Math.random() * sourcePoints.length)];
        }
        arcs.push({
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
        });
      }
      setFlightArcs(arcs);
    };

    loadImages();
  }, [popularDestinations, customPoints]);

  const handleGlobeReady = () => {
    if (globeRef.current) {
      try {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = !initialCenter;
          controls.autoRotateSpeed = 0.5;
        }
        
        // Initial position
        if (initialCenter) {
          globeRef.current.pointOfView({ lat: initialCenter.lat, lng: initialCenter.lng, altitude: initialZoom });
        } else {
          globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: initialZoom });
        }
      } catch (e) {
        console.warn("Could not initialize globe controls", e);
      }
    }
  };

  // Update position if initialCenter changes
  useEffect(() => {
    if (initialCenter && globeRef.current) {
      globeRef.current.pointOfView({ lat: initialCenter.lat, lng: initialCenter.lng, altitude: initialZoom }, 1000);
    }
  }, [initialCenter, initialZoom]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      // Small delay to ensure container has finished resizing
      setTimeout(() => {
        if (globeRef.current) {
          window.dispatchEvent(new Event('resize'));
        }
      }, 100);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const name = data[0].display_name.split(',')[0];
        const country = data[0].display_name.split(',').pop()?.trim() || '';

        globeRef.current?.pointOfView({ lat, lng, altitude: 1.5 }, 2000);
        
        // Add temporary point for searched location
        const newPoint = { lat, lng, name, country, price: 'Explorar', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&h=300' };
        
        // Try to load a real image for the searched location
        import('../services/imageService').then(({ getDynamicImage }) => {
          getDynamicImage(name, country).then(image => {
            setPoints(prev => prev.map(p => p.name === name ? { ...p, image } : p));
            if (selectedPoint?.name === name) {
              setSelectedPoint((prev: any) => ({ ...prev, image }));
            }
          });
        });

        setPoints(prev => [...prev.filter(p => p.name !== name), newPoint]);
        setSelectedPoint(newPoint);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePointClick = (point: any) => {
    setSelectedPoint(point);
    globeRef.current?.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.2 }, 1000);
    if (onLocationSelect) {
      onLocationSelect(point);
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-black" style={{ minHeight: '400px', background: '#1e1b4b' }}>
      {/* Search Bar */}
      {!hideSearch && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar país, cidade ou lugar..."
              className="w-full h-14 pl-12 pr-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </form>
        </div>
      )}

      {/* Globe Controls */}
      {!hideControls && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          <button 
            onClick={() => globeRef.current?.pointOfView({ altitude: (globeRef.current?.pointOfView().altitude || 2) * 0.8 }, 500)}
            className="w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={() => globeRef.current?.pointOfView({ altitude: (globeRef.current?.pointOfView().altitude || 2) * 1.2 }, 500)}
            className="w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={() => globeRef.current?.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000)}
            className="w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Globe Component */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        onGlobeReady={handleGlobeReady}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        
        // Polygons (Countries)
        hexPolygonsData={hideControls ? [] : countries}
        hexPolygonColor={() => 'rgba(34, 211, 238, 0.15)'} /* Cyan color for land */
        hexPolygonResolution={3}
        hexPolygonMargin={0.3} /* Higher margin for dot matrix feel */
        
        // HTML Labels for destinations
        htmlElementsData={points}
        htmlLat="lat"
        htmlLng="lng"
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="hover-label bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-white text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)] whitespace-nowrap cursor-pointer transition-transform hover:scale-110 pointer-events-auto">
              ${d.name} <span class="text-white/50 text-[10px] ml-1 uppercase tracking-widest">${d.country}</span>
            </div>
          `;
          el.style.pointerEvents = 'none';
          el.style.transform = 'translate(-50%, -300%)';
          
          el.onclick = () => handlePointClick(d);
          
          return el;
        }}

        // Destinations Points (Replaced with Custom 3D Objects)
        customLayerData={points}
        customThreeObject={(d: any) => {
          const group = new THREE.Group();
          
          // Cone invertido apontando pra terra
          const coneGeometry = new THREE.ConeGeometry(0.3, 1, 8);
          coneGeometry.rotateX(Math.PI);
          coneGeometry.translate(0, 0.5, 0); // Ajustar pivot pra base
          const coneMaterial = new THREE.MeshBasicMaterial({ color: '#22D3EE', transparent: true, opacity: 0.8 });
          const cone = new THREE.Mesh(coneGeometry, coneMaterial);
          
          // Esfera no topo
          const sphereGeometry = new THREE.SphereGeometry(0.25, 16, 16);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: '#10F5A0' });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(0, 1.1, 0);
          
          // Glow pulsante (simulado)
          const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
          const glowMaterial = new THREE.MeshBasicMaterial({ color: '#22D3EE', transparent: true, opacity: 0.3 });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.set(0, 1.1, 0);

          group.add(cone);
          group.add(sphere);
          group.add(glow);
          
          return group;
        }}
        customThreeObjectUpdate={(obj: any, d: any) => {
          if (!globeRef.current) return;
          // Point object pointing radially outward
          Object.assign(obj.position, globeRef.current.getCoords(d.lat, d.lng, 0.03));
          const { x, y, z } = globeRef.current.getCoords(d.lat, d.lng, 0);
          obj.lookAt(new THREE.Vector3(x, y, z));
          
          // Animação simula pulse no glow
          const time = Date.now() * 0.005;
          const scale = 1 + Math.sin(time + d.lat) * 0.2;
          if (obj.children[2]) {
             obj.children[2].scale.set(scale, scale, scale);
          }
        }}
        onCustomLayerClick={handlePointClick}
        
        // Radar Rings
        ringsData={points}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => '#22D3EE'}
        ringMaxRadius={2}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}
        
        // Flight Arcs
        arcsData={flightArcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={(d: any) => ['#22D3EE', '#10F5A0']}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2500}
        arcStroke={0.5}
        arcAltitudeAutoScale={0.4}
        
        // Atmosphere Breathing Effect
        showAtmosphere={true}
        atmosphereColor="#22D3EE"
        atmosphereAltitude={0.1 + Math.sin(Date.now() / 2000) * 0.02}
      />
      )}

      {/* Info Card */}
      <AnimatePresence>
        {!hideInfoCard && selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm"
          >
            <div className="glass-card overflow-hidden">
              <div className="relative h-40">
                <OptimizedImage 
                  src={selectedPoint.image} 
                  alt={selectedPoint.name}
                  destinationName={selectedPoint.name}
                  className="w-full h-full"
                />
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                >
                  ×
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-black text-xs font-bold">
                  {selectedPoint.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1">{selectedPoint.name}</h3>
                <p className="text-white/60 text-sm mb-4 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {selectedPoint.country || 'Localização'}
                </p>
                {selectedPoint.description && (
                  <p className="text-white/50 text-xs mb-4 line-clamp-2">{selectedPoint.description}</p>
                )}
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate('/plan', { state: { destination: `${selectedPoint.name}, ${selectedPoint.country}`, lat: selectedPoint.lat, lng: selectedPoint.lng } })}
                    className="flex-1 h-12 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" /> Planejar
                  </button>
                  <button 
                    onClick={() => {
                      // Maybe open a search for this place or just close the card
                      setSelectedPoint(null);
                    }}
                    className="w-12 h-12 glass rounded-xl flex items-center justify-center text-white"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend/Overlay */}
      {!hideControls && (
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-medium">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Globo 3D Interativo
          </div>
        </div>
      )}
    </div>
  );
};
