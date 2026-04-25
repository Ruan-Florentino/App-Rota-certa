import axios from 'axios';

// Cache in localStorage to save API calls
const CACHE_KEY = '@way_city_images_cache';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

interface CacheEntry {
  images: string[];
  hero: string;
  timestamp: number;
}

const getCache = (): Record<string, CacheEntry> => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setCache = (key: string, data: CacheEntry) => {
  try {
    const cache = getCache();
    cache[key] = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Could not save cache', e);
  }
};

export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

export const cityImageService = {
  async getCityImages(query: string, count: number = 5): Promise<string[]> {
    const cacheKey = query.toLowerCase().trim();
    const cache = getCache()[cacheKey];

    if (cache && Date.now() - cache.timestamp < CACHE_DURATION && cache.images.length >= count) {
      return cache.images.slice(0, count);
    }

    try {
      // Prioritize Unsplash Source (No API Key Required but deprecated, using Unsplash API or fallback)
      // Since Unsplash Source is deprecated, let's use Wikipedia as a reliable fallback, 
      // or a generic placeholder strategy + Pexels.
      // We will just use standard Unsplash free random endpoint via a safe proxy or fallback.
      
      const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (apiKey) {
        const res = await axios.get(`https://api.unsplash.com/search/photos`, {
          params: { query, per_page: count, orientation: 'landscape' },
          headers: { Authorization: `Client-ID ${apiKey}` }
        });
        
        if (res.data && res.data.results.length > 0) {
          const images = res.data.results.map((img: any) => img.urls.regular);
          setCache(cacheKey, { images, hero: images[0], timestamp: Date.now() });
          return images;
        }
      }

      // Fallback Strategy
      const fallbackImages = Array.from({ length: count }).map((_, i) => 
        `https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&w=1080&q=80&sig=${Math.random()}`
      );
      
      // Let's use Wikipedia API snippet as an alternative
      const wikiRes = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}&origin=*`);
      const pages = wikiRes.data.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pageId !== "-1" && pages[pageId].original) {
        fallbackImages[0] = pages[pageId].original.source;
      }

      setCache(cacheKey, { images: fallbackImages, hero: fallbackImages[0], timestamp: Date.now() });
      return fallbackImages;

    } catch (error) {
      console.warn(`Error fetching images for ${query}`, error);
      // Fallback to placeholder service
      const fallbacks = Array.from({ length: count }).map((_, i) => `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)},city,travel&sig=${i}`);
      return fallbacks;
    }
  },

  async getHeroImage(query: string): Promise<string> {
    const images = await this.getCityImages(query, 1);
    return images[0];
  }
};
