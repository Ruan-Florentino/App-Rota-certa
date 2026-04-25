import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MaplibreMap, LngLatLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapMarker {
  id: string;
  lng: number;
  lat: number;
  label?: string;
  color?: string;
  onClick?: () => void;
  pulse?: boolean;
}

export interface MapProps {
  center: LngLatLike;
  zoom?: number;
  markers?: MapMarker[];
  style?: 'streets' | 'satellite' | 'dark';
  interactive?: boolean;
  onBoundsChange?: (bounds: maplibregl.LngLatBounds) => void;
  className?: string;
  routeData?: any; // To support Turf JS curves naturally natively without react layers.
}

// Using Carto Dark Matter (free, no key required)
const mapStyle = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export function Map({
  center,
  zoom = 1,
  markers = [],
  style = 'dark',
  interactive = true,
  onBoundsChange,
  className = 'w-full h-full',
  routeData,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [ready, setReady] = useState(false);

  // Inicialização (uma vez)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle as any,
      center,
      zoom,
      interactive,
      attributionControl: { compact: true },
    });

    map.on('load', () => {
      setReady(true);
      if (onBoundsChange) {
        map.on('moveend', () => onBoundsChange(map.getBounds()));
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Route Data (Lines / Turf Paths) natively bridging MapLibre Source/Layers.
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const map = mapRef.current;
    const sourceId = 'flight-path';

    if (routeData) {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: routeData
        });

        map.addLayer({
          id: 'flight-path-glow',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#6366F1', 
            'line-width': 8,
            'line-blur': 6,
            'line-opacity': 0.2
          }
        });

        map.addLayer({
          id: 'flight-path-line',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#818CF8', 
            'line-width': 2,
            'line-dasharray': [2, 1]
          }
        });
      } else {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(routeData);
      }
    } else {
      if (map.getLayer('flight-path-line')) map.removeLayer('flight-path-line');
      if (map.getLayer('flight-path-glow')) map.removeLayer('flight-path-glow');
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }
  }, [routeData, ready]);

  // Atualizar markers quando mudam
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    // Limpar antigos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Adicionar novos
    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = `map-marker flex items-center justify-center ${marker.pulse ? 'animate-pulse' : ''}`;
      
      el.style.cssText = `
        width: 10px; height: 10px;
        background: ${marker.color || '#6366F1'};
        border: 2px solid #0A0A0F;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 12px ${marker.color || 'rgba(99, 102, 241, 0.4)'};
      `;
      
      if (marker.onClick) {
        el.addEventListener('click', marker.onClick);
      }

      const mlMarker = new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat]); // lng, lat format native for Maplibre

      if (marker.label) {
        mlMarker.setPopup(
          new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(
            `<div class="font-sans font-bold bg-rw-surface text-rw-text border border-rw-border px-3 py-1.5 rounded-lg shadow-2xl text-xs uppercase tracking-wider">${marker.label}</div>`
          )
        );
      }

      mlMarker.addTo(mapRef.current!);
      markersRef.current.push(mlMarker);
    });
  }, [markers, ready]);


  // Atualizar centro/zoom externos smooth
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    mapRef.current.flyTo({ center, zoom, duration: 1000 });
  }, [center, zoom, ready]);

  return <div ref={containerRef} className={className} />;
}
