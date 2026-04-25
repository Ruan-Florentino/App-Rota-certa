import { z } from 'zod';

export const onboardingSchema = z.object({
  travelStyle: z.string().min(1),
  preferredDestinations: z.array(z.string()).min(1, 'Selecione pelo menos um destino'),
  frequency: z.string().min(1),
  budget: z.string().min(1),
});
