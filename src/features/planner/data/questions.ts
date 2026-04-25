import { Question } from '../types/planner.types';

export const questions: Question[] = [
    { id: '1', text: 'Oi! Sou sua IA de viagens. Vamos planejar algo incrível?', type: 'quick-reply', options: ['Sim, vamos!', 'Me surpreenda!', 'Tenho uma ideia'] },
    { id: '2', text: 'Pra onde você quer ir?', type: 'text' },
];
