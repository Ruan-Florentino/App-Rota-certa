import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  app.get('/api/generate-mockup', async (req, res) => {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const fs = await import("fs");
      const path = await import("path");
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: 'Ultra-premium, cinematic 4K mobile app screenshot of "RotaCerta" destination detail screen on iPhone 16 Pro Max portrait, elegant dark mode with deep navy background (#0A1128), vibrant neon cyan accents (#00F5FF), subtle glassmorphism overlays (frosted blur cards), soft neumorphic shadows for depth. Full-bleed immersive hero image at top 55% of screen: hyper-realistic nighttime Santiago Chile skyline with dramatic Andes mountains snow-capped under starry sky and illuminated city, professional National Geographic quality, cinematic lighting. Overlay on hero: elegant semi-transparent glass card at bottom of image with: Large bold white title "Santiago, Chile" in modern sans-serif, Subtle tag pills glowing cyan: "América" "Neve" "Cultura", Big prominent price pill neon cyan: "A partir de R$ 2.200", Duration badge: "4 dias" with calendar icon, Weather/live info: "Agora 8°C · Neve leve" with animated snowflake icon, Rating: "4.8 ★ (1.2k avaliações)" gold stars. Floating buttons on hero: "Explorar em Realidade Aumentada" (large, glowing cyan, AR glasses icon) and "Planejar Viagem com IA" (primary button gradient cyan to teal). Below hero: scrollable content with glassmorphic sections: First section: "Por que visitar agora" short emotional text block with 4 small photorealistic horizontal scroll cards (Andes ski, Street art Bellavista, Winery, Costanera Center) each with estimated price and time. Mid-screen: interactive mini 3D map widget (Apple Maps flyover style dark theme) showing Santiago with glowing cyan pins for attractions, rotate/zoom implied, "Abrir mapa completo" button. Below map: Auto AI Itinerary (Timeline Day 1 / Day 2 / Day 3 / Day 4 expandable), each day with photo, activities, estimated cost, time, and a "Personalizar com IA" button opening a direct chat. Bottom fixed quick actions (above nav): Save, Share, "Ver todos os voos + hotéis". Bottom navigation: modern minimalist icons (Home, Explorar, Mapa active, Reservas, Perfil) with neon cyan glow only on active. Overall UI: zero clutter, large touch targets, smooth animations implied, ultra-clean, high-contrast readable typography, micro-animations, premium Figma/Apple polish, dimensional depth with layers. Sharp bezels, natural screen reflection, professional product mockup style. Make Santiago photo breathtakingly accurate and epic.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
            imageSize: "4K"
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const outPath = path.join(process.cwd(), 'public', 'mockup.png');
          fs.writeFileSync(outPath, Buffer.from(base64EncodeString, 'base64'));
          return res.json({ success: true, path: '/mockup.png' });
        }
      }
      res.status(500).json({ error: 'No image data' });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // 1. CITIES (Global Search)
  app.get('/api/cities', async (req, res) => {
    const { search } = req.query;
    if (!search || (search as string).length < 2) return res.json([]);
    
    try {
      // Using Photon (OSM) for global city search
      // Added User-Agent and removed type=city which might cause 400
      const response = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(search as string)}&limit=10`, {
        headers: {
          'User-Agent': 'RotaCerta/1.0'
        }
      });
      const cities = response.data.features.map((f: any) => ({
        name: f.properties.name,
        state: f.properties.state || f.properties.county || '',
        country: f.properties.country,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        population: f.properties.population || 0
      }));
      res.json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  });

  // 2. FLIGHTS (Amadeus Proxy)
  app.get('/api/flights', async (req, res) => {
    const { origin, destination, date } = req.query;
    // Implementation logic from flightService.ts moved here for security
    // For now, returning mock to ensure it works without keys, but ready for Amadeus
    res.json([
      { airline: 'LATAM', price: 1250, duration: '3h 45m', stops: 0, departureTime: '08:30', arrivalTime: '12:15', link: 'https://www.latamairlines.com' },
      { airline: 'GOL', price: 980, duration: '4h 10m', stops: 1, departureTime: '10:15', arrivalTime: '14:25', link: 'https://www.voegol.com.br' },
      { airline: 'AZUL', price: 1100, duration: '3h 50m', stops: 0, departureTime: '07:00', arrivalTime: '10:50', link: 'https://www.voeazul.com.br' }
    ]);
  });

  // 3. HOTELS (RapidAPI Proxy)
  app.get('/api/hotels', async (req, res) => {
    const { city } = req.query;
    res.json([
      { name: 'Grand Hyatt Premium', price: 850, rating: 4.8, stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', location: 'Centro', link: 'https://www.booking.com' },
      { name: 'Ibis Budget Central', price: 280, rating: 4.2, stars: 3, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', location: 'Centro', link: 'https://www.airbnb.com' }
    ]);
  });

  // 4. PLACES (OpenTripMap Proxy)
  app.get('/api/places', async (req, res) => {
    const { lat, lng } = req.query;
    // Proxy to OpenTripMap
    res.json([
      { name: 'Torre Eiffel', lat: 48.8584, lng: 2.2945, category: 'Turismo', rating: 5 },
      { name: 'Museu do Louvre', lat: 48.8606, lng: 2.3376, category: 'Turismo', rating: 5 }
    ]);
  });

  // 5. WEATHER (OpenWeather Proxy)
  app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    res.json({ temp: 22, condition: 'Ensolarado', icon: '01d' });
  });

  // 6. CURRENCY (ExchangeRate Proxy)
  app.get('/api/currency', async (req, res) => {
    res.json({ USD: 5.10, EUR: 5.50, BRL: 1.00 });
  });

  // 7. SUGGESTIONS
  const ALL_DESTINATIONS = [
    {
      id: 'buenos-aires',
      name: 'Buenos Aires',
      country: 'Argentina',
      avgPrice: 1800,
      recommendedDays: 3,
      category: ['Internacional', 'Barato', 'Romântico'],
      description: 'O charme europeu na América Latina com o melhor do tango e da gastronomia.',
      lat: -34.6037,
      lng: -58.3816,
      airport: 'EZE'
    },
    {
      id: 'santiago',
      name: 'Santiago',
      country: 'Chile',
      avgPrice: 2100,
      recommendedDays: 4,
      category: ['Internacional', 'Barato'],
      description: 'A capital chilena rodeada pela Cordilheira dos Andes.',
      lat: -33.4489,
      lng: -70.6693,
      airport: 'SCL'
    },
    {
      id: 'rio-de-janeiro',
      name: 'Rio de Janeiro',
      country: 'Brasil',
      avgPrice: 1200,
      recommendedDays: 4,
      category: ['Brasil', 'Praia', 'Barato'],
      description: 'Belezas naturais estonteantes e uma energia que só o Rio tem.',
      lat: -22.9068,
      lng: -43.1729,
      airport: 'GIG'
    },
    {
      id: 'sao-paulo',
      name: 'São Paulo',
      country: 'Brasil',
      avgPrice: 1500,
      recommendedDays: 3,
      category: ['Brasil', 'Negócios', 'Gastronomia'],
      description: 'A maior metrópole do Brasil, centro de cultura e gastronomia.',
      lat: -23.5505,
      lng: -46.6333,
      airport: 'GRU'
    },
    {
      id: 'florianopolis',
      name: 'Florianópolis',
      country: 'Brasil',
      avgPrice: 1800,
      recommendedDays: 5,
      category: ['Brasil', 'Praia', 'Aventura'],
      description: 'A Ilha da Magia com praias paradisíacas e vida noturna agitada.',
      lat: -27.5954,
      lng: -48.5480,
      airport: 'FLN'
    },
    {
      id: 'gramado',
      name: 'Gramado',
      country: 'Brasil',
      avgPrice: 2500,
      recommendedDays: 4,
      category: ['Brasil', 'Romântico', 'Luxo'],
      description: 'O charme europeu na Serra Gaúcha.',
      lat: -29.3746,
      lng: -50.8764,
      airport: 'CXJ'
    },
    {
      id: 'bariloche',
      name: 'Bariloche',
      country: 'Argentina',
      avgPrice: 3500,
      recommendedDays: 5,
      category: ['Internacional', 'Neve', 'Aventura'],
      description: 'O destino preferido para quem ama neve e chocolate na Argentina.',
      lat: -41.1335,
      lng: -71.3103,
      airport: 'BRC'
    },
    {
      id: 'montevideu',
      name: 'Montevidéu',
      country: 'Uruguai',
      avgPrice: 2200,
      recommendedDays: 3,
      category: ['Internacional', 'Barato', 'Tranquilo'],
      description: 'Uma capital charmosa e tranquila às margens do Rio da Prata.',
      lat: -34.9011,
      lng: -56.1645,
      airport: 'MVD'
    },
    {
      id: 'lima',
      name: 'Lima',
      country: 'Peru',
      avgPrice: 2800,
      recommendedDays: 3,
      category: ['Internacional', 'Gastronomia'],
      description: 'A capital gastronômica da América Latina.',
      lat: -12.0464,
      lng: -77.0428,
      airport: 'LIM'
    },
    {
      id: 'cusco',
      name: 'Cusco',
      country: 'Peru',
      avgPrice: 3200,
      recommendedDays: 4,
      category: ['Internacional', 'História', 'Aventura'],
      description: 'O umbigo do mundo e porta de entrada para Machu Picchu.',
      lat: -13.5319,
      lng: -71.9675,
      airport: 'CUZ'
    },
    {
      id: 'machu-picchu',
      name: 'Machu Picchu',
      country: 'Peru',
      avgPrice: 4500,
      recommendedDays: 2,
      category: ['Internacional', 'História', 'Aventura'],
      description: 'A cidade perdida dos Incas.',
      lat: -13.1631,
      lng: -72.5450,
      airport: 'CUZ'
    },
    {
      id: 'bogota',
      name: 'Bogotá',
      country: 'Colômbia',
      avgPrice: 2400,
      recommendedDays: 3,
      category: ['Internacional', 'Cultura'],
      description: 'Uma metrópole vibrante nas alturas dos Andes.',
      lat: 4.7110,
      lng: -74.0721,
      airport: 'BOG'
    },
    {
      id: 'cartagena',
      name: 'Cartagena',
      country: 'Colômbia',
      avgPrice: 3200,
      recommendedDays: 4,
      category: ['Internacional', 'Praia', 'História'],
      description: 'O charme colonial banhado pelo Mar do Caribe.',
      lat: 10.3910,
      lng: -75.4794,
      airport: 'CTG'
    },
    {
      id: 'cancun',
      name: 'Cancún',
      country: 'México',
      avgPrice: 4800,
      recommendedDays: 6,
      category: ['Internacional', 'Praia', 'Luxo'],
      description: 'Águas cristalinas e vida noturna lendária.',
      lat: 21.1619,
      lng: -86.8515,
      airport: 'CUN'
    },
    {
      id: 'mexico-city',
      name: 'Cidade do México',
      country: 'México',
      avgPrice: 3500,
      recommendedDays: 5,
      category: ['Internacional', 'Cultura', 'Gastronomia'],
      description: 'Uma das maiores e mais históricas cidades do mundo.',
      lat: 19.4326,
      lng: -99.1332,
      airport: 'MEX'
    },
    {
      id: 'miami',
      name: 'Miami',
      country: 'EUA',
      avgPrice: 5200,
      recommendedDays: 5,
      category: ['Internacional', 'Praia', 'Compras'],
      description: 'Onde o sol, as compras e a cultura latina se encontram.',
      lat: 25.7617,
      lng: -80.1918,
      airport: 'MIA'
    },
    {
      id: 'orlando',
      name: 'Orlando',
      country: 'EUA',
      avgPrice: 6500,
      recommendedDays: 7,
      category: ['Internacional', 'Parques', 'Família'],
      description: 'A capital mundial da diversão e dos parques temáticos.',
      lat: 28.5383,
      lng: -81.3792,
      airport: 'MCO'
    },
    {
      id: 'new-york',
      name: 'New York',
      country: 'EUA',
      avgPrice: 7500,
      recommendedDays: 6,
      category: ['Internacional', 'Cultura', 'Luxo'],
      description: 'A cidade que nunca dorme.',
      lat: 40.7128,
      lng: -74.0060,
      airport: 'JFK'
    },
    {
      id: 'los-angeles',
      name: 'Los Angeles',
      country: 'EUA',
      avgPrice: 6800,
      recommendedDays: 6,
      category: ['Internacional', 'Cultura', 'Praia'],
      description: 'O coração da indústria do entretenimento.',
      lat: 34.0522,
      lng: -118.2437,
      airport: 'LAX'
    },
    {
      id: 'las-vegas',
      name: 'Las Vegas',
      country: 'EUA',
      avgPrice: 5800,
      recommendedDays: 4,
      category: ['Internacional', 'Diversão', 'Luxo'],
      description: 'A capital mundial do entretenimento e dos cassinos.',
      lat: 36.1699,
      lng: -115.1398,
      airport: 'LAS'
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'França',
      avgPrice: 8500,
      recommendedDays: 5,
      category: ['Internacional', 'Europa', 'Romântico'],
      description: 'A cidade luz e do amor.',
      lat: 48.8566,
      lng: 2.3522,
      airport: 'CDG'
    },
    {
      id: 'roma',
      name: 'Roma',
      country: 'Itália',
      avgPrice: 7200,
      recommendedDays: 5,
      category: ['Internacional', 'Europa', 'História'],
      description: 'A cidade eterna com história em cada esquina.',
      lat: 41.9028,
      lng: 12.4964,
      airport: 'FCO'
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      country: 'Espanha',
      avgPrice: 6500,
      recommendedDays: 4,
      category: ['Internacional', 'Europa', 'Praia'],
      description: 'Arquitetura única de Gaudí e vida vibrante.',
      lat: 41.3851,
      lng: 2.1734,
      airport: 'BCN'
    },
    {
      id: 'madrid',
      name: 'Madrid',
      country: 'Espanha',
      avgPrice: 6200,
      recommendedDays: 4,
      category: ['Internacional', 'Europa', 'Cultura'],
      description: 'O coração da Espanha com museus incríveis.',
      lat: 40.4168,
      lng: -3.7038,
      airport: 'MAD'
    },
    {
      id: 'lisboa',
      name: 'Lisboa',
      country: 'Portugal',
      avgPrice: 5500,
      recommendedDays: 4,
      category: ['Internacional', 'Europa', 'Barato'],
      description: 'Sete colinas de história e fado.',
      lat: 38.7223,
      lng: -9.1393,
      airport: 'LIS'
    },
    {
      id: 'londres',
      name: 'Londres',
      country: 'Reino Unido',
      avgPrice: 8800,
      recommendedDays: 5,
      category: ['Internacional', 'Europa', 'Cultura'],
      description: 'A vibrante capital britânica.',
      lat: 51.5074,
      lng: -0.1278,
      airport: 'LHR'
    },
    {
      id: 'amsterdam',
      name: 'Amsterdam',
      country: 'Holanda',
      avgPrice: 7800,
      recommendedDays: 4,
      category: ['Internacional', 'Europa', 'Cultura'],
      description: 'Canais, bicicletas e muita liberdade.',
      lat: 52.3676,
      lng: 4.9041,
      airport: 'AMS'
    },
    {
      id: 'dubai',
      name: 'Dubai',
      country: 'Emirados Árabes',
      avgPrice: 9500,
      recommendedDays: 5,
      category: ['Internacional', 'Luxo', 'Futuro'],
      description: 'Onde o luxo e a arquitetura desafiam o deserto.',
      lat: 25.2048,
      lng: 55.2708,
      airport: 'DXB'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japão',
      avgPrice: 11000,
      recommendedDays: 7,
      category: ['Internacional', 'Cultura', 'Luxo'],
      description: 'A metrópole do futuro com alma milenar.',
      lat: 35.6762,
      lng: 139.6503,
      airport: 'HND'
    },
    {
      id: 'bangkok',
      name: 'Bangkok',
      country: 'Tailândia',
      avgPrice: 5200,
      recommendedDays: 5,
      category: ['Internacional', 'Cultura', 'Barato'],
      description: 'Templos dourados e comida de rua inesquecível.',
      lat: 13.7563,
      lng: 100.5018,
      airport: 'BKK'
    },
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonésia',
      avgPrice: 6500,
      recommendedDays: 7,
      category: ['Internacional', 'Praia', 'Espiritualidade'],
      description: 'A ilha dos deuses.',
      lat: -8.3405,
      lng: 115.0920,
      airport: 'DPS'
    },
    {
      id: 'sydney',
      name: 'Sydney',
      country: 'Austrália',
      avgPrice: 12000,
      recommendedDays: 6,
      category: ['Internacional', 'Praia', 'Cultura'],
      description: 'Belezas naturais e a icônica Opera House.',
      lat: -33.8688,
      lng: 151.2093,
      airport: 'SYD'
    },
    {
      id: 'cape-town',
      name: 'Cape Town',
      country: 'África do Sul',
      avgPrice: 7500,
      recommendedDays: 5,
      category: ['Internacional', 'Natureza', 'Aventura'],
      description: 'Onde a montanha encontra o mar no extremo da África.',
      lat: -33.9249,
      lng: 18.4241,
      airport: 'CPT'
    }
  ];

  app.get('/api/cities', (req, res) => {
    const search = (req.query.search as string || '').toLowerCase();
    const filtered = ALL_DESTINATIONS
      .filter(s => s.name.toLowerCase().includes(search) || s.country.toLowerCase().includes(search))
      .map(s => ({
        name: s.name,
        country: s.country,
        lat: s.lat,
        lng: s.lng,
        state: s.country
      }))
      .slice(0, 10);
    res.json(filtered);
  });

  app.get('/api/suggestions', (req, res) => {
    res.json(ALL_DESTINATIONS);
  });

  app.get('/api/destination/:id', (req, res) => {
    const dest = ALL_DESTINATIONS.find(d => d.id === req.params.id);
    if (!dest) return res.status(404).json({ error: 'Destination not found' });

    // Generate detailed data for the destination
    const detailedData = {
      ...dest,
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 5000) + 500,
      activities: [
        { name: `Ponto Turístico 1 em ${dest.name}`, image: '', description: 'Atração imperdível com vista panorâmica.', category: 'turismo' },
        { name: `Restaurante Famoso em ${dest.name}`, image: '', description: 'O melhor da culinária local.', category: 'restaurante' },
        { name: `Museu Histórico de ${dest.name}`, image: '', description: 'Mergulhe na história e cultura da região.', category: 'turismo' }
      ],
      flights: [
        { airline: 'LATAM', price: Math.floor(dest.avgPrice * 0.4), times: '08:30 - 12:45', link: 'https://www.latamairlines.com' },
        { airline: 'GOL', price: Math.floor(dest.avgPrice * 0.35), times: '14:15 - 18:30', link: 'https://www.voegol.com.br' },
        { airline: 'AZUL', price: Math.floor(dest.avgPrice * 0.38), times: '10:00 - 14:15', link: 'https://www.voeazul.com.br' }
      ],
      hotels: [
        { name: `${dest.name} Grand Hotel`, price: Math.floor(dest.avgPrice * 0.15), rating: 4.8, image: '', link: 'https://www.booking.com' },
        { name: `${dest.name} Central Hostel`, price: Math.floor(dest.avgPrice * 0.05), rating: 4.2, image: '', link: 'https://www.airbnb.com' }
      ],
      costs: {
        flights: Math.floor(dest.avgPrice * 0.4),
        hotel: Math.floor(dest.avgPrice * 0.3),
        food: Math.floor(dest.avgPrice * 0.2),
        total: dest.avgPrice
      }
    };

    res.json(detailedData);
  });

  app.get('/api/hotels', (req, res) => {
    const city = req.query.city as string || 'Paris';
    const hotels = [
      { id: '1', name: `${city} Luxury Palace`, price: 850, rating: 4.9, location: 'Centro Histórico', link: 'https://www.booking.com', image: '' },
      { id: '2', name: `${city} Modern Suites`, price: 450, rating: 4.7, location: 'Bairro Nobre', link: 'https://www.hotels.com', image: '' },
      { id: '3', name: `${city} Budget Inn`, price: 150, rating: 4.2, location: 'Próximo ao Metrô', link: 'https://www.hostelworld.com', image: '' },
      { id: '4', name: `${city} Boutique Hotel`, price: 600, rating: 4.8, location: 'Vista Mar', link: 'https://www.airbnb.com', image: '' },
      { id: '5', name: `${city} Garden Resort`, price: 720, rating: 4.6, location: 'Zona Rural', link: 'https://www.expedia.com', image: '' }
    ];
    res.json(hotels);
  });

  // 8. ITINERARY (Legacy - Gemini moved to frontend)
  app.post('/api/itinerary', async (req, res) => {
    res.status(410).json({ error: 'Use frontend geminiService instead' });
  });

  // 9. GOOGLE PLACES IMAGE PROXY
  app.get('/api/place-image', async (req, res) => {
    const { query, type, city, country } = req.query;
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    // Fallback URL generator
    const getFallbackUrl = (q: string) => `https://images.unsplash.com/photo-1500000000000?q=${encodeURIComponent(q)}&w=800&h=600`;

    if (!apiKey) {
      console.warn('VITE_GOOGLE_PLACES_API_KEY is missing, falling back to Unsplash');
      return res.json({ url: getFallbackUrl(query as string) });
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
        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${apiKey}`;
        return res.json({ url: imageUrl });
      }

      return res.json({ url: getFallbackUrl(query as string) });
    } catch (error) {
      console.error('Error fetching place image:', error);
      return res.json({ url: getFallbackUrl(query as string) });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RotaCerta Server running on http://localhost:${PORT}`);
  });
}

startServer();
