export type Continent = 
  | 'África' 
  | 'América do Norte' 
  | 'América Central' 
  | 'América do Sul' 
  | 'Ásia' 
  | 'Europa' 
  | 'Oceania';

export interface Country {
  code: string;       // ISO alpha-2
  code3: string;      // ISO alpha-3
  name: string;       // português
  nameEn: string;     // inglês
  capital: string;
  continent: Continent;
  flag: string;       // emoji
  lat: number;
  lng: number;
}

export { COUNTRIES, getCountryByCode, searchCountries, groupByContinent } from './countries/index';
