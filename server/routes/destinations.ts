import { Request, Response } from 'express';
import { ALL_DESTINATIONS } from '../data/destinations';

export const getCities = (req: Request, res: Response) => {
  const search = (req.query.search as string || '').toLowerCase();
  const filtered = ALL_DESTINATIONS
    .filter((s: any) => s.name.toLowerCase().includes(search) || s.country.toLowerCase().includes(search))
    .map((s: any) => ({
      name: s.name,
      country: s.country,
      lat: s.lat,
      lng: s.lng,
      state: s.country
    }))
    .slice(0, 10);
  res.json(filtered);
};

export const getSuggestions = (req: Request, res: Response) => {
  res.json(ALL_DESTINATIONS);
};

export const getDestinationById = (req: Request, res: Response) => {
  const dest = ALL_DESTINATIONS.find((d: any) => d.id === req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });

  // Generate detailed data for the destination
  const detailedData = {
    ...dest,
    rating: 4.5 + Math.random() * 0.5,
    reviews: Math.floor(Math.random() * 5000) + 500,
    activities: [
      { name: `Ponto Turístico 1 em ${dest.name}`, image: '', description: 'Atração imperdível com vista panorâmica.', category: 'turismo' },
      { name: `Restaurante Famoso em ${dest.name}`, image: '', description: 'O melhor da culinária local.', category: 'restaurante' },
      { name: `Museu Histórico de ${dest.name}`, image: '', description: 'Mergulhe na história e cultura da região.', category: 'turismo' }
    ],
    flights: [
      { airline: 'LATAM', price: Math.floor(dest.avgPrice * 0.4), times: '08:30 - 12:45', link: 'https://www.latamairlines.com' },
      { airline: 'GOL', price: Math.floor(dest.avgPrice * 0.35), times: '14:15 - 18:30', link: 'https://www.voegol.com.br' },
      { airline: 'AZUL', price: Math.floor(dest.avgPrice * 0.38), times: '10:00 - 14:15', link: 'https://www.voeazul.com.br' }
    ],
    hotels: [
      { name: `${dest.name} Grand Hotel`, price: Math.floor(dest.avgPrice * 0.15), rating: 4.8, image: '', link: 'https://www.booking.com' },
      { name: `${dest.name} Central Hostel`, price: Math.floor(dest.avgPrice * 0.05), rating: 4.2, image: '', link: 'https://www.airbnb.com' }
    ],
    costs: {
      flights: Math.floor(dest.avgPrice * 0.4),
      hotel: Math.floor(dest.avgPrice * 0.3),
      food: Math.floor(dest.avgPrice * 0.2),
      total: dest.avgPrice
    }
  };

  res.json(detailedData);
};
