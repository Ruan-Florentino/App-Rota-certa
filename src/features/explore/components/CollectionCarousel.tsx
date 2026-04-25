import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ExploreCollection } from '../../../data/exploreCollections';
import { SafeImage } from '../../../components/ui/SafeImage';

interface CollectionCarouselProps {
  collections: ExploreCollection[];
}

export const CollectionCarousel: React.FC<CollectionCarouselProps> = ({ collections }) => {
  const navigate = useNavigate();
  
  return (
    <div className="collection-carousel">
      {collections.map((collection, i) => (
        <motion.button
          key={collection.id}
          className="carousel-card"
          onClick={() => navigate(`/colecao/${collection.id}`)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.5 }}
          whileTap={{ scale: 0.96 }}
        >
          <div className="carousel-card-image">
            <SafeImage src={collection.image} alt={collection.title} />
            <div className="carousel-card-overlay" />
            <div 
              className="carousel-card-accent" 
              style={{ background: collection.gradient }}
            />
          </div>
          
          <div className="carousel-card-tag-wrap">
            <span className="carousel-card-tag">{collection.tag}</span>
          </div>
          
          <div className="carousel-card-content">
            <h3 className="carousel-card-title">{collection.title}</h3>
            <p className="carousel-card-subtitle">{collection.subtitle}</p>
            
            <div className="carousel-card-footer">
              <span className="carousel-card-count">
                {collection.destinationIds.length} destinos
              </span>
              <span className="carousel-card-arrow">→</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
