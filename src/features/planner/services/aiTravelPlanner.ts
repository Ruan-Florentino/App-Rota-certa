import { Question, Itinerary, TripAnswers } from '../types/planner.types';

export const getNextQuestion = (step: number, answers: TripAnswers): Question => {
  const questions: Question[] = [
    { id: '1', text: 'Oi! Sou sua IA de viagens. Vamos planejar algo incrível?', type: 'quick-reply', options: ['Sim, vamos!', 'Me surpreenda!', 'Tenho uma ideia'] },
    { id: '2', text: 'Pra onde você quer ir?', type: 'text' },
    { id: '3', text: 'Quando você pretende viajar?', type: 'date-picker' },
    { id: '4', text: 'Quanto tempo você tem?', type: 'quick-reply', options: ['Fim de semana', '1 semana', '10 dias', '2 semanas'] },
    { id: '5', text: 'Quem vai com você?', type: 'quick-reply', options: ['Sozinho', 'Casal', 'Família', 'Amigos'] },
    { id: '6', text: 'Qual seu orçamento?', type: 'budget-slider' },
    { id: '7', text: 'O que não pode faltar?', type: 'multi-select' },
  ];
  return questions[step] || questions[0];
};

export const generateItinerary = (answers: TripAnswers): Itinerary => {
  return {
    id: '1',
    destination: answers.destination || 'Lisboa',
    country: 'Portugal',
    totalDays: 5,
    budget: answers.budget || 5000,
    matchScore: 96,
    days: [
        { title: 'Dia 1', activities: [{ time: '09:00', title: 'Chegada', desc: 'Hotel check-in' }] }
    ],
    accommodation: [{ name: 'Hotel Lisboa', price: 1000, rating: 4.5 }],
    priceBreakdown: { flights: 2000, stay: 2000, food: 1000 }
  };
};
