/**
 * Seguro Gemini Client - Calls the backend proxy to protect the API Key.
 * The API Key NEVER leaves the server.
 */

import { getAuth } from 'firebase/auth';

const API_BASE = '/api';

export interface GeminiOptions {
  model?: string;
  temperature?: number;
  responseMimeType?: string;
  responseSchema?: any;
}

async function getAuthHeader(): Promise<HeadersInit> {
  let user = null;
  try {
    user = getAuth().currentUser;
  } catch (e) {
    // Auth nulo
  }
  if (!user) return {};
  
  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

export async function generateWithGemini(
  promptOrContents: string | any[],
  options: GeminiOptions = {}
): Promise<string> {
  const body: any = { ...options };
  
  if (typeof promptOrContents === 'string') {
    body.prompt = promptOrContents;
  } else {
    body.contents = promptOrContents;
  }

  const authHeaders = await getAuthHeader();

  const response = await fetch(`${API_BASE}/gemini/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeaders
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    // Se receber 401, a sessão no Firebase ou o token está inválido
    const error = new Error("Sessão expirada. Por favor, faça login novamente para continuar.");
    (error as any).code = 'AUTH_EXPIRED';
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text;
}

export async function getTipOfTheDay(): Promise<string> {
  const response = await fetch(`${API_BASE}/gemini/tip-of-the-day`);

  if (!response.ok) {
    throw new Error('Failed to fetch tip of the day');
  }

  const data = await response.json();
  return data.text;
}
