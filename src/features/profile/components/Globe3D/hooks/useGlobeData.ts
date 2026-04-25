import { useMemo } from 'react';
import { getCountryCoords } from '../utils/countryCoords';

export function useGlobeData(trips: any[]) {
  const pins = useMemo(() => {
    // Only mapped visited trips
    const visitedTrips = trips.filter(t => t.status === 'visited');
    // Extract unique ISO country codes
    const uniqueCountryCodes = Array.from(new Set(visitedTrips.map(t => t.countryCode).filter(Boolean)));
    
    return uniqueCountryCodes
      .map(countryCode => {
        const coords = getCountryCoords(countryCode);
        if (!coords) return null;
        return { country: countryCode, ...coords };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [trips]);
  
  const routes = useMemo(() => {
    const visitedTrips = trips.filter(t => t.status === 'visited').sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const result: Array<{ 
      from: { lat: number; lng: number }; 
      to: { lat: number; lng: number };
    }> = [];
    
    for (let i = 0; i < visitedTrips.length - 1; i++) {
      const fromCode = visitedTrips[i].countryCode;
      const toCode = visitedTrips[i + 1].countryCode;
      if (fromCode === toCode) continue;

      const fromCoords = getCountryCoords(fromCode);
      const toCoords = getCountryCoords(toCode);
      
      if (fromCoords && toCoords) {
        result.push({ from: fromCoords, to: toCoords });
      }
    }
    
    return result;
  }, [trips]);
  
  return { pins, routes };
}
