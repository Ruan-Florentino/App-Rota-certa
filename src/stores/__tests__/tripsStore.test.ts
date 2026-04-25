import { describe, it, expect, beforeEach } from 'vitest';
import { useTripsStore } from '../tripsStore';

describe('tripsStore', () => {
  beforeEach(() => {
    useTripsStore.setState({ trips: [] });
  });

  describe('addTrip', () => {
    it('adiciona uma viagem com ID único', () => {
      const { addTrip } = useTripsStore.getState();
      addTrip({
        countryCode: 'FR',
        status: 'visited',
        city: 'Paris',
        year: 2025,
      });
      
      const trips = useTripsStore.getState().trips;
      expect(trips).toHaveLength(1);
      expect(trips[0].id).toBeDefined();
      expect(trips[0].countryCode).toBe('FR');
    });

    it('adiciona país automaticamente se não existir', () => {
      const { addTrip } = useTripsStore.getState();
      addTrip({ countryCode: 'JP', status: 'planned' });
      
      const trips = useTripsStore.getState().trips;
      expect(trips.some(t => t.countryCode === 'JP')).toBe(true);
    });

    it('não duplica país com mesmo status', () => {
      const { addTrip } = useTripsStore.getState();
      addTrip({ countryCode: 'FR', status: 'visited' });
      addTrip({ countryCode: 'FR', status: 'visited' });
      
      const trips = useTripsStore.getState().trips;
      expect(trips.filter(c => c.countryCode === 'FR')).toHaveLength(1);
    });
  });

  describe('removeTrip', () => {
    it('remove viagem pelo ID', () => {
      const { addTrip, removeTrip } = useTripsStore.getState();
      addTrip({ countryCode: 'IT', status: 'planned' });
      const tripId = useTripsStore.getState().trips[0].id;
      
      removeTrip(tripId);
      expect(useTripsStore.getState().trips).toHaveLength(0);
    });
  });

  describe('stats', () => {
    it('calcula estatísticas corretamente', () => {
      const { addTrip, getStats } = useTripsStore.getState();
      addTrip({ countryCode: 'FR', status: 'visited' });
      addTrip({ countryCode: 'IT', status: 'planned' });
      addTrip({ countryCode: 'GB', status: 'visited' });
      
      const stats = getStats();
      expect(stats.visited).toBe(2);
      expect(stats.planned).toBe(1);
      expect(stats.total).toBe(3);
    });
  });
});
