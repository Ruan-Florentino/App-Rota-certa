import { DESTINATION_IMAGES, FALLBACK_IMAGE_URL } from '../data/destinationImages';

export function getDestinationImage(destinationName: string | undefined): string {
  if (!destinationName) return FALLBACK_IMAGE_URL;

  // Remove acentos e converte para minúsculo
  const normalizedName = destinationName
    .normalize('NFD') // Decompõe os caracteres com acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos
    .toLowerCase()
    .trim();

  // Verifica se o destino existe no map
  if (DESTINATION_IMAGES[normalizedName]) {
    return DESTINATION_IMAGES[normalizedName];
  }

  // Fallback genérico para viagens
  return FALLBACK_IMAGE_URL;
}
