/**
 * Lê um File e retorna data URL (base64).
 * Redimensiona se > maxWidth pra não estourar localStorage.
 */
export async function fileToDataUrl(
  file: File,
  maxWidth = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Arquivo não é uma imagem'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.onload = () => {
        // Calcular novo tamanho mantendo proporção
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas não suportado'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function validateImage(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Selecione uma imagem (JPG, PNG, WEBP)';
  }
  if (file.size > 10 * 1024 * 1024) {
    return 'Imagem muito grande. Máximo 10MB';
  }
  return null;
}
