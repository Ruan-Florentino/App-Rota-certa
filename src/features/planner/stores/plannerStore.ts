import { create } from 'zustand';
import { Message, TripAnswers, Question, Itinerary } from '../types/planner.types';

interface PlannerState {
  messages: Message[];
  currentStep: number;
  answers: TripAnswers;
  isTyping: boolean;
  currentQuestion: Question | null;
  itinerary: Itinerary | null;
  status: 'conversing' | 'generating' | 'completed';
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  answerQuestion: (key: keyof TripAnswers, value: any) => void;
  generateItinerary: () => void;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  messages: [],
  currentStep: 0,
  answers: {},
  isTyping: false,
  currentQuestion: null,
  itinerary: null,
  status: 'conversing',
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (isTyping) => set({ isTyping }),
  answerQuestion: (key, value) => set((state) => ({ 
    answers: { ...state.answers, [key]: value },
    messages: [...state.messages, { id: Date.now().toString(), sender: 'user', text: String(value), type: 'text', timestamp: new Date() }]
  })),
  generateItinerary: () => set({ status: 'generating' })
}));
