import { DESTINATIONS, COLLECTION_IMAGES } from './destinationImages';

export interface ExploreCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  destinationIds: string[];
  tag: string;
  gradient: string;
}

export const EXPLORE_COLLECTIONS: ExploreCollection[] = [
  {
    id: 'praias-paradisiacas',
    title: 'Praias Paradisíacas',
    subtitle: 'As praias mais sonhadoras do planeta',
    image: COLLECTION_IMAGES['praias-paradisiacas'],
    destinationIds: [
      'maldivas', 'bora-bora', 'fernando-noronha', 'tulum', 'phuket',
      'zanzibar', 'cancun', 'santorini', 'mykonos', 'bali',
      'jericoacoara', 'florianopolis', 'miami', 'rio', 'gold-coast',
      'fiji', 'bahamas', 'ilhas-gregas', 'seychelles', 'koh-samui'
    ],
    tag: 'PRAIAS',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
  },
  {
    id: 'baratos-2026',
    title: 'Destinos Baratos pra 2026',
    subtitle: 'Viaje muito gastando pouco',
    image: COLLECTION_IMAGES['baratos-2026'],
    destinationIds: [
      'buenos-aires', 'montevideu', 'lisboa', 'budapeste', 'praga',
      'hanoi', 'bangkok', 'chiang-mai', 'ho-chi-minh', 'marrakech',
      'cidade-mexico', 'cartagena', 'istanbul', 'sofia', 'belgrado',
      'krakow'
    ],
    tag: 'ECONÔMICO',
    gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
  },
  {
    id: 'patrimonios-brasil',
    title: 'Patrimônios Históricos do Brasil',
    subtitle: 'Nossa história em cada pedra',
    image: COLLECTION_IMAGES['patrimonios-brasil'],
    destinationIds: [
      'ouro-preto', 'salvador', 'rio', 'olinda', 'paraty',
      'sao-luis', 'diamantina', 'tiradentes', 'congonhas', 'goias-velho',
      'petropolis', 'mariana'
    ],
    tag: 'BRASIL',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  },
  {
    id: 'nordeste-autentico',
    title: 'Vibe Autêntica do Nordeste',
    subtitle: 'Sol, axé e cultura pulsante',
    image: COLLECTION_IMAGES['nordeste-autentico'],
    destinationIds: [
      'salvador', 'jericoacoara', 'fernando-noronha', 'chapada-diamantina',
      'porto-de-galinhas', 'maragogi', 'morro-sao-paulo', 'pipa',
      'lencois-maranhenses', 'olinda', 'recife', 'natal',
      'fortaleza', 'cumbuco'
    ],
    tag: 'NORDESTE',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
  },
  {
    id: 'montanhas-epicas',
    title: 'Montanhas Épicas',
    subtitle: 'Picos, neve e paisagens de tirar o fôlego',
    image: COLLECTION_IMAGES['montanhas-epicas'],
    destinationIds: [
      'interlaken', 'zurique', 'bariloche', 'queenstown', 'patagonia',
      'banff', 'aspen', 'chamonix', 'cusco', 'machu-picchu', 'campos-do-jordao'
    ],
    tag: 'MONTANHAS',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
  },
  {
    id: 'europa-classica',
    title: 'Europa Clássica Essencial',
    subtitle: 'As cidades que todo viajante precisa conhecer',
    image: COLLECTION_IMAGES['europa-classica'],
    destinationIds: [
      'paris', 'roma', 'londres', 'barcelona', 'amsterdam',
      'veneza', 'praga', 'viena', 'budapeste', 'berlim',
      'lisboa', 'madrid', 'florenca', 'dublin', 'edimburgo'
    ],
    tag: 'EUROPA',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  },
  {
    id: 'asia-exotica',
    title: 'Ásia Exótica',
    subtitle: 'Mergulhe em culturas milenares',
    image: COLLECTION_IMAGES['asia-exotica'],
    destinationIds: [
      'toquio', 'kyoto', 'bangkok', 'bali', 'seul',
      'hanoi', 'singapura', 'hongkong', 'osaka', 'chiang-mai',
      'phuket', 'kuala-lumpur', 'xangai', 'taipei', 'jaipur'
    ],
    tag: 'ÁSIA',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
  },
  {
    id: 'aventura-extrema',
    title: 'Aventura Extrema',
    subtitle: 'Para quem busca adrenalina pura',
    image: COLLECTION_IMAGES['aventura-extrema'],
    destinationIds: [
      'patagonia', 'queenstown', 'reykjavik', 'cappadocia', 'cape-town',
      'interlaken', 'chapada-diamantina', 'alaska', 'everest-nepal',
      'moab-utah', 'norway-fjords', 'costa-rica'
    ],
    tag: 'AVENTURA',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },
  {
    id: 'lua-de-mel',
    title: 'Lua de Mel dos Sonhos',
    subtitle: 'Destinos românticos inesquecíveis',
    image: COLLECTION_IMAGES['lua-de-mel'],
    destinationIds: [
      'maldivas', 'bora-bora', 'santorini', 'veneza', 'bali',
      'paris', 'seychelles', 'mauricio', 'kyoto', 'cappadocia',
      'fiji', 'positano'
    ],
    tag: 'ROMANCE',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
  },
  {
    id: 'cidades-gastronomicas',
    title: 'Cidades Gastronômicas',
    subtitle: 'Para os amantes de boa comida',
    image: COLLECTION_IMAGES['cidades-gastronomicas'],
    destinationIds: [
      'toquio', 'bangkok', 'roma', 'barcelona', 'lisboa',
      'ho-chi-minh', 'cidade-mexico', 'paris', 'sao-paulo',
      'istanbul', 'hanoi', 'osaka'
    ],
    tag: 'GASTRONOMIA',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
  },
  {
    id: 'natureza-selvagem',
    title: 'Natureza Selvagem',
    subtitle: 'Safaris, florestas e vida selvagem',
    image: COLLECTION_IMAGES['natureza-selvagem'],
    destinationIds: [
      'serengeti', 'amazonia', 'galapagos', 'costa-rica', 'borneo',
      'yellowstone', 'kruger', 'pantanal', 'madagascar', 'alaska',
      'iguacu', 'okavango'
    ],
    tag: 'NATUREZA',
    gradient: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)',
  },
  {
    id: 'ilhas-paraisos',
    title: 'Ilhas Paraíso',
    subtitle: 'Escapadas em pedaços de paraíso',
    image: COLLECTION_IMAGES['ilhas-paraisos'],
    destinationIds: [
      'maldivas', 'bora-bora', 'fiji', 'seychelles', 'mauricio',
      'santorini', 'mykonos', 'bali', 'fernando-noronha', 'capri',
      'phuket', 'ibiza'
    ],
    tag: 'ILHAS',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
  },
];
