import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ExploreCollection } from '../../../data/exploreCollections';
import { SafeImage } from '../../../components/ui/SafeImage';

interface HeroCollectionProps {
  collection: ExploreCollection;
}

export const HeroCollection: React.FC<HeroCollectionProps> = ({ collection }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/colecao/${collection.id}`);
  };
  
  return (
    <motion.div
      className="hero-collection"
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
    >
      <div className="hero-collection-image">
        <SafeImage src={collection.image} alt={collection.title} />
      </div>
      
      <div className="hero-collection-overlay" />
      
      <div className="hero-collection-content">
        <div className="hero-collection-top">
          <span className="hero-collection-badge">
            <span className="hero-collection-badge-dot" />
            DESTAQUE DA SEMANA
          </span>
        </div>
        
        <div className="hero-collection-bottom">
          <span className="hero-collection-tag-line">{collection.tag}</span>
          <h2 className="hero-collection-title">{collection.title}</h2>
          <p className="hero-collection-subtitle">{collection.subtitle}</p>
          
          <div className="hero-collection-footer">
            <div className="hero-collection-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">{collection.destinationIds.length}</span>
                <span className="hero-stat-label">destinos</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">4.8</span>
                <span className="hero-stat-label">avaliação</span>
              </div>
            </div>
            
            <button 
              className="hero-collection-cta"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Explorar
              <span className="hero-cta-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
