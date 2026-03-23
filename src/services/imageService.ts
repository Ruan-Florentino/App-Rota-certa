import axios from 'axios';

// Cache in memory to avoid repeated API calls
const imageCache: Record<string, string> = {};

/**
 * Fetches a high-quality image for a city/country or specific place using Google Places API.
 */
export const getDynamicImage = async (query: string, type: 'city' | 'hotel' | 'place' = 'city', city?: string, country?: string): Promise<string> => {
  const cacheKey = `google:${type}:${query.toLowerCase().trim()}`;
  
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  try {
    const response = await axios.get('/api/place-image', {
      params: { query, type, city, country }
    });
    
    if (response.data && response.data.url) {
      imageCache[cacheKey] = response.data.url;
      return response.data.url;
    }
    
    return '';
  } catch (error) {
    console.error('Error fetching Google Place image:', error);
    return '';
  }
};

/**
 * Global function to get city image correctly
 */
export const getCityImage = async (city: string, country: string = ''): Promise<string> => {
  return getDynamicImage(`${city} ${country}`.trim(), 'city', city, country);
};

/**
 * Convenience function for hotel images
 */
export const getHotelImage = async (hotelName: string, city: string = ''): Promise<string> => {
  return getDynamicImage(`${hotelName} ${city}`.trim(), 'hotel', city);
};

/**
 * Convenience function for place/activity images
 */
export const getPlaceImage = async (placeName: string, city: string = ''): Promise<string> => {
  return getDynamicImage(`${placeName} ${city}`.trim(), 'place', city);
};

/**
 * Mapping of airline names to their official logo URLs
 */
const airlineLogos: Record<string, string> = {
  'LATAM': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/LATAM_Airlines_logo.svg',
  'GOL': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Gol_Transportes_A%C3%A9reos_logo.svg',
  'AZUL': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Azul_Brazilian_Airlines_logo.svg',
  'AMERICAN': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/American_Airlines_logo_2013.svg',
  'DELTA': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Delta_Air_Lines_Logo.svg',
  'UNITED': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/United_Airlines_Logo.svg',
  'EMIRATES': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg',
  'TAP': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/TAP_Air_Portugal_logo.svg',
  'LUFTHANSA': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lufthansa_Logo_2018.svg',
  'QATAR': 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Qatar_Airways_logo.svg'
};

/**
 * Returns the logo URL for a given airline name
 */
export const getAirlineLogo = (airlineName: string): string | null => {
  const normalized = airlineName.toUpperCase().trim();
  // Try exact match or partial match
  for (const key in airlineLogos) {
    if (normalized.includes(key)) {
      return airlineLogos[key];
    }
  }
  return null;
};
