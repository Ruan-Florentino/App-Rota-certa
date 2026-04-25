// src/components/common/OptimizedImage.tsx
import { useState, useEffect, useRef } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  category?: 'destination' | 'avatar' | 'post' | 'generic';
  destinationName?: string; // Absorbed but not used (fixing legacy refs)
  onLoadComplete?: () => void;
  onImageError?: () => void;
}

import { getDestinationImage } from '../../data/destinationImages';

// Fallbacks por categoria (imagens SEMPRE disponíveis)
const CATEGORY_FALLBACKS = {
  destination: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&auto=format&fit=crop',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  post: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80&auto=format&fit=crop',
  generic: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
};

export function OptimizedImage({
  src: originalSrc,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc,
  category = 'generic',
  onLoadComplete,
  onImageError: onErrorCallback,
  destinationName,
  ...props
}: OptimizedImageProps) {
  // Se destinationName for passado, tentamos buscar a imagem dele se originalSrc for vazio ou genérico
  const resolvedSrc = (originalSrc === '' || originalSrc?.includes('generic')) && destinationName 
    ? getDestinationImage(destinationName) 
    : originalSrc;

  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const errorCountRef = useRef(0);
  
  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(originalSrc);
    setState('loading');
    errorCountRef.current = 0;
  }, [originalSrc]);
  
  const handleError = () => {
    errorCountRef.current += 1;
    
    // Nível 1: Tenta fallback customizado
    if (errorCountRef.current === 1 && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    // Nível 2: Tenta fallback da categoria
    if (errorCountRef.current <= 2) {
      setCurrentSrc(CATEGORY_FALLBACKS[category]);
      return;
    }
    
    // Nível 3: Desiste e mostra UI de erro
    setState('error');
    if (onErrorCallback) onErrorCallback();
  };
  
  const handleLoad = () => {
    setState('loaded');
    if (onLoadComplete) onLoadComplete();
  };
  
  return (
    <div 
      className={`relative overflow-hidden bg-white/5 ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    >
      {/* Skeleton loading */}
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 animate-pulse" />
          <Loader2 className="w-6 h-6 text-white/20 animate-spin relative z-10" />
        </div>
      )}
      
      {/* Error state */}
      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 text-white/30">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-xs">Imagem indisponível</span>
        </div>
      )}
      
      {/* Imagem real */}
      {state !== 'error' && (
        <img
          {...props}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}
