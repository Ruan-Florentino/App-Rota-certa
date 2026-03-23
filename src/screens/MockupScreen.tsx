import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MobileContainer } from '../components/MobileUI';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export const MockupScreen: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generateMockup = async () => {
    setLoading(true);
    setError(null);
    try {
      // The API key is injected into process.env.API_KEY by the platform after selection
      const apiKey = process.env.API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: 'Ultra-premium, cinematic 4K mobile app screenshot of "RotaCerta" destination detail screen on iPhone 16 Pro Max portrait, elegant dark mode with deep navy background (#0A1128), vibrant neon cyan accents (#00F5FF), subtle glassmorphism overlays (frosted blur cards), soft neumorphic shadows for depth. Full-bleed immersive hero image at top 55% of screen: hyper-realistic nighttime Santiago Chile skyline with dramatic Andes mountains snow-capped under starry sky and illuminated city, professional National Geographic quality, cinematic lighting. Overlay on hero: elegant semi-transparent glass card at bottom of image with: Large bold white title "Santiago, Chile" in modern sans-serif, Subtle tag pills glowing cyan: "América" "Neve" "Cultura", Big prominent price pill neon cyan: "A partir de R$ 2.200", Duration badge: "4 dias" with calendar icon, Weather/live info: "Agora 8°C · Neve leve" with animated snowflake icon, Rating: "4.8 ★ (1.2k avaliações)" gold stars. Floating buttons on hero: "Explorar em Realidade Aumentada" (large, glowing cyan, AR glasses icon) and "Planejar Viagem com IA" (primary button gradient cyan to teal). Below hero: scrollable content with glassmorphic sections: First section: "Por que visitar agora" short emotional text block with 4 small photorealistic horizontal scroll cards (Andes ski, Street art Bellavista, Winery, Costanera Center) each with estimated price and time. Mid-screen: interactive mini 3D map widget (Apple Maps flyover style dark theme) showing Santiago with glowing cyan pins for attractions, rotate/zoom implied, "Abrir mapa completo" button. Below map: Auto AI Itinerary (Timeline Day 1 / Day 2 / Day 3 / Day 4 expandable), each day with photo, activities, estimated cost, time, and a "Personalizar com IA" button opening a direct chat. Bottom fixed quick actions (above nav): Save, Share, "Ver todos os voos + hotéis". Bottom navigation: modern minimalist icons (Home, Explorar, Mapa active, Reservas, Perfil) with neon cyan glow only on active. Overall UI: zero clutter, large touch targets, smooth animations implied, ultra-clean, high-contrast readable typography, micro-animations, premium Figma/Apple polish, dimensional depth with layers. Sharp bezels, natural screen reflection, professional product mockup style. Make Santiago photo breathtakingly accurate and epic.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
            imageSize: "4K"
          }
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64EncodeString}`);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) {
        setError('No image generated.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating image');
      if (err.message?.includes('Requested entity was not found')) {
        setHasKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="p-6 pt-12 flex flex-col items-center min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-6">Mockup Generator</h1>
        
        {!hasKey ? (
          <div className="bg-white/10 p-6 rounded-2xl text-center">
            <p className="text-white mb-4">Para gerar imagens 4K, você precisa fornecer sua própria chave de API do Google Cloud (projeto com faturamento ativado).</p>
            <button 
              onClick={handleSelectKey}
              className="bg-primary text-background px-6 py-3 rounded-xl font-bold"
            >
              Selecionar API Key
            </button>
            <p className="text-xs text-subtext mt-4">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">
                Documentação de Faturamento
              </a>
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <button 
              onClick={generateMockup}
              disabled={loading}
              className="bg-primary text-background px-6 py-3 rounded-xl font-bold w-full mb-6 disabled:opacity-50"
            >
              {loading ? 'Gerando (pode levar 1-2 min)...' : 'Gerar Mockup 4K'}
            </button>
            
            {error && (
              <div className="bg-red-500/20 text-red-200 p-4 rounded-xl w-full mb-6 text-sm">
                {error}
              </div>
            )}

            {imageUrl && (
              <div className="w-full max-w-sm rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <img src={imageUrl} alt="Generated Mockup" className="w-full h-auto" />
              </div>
            )}
          </div>
        )}
      </div>
    </MobileContainer>
  );
};
