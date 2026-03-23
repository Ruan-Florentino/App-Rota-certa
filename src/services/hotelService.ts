import axios from 'axios';

const RAPIDAPI_HOST = 'hotels4.p.rapidapi.com';

export interface HotelOffer {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  stars: number;
  image: string;
  location: string;
  amenities?: string[];
  link?: string;
}

export const searchHotels = async (
  destinationId: string,
  checkInDate: string,
  checkOutDate: string
): Promise<HotelOffer[]> => {
  try {
    const response = await axios.get('/api/hotels', {
      params: { city: destinationId, checkIn: checkInDate, checkOut: checkOutDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
};
