import { GoogleGenAI, Type } from "@google/genai";
import { Trip } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY not found in environment. Itinerary generation may fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const generateItinerary = async (
  destination: string,
  days: number,
  budget: number,
  type: string
): Promise<Partial<Trip>> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Você é um guia de viagens especialista. Crie um roteiro de viagem REALISTA e DETALHADO para:
    Destino: ${destination}
    Duração: ${days} dias
    Orçamento Total: R$ ${budget} (REAIS BRASILEIROS)
    Perfil da Viagem: ${type}
    
    REGRAS CRÍTICAS:
    1. Responda APENAS em PORTUGUÊS.
    2. Todos os valores monetários devem ser em REAIS (BRL).
    3. O orçamento deve ser respeitado RIGOROSAMENTE. Se o orçamento for baixo, sugira opções econômicas. Se for alto, sugira luxo.
    4. Distribua o orçamento entre: Voos (aprox. 30%), Hotéis (aprox. 40%), Alimentação (aprox. 20%), Atividades (aprox. 10%).
    5. Gere EXATAMENTE ${days} dias de roteiro. Cada dia DEVE ter atividades para Manhã, Tarde e Noite.
    6. Use LUGARES REAIS que existem no destino.
    7. Inclua coordenadas (lat, lng) reais para cada atividade.
    8. Sugira 3 opções de voos reais (estimados) e 3 opções de hotéis reais que caibam no orçamento.
    9. Calcule os custos detalhadamente. A soma de costs.hotel + costs.food + costs.transport + costs.activities DEVE ser igual ou menor que o total.
    10. Para cada atividade, defina uma categoria: "turismo", "restaurante", "transporte" ou "lazer".

    ESTRUTURA DO ROTEIRO:
    - Dia 1: Foco em chegada e pontos principais.
    - Dias intermediários: Exploração profunda.
    - Último dia: Compras ou relaxamento antes da partida.

    Retorne um objeto JSON seguindo o esquema fornecido.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["itinerary", "costs", "tips", "flights", "hotels", "info"],
          properties: {
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["day", "activities"],
                properties: {
                  day: { type: Type.INTEGER },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["time", "activity", "description", "cost", "duration", "location", "category"],
                      properties: {
                        time: { type: Type.STRING, enum: ["manhã", "tarde", "noite"] },
                        activity: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cost: { type: Type.NUMBER },
                        duration: { type: Type.STRING },
                        location: {
                          type: Type.OBJECT,
                          required: ["lat", "lng"],
                          properties: {
                            lat: { type: Type.NUMBER },
                            lng: { type: Type.NUMBER }
                          }
                        },
                        category: { type: Type.STRING, enum: ["turismo", "restaurante", "transporte", "lazer"] }
                      }
                    }
                  }
                }
              }
            },
            costs: {
              type: Type.OBJECT,
              required: ["hotel", "food", "transport", "activities", "total"],
              properties: {
                hotel: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                transport: { type: Type.NUMBER },
                activities: { type: Type.NUMBER },
                total: { type: Type.NUMBER }
              }
            },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            flights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["airline", "price", "duration", "stops", "times", "link"],
                properties: {
                  airline: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  duration: { type: Type.STRING },
                  stops: { type: Type.INTEGER },
                  times: { type: Type.STRING },
                  link: { type: Type.STRING }
                }
              }
            },
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "price", "rating", "stars", "image", "location", "amenities", "link"],
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  rating: { type: Type.NUMBER },
                  stars: { type: Type.INTEGER },
                  image: { type: Type.STRING },
                  location: { type: Type.STRING },
                  amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  link: { type: Type.STRING }
                }
              }
            },
            info: {
              type: Type.OBJECT,
              required: ["bestTime", "timezone", "language", "currency"],
              properties: {
                bestTime: { type: Type.STRING },
                timezone: { type: Type.STRING },
                language: { type: Type.STRING },
                currency: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Fallback and validation logic
    if (!result.itinerary || result.itinerary.length === 0) {
      throw new Error("Roteiro vazio gerado.");
    }

    return result;
  } catch (error) {
    console.error("Error generating itinerary with Gemini:", error);
    throw new Error("Falha ao gerar roteiro. O sistema de IA não conseguiu criar um plano válido para este orçamento ou destino. Tente aumentar o orçamento ou mudar o destino.");
  }
};
