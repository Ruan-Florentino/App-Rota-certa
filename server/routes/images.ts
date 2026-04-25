import { Request, Response } from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const imageCache = new NodeCache({ stdTTL: 86400 }); // 24h cache

export const getPlaceImage = async (req: Request, res: Response) => {
  const { query, type, city, country } = req.query;
  const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
  
  if (!query) return res.status(400).json({ error: 'query required' });

  const cacheKey = `img:${query}`;
  const cached = imageCache.get<string>(cacheKey);
  if (cached) return res.json({ url: cached });
  
  // Fallback URL generator using Unsplash Source (Redirects)
  const getFallbackUrl = (q: string) => {
    // Unsplash API (grátis, 50 req/hora sem key via source.unsplash.com)
    // Using a more reliable fallback structure that Unsplash allows
    return `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80`;
  };

  if (!apiKey) {
    const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(String(query) + ',travel,city')}`;
    imageCache.set(cacheKey, url);
    return res.json({ url });
  }

  try {
    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query as string)}&key=${apiKey}`;
    let response = await axios.get(searchUrl);
    let results = response.data.results;

    if (!results || results.length === 0 || !results[0].photos || results[0].photos.length === 0) {
      if (type === 'city' && city) {
        const landmarkQuery = `landmark ${city} ${country || ''}`.trim();
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(landmarkQuery)}&key=${apiKey}`;
        response = await axios.get(searchUrl);
        results = response.data.results;
      }
    }

    if (results && results.length > 0 && results[0].photos && results[0].photos.length > 0) {
      const photoRef = results[0].photos[0].photo_reference;
      const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${apiKey}`;
      imageCache.set(cacheKey, imageUrl);
      return res.json({ url: imageUrl });
    }

    const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(String(query) + ',travel,city')}`;
    imageCache.set(cacheKey, url);
    return res.json({ url });
  } catch (error) {
    console.error('Error fetching place image:', error);
    const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(String(query) + ',travel,city')}`;
    imageCache.set(cacheKey, url);
    return res.json({ url });
  }
};

export const getLocationImages = async (req: Request, res: Response) => {
  const { query, count = 5 } = req.query;
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
  const pexelsApiKey = process.env.PEXELS_API_KEY;

  try {
    // Try Unsplash first if key exists
    if (unsplashAccessKey) {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, per_page: count, orientation: 'landscape' },
        headers: { Authorization: `Client-ID ${unsplashAccessKey}` }
      });
      if (response.data.results.length > 0) {
        return res.json({ images: response.data.results.map((r: any) => r.urls.regular) });
      }
    }

    // Try Pexels if Unsplash fails or no key
    if (pexelsApiKey) {
      const response = await axios.get(`https://api.pexels.com/v1/search`, {
        params: { query, per_page: count, orientation: 'landscape' },
        headers: { Authorization: pexelsApiKey }
      });
      if (response.data.photos.length > 0) {
        return res.json({ images: response.data.photos.map((p: any) => p.src.large2x) });
      }
    }

    // Fallback: Use LoremFlickr with different seeds for variety
    const fallbacks = Array.from({ length: Number(count) }).map((_, i) => 
      `https://loremflickr.com/1600/900/${encodeURIComponent((query as string).replace(/\s+/g, ','))}?lock=${i + 100}`
    );
    res.json({ images: fallbacks });

  } catch (error) {
    console.error('Error fetching location images:', error);
    const fallbacks = Array.from({ length: Number(count) }).map((_, i) => 
      `https://loremflickr.com/1600/900/${encodeURIComponent((query as string).replace(/\s+/g, ','))}?lock=${i + 100}`
    );
    res.json({ images: fallbacks });
  }
};
