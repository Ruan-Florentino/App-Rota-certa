import { getDestinationByName } from '../data/destinationImages';

export interface AiRecommendation {
  id: string;
  destination: string;
  country: string;
  image: string;
  matchPercentage: number;
  reasons: string[];
  estimatedPrice: number;
  bestMonth: string;
  tags: string[];
}

export function getPersonalizedRecommendations(user: any): AiRecommendation[] {
  // Use recommendations based on user preferences or default ones
  const recommendations = [
    {
      id: '1',
      destination: 'Lisboa',
      country: 'Portugal',
      matchPercentage: 96,
      reasons: ['Combina com seu perfil cultural', 'Excelente custo-benefício'],
      estimatedPrice: 6500,
      bestMonth: 'Abril',
      tags: ['cultural', 'gastronomia']
    },
    {
      id: '2',
      destination: 'Kyoto',
      country: 'Japão',
      matchPercentage: 92,
      reasons: ['Tranquilidade e templos inspiradores', 'Estação das cerejeiras'],
      estimatedPrice: 12000,
      bestMonth: 'Março',
      tags: ['cultural', 'templos']
    },
    {
      id: '3',
      destination: 'Cancún',
      country: 'México',
      matchPercentage: 89,
      reasons: ['Praias cristalinas e sol todo ano', 'Vida noturna agitada'],
      estimatedPrice: 8500,
      bestMonth: 'Dezembro',
      tags: ['praia', 'resort']
    },
    {
      id: '4',
      destination: 'Paris',
      country: 'França',
      matchPercentage: 87,
      reasons: ['Capital mundial da gastronomia', 'Arquitetura icônica'],
      estimatedPrice: 9500,
      bestMonth: 'Junho',
      tags: ['romântico', 'cultural']
    }
  ];

  return recommendations.map(rec => ({
    ...rec,
    image: getDestinationByName(rec.destination)?.cover || ''
  }));
}
