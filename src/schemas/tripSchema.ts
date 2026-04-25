import { z } from 'zod';

export const tripSchema = z.object({
  title: z.string().min(3, 'Título precisa ter 3+ caracteres').max(100),
  destination: z.string().min(1, 'Destino é obrigatório'),
  destinationDetails: z.object({
    name: z.string().min(1),
    country: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  travelers: z.number().min(1).max(50).default(1),
  budget: z.number().min(0).optional(),
  categories: z.array(z.string()).optional(),
  description: z.string().max(1000).optional(),
  type: z.string().optional(),
  isPublic: z.boolean().default(false),
  economyMode: z.boolean().default(false),
});

export type TripInput = z.infer<typeof tripSchema>;
