import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    console.log('Generating image...');
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'Generate an ultra-realistic, high-resolution (4K) mobile app screenshot mockup of a premium Brazilian travel app called "Vista Viagens" on an iPhone 16 Pro in portrait mode, dark mode theme with deep black background, glowing teal neon accents (#00F5FF) and subtle purple gradients. Top status bar shows real iPhone time 9:41, 5G, battery. New modern logo at the top: a minimalist glowing globe with a sleek airplane trajectory forming the letters "VV" in futuristic teal neon, with app name "Vista Viagens" below in clean sans-serif font. Screen title: "Explorar Destinos" with subtitle "Realidade aumentada • IA • Mapa 3D". Smart search bar with voice icon and AI suggestions chips: "Paris", "Rio de Janeiro", "Bali", "Tóquio". Horizontal filters: Voos, Hotéis, Experiências, Praias, Aventura. Toggle buttons: "Lista" (selected, teal) and "Mapa". Top carousel "Recomendações IA do Momento" with 3 stunning photorealistic destination thumbnails (Paris at sunset, Rio Christ the Redeemer, Bali beach sunrise). Main content: vertical scroll of 5 premium destination cards with REALISTIC high-resolution photos (National Geographic quality): Card 1: Eiffel Tower Paris at golden hour, overlay gradient with "Paris, França", "A partir de R$ 3.299", 4.9 stars, "Voo direto", "18°C ensolarado", badge "Top IA", buttons "Ver em AR" (augmented reality icon) and "Detalhes". Card 2: Christ the Redeemer Rio de Janeiro panoramic view, same rich info. Card 3: Tokyo neon skyline night, same. Card 4: Santorini white houses Greece. Card 5: Machu Picchu Peru. Each card has subtle shadow, rounded corners, depth, price in bold, local time, weather icon, "Popular agora" tag, and AR preview button that looks clickable. At the bottom of the screen: floating "Mapa 3D" section showing a realistic dark-themed interactive map (Google Maps style but custom dark teal palette) with glowing 3D pins (one pin open with popup card showing mini photo of Paris, price, "Ver em AR", local time 15:41, "Clima: 12°C", "4.8 (2.347 avaliações)", "Curiosidade: Torre Eiffel tem 324 metros"). Bottom navigation bar: Home, Explorar (active with teal dot), Reservas, Perfil, all with modern icons. Overall UI: ultra clean, minimalist, premium Apple/Figma level design, perfect typography (Inter font), high contrast, depth shadows, micro-animations implied, photorealistic phone bezels, slight screen reflection. Make every destination photo 100% real-world accurate and breathtaking. Style: professional product design mockup, cinematic lighting, no text blur, extremely detailed and modern. Generate in the exact style of a real app store screenshot.',
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
        fs.writeFileSync('public/mockup.png', Buffer.from(base64EncodeString, 'base64'));
        console.log('Image saved to public/mockup.png');
        return;
      }
    }
    console.log('No image data found in response.');
  } catch (e) {
    console.error('Error with 3.1:', e.message);
    console.log('Falling back to 2.5...');
    try {
      const response2 = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'Generate an ultra-realistic, high-resolution mobile app screenshot mockup of a premium Brazilian travel app called "Vista Viagens" on an iPhone 16 Pro in portrait mode, dark mode theme with deep black background, glowing teal neon accents (#00F5FF) and subtle purple gradients. Top status bar shows real iPhone time 9:41, 5G, battery. New modern logo at the top: a minimalist glowing globe with a sleek airplane trajectory forming the letters "VV" in futuristic teal neon, with app name "Vista Viagens" below in clean sans-serif font. Screen title: "Explorar Destinos" with subtitle "Realidade aumentada • IA • Mapa 3D". Smart search bar with voice icon and AI suggestions chips: "Paris", "Rio de Janeiro", "Bali", "Tóquio". Horizontal filters: Voos, Hotéis, Experiências, Praias, Aventura. Toggle buttons: "Lista" (selected, teal) and "Mapa". Top carousel "Recomendações IA do Momento" with 3 stunning photorealistic destination thumbnails (Paris at sunset, Rio Christ the Redeemer, Bali beach sunrise). Main content: vertical scroll of 5 premium destination cards with REALISTIC high-resolution photos (National Geographic quality): Card 1: Eiffel Tower Paris at golden hour, overlay gradient with "Paris, França", "A partir de R$ 3.299", 4.9 stars, "Voo direto", "18°C ensolarado", badge "Top IA", buttons "Ver em AR" (augmented reality icon) and "Detalhes". Card 2: Christ the Redeemer Rio de Janeiro panoramic view, same rich info. Card 3: Tokyo neon skyline night, same. Card 4: Santorini white houses Greece. Card 5: Machu Picchu Peru. Each card has subtle shadow, rounded corners, depth, price in bold, local time, weather icon, "Popular agora" tag, and AR preview button that looks clickable. At the bottom of the screen: floating "Mapa 3D" section showing a realistic dark-themed interactive map (Google Maps style but custom dark teal palette) with glowing 3D pins (one pin open with popup card showing mini photo of Paris, price, "Ver em AR", local time 15:41, "Clima: 12°C", "4.8 (2.347 avaliações)", "Curiosidade: Torre Eiffel tem 324 metros"). Bottom navigation bar: Home, Explorar (active with teal dot), Reservas, Perfil, all with modern icons. Overall UI: ultra clean, minimalist, premium Apple/Figma level design, perfect typography (Inter font), high contrast, depth shadows, micro-animations implied, photorealistic phone bezels, slight screen reflection. Make every destination photo 100% real-world accurate and breathtaking. Style: professional product design mockup, cinematic lighting, no text blur, extremely detailed and modern. Generate in the exact style of a real app store screenshot.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16"
          }
        },
      });
  
      for (const part of response2.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          fs.writeFileSync('public/mockup.png', Buffer.from(base64EncodeString, 'base64'));
          console.log('Image saved to public/mockup.png');
          return;
        }
      }
    } catch (err2) {
      console.error('Error with 2.5:', err2.message);
    }
  }
}
generate();
