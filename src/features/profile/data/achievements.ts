import { Achievement } from '../types/profile.types';

export const achievementsData: Achievement[] = [
  {
    id: 'mochileiro',
    name: 'MOCHILEIRO',
    description: '1ª VIAGEM',
    icon: '✅',
    unlocked: true,
    unlockedAt: new Date(),
  },
  {
    id: 'economico',
    name: 'ECONÔMICO',
    description: 'NO ORÇAMENTO',
    icon: '🔒',
    unlocked: false,
  },
  {
    id: 'fotografo',
    name: 'FOTÓGRAFO',
    description: 'COM FOTOS',
    icon: '🔒',
    unlocked: false,
  },
  {
    id: 'explorador',
    name: 'EXPLORADOR',
    description: '5 PAÍSES',
    icon: '🔒',
    unlocked: false,
  },
  {
    id: 'aventureiro',
    name: 'AVENTUREIRO',
    description: '10 TRIPS',
    icon: '🔒',
    unlocked: false,
  },
  {
    id: 'global',
    name: 'GLOBAL',
    description: '3 CONTINENTES',
    icon: '🔒',
    unlocked: false,
  },
  {
    id: 'lenda',
    name: 'LENDA',
    description: '50 VIAGENS',
    icon: '🔒',
    unlocked: false,
  }
];
