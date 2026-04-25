import { describe, it, expect } from 'vitest';
import { 
  tripSchema, 
  userProfileSchema, 
  onboardingSchema 
} from '../index';

describe('tripSchema', () => {
  it('aceita dados válidos', () => {
    const result = tripSchema.safeParse({
      title: 'Minha Viagem',
      destination: 'Paris',
      startDate: '2025-06-01',
      endDate: '2025-06-10',
      budget: 5000,
    });
    expect(result.success).toBe(true);
  });

  it('rejeita destino vazio', () => {
    const result = tripSchema.safeParse({
      title: 'Minha Viagem',
      destination: '',
      startDate: '2025-06-01',
      endDate: '2025-06-10',
    });
    expect(result.success).toBe(false);
  });

  it('rejeita orçamento negativo', () => {
    const result = tripSchema.safeParse({
      title: 'Minha Viagem',
      destination: 'Paris',
      startDate: '2025-06-01',
      endDate: '2025-06-10',
      budget: -100,
    });
    expect(result.success).toBe(false);
  });
});

describe('userProfileSchema', () => {
  it('aceita perfil completo válido', () => {
    const result = userProfileSchema.safeParse({
      displayName: 'Ruan',
      email: 'ruan@test.com',
      bio: 'Viajante',
      travelStyle: 'adventure',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita email inválido', () => {
    const result = userProfileSchema.safeParse({
      displayName: 'Ruan',
      email: 'email-invalido',
    });
    expect(result.success).toBe(false);
  });

  it('rejeita displayName muito curto', () => {
    const result = userProfileSchema.safeParse({
      displayName: 'R',
      email: 'ruan@test.com',
    });
    expect(result.success).toBe(false);
  });
});

describe('onboardingSchema', () => {
  it('aceita onboarding completo', () => {
    const result = onboardingSchema.safeParse({
      travelStyle: 'luxury',
      preferredDestinations: ['beach', 'city'],
      frequency: 'monthly',
      budget: 'high',
    });
    expect(result.success).toBe(true);
  });

  it('exige pelo menos 1 destino preferido', () => {
    const result = onboardingSchema.safeParse({
      travelStyle: 'luxury',
      preferredDestinations: [],
      frequency: 'monthly',
      budget: 'high',
    });
    expect(result.success).toBe(false);
  });
});
