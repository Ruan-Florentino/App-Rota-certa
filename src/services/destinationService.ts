import { useQuery } from '@tanstack/react-query';
import { ALL_DESTINATIONS, TRENDING_DESTINATIONS, FEATURED_DESTINATIONS } from '../data/destinations';
import { COLLECTIONS } from '../data/collections';
import { Destination, Collection, PriceRange } from '../types/destination';
import Fuse from 'fuse.js';

// Search options for Fuse.js
const fuseOptions = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'country', weight: 1.5 },
    { name: 'state', weight: 1.5 },
    { name: 'tags', weight: 1 },
    { name: 'description', weight: 0.5 },
  ],
  threshold: 0.3,
  includeScore: true,
};

const fuse = new Fuse(ALL_DESTINATIONS, fuseOptions);

export const destinationService = {
  // Simulate network delay for a more realistic feel
  getAll: async (filters?: { category?: string; priceRange?: PriceRange }) => {
    await new Promise(r => setTimeout(r, 600));
    let results = [...ALL_DESTINATIONS];
    
    if (filters?.category && filters.category !== 'all') {
      results = results.filter(d => d.categories.includes(filters.category!));
    }
    
    if (filters?.priceRange) {
      results = results.filter(d => d.priceRange === filters.priceRange);
    }
    
    return results;
  },

  getTrending: async () => {
    await new Promise(r => setTimeout(r, 400));
    return TRENDING_DESTINATIONS;
  },

  getFeatured: async () => {
    await new Promise(r => setTimeout(r, 500));
    return FEATURED_DESTINATIONS;
  },

  getCollections: async () => {
    await new Promise(r => setTimeout(r, 400));
    return COLLECTIONS;
  },

  search: async (query: string) => {
    if (!query) return ALL_DESTINATIONS.slice(0, 10);
    const results = fuse.search(query);
    return results.map(r => r.item);
  },

  getById: async (id: string) => {
    return ALL_DESTINATIONS.find(d => d.id === id);
  }
};

// React Query Hooks
export const useDestinations = (filters?: { category?: string; priceRange?: PriceRange }) => {
  return useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => destinationService.getAll(filters),
  });
};

export const useTrendingDestinations = () => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: () => destinationService.getTrending(),
  });
};

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => destinationService.getCollections(),
  });
};

export const useFeaturedDestinations = () => {
  return useQuery({
    queryKey: ['featured'],
    queryFn: () => destinationService.getFeatured(),
  });
};
