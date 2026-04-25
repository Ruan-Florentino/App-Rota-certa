// src/data/destinationImages.ts

export interface DestinationImages {
  id: string;
  name: string;
  country: string;
  continent: string;
  cover: string;
  thumbnail: string;
  gallery: string[];
  coords: { lat: number; lng: number };
  tags: string[];
}

const u = (photoId: string, w = 800, h = 600) => 
  `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

export const DESTINATIONS: DestinationImages[] = [
  // ═══ AMÉRICAS ═══
  {
    id: 'miami',
    name: 'Miami',
    country: 'Estados Unidos',
    continent: 'América do Norte',
    cover: u('photo-1589083130544-0d6a2926e519', 1200, 800),
    thumbnail: u('photo-1589083130544-0d6a2926e519', 400, 300),
    gallery: [
      u('photo-1535498730771-e735b998cd64'),
      u('photo-1514214246283-d427a95c5d2f'),
    ],
    coords: { lat: 25.7617, lng: -80.1918 },
    tags: ['praia', 'cidade', 'noturna'],
  },
  {
    id: 'cancun',
    name: 'Cancún',
    country: 'México',
    continent: 'América do Norte',
    cover: u('photo-1552074284-5e88ef1aef18', 1200, 800),
    thumbnail: u('photo-1552074284-5e88ef1aef18', 400, 300),
    gallery: [
      u('photo-1510097467424-192d713fd8b2'),
      u('photo-1518638150340-f706e86654de'),
    ],
    coords: { lat: 21.1619, lng: -86.8515 },
    tags: ['praia', 'caribenho', 'resort'],
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    country: 'Brasil',
    continent: 'América do Sul',
    cover: u('photo-1483729558449-99ef09a8c325', 1200, 800),
    thumbnail: u('photo-1483729558449-99ef09a8c325', 400, 300),
    gallery: [
      u('photo-1516306580123-e6e52b1b7b5f'),
      u('photo-1544989164-22be8f62a8b5'),
    ],
    coords: { lat: -22.9068, lng: -43.1729 },
    tags: ['praia', 'cultural', 'natureza'],
  },
  {
    id: 'new-york',
    name: 'Nova York',
    country: 'Estados Unidos',
    continent: 'América do Norte',
    cover: u('photo-1496442226666-8d4d0e62e6e9', 1200, 800),
    thumbnail: u('photo-1496442226666-8d4d0e62e6e9', 400, 300),
    gallery: [
      u('photo-1534430480872-3498386e7856'),
      u('photo-1555109307-f7d9da25c244'),
    ],
    coords: { lat: 40.7128, lng: -74.0060 },
    tags: ['cidade', 'cultural', 'shopping'],
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    country: 'Peru',
    continent: 'América do Sul',
    cover: u('photo-1587595431973-160d0d94add1', 1200, 800),
    thumbnail: u('photo-1587595431973-160d0d94add1', 400, 300),
    gallery: [
      u('photo-1526392060635-9d6019884377'),
      u('photo-1580619305218-8423a7ef79b4'),
    ],
    coords: { lat: -13.1631, lng: -72.5450 },
    tags: ['história', 'natureza', 'aventura'],
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    continent: 'América do Sul',
    cover: u('photo-1589909202802-8f4aadce1849', 1200, 800),
    thumbnail: u('photo-1589909202802-8f4aadce1849', 400, 300),
    gallery: [u('photo-1612294037637-ec4fe4a7f0f7')],
    coords: { lat: -34.6037, lng: -58.3816 },
    tags: ['cultural', 'tango', 'gastronomia'],
  },

  // ═══ EUROPA ═══
  {
    id: 'lisboa',
    name: 'Lisboa',
    country: 'Portugal',
    continent: 'Europa',
    cover: u('photo-1555881400-74d7acaacd8b', 1200, 800),
    thumbnail: u('photo-1555881400-74d7acaacd8b', 400, 300),
    gallery: [
      u('photo-1513735492246-483525079686'),
      u('photo-1588535005958-ec1a15ba74ce'),
    ],
    coords: { lat: 38.7223, lng: -9.1393 },
    tags: ['cultural', 'histórico', 'gastronomia'],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'França',
    continent: 'Europa',
    cover: u('photo-1502602898657-3e91760cbb34', 1200, 800),
    thumbnail: u('photo-1502602898657-3e91760cbb34', 400, 300),
    gallery: [
      u('photo-1549144511-f099e773c147'),
      u('photo-1431274172761-fca41d930114'),
    ],
    coords: { lat: 48.8566, lng: 2.3522 },
    tags: ['romântico', 'cultural', 'gastronomia'],
  },
  {
    id: 'roma',
    name: 'Roma',
    country: 'Itália',
    continent: 'Europa',
    cover: u('photo-1552832230-c0197dd311b5', 1200, 800),
    thumbnail: u('photo-1552832230-c0197dd311b5', 400, 300),
    gallery: [
      u('photo-1529260830199-42c24126f198'),
      u('photo-1515542622106-78bda8ba0e5b'),
    ],
    coords: { lat: 41.9028, lng: 12.4964 },
    tags: ['histórico', 'cultural', 'gastronomia'],
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Espanha',
    continent: 'Europa',
    cover: u('photo-1583422409516-2895a77efded', 1200, 800),
    thumbnail: u('photo-1583422409516-2895a77efded', 400, 300),
    gallery: [
      u('photo-1523531294919-4bcd7c65e216'),
      u('photo-1539037116277-4db20889f2d4'),
    ],
    coords: { lat: 41.3851, lng: 2.1734 },
    tags: ['praia', 'cultural', 'arquitetura'],
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Grécia',
    continent: 'Europa',
    cover: u('photo-1570077188670-e3a8d69ac5ff', 1200, 800),
    thumbnail: u('photo-1570077188670-e3a8d69ac5ff', 400, 300),
    gallery: [
      u('photo-1613395877344-13d4a8e0d49e'),
      u('photo-1601581875309-fafbf2d3ed3a'),
    ],
    coords: { lat: 36.3932, lng: 25.4615 },
    tags: ['praia', 'romântico', 'ilha'],
  },
  {
    id: 'londres',
    name: 'Londres',
    country: 'Reino Unido',
    continent: 'Europa',
    cover: u('photo-1513635269975-59663e0ac1ad', 1200, 800),
    thumbnail: u('photo-1513635269975-59663e0ac1ad', 400, 300),
    gallery: [
      u('photo-1520986606214-8b456906c813'),
      u('photo-1529655683826-aba9b3e77383'),
    ],
    coords: { lat: 51.5074, lng: -0.1278 },
    tags: ['cultural', 'histórico', 'cidade'],
  },
  {
    id: 'amsterda',
    name: 'Amsterdã',
    country: 'Holanda',
    continent: 'Europa',
    cover: u('photo-1534351590666-13e3e96c5017', 1200, 800),
    thumbnail: u('photo-1534351590666-13e3e96c5017', 400, 300),
    gallery: [u('photo-1576924542622-772579a8ee2a')],
    coords: { lat: 52.3676, lng: 4.9041 },
    tags: ['cultural', 'canais', 'ciclismo'],
  },
  {
    id: 'veneza',
    name: 'Veneza',
    country: 'Itália',
    continent: 'Europa',
    cover: u('photo-1514890547357-a9ee288728e0', 1200, 800),
    thumbnail: u('photo-1514890547357-a9ee288728e0', 400, 300),
    gallery: [u('photo-1523906834658-6e24ef2386f9')],
    coords: { lat: 45.4408, lng: 12.3155 },
    tags: ['romântico', 'histórico', 'canais'],
  },
  {
    id: 'islandia',
    name: 'Islândia',
    country: 'Islândia',
    continent: 'Europa',
    cover: u('photo-1504893524553-b855bce32c67', 1200, 800),
    thumbnail: u('photo-1504893524553-b855bce32c67', 400, 300),
    gallery: [u('photo-1531168556467-80aace0d0144')],
    coords: { lat: 64.9631, lng: -19.0208 },
    tags: ['natureza', 'aventura', 'aurora'],
  },

  // ═══ ÁSIA ═══
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japão',
    continent: 'Ásia',
    cover: u('photo-1493976040374-85c8e12f0c0e', 1200, 800),
    thumbnail: u('photo-1493976040374-85c8e12f0c0e', 400, 300),
    gallery: [
      u('photo-1528360983277-13d401cdc186'),
      u('photo-1545569341-9eb8b30979d9'),
    ],
    coords: { lat: 35.0116, lng: 135.7681 },
    tags: ['cultural', 'histórico', 'templos'],
  },
  {
    id: 'toquio',
    name: 'Tóquio',
    country: 'Japão',
    continent: 'Ásia',
    cover: u('photo-1540959733332-eab4deabeeaf', 1200, 800),
    thumbnail: u('photo-1540959733332-eab4deabeeaf', 400, 300),
    gallery: [
      u('photo-1513407030348-c983a97b98d8'),
      u('photo-1536098561742-ca998e48cbcc'),
    ],
    coords: { lat: 35.6762, lng: 139.6503 },
    tags: ['cidade', 'tecnologia', 'gastronomia'],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonésia',
    continent: 'Ásia',
    cover: u('photo-1537953773345-d172ccf13cf1', 1200, 800),
    thumbnail: u('photo-1537953773345-d172ccf13cf1', 400, 300),
    gallery: [
      u('photo-1518548419970-58e3b4079ab2'),
      u('photo-1555400038-63f5ba517a47'),
    ],
    coords: { lat: -8.3405, lng: 115.0920 },
    tags: ['praia', 'espiritual', 'natureza'],
  },
  {
    id: 'tailandia',
    name: 'Tailândia',
    country: 'Tailândia',
    continent: 'Ásia',
    cover: u('photo-1552465011-b4e21bf6e79a', 1200, 800),
    thumbnail: u('photo-1552465011-b4e21bf6e79a', 400, 300),
    gallery: [u('photo-1528181304800-259b08848526')],
    coords: { lat: 15.8700, lng: 100.9925 },
    tags: ['praia', 'cultural', 'tropical'],
  },
  {
    id: 'maldivas',
    name: 'Maldivas',
    country: 'Maldivas',
    continent: 'Ásia',
    cover: u('photo-1514282401047-d79a71a590e8', 1200, 800),
    thumbnail: u('photo-1514282401047-d79a71a590e8', 400, 300),
    gallery: [u('photo-1586500036706-41963de24d8b')],
    coords: { lat: 3.2028, lng: 73.2207 },
    tags: ['praia', 'paraíso', 'mergulho'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'Emirados Árabes',
    continent: 'Ásia',
    cover: u('photo-1512453979798-5ea266f8880c', 1200, 800),
    thumbnail: u('photo-1512453979798-5ea266f8880c', 400, 300),
    gallery: [u('photo-1518684079-3c830dcef090')],
    coords: { lat: 25.2048, lng: 55.2708 },
    tags: ['luxo', 'cidade', 'deserto'],
  },

  // ═══ OCEANIA ═══
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Austrália',
    continent: 'Oceania',
    cover: u('photo-1506973035872-a4ec16b8e8d9', 1200, 800),
    thumbnail: u('photo-1506973035872-a4ec16b8e8d9', 400, 300),
    gallery: [u('photo-1523428096881-5bd79d043006')],
    coords: { lat: -33.8688, lng: 151.2093 },
    tags: ['praia', 'cidade', 'cultural'],
  },

  // ═══ ÁFRICA ═══
  {
    id: 'marrakesh',
    name: 'Marrakesh',
    country: 'Marrocos',
    continent: 'África',
    cover: u('photo-1489749798305-4fea3ae63d43', 1200, 800),
    thumbnail: u('photo-1489749798305-4fea3ae63d43', 400, 300),
    gallery: [u('photo-1553603227-2358aabe821e')],
    coords: { lat: 31.6295, lng: -7.9811 },
    tags: ['cultural', 'exótico', 'mercado'],
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'África do Sul',
    continent: 'África',
    cover: u('photo-1580060839134-75a5edca2e99', 1200, 800),
    thumbnail: u('photo-1580060839134-75a5edca2e99', 400, 300),
    gallery: [u('photo-1484318571209-661cf29a69c3')],
    coords: { lat: -33.9249, lng: 18.4241 },
    tags: ['natureza', 'praia', 'aventura'],
  },
];

export const FALLBACK_IMAGE = u('photo-1488646953014-85cb44e25828', 1200, 800);
export const FALLBACK_IMAGE_URL = FALLBACK_IMAGE;

export function getDestinationById(id: string): DestinationImages | undefined {
  return DESTINATIONS.find(d => d.id === id.toLowerCase().trim());
}

export function getDestinationByName(name: string): DestinationImages | undefined {
  const normalized = name.toLowerCase().trim();
  return DESTINATIONS.find(d => 
    d.name.toLowerCase() === normalized ||
    d.id === normalized ||
    normalized.includes(d.name.toLowerCase()) ||
    d.name.toLowerCase().includes(normalized)
  );
}

export function getDestinationImage(nameOrId: string): string {
  const dest = getDestinationByName(nameOrId) || getDestinationById(nameOrId);
  return dest?.cover || FALLBACK_IMAGE;
}

export function getRandomDestination(): DestinationImages {
  return DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
}

export function searchDestinations(query: string): DestinationImages[] {
  const q = query.toLowerCase().trim();
  if (!q) return DESTINATIONS;
  return DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.country.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q))
  );
}

// Aliases for compatibility
export const DESTINATION_IMAGES: Record<string, string> = DESTINATIONS.reduce((acc, d) => ({
  ...acc,
  [d.id]: d.cover,
  [d.name.toLowerCase()]: d.cover
}), {});

export const COLLECTION_IMAGES: Record<string, string> = {
  'praias-paradisiacas': u('photo-1507525428034-b723cf961d3e', 800, 1000),
  'baratos-2026': u('photo-1533240332313-0dbf2f13f173', 800, 1000),
  'patrimonios-brasil': u('photo-1549144511-f099e773c147', 800, 1000),
  'nordeste-autentico': u('photo-1485081669829-bacb8c7bb1f3', 800, 1000),
  'montanhas-epicas': u('photo-1464822759023-fed622ff2c3b', 800, 1000),
  'europa-classica': u('photo-1502602898657-3e91760cbb34', 800, 1000),
  'asia-exotica': u('photo-1540959733332-eab4deabeeaf', 800, 1000),
  'aventura-extrema': u('photo-1533240332313-0dbf2f13f173', 800, 1000),
  'lua-de-mel': u('photo-1522708323590-d24dbb6b0267', 800, 1000),
  'cidades-gastronomicas': u('photo-1551183053-bf91a1d81141', 800, 1000),
  'natureza-selvagem': u('photo-1469474968028-56623f02e42e', 800, 1000),
  'ilhas-paraisos': u('photo-1440778303588-435521a205bc', 800, 1000)
};

export const MYSTERY_IMAGES = [
  u('photo-1533240332313-0dbf2f13f173', 800, 600),
  u('photo-1469474968028-56623f02e42e', 800, 600)
];
