import axios from 'axios';

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1';
const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

const getAccessToken = async () => {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const response = await axios.post(AMADEUS_AUTH_URL, params);
  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  return accessToken;
};

export interface FlightOffer {
  airline: string;
  price: number;
  currency: string;
  duration: string;
  stops: number;
  departureTime: string;
  arrivalTime: string;
  logo?: string;
  link?: string;
}

export const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string
): Promise<FlightOffer[]> => {
  try {
    const response = await axios.get('/api/flights', {
      params: { origin, destination, date: departureDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
};
