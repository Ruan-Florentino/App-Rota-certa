const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const apiUrl = (path: string) => `${BASE_URL}${path}`;
