export interface Airline {
  code: string;          // Código IATA (2 letras)
  icao?: string;         // Código ICAO (3 letras)
  name: string;
  country: string;
  logo: string;          // URL do logo oficial
  logoFallback?: string; // URL alternativa
  color: string;         // Cor primária da marca
  website?: string;
}

// Logos via Wikipedia Commons (domínio público) + CDN de aviação
export const AIRLINES: Record<string, Airline> = {
  // ========== BRASIL ==========
  LATAM: {
    code: 'LA',
    icao: 'LAN',
    name: 'LATAM Airlines',
    country: 'Brasil/Chile',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/LATAM_Airlines_logo.svg/512px-LATAM_Airlines_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_LA_200_200_s.png',
    color: '#ED1651',
    website: 'https://www.latamairlines.com',
  },
  GOL: {
    code: 'G3',
    icao: 'GLO',
    name: 'GOL Linhas Aéreas',
    country: 'Brasil',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Logo_GOL_2020.svg/512px-Logo_GOL_2020.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_G3_200_200_s.png',
    color: '#FF6B00',
    website: 'https://www.voegol.com.br',
  },
  AZUL: {
    code: 'AD',
    icao: 'AZU',
    name: 'Azul Linhas Aéreas',
    country: 'Brasil',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Azul_Brazilian_Airlines_logo.svg/512px-Azul_Brazilian_Airlines_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AD_200_200_s.png',
    color: '#0077C8',
    website: 'https://www.voeazul.com.br',
  },
  
  // ========== AMÉRICAS ==========
  AA: {
    code: 'AA',
    icao: 'AAL',
    name: 'American Airlines',
    country: 'EUA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/American_Airlines_logo_2013.svg/512px-American_Airlines_logo_2013.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AA_200_200_s.png',
    color: '#0078D2',
  },
  DELTA: {
    code: 'DL',
    icao: 'DAL',
    name: 'Delta Air Lines',
    country: 'EUA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/512px-Delta_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_DL_200_200_s.png',
    color: '#E01933',
  },
  UNITED: {
    code: 'UA',
    icao: 'UAL',
    name: 'United Airlines',
    country: 'EUA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/United_Airlines_Logo.svg/512px-United_Airlines_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_UA_200_200_s.png',
    color: '#002244',
  },
  COPA: {
    code: 'CM',
    icao: 'CMP',
    name: 'Copa Airlines',
    country: 'Panamá',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Copa_Airlines_logo.svg/512px-Copa_Airlines_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_CM_200_200_s.png',
    color: '#005BAC',
  },
  AEROMEXICO: {
    code: 'AM',
    icao: 'AMX',
    name: 'Aeroméxico',
    country: 'México',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Aerom%C3%A9xico_logo_2023.svg/512px-Aerom%C3%A9xico_logo_2023.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AM_200_200_s.png',
    color: '#0B2343',
  },
  AVIANCA: {
    code: 'AV',
    icao: 'AVA',
    name: 'Avianca',
    country: 'Colômbia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Avianca_Logo.svg/512px-Avianca_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AV_200_200_s.png',
    color: '#D01C1F',
  },
  AIR_CANADA: {
    code: 'AC',
    icao: 'ACA',
    name: 'Air Canada',
    country: 'Canadá',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Air_Canada_Logo.svg/512px-Air_Canada_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AC_200_200_s.png',
    color: '#F01428',
  },
  JETBLUE: {
    code: 'B6',
    icao: 'JBU',
    name: 'JetBlue Airways',
    country: 'EUA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/JetBlue_Airways_Logo.svg/512px-JetBlue_Airways_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_B6_200_200_s.png',
    color: '#003876',
  },
  SOUTHWEST: {
    code: 'WN',
    icao: 'SWA',
    name: 'Southwest Airlines',
    country: 'EUA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Southwest_Airlines_logo_2014.svg/512px-Southwest_Airlines_logo_2014.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_WN_200_200_s.png',
    color: '#304CB2',
  },
  SPIRIT: {
    code: 'NK',
    icao: 'NKS',
    name: 'Spirit Airlines',
    country: 'EUA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Spirit_Airlines_logo.svg/512px-Spirit_Airlines_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_NK_200_200_s.png',
    color: '#FFEC00',
  },
  
  // ========== EUROPA ==========
  LUFTHANSA: {
    code: 'LH',
    icao: 'DLH',
    name: 'Lufthansa',
    country: 'Alemanha',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Lufthansa_Logo_2018.svg/512px-Lufthansa_Logo_2018.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_LH_200_200_s.png',
    color: '#05164D',
  },
  AIR_FRANCE: {
    code: 'AF',
    icao: 'AFR',
    name: 'Air France',
    country: 'França',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/512px-Air_France_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AF_200_200_s.png',
    color: '#002157',
  },
  KLM: {
    code: 'KL',
    icao: 'KLM',
    name: 'KLM Royal Dutch Airlines',
    country: 'Holanda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/KLM_logo.svg/512px-KLM_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_KL_200_200_s.png',
    color: '#00A1DE',
  },
  BRITISH_AIRWAYS: {
    code: 'BA',
    icao: 'BAW',
    name: 'British Airways',
    country: 'Reino Unido',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/British_Airways_Logo.svg/512px-British_Airways_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_BA_200_200_s.png',
    color: '#075AAA',
  },
  IBERIA: {
    code: 'IB',
    icao: 'IBE',
    name: 'Iberia',
    country: 'Espanha',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Iberia_Logo.svg/512px-Iberia_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_IB_200_200_s.png',
    color: '#D7192D',
  },
  TAP: {
    code: 'TP',
    icao: 'TAP',
    name: 'TAP Air Portugal',
    country: 'Portugal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/TAP_Air_Portugal_logo.svg/512px-TAP_Air_Portugal_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_TP_200_200_s.png',
    color: '#00A859',
  },
  ALITALIA: {
    code: 'AZ',
    icao: 'ITY',
    name: 'ITA Airways',
    country: 'Itália',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/ITA_Airways_logo.svg/512px-ITA_Airways_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_AZ_200_200_s.png',
    color: '#002D74',
  },
  SWISS: {
    code: 'LX',
    icao: 'SWR',
    name: 'Swiss International Air Lines',
    country: 'Suíça',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Swiss_International_Air_Lines_Logo_2011.svg/512px-Swiss_International_Air_Lines_Logo_2011.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_LX_200_200_s.png',
    color: '#CB0300',
  },
  RYANAIR: {
    code: 'FR',
    icao: 'RYR',
    name: 'Ryanair',
    country: 'Irlanda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Ryanair_logo.svg/512px-Ryanair_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_FR_200_200_s.png',
    color: '#073590',
  },
  EASYJET: {
    code: 'U2',
    icao: 'EZY',
    name: 'easyJet',
    country: 'Reino Unido',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/EasyJet_logo.svg/512px-EasyJet_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_U2_200_200_s.png',
    color: '#FF6600',
  },
  TURKISH: {
    code: 'TK',
    icao: 'THY',
    name: 'Turkish Airlines',
    country: 'Turquia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Turkish_Airlines_logo_2019_compact.svg/512px-Turkish_Airlines_logo_2019_compact.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_TK_200_200_s.png',
    color: '#C70A0C',
  },
  
  // ========== ORIENTE MÉDIO ==========
  EMIRATES: {
    code: 'EK',
    icao: 'UAE',
    name: 'Emirates',
    country: 'Emirados Árabes',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/512px-Emirates_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_EK_200_200_s.png',
    color: '#D71A21',
  },
  QATAR: {
    code: 'QR',
    icao: 'QTR',
    name: 'Qatar Airways',
    country: 'Catar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Qatar_Airways_Logo.svg/512px-Qatar_Airways_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_QR_200_200_s.png',
    color: '#5C0F3D',
  },
  ETIHAD: {
    code: 'EY',
    icao: 'ETD',
    name: 'Etihad Airways',
    country: 'Emirados Árabes',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Etihad-airways-logo.svg/512px-Etihad-airways-logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_EY_200_200_s.png',
    color: '#BD8B13',
  },
  
  // ========== ÁSIA ==========
  SINGAPORE: {
    code: 'SQ',
    icao: 'SIA',
    name: 'Singapore Airlines',
    country: 'Singapura',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Singapore_Airlines_Logo_2.svg/512px-Singapore_Airlines_Logo_2.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_SQ_200_200_s.png',
    color: '#F99F1C',
  },
  CATHAY: {
    code: 'CX',
    icao: 'CPA',
    name: 'Cathay Pacific',
    country: 'Hong Kong',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Cathay_Pacific_logo.svg/512px-Cathay_Pacific_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_CX_200_200_s.png',
    color: '#006564',
  },
  JAL: {
    code: 'JL',
    icao: 'JAL',
    name: 'Japan Airlines',
    country: 'Japão',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Japan_Airlines_logo.svg/512px-Japan_Airlines_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_JL_200_200_s.png',
    color: '#D70035',
  },
  ANA: {
    code: 'NH',
    icao: 'ANA',
    name: 'All Nippon Airways',
    country: 'Japão',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/All_Nippon_Airways_Logo.svg/512px-All_Nippon_Airways_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_NH_200_200_s.png',
    color: '#13448F',
  },
  KOREAN: {
    code: 'KE',
    icao: 'KAL',
    name: 'Korean Air',
    country: 'Coreia do Sul',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Korean_Air_Logo.svg/512px-Korean_Air_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_KE_200_200_s.png',
    color: '#00256C',
  },
  AIR_CHINA: {
    code: 'CA',
    icao: 'CCA',
    name: 'Air China',
    country: 'China',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Air_China_Logo.svg/512px-Air_China_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_CA_200_200_s.png',
    color: '#E4002B',
  },
  THAI: {
    code: 'TG',
    icao: 'THA',
    name: 'Thai Airways',
    country: 'Tailândia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Thai_Airways_Logo.svg/512px-Thai_Airways_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_TG_200_200_s.png',
    color: '#6D0C7E',
  },
  
  // ========== OCEANIA ==========
  QANTAS: {
    code: 'QF',
    icao: 'QFA',
    name: 'Qantas',
    country: 'Austrália',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Qantas_Logo_2016.svg/512px-Qantas_Logo_2016.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_QF_200_200_s.png',
    color: '#E40000',
  },
  AIR_NZ: {
    code: 'NZ',
    icao: 'ANZ',
    name: 'Air New Zealand',
    country: 'Nova Zelândia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Air_New_Zealand_logo.svg/512px-Air_New_Zealand_logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_NZ_200_200_s.png',
    color: '#00205B',
  },
  
  // ========== ÁFRICA ==========
  ETHIOPIAN: {
    code: 'ET',
    icao: 'ETH',
    name: 'Ethiopian Airlines',
    country: 'Etiópia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Ethiopian_Airlines_Logo.svg/512px-Ethiopian_Airlines_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_ET_200_200_s.png',
    color: '#648B1F',
  },
  SAA: {
    code: 'SA',
    icao: 'SAA',
    name: 'South African Airways',
    country: 'África do Sul',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/South_African_Airways_Logo.svg/512px-South_African_Airways_Logo.svg.png',
    logoFallback: 'https://content.airhex.com/content/logos/airlines_SA_200_200_s.png',
    color: '#002D5A',
  },
};

// ============================================
// HELPERS
// ============================================

/**
 * Busca companhia por código IATA (2 letras) ou nome
 */
export function getAirline(codeOrName: string): Airline | null {
  if (!codeOrName) return null;
  
  const upper = codeOrName.toUpperCase().trim();
  
  // Busca direta pela key
  if (AIRLINES[upper]) return AIRLINES[upper];
  
  // Busca por código IATA
  const byCode = Object.values(AIRLINES).find(a => a.code === upper);
  if (byCode) return byCode;
  
  // Busca por nome (parcial)
  const byName = Object.values(AIRLINES).find(a => 
    a.name.toUpperCase().includes(upper) ||
    upper.includes(a.name.toUpperCase().split(' ')[0])
  );
  if (byName) return byName;
  
  return null;
}

/**
 * Retorna URL do logo usando serviço com fallback automático
 * Usa airhex.com (API pública que serve logos por código IATA)
 */
export function getAirlineLogoByCode(iataCode: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  if (!iataCode) return '';
  const sizeMap = { sm: 100, md: 200, lg: 400 };
  const dimension = sizeMap[size];
  
  return `https://content.airhex.com/content/logos/airlines_${iataCode.toUpperCase()}_${dimension}_${dimension}_s.png`;
}

/**
 * Lista todas as companhias ordenadas por nome
 */
export function getAllAirlines(): Airline[] {
  return Object.values(AIRLINES).sort((a, b) => a.name.localeCompare(b.name));
}
