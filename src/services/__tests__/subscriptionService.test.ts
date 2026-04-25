import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  checkSubscriptionStatus,
  canAccessFeature,
  PLAN_LIMITS,
} from '../subscriptionService';

describe('subscriptionService', () => {
  describe('canAccessFeature', () => {
    it('free pode acessar features básicas', () => {
      expect(canAccessFeature('free', 'basic_trips')).toBe(true);
      expect(canAccessFeature('free', 'community_feed')).toBe(true);
    });

    it('free NÃO pode acessar AI Planner ilimitado', () => {
      expect(canAccessFeature('free', 'ai_planner_unlimited')).toBe(false);
    });

    it('pro pode acessar TODAS as features', () => {
      expect(canAccessFeature('pro', 'ai_planner_unlimited')).toBe(true);
      expect(canAccessFeature('pro', 'premium_themes')).toBe(true);
      expect(canAccessFeature('pro', 'export_pdf')).toBe(true);
    });
  });

  describe('PLAN_LIMITS', () => {
    it('free tem limite de 3 viagens', () => {
      expect(PLAN_LIMITS.free.maxTrips).toBe(3);
    });

    it('pro tem viagens ilimitadas', () => {
      expect(PLAN_LIMITS.pro.maxTrips).toBe(Infinity);
    });

    it('free tem 5 queries/dia no AI', () => {
      expect(PLAN_LIMITS.free.aiQueriesPerDay).toBe(5);
    });
  });

  describe('checkSubscriptionStatus', () => {
    it('retorna expired se data venceu', async () => {
      const status = await checkSubscriptionStatus({
        plan: 'pro',
        expiresAt: new Date('2020-01-01').toISOString(),
      });
      expect(status).toBe('expired');
    });

    it('retorna active se dentro do prazo', async () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      
      const status = await checkSubscriptionStatus({
        plan: 'pro',
        expiresAt: future.toISOString(),
      });
      expect(status).toBe('active');
    });
  });
});
