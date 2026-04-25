import axios from 'axios';
import { Trip } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const searchOffers = async (
  type: 'flights' | 'hotels',
  destination: string,
  dates: { start: string; end: string }
): Promise<any> => {
  const response = await api.get('/search-offers', {
    params: { type, destination, start: dates.start, end: dates.end },
  });
  return response.data;
};

export const startCheckout = async (planId: string): Promise<{ url: string }> => {
  const response = await api.post('/start-checkout', { planId });
  return response.data;
};
