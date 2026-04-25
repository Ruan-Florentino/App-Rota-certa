// src/utils/testImages.ts
import { DESTINATIONS } from '../data/destinationImages';

export async function testAllImages() {
  // Apenas roda em ambiente de desenvolvimento ou quando explicitamente solicitado no console
  console.log('🧪 Testando todas as imagens do catálogo...');
  
  const imagesToTest = DESTINATIONS.flatMap(d => [
    { url: d.cover, dest: d.name, type: 'cover' },
    { url: d.thumbnail, dest: d.name, type: 'thumb' },
    ...d.gallery.map((url, i) => ({ url, dest: d.name, type: `gallery-${i}` })),
  ]);

  const results = await Promise.allSettled(
    imagesToTest.map(async ({ url, dest, type }) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return { url, dest, type, ok: res.ok, status: res.status };
      } catch (err) {
        return { url, dest, type, ok: false, status: 'fetch-failed' };
      }
    })
  );
  
  const broken = results
    .filter(r => r.status === 'fulfilled' && !r.value.ok)
    .map(r => (r as PromiseFulfilledResult<any>).value);
  
  if (broken.length) {
    console.group('❌ IMAGENS QUEBRADAS ENCONTRADAS');
    console.table(broken);
    console.groupEnd();
  } else {
    console.log('✅ Todas as imagens do catálogo estão acessíveis!');
  }
}
