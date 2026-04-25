// Coordenadas (capital ou centro) dos principais países usando ISO Alpha-2
export const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  'BR': { lat: -15.8267, lng: -47.9218 },
  'FR': { lat: 48.8566, lng: 2.3522 },
  'IT': { lat: 41.9028, lng: 12.4964 },
  'JP': { lat: 35.6762, lng: 139.6503 },
  'US': { lat: 38.9072, lng: -77.0369 },
  'MX': { lat: 19.4326, lng: -99.1332 },
  'PT': { lat: 38.7223, lng: -9.1393 },
  'ES': { lat: 40.4168, lng: -3.7038 },
  'GB': { lat: 51.5074, lng: -0.1278 },
  'DE': { lat: 52.5200, lng: 13.4050 },
  'GR': { lat: 37.9838, lng: 23.7275 },
  'TR': { lat: 39.9334, lng: 32.8597 },
  'EG': { lat: 30.0444, lng: 31.2357 },
  'MA': { lat: 31.6295, lng: -7.9811 },
  'ZA': { lat: -33.9249, lng: 18.4241 },
  'AU': { lat: -35.2809, lng: 149.1300 },
  'NZ': { lat: -41.2865, lng: 174.7762 },
  'TH': { lat: 13.7563, lng: 100.5018 },
  'ID': { lat: -6.2088, lng: 106.8456 },
  'IN': { lat: 28.6139, lng: 77.2090 },
  'CN': { lat: 39.9042, lng: 116.4074 },
  'KR': { lat: 37.5665, lng: 126.9780 },
  'VN': { lat: 21.0285, lng: 105.8542 },
  'SG': { lat: 1.3521, lng: 103.8198 },
  'AE': { lat: 24.4539, lng: 54.3773 },
  'AR': { lat: -34.6037, lng: -58.3816 },
  'CL': { lat: -33.4489, lng: -70.6693 },
  'PE': { lat: -12.0464, lng: -77.0428 },
  'CO': { lat: 4.7110, lng: -74.0721 },
  'CA': { lat: 45.4215, lng: -75.6972 },
};

export function getCountryCoords(countryCode: string) {
  return COUNTRY_COORDS[countryCode?.toUpperCase()] || null;
}
