import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useSubscription } from '../services/subscriptionService';
import { useShallow } from 'zustand/react/shallow';
import type { GenerationContext } from '../services/geminiService';

// Seletores estáticos fora do hook para garantir que a referência da função seja constante
const userIdSelector = (s: any) => s.user?.uid ?? 'anonymous';
const languageSelector = (s: any) => s.user?.preferences?.language ?? 'pt-BR';
const prefsSelector = (s: any) => ({
  travelStyle: s.user?.travelStyle,
  travelPace: s.user?.travelPace,
  interests: s.user?.travelInterests,
  currency: s.user?.preferences?.currency,
  theme: s.user?.preferences?.theme,
  language: s.user?.preferences?.language
});
const isProSelector = (s: any) => s.isPro;

/**
 * Monta o contexto padrão pra chamadas do Gemini.
 * Otimizado com seletores estáticos e useMemo para evitar re-renders em cascata e loops de snapshot.
 */
export function useGenerationContext(): GenerationContext {
  const userId = useStore(userIdSelector);
  const language = useStore(languageSelector);
  const prefs = useStore(useShallow(prefsSelector));
  const isPremium = useSubscription(isProSelector);

  // Memoizamos o objeto final para garantir que a referência só mude se os dados mudarem de fato
  return useMemo(() => ({
    userId,
    language,
    isPremium,
    preferences: prefs
  }), [userId, language, isPremium, prefs]);
}
