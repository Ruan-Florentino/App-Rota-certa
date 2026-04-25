import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import NodeCache from 'node-cache';
import { z } from 'zod';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });
const tipCache = new NodeCache({ stdTTL: 86400 }); // 24 hours

const GenerateSchema = z.object({
  prompt: z.string().min(1).max(8000).optional(),
  contents: z.any().optional(),
  model: z.enum(['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro']).optional().default('gemini-2.5-flash'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  responseMimeType: z.string().optional(),
  responseSchema: z.any().optional(),
});

/**
 * Proxy for Gemini Content Generation
 */
export async function generateContent(req: Request, res: Response) {
  try {
    const parsed = GenerateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: 'Input inválido',
        details: parsed.error.flatten(),
      });
    }

    const { prompt, contents, model, temperature, responseMimeType, responseSchema } = parsed.data;

    if (!prompt && !contents) {
      return res.status(400).json({ error: 'Prompt ou contents são obrigatórios.' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Configuração do servidor incompleta (API Key ausente).' });
    }

    const config: any = { temperature };
    if (responseMimeType) config.responseMimeType = responseMimeType;
    if (responseSchema) config.responseSchema = responseSchema;

    const finalContents = contents || prompt;

    // Structured logging using Pino (available on req.log if setup in server.ts)
    if (req.log) {
      req.log.info({ uid: req.user?.uid, model }, 'gemini_request');
    }

    const response = await ai.models.generateContent({
      model,
      contents: finalContents,
      config
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'Resposta vazia do Gemini.' });
    }

    return res.json({ text, model });
  } catch (error: any) {
    if (req.log) {
      req.log.error({ err: error, uid: req.user?.uid }, 'Gemini Proxy Error');
    } else {
      console.error('Gemini Proxy Error:', error);
    }
    const status = error.status || 500;
    const message = error.message || 'Erro ao processar requisição com IA.';
    return res.status(status).json({ error: message });
  }
}

/**
 * Special endpoint for Tip of the Day with Server-Side Caching
 */
export async function getTipOfTheDay(req: Request, res: Response) {
  try {
    const cacheKey = 'tip_of_the_day';
    const cachedTip = tipCache.get(cacheKey);

    if (cachedTip) {
      return res.json({ text: cachedTip, cached: true });
    }

    if (!GEMINI_API_KEY) {
      return res.json({ text: "Explore novos horizontes e descubra a beleza do mundo!", cached: false });
    }

    const prompt = `Você é um especialista em viagens. Gere UMA dica prática, curta (máximo 2 linhas) e surpreendente para viajantes brasileiros. Não use emojis. Não comece com "Dica:". Apenas a dica direta. Seja criativo e específico.`;

    const model = "gemini-1.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });

    const text = (response.text || "").trim() || "Explore novos horizontes e descubra a beleza do mundo!";
    
    tipCache.set(cacheKey, text);
    
    return res.json({ text, cached: false });
  } catch (error) {
    console.error('Tip of the Day Error:', error);
    return res.status(500).json({ error: 'Erro ao buscar dica do dia.' });
  }
}
