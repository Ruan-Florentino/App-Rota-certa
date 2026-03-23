import axios from 'axios';
import { getPlaceImage } from './imageService';

const API_KEY = process.env.OPENTRIPMAP_API_KEY;
const BASE_URL = 'https://api.opentripmap.com/0.1/en/places';

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  rating: number;
  image?: string;
  description?: string;
}

export const getPlacesNearby = async (lat: number, lng: number, radius: number = 5000): Promise<Place[]> => {
  if (!API_KEY) {
    // Mock data if no API key
    const mockPlaces = [
      { id: '1', name: 'Torre Eiffel', lat: 48.8584, lng: 2.2945, category: 'Turismo', rating: 5 },
      { id: '2', name: 'Museu do Louvre', lat: 48.8606, lng: 2.3376, category: 'Turismo', rating: 5 },
      { id: '3', name: 'Catedral de Notre-Dame', lat: 48.8530, lng: 2.3499, category: 'Turismo', rating: 4.8 },
    ];

    // Fetch images for mock places
    const placesWithImages = await Promise.all(
      mockPlaces.map(async (place) => ({
        ...place,
        image: await getPlaceImage(place.name)
      }))
    );

    return placesWithImages;
  }

  try {
    const response = await axios.get(`${BASE_URL}/radius`, {
      params: {
        radius,
        lon: lng,
        lat,
        format: 'json',
        limit: 10, // Reduced limit for faster image fetching
        apikey: API_KEY
      }
    });

    const places = response.data.map((place: any) => ({
      id: place.xid,
      name: place.name,
      lat: place.point.lat,
      lng: place.point.lon,
      category: place.kinds.split(',')[0].replace('_', ' '),
      rating: place.rate || 3
    })).filter((p: any) => p.name); // Only return places with names

    // Fetch images for each place
    const placesWithImages = await Promise.all(
      places.map(async (place: any) => {
        try {
          // Attempt to get specific details first (which might have an image)
          const details = await getPlaceDetails(place.id);
          return {
            ...place,
            image: details.image || await getPlaceImage(place.name),
            description: details.description
          };
        } catch (e) {
          return {
            ...place,
            image: await getPlaceImage(place.name)
          };
        }
      })
    );

    return placesWithImages;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const getPlaceDetails = async (xid: string): Promise<Partial<Place>> => {
  if (!API_KEY) return {};

  try {
    const response = await axios.get(`${BASE_URL}/xid/${xid}`, {
      params: { apikey: API_KEY }
    });
    
    return {
      description: response.data.info?.descr || response.data.wikipedia_extracts?.text,
      image: response.data.preview?.source || response.data.image,
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return {};
  }
};
