import { Request, Response } from 'express';

export const generateMockup = async (req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing.");
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required. Please set it in the AI Studio Settings." });
    }

    const { GoogleGenAI } = await import("@google/genai");
    const fs = await import("fs");
    const path = await import("path");
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'imagen-3',
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

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const outPath = path.join(process.cwd(), 'public', 'mockup.png');
        fs.writeFileSync(outPath, Buffer.from(base64EncodeString, 'base64'));
        return res.json({ success: true, path: '/mockup.png' });
      }
    }
    res.status(500).json({ error: 'No image data' });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
