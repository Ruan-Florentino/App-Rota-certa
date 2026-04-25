import { describe, it, expect } from 'vitest';
import { 
  createSubscriptionSchema,
  claimReferralSchema,
  createAlertSchema
} from '../schemas/index';

describe('Server Schemas', () => {
  describe('createSubscriptionSchema', () => {
    it('aceita payload válido', () => {
      const valid = {
        userId: 'user123',
        email: 'test@example.com',
      };
      expect(() => createSubscriptionSchema.parse(valid)).not.toThrow();
    });
    
    it('rejeita email inválido', () => {
      const invalid = { userId: 'user123', email: 'invalid-email' };
      expect(() => createSubscriptionSchema.parse(invalid)).toThrow();
    });
    
    it('rejeita sem userId', () => {
      const invalid = { email: 'test@example.com' };
      expect(() => createSubscriptionSchema.parse(invalid)).toThrow();
    });
  });

  describe('claimReferralSchema', () => {
    it('aceita payload válido', () => {
      const valid = {
        code: 'REF123',
        userId: 'user123'
      };
      expect(() => claimReferralSchema.parse(valid)).not.toThrow();
    });
    
    it('rejeita sem code', () => {
      const invalid = { userId: 'user123' };
      expect(() => claimReferralSchema.parse(invalid)).toThrow();
    });
    
    it('rejeita code vazio', () => {
      const invalid = { code: '', userId: 'user123' };
      expect(() => claimReferralSchema.parse(invalid)).toThrow();
    });
  });

  describe('createAlertSchema', () => {
    it('aceita payload válido', () => {
      const valid = {
        userId: 'user123',
        origin: 'GRU',
        destination: 'JFK',
        targetPrice: 500
      };
      expect(() => createAlertSchema.parse(valid)).not.toThrow();
    });
    
    it('rejeita origin curto (<3 chars)', () => {
      const invalid = {
        userId: 'user123',
        origin: 'GR',
        destination: 'JFK',
        targetPrice: 500
      };
      expect(() => createAlertSchema.parse(invalid)).toThrow();
    });
    
    it('rejeita preco negativo', () => {
      const invalid = {
        userId: 'user123',
        origin: 'GRU',
        destination: 'JFK',
        targetPrice: -10
      };
      expect(() => createAlertSchema.parse(invalid)).toThrow();
    });
  });
});
