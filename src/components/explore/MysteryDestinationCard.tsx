import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ALL_DESTINATIONS } from '../../data/destinations';

export function MysteryDestinationCard() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [destination, setDestination] = useState<any>(null);
  
  const handleReveal = () => {
    if (revealed) return;
    
    const featured = ALL_DESTINATIONS.filter(d => d.featured || d.trending);
    const picked = featured[Math.floor(Math.random() * featured.length)];
    setDestination(picked);
    setRevealed(true);
    
    if ('vibrate' in navigator) navigator.vibrate([30, 20, 50]);
  };
  
  const handleOpen = () => {
    if (destination) navigate(`/destination/${destination.id}`);
  };
  
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealed(false);
    setDestination(null);
  };
  
  return (
    <section className="mystery-section">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.button
            key="mystery"
            className="mystery-card"
            onClick={handleReveal}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Partículas flutuantes no fundo */}
            <div className="mystery-particles">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="mystery-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
            
            {/* Orbs de luz */}
            <div className="mystery-orb mystery-orb-1" />
            <div className="mystery-orb mystery-orb-2" />
            
            {/* Header com badge */}
            <div className="mystery-header">
              <motion.div
                className="mystery-badge"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(34, 211, 238, 0.3)',
                    '0 0 30px rgba(168, 85, 247, 0.5)',
                    '0 0 20px rgba(34, 211, 238, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span>✨</span>
                <span>DESTINO DO DIA</span>
              </motion.div>
              
              <motion.div
                className="mystery-arrow"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </div>
            
            {/* Ilustração central animada */}
            <div className="mystery-illustration">
              <motion.div
                className="mystery-globe"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                🌍
              </motion.div>
              
              <motion.div
                className="mystery-sparkle mystery-sparkle-1"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                ✦
              </motion.div>
              
              <motion.div
                className="mystery-sparkle mystery-sparkle-2"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              >
                ✦
              </motion.div>
              
              <motion.div
                className="mystery-sparkle mystery-sparkle-3"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                ✧
              </motion.div>
            </div>
            
            {/* Texto com hierarquia */}
            <div className="mystery-text-wrap">
              <p className="mystery-kicker">Onde você vai?</p>
              
              <h3 className="mystery-title">
                Um destino <span className="mystery-italic">inesperado</span><br />
                te aguarda hoje
              </h3>
              
              <div className="mystery-cta">
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Toque para revelar
                </motion.span>
                <div className="mystery-dots">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    >
                      •
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="revealed"
            className="mystery-card mystery-card-revealed"
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="revealed-image">
              <motion.img
                src={destination.heroImage}
                alt={destination.name}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0';
                }}
              />
              <div className="revealed-overlay" />
            </div>
            
            <div className="revealed-content">
              <motion.div
                className="revealed-badge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ✨ Revelado
              </motion.div>
              
              <motion.div
                className="revealed-location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                📍 {destination.country}
              </motion.div>
              
              <motion.h3
                className="revealed-name"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {destination.name}
              </motion.h3>
              
              <motion.div
                className="revealed-footer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="revealed-rating">
                  ⭐ {destination.rating}
                </div>
                <div className="revealed-price">
                  <span style={{ fontSize: '9px' }}>Estimativa Histórica*</span>
                  <strong>R$ {(destination.priceFrom || destination.avgPrice || 0).toLocaleString('pt-BR')} - {Math.round((destination.priceFrom || destination.avgPrice || 0) * 1.4).toLocaleString('pt-BR')}</strong>
                </div>
              </motion.div>
              
              <button className="revealed-reset" onClick={handleReset}>
                ↻ Outra surpresa
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
