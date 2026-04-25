import { Country, Continent } from '../countries';
import { africa } from './africa';
import { northAmerica } from './northAmerica';
import { centralAmerica } from './centralAmerica';
import { southAmerica } from './southAmerica';
import { asia } from './asia';
import { europe } from './europe';
import { oceania } from './oceania';

export const COUNTRIES: Country[] = [
  ...africa,
  ...northAmerica,
  ...centralAmerica,
  ...southAmerica,
  ...asia,
  ...europe,
  ...oceania,
];

// Validação em runtime
if (COUNTRIES.length !== 195) {
  console.warn(`⚠️ Esperado 195 países, encontrado ${COUNTRIES.length}. Verifique se algum foi esquecido ou se há duplicatas.`);
}

export const getCountryByCode = (code?: string | null) => {
  if (!code || typeof code !== 'string') return undefined;
  const normalized = code.toUpperCase();
  return COUNTRIES.find(c => c.code?.toUpperCase() === normalized);
};

export const searchCountries = (query?: string | null) => {
  if (!query || typeof query !== 'string') return COUNTRIES;
  const q = query.toLowerCase().trim();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter(c =>
    c.name?.toLowerCase().includes(q) ||
    c.nameEn?.toLowerCase().includes(q) ||
    c.code?.toLowerCase().includes(q) ||
    (c.capital && c.capital.toLowerCase().includes(q))
  );
};

export const groupByContinent = (countries: Country[] = []) => {
  return countries.reduce((acc, c) => {
    if (!c?.continent) return acc;
    if (!acc[c.continent]) acc[c.continent] = [];
    acc[c.continent].push(c);
    return acc;
  }, {} as Record<string, Country[]>);
};
