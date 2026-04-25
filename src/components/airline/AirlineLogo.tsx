import { useState } from 'react';
import { motion } from 'motion/react';
import { getAirline, getAirlineLogoByCode } from '../../data/airlines';

interface Props {
  /** Código IATA (ex: "LA", "G3") ou nome ("LATAM", "Gol") */
  airline: string;
  /** Tamanho do logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Estilo do container */
  variant?: 'default' | 'rounded' | 'square' | 'circle';
  /** Mostrar nome ao lado */
  showName?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

const SIZES = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export function AirlineLogo({ 
  airline, 
  size = 'md', 
  variant = 'rounded',
  showName = false,
  className = '',
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  
  const airlineData = getAirline(airline);
  const dimension = SIZES[size];
  
  // Determina URL do logo
  let logoUrl = '';
  if (airlineData) {
    if (!imageError) {
      logoUrl = airlineData.logo;
    } else if (!fallbackError && airlineData.logoFallback) {
      logoUrl = airlineData.logoFallback;
    } else {
      // Tenta API pública como último recurso
      logoUrl = getAirlineLogoByCode(airlineData.code, size === 'sm' || size === 'md' ? size : 'md');
    }
  } else {
    // Tenta direto pela API se não está no banco
    logoUrl = getAirlineLogoByCode(airline, size === 'sm' || size === 'md' ? size : 'md');
  }
  
  const handleError = () => {
    if (!imageError) {
      setImageError(true);
    } else if (!fallbackError) {
      setFallbackError(true);
    }
  };
  
  const showLetterFallback = imageError && fallbackError;
  const displayName = airlineData?.name || airline;
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  
  return (
    <div className={`airline-logo-wrap ${className}`}>
      <motion.div
        className={`airline-logo airline-logo-${variant} airline-logo-${size}`}
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: showLetterFallback ? airlineData?.color : '#FFFFFF',
        }}
        whileHover={{ scale: 1.05 }}
      >
        {!showLetterFallback ? (
          <img
            src={logoUrl}
            alt={displayName}
            onError={handleError}
            loading="lazy"
          />
        ) : (
          <span className="airline-logo-initials">{initials}</span>
        )}
      </motion.div>
      
      {showName && airlineData && (
        <div className="airline-info">
          <div className="airline-name">{airlineData.name}</div>
          <div className="airline-code">{airlineData.code}</div>
        </div>
      )}
    </div>
  );
}
