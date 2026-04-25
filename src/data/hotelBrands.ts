export interface HotelChain {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  budgetLevel: 1 | 2 | 3; // 1 = eco, 2 = mid, 3 = luxury
  bookingUrl: (destination: string) => string;
}

export const hotelChains: HotelChain[] = [
  {
    id: 'accor',
    name: 'Accor (Ibis, Mercure, Novotel)',
    description: 'Maior rede europeia, excelente para custo-benefício e negócios.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Accor_logo.svg/512px-Accor_logo.svg.png',
    color: '#002A3A',
    budgetLevel: 2,
    bookingUrl: (dest) => `https://all.accor.com/ssr/app/accor/results?destination=${encodeURIComponent(dest)}`
  },
  {
    id: 'hilton',
    name: 'Hilton Honors',
    description: 'Hotelaria clássica americana com foco em conforto aprimorado.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Hilton_logo.svg/512px-Hilton_logo.svg.png',
    color: '#13294B',
    budgetLevel: 3,
    bookingUrl: (dest) => `https://www.hilton.com/en/search/?query=${encodeURIComponent(dest)}`
  },
  {
    id: 'marriott',
    name: 'Marriott Bonvoy',
    description: 'Maior rede do mundo, opções de luxo a premium.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Marriott_International_logo.svg/512px-Marriott_International_logo.svg.png',
    color: '#E81C2E',
    budgetLevel: 3,
    bookingUrl: (dest) => `https://www.marriott.com/search/findHotels.mi?destinationAddress.destination=${encodeURIComponent(dest)}`
  },
  {
    id: 'ihg',
    name: 'IHG (Holiday Inn, InterContinental)',
    description: 'Opção versátil com grande foco em famílias e viagens rápidas.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/IHG_Hotels_%26_Resorts_logo.svg/512px-IHG_Hotels_%26_Resorts_logo.svg.png',
    color: '#F47321',
    budgetLevel: 2,
    bookingUrl: (dest) => `https://www.ihg.com/hotels/us/en/find-hotels/hotel/list?destination=${encodeURIComponent(dest)}`
  },
  {
    id: 'hyatt',
    name: 'Hyatt',
    description: 'Hospedagem sofisticada com forte viés para bem-estar.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Hyatt_logo.svg/512px-Hyatt_logo.svg.png',
    color: '#001a40',
    budgetLevel: 3,
    bookingUrl: (dest) => `https://www.hyatt.com/search/${encodeURIComponent(dest)}`
  },
  {
    id: 'wyndham',
    name: 'Wyndham',
    description: 'Inúmeras opções econômicas globais e estadias prolongadas.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Wyndham_Hotels_and_Resorts_logo.svg/512px-Wyndham_Hotels_and_Resorts_logo.svg.png',
    color: '#1273C4',
    budgetLevel: 1,
    bookingUrl: (dest) => `https://www.wyndhamhotels.com/locations?query=${encodeURIComponent(dest)}`
  },
  {
    id: 'choice',
    name: 'Choice Hotels',
    description: 'Rede econômica americana popular para roadtrips.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Choice_Hotels_International_Logo.svg/512px-Choice_Hotels_International_Logo.svg.png',
    color: '#F48024',
    budgetLevel: 1,
    bookingUrl: (dest) => `https://www.choicehotels.com/search?q=${encodeURIComponent(dest)}`
  },
  {
    id: 'bestwestern',
    name: 'Best Western',
    description: 'Ótima cobertura focada no mercado europeu e americano intermediário.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Best_Western_logo_2015.svg/512px-Best_Western_logo_2015.svg.png',
    color: '#003a70',
    budgetLevel: 2,
    bookingUrl: (dest) => `https://www.bestwestern.com/en_US/book/hotels-by-city.html?destination=${encodeURIComponent(dest)}`
  }
];

export const suggestHotelChains = (budgetPreference?: 'economic' | 'luxury' | 'mid'): HotelChain[] => {
  if (budgetPreference === 'economic') {
    return hotelChains.filter(c => c.budgetLevel <= 2).sort(() => 0.5 - Math.random()).slice(0, 3);
  }
  if (budgetPreference === 'luxury') {
    return hotelChains.filter(c => c.budgetLevel >= 2).sort((a,b) => b.budgetLevel - a.budgetLevel).slice(0, 3);
  }
  return hotelChains.sort(() => 0.5 - Math.random()).slice(0, 4);
};
