import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Collection } from '../../data/collections';

interface Props {
  collection: Collection;
  index?: number;
  onClick?: () => void;
}

export function CollectionCard({ collection, index = 0, onClick }: Props) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if ('vibrate' in navigator) navigator.vibrate(15);
    if (onClick) {
      onClick();
    } else {
      navigate(`/collection/${collection.id}`);
    }
  };
  
  return (
    <motion.button
      className="collection-card-v2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
    >
      {/* Imagem à esquerda */}
      <div className="collection-image-v2">
        <img 
          src={collection.coverImage}
          alt={collection.title}
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            img.parentElement!.style.background = collection.gradient;
          }}
        />
        
        {/* Badge de quantidade */}
        <div className="collection-count-badge">
          {collection.destinationCount}
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="collection-content-v2">
        <h3 className="collection-title-v2">{collection.title}</h3>
        <p className="collection-subtitle-v2">{collection.subtitle}</p>
        
        <div className="collection-footer-v2">
          <div className="curator-chip">
            <div className="curator-avatar">RW</div>
            <span className="curator-name">Equipe Right Way</span>
          </div>
          
          <motion.div 
            className="collection-arrow-v2"
            whileHover={{ x: 4 }}
          >
            →
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}
