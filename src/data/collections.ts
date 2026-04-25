export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  curator: string;
  filters: {
    continent?: string;
    category?: string;
    country?: string;
    custom?: string[]; // IDs específicos
  };
  destinationCount: number;
  gradient: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'praias-paradisiacas',
    title: '7 Praias Paradisíacas do Brasil',
    subtitle: 'Areia branca e água cristalina',
    coverImage: 'https://images.unsplash.com/photo-1583933292423-a0db1a11ad4a?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { country: 'Brasil', category: 'beach' },
    destinationCount: 7,
    gradient: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
  },
  {
    id: 'capitais-instagram',
    title: 'Capitais Mais Instagramáveis',
    subtitle: 'Para lotar o seu feed de beleza',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { category: 'city' },
    destinationCount: 6,
    gradient: 'linear-gradient(135deg, #EC4899, #A855F7)',
  },
  {
    id: 'natureza-folego',
    title: 'Natureza de Tirar o Fôlego',
    subtitle: 'Cachoeiras, montanhas e vistas épicas',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { category: 'nature' },
    destinationCount: 7,
    gradient: 'linear-gradient(135deg, #10B981, #22D3EE)',
  },
  {
    id: 'destinos-baratos-2026',
    title: 'Destinos Baratos para 2026',
    subtitle: 'Viagens inesquecíveis sem gastar muito',
    coverImage: 'https://images.unsplash.com/photo-1533165850316-2c71ee16dcd9?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { custom: ['br-jericoacoara', 'br-chapada-diamantina', 'br-bonito', 'co-cartagena', 'th-bangkok', 'ma-marrakech', 'pe-machu-picchu', 'mx-cancun'] },
    destinationCount: 8,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
  },
  {
    id: 'romance-internacional',
    title: 'Romance Internacional',
    subtitle: 'Destinos perfeitos para apaixonados',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { category: 'romance' },
    destinationCount: 5,
    gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)',
  },
  {
    id: 'aventuras-radicais',
    title: 'Aventuras Radicais',
    subtitle: 'Para quem busca adrenalina pura',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { category: 'adventure' },
    destinationCount: 6,
    gradient: 'linear-gradient(135deg, #DC2626, #F97316)',
  },
  {
    id: 'tesouros-culturais-asia',
    title: 'Tesouros Culturais da Ásia',
    subtitle: 'Tradição, templos e modernidade',
    coverImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { continent: 'asia', category: 'culture' },
    destinationCount: 4,
    gradient: 'linear-gradient(135deg, #7C3AED, #EC4899)',
  },
  {
    id: 'cidades-vibrantes',
    title: 'Cidades Vibrantes do Amanhã',
    subtitle: 'Tecnologia, luzes e arranha-céus',
    coverImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { custom: ['jp-tokyo', 'us-newyork', 'th-bangkok', 'uk-london', 'eu-paris'] },
    destinationCount: 5,
    gradient: 'linear-gradient(135deg, #6366F1, #22D3EE)',
  },
  {
    id: 'patrimonios-brasil',
    title: 'Patrimônios Históricos do Brasil',
    subtitle: 'Um mergulho no ouro e na história',
    coverImage: 'https://images.unsplash.com/photo-1544989164-31d93e1ff942?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { custom: ['br-rio', 'br-chapada-diamantina', 'br-gramado', 'br-noronha'] },
    destinationCount: 4,
    gradient: 'linear-gradient(135deg, #CA8A04, #DC2626)',
  },
  {
    id: 'expedicoes-amazonicas',
    title: 'Expedições Amazônicas',
    subtitle: 'Rios gigantes e selva virgem',
    coverImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { custom: ['br-lencois', 'br-bonito', 'br-chapada-diamantina'] },
    destinationCount: 3,
    gradient: 'linear-gradient(135deg, #16A34A, #15803D)',
  },
  {
    id: 'vibes-nordeste',
    title: 'Vibes Autênticas do Nordeste',
    subtitle: 'Cangaço, forró e hospitalidade',
    coverImage: 'https://images.unsplash.com/photo-1591981813204-24e9d4f9b63a?w=1200&q=85',
    curator: 'Equipe Right Way',
    filters: { custom: ['br-noronha', 'br-jericoacoara', 'br-lencois'] },
    destinationCount: 3,
    gradient: 'linear-gradient(135deg, #F97316, #EAB308)',
  },
];

// Helper: filtrar destinos baseado nos filtros da coleção
import { ALL_DESTINATIONS } from './destinations';

export function getCollectionDestinations(collectionId: string) {
  const collection = COLLECTIONS.find(c => c.id === collectionId);
  if (!collection) return [];
  
  const { filters } = collection;
  
  // Prioridade 1: IDs customizados
  if (filters.custom && filters.custom.length > 0) {
    return filters.custom
      .map(id => ALL_DESTINATIONS.find(d => d.id === id))
      .filter(Boolean);
  }
  
  // Prioridade 2: Filtros combinados
  let result = [...ALL_DESTINATIONS];
  
  if (filters.country) {
    result = result.filter(d => d.country === filters.country);
  }
  
  if (filters.continent) {
    result = result.filter(d => d.continent === filters.continent);
  }
  
  if (filters.category) {
    result = result.filter(d => (d.tags || []).includes(filters.category as any));
  }
  
  return result;
}
