import axios from 'axios';

const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export interface CurrencyRates {
  [key: string]: number;
}

export const getCurrencyRates = async (base: string = 'USD'): Promise<CurrencyRates> => {
  try {
    const response = await axios.get(`${BASE_URL}/${base}`);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    // Fallback rates if API fails
    return {
      'BRL': 5.42,
      'EUR': 0.92,
      'GBP': 0.78,
      'USD': 1.00
    };
  }
};

export const convertCurrency = (amount: number, from: string, to: string, rates: CurrencyRates): number => {
  if (from === to) return amount;
  const inBase = amount / (rates[from] || 1);
  return inBase * (rates[to] || 1);
};
