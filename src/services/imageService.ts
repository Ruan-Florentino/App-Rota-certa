import axios from "axios";
import { getDestinationImage as getFromCatalog } from "../data/destinationImages";

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Cache in memory to avoid repeated API calls
const imageCache: Record<string, string> = {};
const imagesCache: Record<string, string[]> = {};

/**
 * Helper function to fetch photos using Wikimedia Commons API
 */
const fetchWikimediaImage = async (query: string): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`
    );
    const pages = response.data?.query?.pages;
    if (pages) {
      const firstPage = Object.values(pages)[0] as any;
      if (firstPage?.imageinfo?.[0]?.url) {
        return firstPage.imageinfo[0].url;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching from Wikimedia:", error);
    return null;
  }
};

/**
 * Helper function to fetch photos using Google Places API (Text Search)
 */
const fetchPlacesPhotos = async (query: string, maxResultCount: number = 5): Promise<string[]> => {
  if (!API_KEY) {
    console.warn("VITE_GOOGLE_PLACES_API_KEY is not set. Trying Wikimedia...");
    const wiki = await fetchWikimediaImage(query);
    return wiki ? [wiki] : [];
  }

  try {
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: query,
        languageCode: 'pt-BR'
      },
      {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.photos',
          'Content-Type': 'application/json'
        }
      }
    );

    const places = response.data.places;
    if (!places || places.length === 0) return [];

    const photos: string[] = [];
    for (const place of places) {
      if (place.photos) {
        for (const photo of place.photos) {
          if (photos.length >= maxResultCount) break;
          const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=1080&maxWidthPx=1920&key=${API_KEY}`;
          photos.push(photoUrl);
        }
      }
      if (photos.length >= maxResultCount) break;
    }

    return photos;
  } catch (error) {
    console.error("Error fetching from Google Places API:", error);
    return [];
  }
};

/**
 * Global function to get multiple city images correctly from real sources
 */
export const getCityImages = async (
  city: string,
  country: string = ""
): Promise<string[]> => {
  // 1. Tenta o catálogo local primeiro (MUITO mais rápido e confiável para mock)
  const catalogImg = getFromCatalog(city);
  if (catalogImg && !catalogImg.includes('placeholder')) {
    return [catalogImg];
  }

  const query = `${city} ${country} city tourism`.trim();
  const cacheKey = `city:${query}`;

  if (imagesCache[cacheKey]) {
    return imagesCache[cacheKey];
  }

  let photos = await fetchPlacesPhotos(query, 5);
  
  if (photos.length === 0) {
    const fallbackQuery = `main landmark in ${city} ${country}`;
    photos = await fetchPlacesPhotos(fallbackQuery, 5);
  }

  if (photos.length === 0) {
    const wikiImage = await fetchWikimediaImage(`${city} ${country} landmark`);
    if (wikiImage) photos = [wikiImage];
  }

  // Se tudo falhar, devolve um array vazio em vez de generic
  if (photos.length > 0) {
    imagesCache[cacheKey] = photos;
  }
  
  return photos;
};

/**
 * Compatibility wrapper for getLocationImages
 */
export const getLocationImages = async (
  name: string,
  country: string = "",
  count: number = 5
): Promise<string[]> => {
  const images = await getCityImages(name, country);
  return images.slice(0, count);
};

/**
 * Fetches a high-quality image for a city/hotel/place or specific place.
 */
export const getDynamicImage = async (
  query: string,
  type: "city" | "hotel" | "place" = "city",
  city?: string,
  country?: string,
): Promise<string> => {
  if (type === 'city') {
    const images = await getCityImages(query, country || '');
    return images[0] || '';
  } else if (type === 'hotel') {
    return getHotelImage(query, city);
  } else {
    return getPlaceImage(query, city);
  }
};

/**
 * Convenience function for hotel images
 */
export const getHotelImage = async (hotelName: string, city: string = ""): Promise<string> => {
  const query = `${hotelName} hotel in ${city}`.trim();
  const cacheKey = `hotel:${query}`;

  if (imageCache[cacheKey]) return imageCache[cacheKey];

  let photos = await fetchPlacesPhotos(query, 1);
  
  if (photos.length === 0) {
    const wikiImage = await fetchWikimediaImage(`${hotelName} hotel`);
    if (wikiImage) photos = [wikiImage];
  }

  const url = photos[0] || '';
  if (url) imageCache[cacheKey] = url;
  return url;
};

/**
 * Convenience function for place/activity images
 */
export const getPlaceImage = async (placeName: string, city: string = ""): Promise<string> => {
  const query = `${placeName} in ${city}`.trim();
  const cacheKey = `place:${query}`;

  if (imageCache[cacheKey]) return imageCache[cacheKey];

  let photos = await fetchPlacesPhotos(query, 1);
  
  if (photos.length === 0) {
    const wikiImage = await fetchWikimediaImage(`${placeName} ${city}`);
    if (wikiImage) photos = [wikiImage];
  }

  const url = photos[0] || '';
  if (url) imageCache[cacheKey] = url;
  return url;
};

/**
 * Mapping of airline names to their official logo URLs
 */
const airlineLogos: Record<string, string> = {
  LATAM: "https://upload.wikimedia.org/wikipedia/commons/7/7b/LATAM_Airlines_logo.svg",
  GOL: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Gol_Transportes_A%C3%A9reos_logo.svg",
  AZUL: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Azul_Brazilian_Airlines_logo.svg",
  AMERICAN: "https://upload.wikimedia.org/wikipedia/commons/5/5c/American_Airlines_logo_2013.svg",
  DELTA: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Delta_Air_Lines_Logo.svg",
  UNITED: "https://upload.wikimedia.org/wikipedia/commons/6/6b/United_Airlines_Logo.svg",
  EMIRATES: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
  TAP: "https://upload.wikimedia.org/wikipedia/commons/2/2e/TAP_Air_Portugal_logo.svg",
  LUFTHANSA: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lufthansa_Logo_2018.svg",
  QATAR: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Qatar_Airways_logo.svg",
  "AIR FRANCE": "https://upload.wikimedia.org/wikipedia/commons/4/44/Air_France_Logo.svg",
};

/**
 * Returns the logo URL for a given airline name
 */
export const getAirlineLogo = (airlineName: string): string | null => {
  const normalized = airlineName.toUpperCase().trim();
  for (const key in airlineLogos) {
    if (normalized.includes(key)) {
      return airlineLogos[key];
    }
  }
  return null;
};

export const getDestinationImage = async (destination: string): Promise<string> => {
   const images = await getCityImages(destination);
   return images[0] || '';
};

export const geocodePlace = async (query: string): Promise<{lat: number, lng: number} | null> => {
  if (!API_KEY) return null;
  try {
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: query,
        languageCode: 'pt-BR'
      },
      {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.location',
          'Content-Type': 'application/json'
        }
      }
    );
    
    const places = response.data.places;
    if (places && places.length > 0 && places[0].location) {
      return {
        lat: places[0].location.latitude,
        lng: places[0].location.longitude
      };
    }
  } catch (error) {
    console.error(`Error geocoding ${query}:`, error);
  }
  return null;
};
