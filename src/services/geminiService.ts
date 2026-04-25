import { Trip } from '../types';
import { generateWithGemini } from './geminiClient';

export interface GenerationContext {
  userId: string;
  language: string;
  isPremium: boolean;
  preferences?: {
    travelStyle?: string;
    travelPace?: string;
    interests?: string[];
    dietaryRestrictions?: string[];
    currency?: string;
    theme?: string;
    language?: string;
  };
}

/**
 * GEMINI AI CONFIGURATION AND MODELS
 * ⚠️ IMPORTANTE:
 * - gemini-1.5-* is deprecated.
 * - gemini-2.5-pro is the current stable Pro version, shutting down mid 2026.
 * - Migrate to 3.1 around 06/2026.
 */

// ✅ RECOMENDAÇÃO CONSERVADORA (estável hoje, funciona até 17/06/2026)
const GEMINI_MODEL_FLASH = "gemini-2.5-flash";       // GA estável
const GEMINI_MODEL_PRO = "gemini-2.5-pro";           // GA estável
const GEMINI_MODEL_LITE = "gemini-2.5-flash-lite";   // Barato, dica do dia

// 🔮 PRÓXIMA GERAÇÃO (Preview — monitorar e migrar até meio de 2026)
// export const GEMINI_MODEL_PRO_NEXT = "gemini-3.1-pro-preview";
// export const GEMINI_MODEL_FLASH_NEXT = "gemini-3-flash-preview";

/**
 * STRATEGY:
 * tipOfTheDay: GEMINI_MODEL_LITE,        // Simples, barato, rápido
 * chatGeneral: GEMINI_MODEL_FLASH,       // Equilíbrio
 * tripPlanning: GEMINI_MODEL_PRO,        // Reasoning pesado, vale investir
 * packingList: GEMINI_MODEL_FLASH,       // Lista estruturada, flash dá conta
 * survivalGuide: GEMINI_MODEL_PRO,       // Contexto cultural, pede reasoning
 * priceEstimate: GEMINI_MODEL_FLASH,     // Ranges numéricos
 */

const buildUserContextString = (context?: GenerationContext) => {
  if (!context?.preferences) return "";
  const { preferences } = context;
  return `O perfil do usuário é: Estilo ${preferences.travelStyle || 'Aventureiro'}, Ritmo ${preferences.travelPace || 'Moderado'}, Interesses: ${(preferences.interests || []).join(', ')}.`;
};

// Helper for retries with exponential backoff and jitter
const withRetry = async <T>(fn: () => Promise<T>, retries = 5): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check for 429 or 503 (often demand issues)
      const isRateLimit = error.message?.includes('429') || error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED');
      const isOverloaded = error.message?.includes('503') || error.status === 503 || error.message?.includes('high demand');
      
      if (isRateLimit || isOverloaded) {
        // Longer wait for rate limits/overload: 2, 4, 8, 16, 32 seconds + jitter
        const baseDelay = Math.pow(2, i + 1) * 1000;
        const jitter = Math.random() * 1000;
        const delay = baseDelay + jitter;
        
        console.warn(`Gemini is experiencing high demand (429/503). Retry ${i + 1}/${retries} in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // For other errors, standard retry or fail
      console.warn(`Retry ${i + 1}/${retries} failed with error:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  // If we're here, it means we exhausted retries
  if (lastError.message?.includes('429') || lastError.message?.includes('high demand') || lastError.message?.includes('RESOURCE_EXHAUSTED')) {
    throw new Error('O AI está com alta demanda no momento. Por favor, aguarde um minuto e tente novamente.');
  }
  
  throw lastError;
};

export const generatePackingList = async (
  destination: string,
  days: number,
  type: string
): Promise<any[]> => {
  return withRetry(async () => {
    const prompt = `Você é um guia de viagens especialista. Crie uma lista de bagagem (packing list) detalhada e inteligente para uma viagem com as seguintes características:
    Destino: ${destination}
    Duração: ${days} dias
    Perfil da Viagem: ${type}
    
    REGRAS:
    1. Responda APENAS em PORTUGUÊS.
    2. Considere o clima típico do destino, a duração da viagem e o estilo da viagem para sugerir os itens.
    3. Divida a lista em categorias lógicas (ex: Roupas, Eletrônicos, Documentos, Higiene, Acessórios).
    4. OBRIGATÓRIO: Inclua uma categoria chamada "Sugestões de Looks" com combinações de roupas prontas para diferentes ocasiões na viagem (ex: "Look Jantar: Vestido leve + Sandália", "Look Trilha: Calça tactel + Bota + Camisa UV").
    5. Cada categoria deve her uma lista de itens específicos.
    
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["category", "items"],
          properties: {
            category: { type: "STRING" },
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                required: ["name"],
                properties: {
                  name: { type: "STRING" }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(responseText);
    return data.map((cat: any) => ({
      ...cat,
      items: cat.items.map((item: any) => ({ ...item, checked: false }))
    }));
  });
};

export const generateSurvivalGuide = async (
  destination: string
): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Você é um guia local especialista em ${destination}. Crie um "Guia de Sobrevivência" contendo:
    1. Números de emergência locais (Polícia, Ambulância, Bombeiros).
    2. 5 frases essenciais no idioma local (com tradução para português e pronúncia aproximada).
    3. Regras de gorjeta (tipping) e etiqueta básica do local.
    
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["emergencyNumbers", "phrases", "tipping"],
        properties: {
          emergencyNumbers: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: ["name", "number"],
              properties: {
                name: { type: "STRING" },
                number: { type: "STRING" }
              }
            }
          },
          phrases: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: ["original", "translation", "pronunciation"],
              properties: {
                original: { type: "STRING" },
                translation: { type: "STRING" },
                pronunciation: { type: "STRING" }
              }
            }
          },
          tipping: { type: "STRING" }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const translateText = async (
  text: string,
  destination: string,
  language: string,
  context?: GenerationContext
): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Você é um tradutor nativo e guia cultural em ${destination}. Traduza a seguinte frase para o idioma local (${language}).
    A linguagem do usuário é ${context?.language || 'pt-BR'}.
    Frase: "${text}"
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["translation", "pronunciation", "context"],
        properties: {
          translation: { type: "STRING" },
          pronunciation: { type: "STRING" },
          context: { type: "STRING" }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateOutfitSuggestion = async (
  destination: string,
  weather: string,
  activity: string
): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Você é um personal stylist de viagens. Sugira o look ideal para:
    Destino: ${destination}
    Clima: ${weather}
    Atividade: ${activity}
    
    Divida em categorias: "Roupa do Dia", "Calçados", "Acessórios" e "Dica Extra".
    Seja específico e considere as temperaturas e condições (chuva, sol, vento).
    Responda em PORTUGUÊS.
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["outfit", "footwear", "accessories", "tip"],
        properties: {
          outfit: { type: "STRING" },
          footwear: { type: "STRING" },
          accessories: { type: "STRING" },
          tip: { type: "STRING" }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateJournalInsight = async (
  journalText: string,
  destination: string
): Promise<string> => {
  return withRetry(async () => {
    const prompt = `Você é um mentor de viagens e escritor. Analise esta entrada de diário sobre ${destination}:
  "${journalText}"
  
  Com base nisso, forneça um "Insight de Viagem" curto (máximo 2 parágrafos). 
  Pode ser uma reflexão filosófica, uma dica prática relacionada ao que foi escrito, ou uma curiosidade sobre o local que se conecta com a experiência.
  Seja inspirador e amigável. Responda em PORTUGUÊS.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH
    });
    return responseText?.trim() || "Continue explorando e criando memórias incríveis!";
  });
};

export const generateHiddenGems = async (
  destination: string
): Promise<any[]> => {
  return withRetry(async () => {
    const prompt = `Você é um explorador local em ${destination}. Liste 3 "Pérolas Escondidas" (lugares pouco conhecidos por turistas, mas amados pelos locais).
    Para cada lugar, forneça:
    1. Nome do lugar.
    2. Por que é especial.
    3. Dica de como chegar ou melhor horário.
    4. Categoria (ex: Café, Mirante, Parque, Loja, Rua).
    
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["name", "reason", "tip", "category"],
          properties: {
            name: { type: "STRING" },
            reason: { type: "STRING" },
            tip: { type: "STRING" },
            category: { type: "STRING" }
          }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateLocalFood = async (
  destination: string
): Promise<any[]> => {
  return withRetry(async () => {
    const prompt = `Você é um crítico gastronômico local em ${destination}. Liste 3 pratos ou bebidas típicas que todo viajante DEVE provar.
    Para cada item:
    1. "name": Nome do prato/bebida.
    2. "description": Uma breve e apetitosa descrição dos ingredientes e sabor.
    3. "whereToFind": Tipo de lugar onde é mais comum encontrar (ex: "Barracas de rua", "Restaurantes sofisticados", "Padarias locais").
    
    Retorne um array JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["name", "description", "whereToFind"],
          properties: {
            name: { type: "STRING" },
            description: { type: "STRING" },
            whereToFind: { type: "STRING" }
          }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateEmergencyInfo = async (
  destination: string
): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Forneça informações de emergência essenciais para um turista em ${destination}.
    1. "police": Número da polícia local.
    2. "ambulance": Número da ambulância local.
    3. "fire": Número dos bombeiros locais.
    4. "phrase": Uma frase curta no idioma local pedindo ajuda (com a tradução e pronúncia).
    
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["police", "ambulance", "fire", "phrase"],
        properties: {
          police: { type: "STRING" },
          ambulance: { type: "STRING" },
          fire: { type: "STRING" },
          phrase: {
            type: "OBJECT",
            required: ["original", "translation", "pronunciation"],
            properties: {
              original: { type: "STRING" },
              translation: { type: "STRING" },
              pronunciation: { type: "STRING" }
            }
          }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateCulturalEtiquette = async (
  destination: string
): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Você é um consultor de etiqueta cultural. Forneça 4 dicas essenciais sobre como se comportar em ${destination} para evitar gafes e respeitar a cultura local.
    Inclua:
    1. "do": O que é muito bem visto fazer.
    2. "dont": O que é considerado rude ou proibido.
    3. "tipping": Regra geral sobre gorjetas neste local.
    4. "greeting": Como os locais se cumprimentam (ex: aperto de mão, beijo no rosto, reverência).
    
    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["do", "dont", "tipping", "greeting"],
        properties: {
          do: { type: "STRING" },
          dont: { type: "STRING" },
          tipping: { type: "STRING" },
          greeting: { type: "STRING" }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generatePhotoSpots = async (
  destination: string
): Promise<any[]> => {
  return withRetry(async () => {
    const prompt = `Você é um fotógrafo profissional de viagens. Liste os 3 melhores "Instagrammable Spots" em ${destination}.
    Para cada spot:
    1. "name": Nome do local.
    2. "description": Por que a foto fica incrível lá.
    3. "bestTime": Melhor horário para fotografar (ex: "Golden hour", "Amanhecer para evitar multidões").
    4. "tip": Uma dica de fotografia específica para este local (ângulo, lente, pose).
    
    Retorne um array JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["name", "description", "bestTime", "tip"],
          properties: {
            name: { type: "STRING" },
            description: { type: "STRING" },
            bestTime: { type: "STRING" },
            tip: { type: "STRING" }
          }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateSecretMissions = async (
  destination: string
): Promise<any[]> => {
  return withRetry(async () => {
    const prompt = `Você é um mestre de jogos (Game Master) criando uma caça ao tesouro na vida real. Crie 3 "Missões Secretas" divertidas, seguras e únicas para um turista completar em "${destination}".
    As missões devem incentivar a exploração fora do comum, interação com a cultura local ou provar comidas específicas.
    Para cada missão, forneça:
    1. "title": Um título criativo e misterioso para a missão.
    2. "description": O que o usuário deve fazer exatamente (ex: "Encontre a estátua X e tire uma foto imitando a pose", "Peça um café no idioma local usando a gíria Y").
    3. "xp": Quantidade de XP (experiência) ganha ao completar (ex: 100, 250, 500).
    4. "difficulty": "Fácil", "Médio" ou "Épico".
    
    Retorne um array JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["title", "description", "xp", "difficulty"],
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            xp: { type: "NUMBER" },
            difficulty: { type: "STRING" }
          }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateItinerary = async (
  destination: string,
  days: number,
  budget: number,
  type: string,
  economyMode: boolean = false,
  context?: GenerationContext
): Promise<Partial<Trip>> => {
  return withRetry(async () => {
    const userContextStr = buildUserContextString(context);
    const currentMonth = new Date().toLocaleString(context?.language || 'pt-BR', { month: 'long' });
    const modelTarget = context?.isPremium ? GEMINI_MODEL_PRO : GEMINI_MODEL_FLASH;
    
    const prompt = `Você é um guia de viagens especialista e planejador de roteiros inteligente. Crie um roteiro de viagem REALISTA e DETALHADO para:
    Destino: ${destination}
    Duração: ${days} dias
    Orçamento Total: R$ ${budget} (REAIS BRASILEIROS)
    Perfil da Viagem: ${type}
    Época do ano atual: ${currentMonth}
    
    ${userContextStr ? `CONTEXTO DO VIAJANTE: ${userContextStr}` : ''}
    ${economyMode ? `MODO ECONOMIA ATIVADO: O seu objetivo principal é reduzir custos agressivamente. Sugira hostels, comida de rua, transportes públicos gratuitos ou passes de dia, e atividades gratuitas. Tente ficar BEM ABAIXO do orçamento original de R$ ${budget}.` : ''}

    PENSE PASSO A PASSO (Chain of Thought):
    1. Analise o clima em ${destination} durante ${currentMonth}.
    2. Considere o perfil "${type}" e o contexto do usuário para selecionar atividades personalizadas.
    3. Verifique a viabilidade do orçamento de R$ ${budget}. Se o MODO ECONOMIA estiver ligado, otimize ao máximo os custos.
    4. Organize a logística geográfica para evitar deslocamentos desnecessários.
    
    REGRAS CRÍTICAS:
    1. Responda APENAS em ${context?.language === 'en-US' ? 'INGLÊS' : context?.language === 'es-ES' ? 'ESPANHOL' : 'PORTUGUÊS'}.
    2. Todos os valores monetários devem ser em REAIS (BRL).
    3. O orçamento deve ser respeitado, MAS SE FOR IRREALISTA para o destino (ex: voo do Brasil para Ásia/Oriente Médio por 500 BRL), IGNORE O ORÇAMENTO e forneça VALORES REAIS DE MERCADO. Um voo internacional longo custa no mínimo 4000-8000 BRL. NUNCA invente voos de 500 BRL para destinos intercontinentais.
    4. Distribua o orçamento de forma lógica: Hospedagem (30-40%), Alimentação (20-30%), Atividades (20%), Transporte (10-20%).
    5. Gere EXATAMENTE ${days} dias de roteiro. Cada dia DEVE ter atividades para Manhã, Tarde e Noite.
    6. Use LUGARES REAIS que existem no destino.
    7. Inclua coordenadas (lat, lng) reais para cada atividade.
    8. Sugira 3 opções de voos reais (estimados) e 3 opções de hotéis reais com PREÇOS REAIS DE MERCADO.
    9. OBRIGATÓRIO: Para cada voo, gere um link real de busca no Google Flights. Ex: "https://www.google.com/travel/flights?q=flights+from+SAO+to+PARIS"
    10. OBRIGATÓRIO: Para cada hotel, gere um link real de busca no Booking.com. Ex: "https://www.booking.com/searchresults.html?ss=Paris"
    11. Calcule os custos detalhadamente por categoria.
    12. Para cada atividade, defina uma categoria: "turismo", "restaurante", "transporte" ou "lazer".
    13. Para cada atividade, forneça o nome exato do local/atração no campo "placeName" para que possamos buscar uma foto real na internet. Ex: "Abraj Al Bait", "Al-Baik".

    ESTRUTURA DO ROTEIRO:
    - Dia 1: Foco em chegada e pontos principais.
    - Dias intermediários: Exploração profunda.
    - Último dia: Compras ou relaxamento antes da partida.

    Além disso, gere uma lista de bagagem (packingList) recomendada para este destino e clima em ${currentMonth}, dividida por categorias (ex: Roupas, Eletrônicos, Documentos, Higiene).

    Retorne um objeto JSON seguindo o esquema fornecido.`;

    const responseText = await generateWithGemini(prompt, {
      model: modelTarget,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["itinerary", "costs", "tips", "flights", "hotels", "info", "packingList"],
        properties: {
          itinerary: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: ["day", "activities"],
              properties: {
                day: { type: "INTEGER" },
                activities: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    required: [
                      "time",
                      "activity",
                      "placeName",
                      "description",
                      "cost",
                      "duration",
                      "location",
                      "category",
                    ],
                    properties: {
                      time: {
                        type: "STRING",
                        enum: ["manhã", "tarde", "noite"],
                      },
                      activity: { type: "STRING" },
                      placeName: { type: "STRING" },
                      description: { type: "STRING" },
                      cost: { type: "NUMBER" },
                      duration: { type: "STRING" },
                      location: {
                        type: "OBJECT",
                        required: ["lat", "lng"],
                        properties: {
                          lat: { type: "NUMBER" },
                          lng: { type: "NUMBER" },
                        },
                      },
                      category: {
                        type: "STRING",
                        enum: [
                          "turismo",
                          "restaurante",
                          "transporte",
                          "lazer",
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
          costs: {
            type: "OBJECT",
            required: ["hotel", "food", "transport", "activities", "total"],
            properties: {
              hotel: { type: "NUMBER" },
              food: { type: "NUMBER" },
              transport: { type: "NUMBER" },
              activities: { type: "NUMBER" },
              total: { type: "NUMBER" },
            },
          },
          tips: { type: "ARRAY", items: { type: "STRING" } },
          flights: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: [
                "airline",
                "price",
                "duration",
                "stops",
                "times",
                "link",
              ],
              properties: {
                airline: { type: "STRING" },
                price: { type: "NUMBER" },
                duration: { type: "STRING" },
                stops: { type: "INTEGER" },
                times: { type: "STRING" },
                link: { type: "STRING" },
              },
            },
          },
          hotels: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: [
                "name",
                "price",
                "rating",
                "stars",
                "image",
                "location",
                "amenities",
                "link",
              ],
              properties: {
                name: { type: "STRING" },
                price: { type: "NUMBER" },
                rating: { type: "NUMBER" },
                stars: { type: "INTEGER" },
                image: { type: "STRING" },
                location: { type: "STRING" },
                amenities: { type: "ARRAY", items: { type: "STRING" } },
                link: { type: "STRING" },
              },
            },
          },
          info: {
            type: "OBJECT",
            required: ["bestTime", "timezone", "language", "currency"],
            properties: {
              bestTime: { type: "STRING" },
              timezone: { type: "STRING" },
              language: { type: "STRING" },
              currency: { type: "STRING" },
            },
          },
          packingList: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: ["category", "items"],
              properties: {
                category: { type: "STRING" },
                items: { type: "ARRAY", items: { type: "STRING" } },
              },
            },
          },
        },
      }
    });

    return JSON.parse(responseText);
  });
};

export const generateAudioGuide = async (
  placeName: string,
  destination: string
): Promise<string> => {
  return withRetry(async () => {
    const prompt = `Você é um guia turístico carismático e envolvente. Escreva um roteiro de áudio curto (cerca de 2 a 3 parágrafos curtos) sobre "${placeName}" em "${destination}". O tom deve ser fascinante, contando alguma curiosidade histórica ou lenda local. Comece com uma saudação animada. Responda apenas com o texto a ser narrado, em português do Brasil, sem formatação markdown, apenas texto puro para ser lido por um sintetizador de voz.`;

    return await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH
    }) || "Desculpe, não consegui gerar o roteiro de áudio.";
  });
};

export const generateTimeMachine = async (
  placeName: string,
  destination: string,
  year: string
): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Você é um historiador imersivo. Transporte o usuário para "${placeName}" em "${destination}" no ano de ${year}.
    Descreva com detalhes sensoriais:
    1. "visual": O que o usuário veria (arquitetura, vestimentas, clima).
    2. "sounds": O que o usuário estaria ouvindo (sons da cidade, natureza, conversas, música).
    3. "fact": Um fato histórico ou curiosidade chocante/interessante sobre essa época específica neste local.
    
    Retorne um objeto JSON seguindo o esquema fornecido, em português do Brasil.`;

    const responseText = await generateWithGemini(prompt, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["visual", "sounds", "fact"],
        properties: {
          visual: { type: "STRING" },
          sounds: { type: "STRING" },
          fact: { type: "STRING" }
        }
      }
    });

    return JSON.parse(responseText);
  });
};

export const simpleChat = async (message: string, systemInstruction?: string, history?: any[], context?: GenerationContext) => {
  try {
    const contents: any[] = [];
    const modelTarget = context?.isPremium ? GEMINI_MODEL_PRO : GEMINI_MODEL_FLASH;
    
    if (systemInstruction) {
      contents.push({ role: 'system', parts: [{ text: systemInstruction }] });
    }
    
    if (history && history.length > 0) {
      contents.push(...history);
    }
    
    contents.push({ role: 'user', parts: [{ text: message }] });

    return await generateWithGemini(contents, {
      model: modelTarget
    });
  } catch (err) {
    console.error("Error in simpleChat", err);
    throw err;
  }
};

export const chatWithAssistant = async (message: string, contextObj?: any, history?: any[], genContext?: GenerationContext) => {
  try {
    const userLang = genContext?.language === 'en-US' ? 'inglês' : genContext?.language === 'es-ES' ? 'espanhol' : 'português';
    const modelTarget = genContext?.isPremium ? GEMINI_MODEL_PRO : GEMINI_MODEL_FLASH;

    const systemInstruction = contextObj 
      ? `Você é o assistente virtual de viagens Right Way. Responda em ${userLang}. Contexto atual da viagem: ${JSON.stringify(contextObj)}. Responda de forma curta e amigável.`
      : `Você é o assistente virtual de viagens Right Way. Responda em ${userLang} de forma curta e amigável.`;
      
    const contents: any[] = [
      { role: 'system', parts: [{ text: systemInstruction }] }
    ];
    
    if (history && history.length > 0) {
      contents.push(...history);
    }
    
    contents.push({ role: 'user', parts: [{ text: message }] });

    return await generateWithGemini(contents, {
      model: modelTarget
    });
  } catch (err) {
    console.error("Error in chatWithAssistant", err);
    throw err;
  }
};

export const analyzeImageWithAI = async (base64Image: string, mimeType: string): Promise<any> => {
  return withRetry(async () => {
    const prompt = `Você é um guia turístico especialista. Analise esta imagem e forneça:
      1. O nome do local, monumento ou prato (se aplicável).
      2. Uma breve história ou descrição interessante.
      3. Dicas práticas para quem visita/experimenta.
      
      Retorne um JSON seguindo o esquema fornecido.`;

    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      }
    ];

    const responseText = await generateWithGemini(contents, {
      model: GEMINI_MODEL_FLASH,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["name", "description", "tips"],
        properties: {
          name: { type: "STRING" },
          description: { type: "STRING" },
          tips: { type: "ARRAY", items: { type: "STRING" } }
        }
      }
    });

    return JSON.parse(responseText);
  });
};
