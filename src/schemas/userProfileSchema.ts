import { z } from 'zod';

export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Nome muito curto').max(50),
  email: z.string().email('Email inválido'),
  bio: z.string().max(500).optional(),
  travelStyle: z.string().optional(),
});
