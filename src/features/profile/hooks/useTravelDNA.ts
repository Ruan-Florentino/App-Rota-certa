import { useMemo } from 'react';
import { useTripsStore } from '@/stores/tripsStore';
import { COUNTRIES } from '@/data/countries';

export type Archetype = 
  | 'NÔMADE CULTURAL 🎭'
  | 'CAÇADOR DE AVENTURAS 🌋'
  | 'EXPLORADOR URBANO 🏙️'
  | 'AMANTE DA NATUREZA 🌲'
  | 'RESIDENTE DO MUNDO 🌍'
  | 'VIAJANTE LENDÁRIO 👑';

export interface TravelDNA {
  adventure: number; // %
  culture: number;   // %
  nature: number;    // %
  urban: number;     // %
  archetype: Archetype;
}

export function useTravelDNA(): TravelDNA {
  const { trips } = useTripsStore();

  return useMemo(() => {
    let adventure = 0;
    let culture = 0;
    let nature = 0;
    let urban = 0;

    const visited = trips.filter(t => t.status === 'visited');
    const total = visited.length || 1; // prevent div by zero

    visited.forEach(trip => {
      const c = COUNTRIES.find(x => x.code === trip.countryCode);
      if (c) {
        // Very rudimentary heuristics based on continent
        if (c.continent === 'Oceania' || c.continent === 'América do Sul') {
          adventure += 1;
          nature += 1;
        } else if (c.continent === 'Europa') {
          culture += 1;
          urban += 0.5;
        } else if (c.continent === 'África') {
          nature += 1;
          adventure += 0.5;
        } else {
          urban += 1;
        }
      }
    });

    const normalize = (val: number) => Math.min(100, Math.round((val / total) * 100));

    const dna = {
      adventure: normalize(adventure),
      culture: normalize(culture),
      nature: normalize(nature),
      urban: normalize(urban),
      archetype: 'NÔMADE CULTURAL 🎭' as Archetype
    };

    const maxTrait = Math.max(dna.adventure, dna.culture, dna.nature, dna.urban);
    if (visited.length > 20) dna.archetype = 'VIAJANTE LENDÁRIO 👑';
    else if (maxTrait === dna.adventure) dna.archetype = 'CAÇADOR DE AVENTURAS 🌋';
    else if (maxTrait === dna.nature) dna.archetype = 'AMANTE DA NATUREZA 🌲';
    else if (maxTrait === dna.urban) dna.archetype = 'EXPLORADOR URBANO 🏙️';
    else dna.archetype = 'NÔMADE CULTURAL 🎭';

    return dna;
  }, [trips]);
}
