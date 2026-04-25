/**
 * UTILS - FORMATTING
 * Centralized formatting helpers for consistency across the app.
 */

/**
 * Formats a number as BRL currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a number with pt-BR locale.
 */
export const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  return n.toLocaleString('pt-BR');
};

/**
 * Formats a date to a compact string (dd/mm/yyyy).
 */
export const formatDate = (date: string | Date | any): string => {
  if (!date) return '';
  const d = typeof date.toDate === 'function' ? date.toDate() : (typeof date === 'string' ? new Date(date) : date);
  return d.toLocaleDateString('pt-BR');
};

/**
 * Formats a date with time.
 */
export const formatDateTime = (date: any): string => {
  if (!date) return '';
  const d = typeof date.toDate === 'function' ? date.toDate() : (typeof date === 'string' ? new Date(date) : date);
  return d.toLocaleString('pt-BR');
};

/**
 * Formats a duration in minutes to human readable (Xh Ym).
 */
export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};
