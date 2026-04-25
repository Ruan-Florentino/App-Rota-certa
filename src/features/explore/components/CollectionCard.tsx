import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { SafeImage } from '../../../components/ui/SafeImage';
import { ExploreCollection } from '../../../data/exploreCollections';

interface CollectionCardProps {
  collection: ExploreCollection;
  index: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, index }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(`/colecao/${collection.id}`)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      className="collection-card group"
    >
      {/* Imagem de fundo */}
      <div className="collection-card-image">
        <SafeImage src={collection.image} alt={collection.title} />
      </div>
      
      {/* Overlay gradient escuro */}
      <div className="collection-card-overlay" />
      
      {/* Gradient colorido lateral */}
      <div 
        className="collection-card-color"
        style={{ background: collection.gradient }}
      />
      
      {/* Conteúdo */}
      <div className="collection-card-content">
        {/* Top */}
        <div className="collection-card-top">
          <span className="collection-card-tag">{collection.tag}</span>
        </div>
        
        {/* Bottom */}
        <div className="collection-card-bottom">
          <h3 className="collection-card-title">{collection.title}</h3>
          <p className="collection-card-subtitle">{collection.subtitle}</p>
          <div className="collection-card-meta">
            <span className="collection-card-count">
              {collection.destinationIds.length} destinos
            </span>
            <span className="collection-card-arrow font-display font-bold text-primary">Ver tudo →</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
