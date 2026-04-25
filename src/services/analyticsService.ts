import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '../firebase';

let analytics: ReturnType<typeof getAnalytics> | null = null;

const getAnalyticsInstance = () => {
  if (!analytics) {
    try { analytics = getAnalytics(app); } catch { return null; }
  }
  return analytics;
};

export const trackEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  const a = getAnalyticsInstance();
  if (!a) return;
  try { logEvent(a, eventName, params); } catch {}
};
