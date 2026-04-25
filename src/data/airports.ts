export interface Airport {
  code: string;      // IATA
  name: string;
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  popular: boolean;
}

export const airports: Airport[] = [
  // === BRASIL ===
  { code: 'GRU', name: 'Guarulhos Intl', city: 'São Paulo', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'CGH', name: 'Congonhas', city: 'São Paulo', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'VCP', name: 'Viracopos', city: 'Campinas', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'SDU', name: 'Santos Dumont', city: 'Rio de Janeiro', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'SSA', name: 'Deputado Luís E. Magalhães', city: 'Salvador', country: 'Brasil', countryCode: 'BR', timezone: 'America/Bahia', popular: true },
  { code: 'REC', name: 'Guararapes', city: 'Recife', country: 'Brasil', countryCode: 'BR', timezone: 'America/Recife', popular: true },
  { code: 'FOR', name: 'Pinto Martins', city: 'Fortaleza', country: 'Brasil', countryCode: 'BR', timezone: 'America/Fortaleza', popular: true },
  { code: 'BSB', name: 'Juscelino Kubitschek', city: 'Brasília', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'CNF', name: 'Confins', city: 'Belo Horizonte', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'POA', name: 'Salgado Filho', city: 'Porto Alegre', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'CWB', name: 'Afonso Pena', city: 'Curitiba', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'FLN', name: 'Hercílio Luz', city: 'Florianópolis', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'MAO', name: 'Eduardo Gomes', city: 'Manaus', country: 'Brasil', countryCode: 'BR', timezone: 'America/Manaus', popular: true },
  { code: 'BEL', name: 'Val de Cans', city: 'Belém', country: 'Brasil', countryCode: 'BR', timezone: 'America/Belem', popular: true },
  { code: 'NAT', name: 'Aluízio Alves', city: 'Natal', country: 'Brasil', countryCode: 'BR', timezone: 'America/Fortaleza', popular: true },
  { code: 'MCZ', name: 'Zumbi dos Palmares', city: 'Maceió', country: 'Brasil', countryCode: 'BR', timezone: 'America/Maceio', popular: false },
  { code: 'AJU', name: 'Santa Maria', city: 'Aracaju', country: 'Brasil', countryCode: 'BR', timezone: 'America/Maceio', popular: false },
  { code: 'JPA', name: 'Castro Pinto', city: 'João Pessoa', country: 'Brasil', countryCode: 'BR', timezone: 'America/Fortaleza', popular: false },
  { code: 'VIX', name: 'Eurico de Aguiar Salles', city: 'Vitória', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: false },
  { code: 'CGB', name: 'Marechal Rondon', city: 'Cuiabá', country: 'Brasil', countryCode: 'BR', timezone: 'America/Cuiaba', popular: false },
  { code: 'CGR', name: 'Campo Grande', city: 'Campo Grande', country: 'Brasil', countryCode: 'BR', timezone: 'America/Campo_Grande', popular: false },
  { code: 'IGU', name: 'Cataratas', city: 'Foz do Iguaçu', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', popular: true },
  { code: 'FEN', name: 'Fernando de Noronha', city: 'Fernando de Noronha', country: 'Brasil', countryCode: 'BR', timezone: 'America/Noronha', popular: true },
  
  // === EUROPA ===
  { code: 'LIS', name: 'Humberto Delgado', city: 'Lisboa', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon', popular: true },
  { code: 'OPO', name: 'Francisco Sá Carneiro', city: 'Porto', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon', popular: true },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'França', countryCode: 'FR', timezone: 'Europe/Paris', popular: true },
  { code: 'ORY', name: 'Orly', city: 'Paris', country: 'França', countryCode: 'FR', timezone: 'Europe/Paris', popular: true },
  { code: 'LHR', name: 'Heathrow', city: 'Londres', country: 'Reino Unido', countryCode: 'GB', timezone: 'Europe/London', popular: true },
  { code: 'LGW', name: 'Gatwick', city: 'Londres', country: 'Reino Unido', countryCode: 'GB', timezone: 'Europe/London', popular: true },
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'Espanha', countryCode: 'ES', timezone: 'Europe/Madrid', popular: true },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Espanha', countryCode: 'ES', timezone: 'Europe/Madrid', popular: true },
  { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'Itália', countryCode: 'IT', timezone: 'Europe/Rome', popular: true },
  { code: 'MXP', name: 'Malpensa', city: 'Milão', country: 'Itália', countryCode: 'IT', timezone: 'Europe/Rome', popular: true },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Alemanha', countryCode: 'DE', timezone: 'Europe/Berlin', popular: true },
  { code: 'MUC', name: 'Munique', city: 'Munique', country: 'Alemanha', countryCode: 'DE', timezone: 'Europe/Berlin', popular: true },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Holanda', countryCode: 'NL', timezone: 'Europe/Amsterdam', popular: true },
  { code: 'ZRH', name: 'Zurique', city: 'Zurique', country: 'Suíça', countryCode: 'CH', timezone: 'Europe/Zurich', popular: true },
  { code: 'VIE', name: 'Schwechat', city: 'Viena', country: 'Áustria', countryCode: 'AT', timezone: 'Europe/Vienna', popular: false },
  { code: 'CPH', name: 'Kastrup', city: 'Copenhague', country: 'Dinamarca', countryCode: 'DK', timezone: 'Europe/Copenhagen', popular: false },
  { code: 'ARN', name: 'Arlanda', city: 'Estocolmo', country: 'Suécia', countryCode: 'SE', timezone: 'Europe/Stockholm', popular: false },
  { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atenas', country: 'Grécia', countryCode: 'GR', timezone: 'Europe/Athens', popular: true },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istambul', country: 'Turquia', countryCode: 'TR', timezone: 'Europe/Istanbul', popular: true },
  
  // === AMÉRICA DO NORTE ===
  { code: 'JFK', name: 'John F. Kennedy', city: 'Nova York', country: 'EUA', countryCode: 'US', timezone: 'America/New_York', popular: true },
  { code: 'EWR', name: 'Newark', city: 'Nova York', country: 'EUA', countryCode: 'US', timezone: 'America/New_York', popular: true },
  { code: 'LGA', name: 'LaGuardia', city: 'Nova York', country: 'EUA', countryCode: 'US', timezone: 'America/New_York', popular: true },
  { code: 'MIA', name: 'Miami Intl', city: 'Miami', country: 'EUA', countryCode: 'US', timezone: 'America/New_York', popular: true },
  { code: 'MCO', name: 'Orlando Intl', city: 'Orlando', country: 'EUA', countryCode: 'US', timezone: 'America/New_York', popular: true },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'EUA', countryCode: 'US', timezone: 'America/Los_Angeles', popular: true },
  { code: 'SFO', name: 'San Francisco Intl', city: 'São Francisco', country: 'EUA', countryCode: 'US', timezone: 'America/Los_Angeles', popular: true },
  { code: 'LAS', name: 'Harry Reid Intl', city: 'Las Vegas', country: 'EUA', countryCode: 'US', timezone: 'America/Los_Angeles', popular: true },
  { code: 'ORD', name: 'O\'Hare Intl', city: 'Chicago', country: 'EUA', countryCode: 'US', timezone: 'America/Chicago', popular: true },
  { code: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canadá', countryCode: 'CA', timezone: 'America/Toronto', popular: true },
  { code: 'YUL', name: 'Trudeau', city: 'Montreal', country: 'Canadá', countryCode: 'CA', timezone: 'America/Toronto', popular: true },
  { code: 'CUN', name: 'Cancún', city: 'Cancún', country: 'México', countryCode: 'MX', timezone: 'America/Cancun', popular: true },
  { code: 'MEX', name: 'Benito Juárez', city: 'Cidade do México', country: 'México', countryCode: 'MX', timezone: 'America/Mexico_City', popular: true },
  
  // === AMÉRICA DO SUL ===
  { code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', timezone: 'America/Argentina/Buenos_Aires', popular: true },
  { code: 'AEP', name: 'Jorge Newbery', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', timezone: 'America/Argentina/Buenos_Aires', popular: true },
  { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', countryCode: 'CL', timezone: 'America/Santiago', popular: true },
  { code: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', countryCode: 'PE', timezone: 'America/Lima', popular: true },
  { code: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colômbia', countryCode: 'CO', timezone: 'America/Bogota', popular: true },
  { code: 'UIO', name: 'Mariscal Sucre', city: 'Quito', country: 'Equador', countryCode: 'EC', timezone: 'America/Guayaquil', popular: false },
  { code: 'MVD', name: 'Carrasco', city: 'Montevidéu', country: 'Uruguai', countryCode: 'UY', timezone: 'America/Montevideo', popular: true },
  { code: 'PTY', name: 'Tocumen', city: 'Cidade do Panamá', country: 'Panamá', countryCode: 'PA', timezone: 'America/Panama', popular: true },
  
  // === ÁSIA / OCEANIA ===
  { code: 'HND', name: 'Haneda', city: 'Tóquio', country: 'Japão', countryCode: 'JP', timezone: 'Asia/Tokyo', popular: true },
  { code: 'NRT', name: 'Narita', city: 'Tóquio', country: 'Japão', countryCode: 'JP', timezone: 'Asia/Tokyo', popular: true },
  { code: 'ICN', name: 'Incheon', city: 'Seul', country: 'Coreia do Sul', countryCode: 'KR', timezone: 'Asia/Seoul', popular: true },
  { code: 'HKG', name: 'Chek Lap Kok', city: 'Hong Kong', country: 'China', countryCode: 'HK', timezone: 'Asia/Hong_Kong', popular: true },
  { code: 'SIN', name: 'Changi', city: 'Singapura', country: 'Singapura', countryCode: 'SG', timezone: 'Asia/Singapore', popular: true },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Tailândia', countryCode: 'TH', timezone: 'Asia/Bangkok', popular: true },
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'Emirados Árabes', countryCode: 'AE', timezone: 'Asia/Dubai', popular: true },
  { code: 'DOH', name: 'Hamad Intl', city: 'Doha', country: 'Qatar', countryCode: 'QA', timezone: 'Asia/Qatar', popular: true },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Austrália', countryCode: 'AU', timezone: 'Australia/Sydney', popular: true },
  
  // === ÁFRICA ===
  { code: 'CPT', name: 'Cidade do Cabo Intl', city: 'Cidade do Cabo', country: 'África do Sul', countryCode: 'ZA', timezone: 'Africa/Johannesburg', popular: true },
  { code: 'JNB', name: 'O. R. Tambo', city: 'Joanesburgo', country: 'África do Sul', countryCode: 'ZA', timezone: 'Africa/Johannesburg', popular: false },
  { code: 'CMN', name: 'Mohammed V', city: 'Casablanca', country: 'Marrocos', countryCode: 'MA', timezone: 'Africa/Casablanca', popular: false },
  { code: 'RAK', name: 'Menara', city: 'Marrakech', country: 'Marrocos', countryCode: 'MA', timezone: 'Africa/Casablanca', popular: true },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 1) {
    return airports.filter(a => a.popular).slice(0, 10);
  }
  
  const q = query.toLowerCase().trim();
  
  const matches = airports.filter(airport => 
    airport.city.toLowerCase().includes(q) ||
    airport.country.toLowerCase().includes(q) ||
    airport.code.toLowerCase().includes(q) ||
    airport.name.toLowerCase().includes(q)
  );
  
  return matches
    .sort((a, b) => {
      // Matches exatos de código primeiro
      if (a.code.toLowerCase() === q) return -1;
      if (b.code.toLowerCase() === q) return 1;
      
      // Matches de início de cidade
      const aStartsCity = a.city.toLowerCase().startsWith(q);
      const bStartsCity = b.city.toLowerCase().startsWith(q);
      if (aStartsCity && !bStartsCity) return -1;
      if (bStartsCity && !aStartsCity) return 1;
      
      // Popular primeiro
      if (a.popular && !b.popular) return -1;
      if (b.popular && !a.popular) return 1;
      
      return 0;
    })
    .slice(0, 12);
}
