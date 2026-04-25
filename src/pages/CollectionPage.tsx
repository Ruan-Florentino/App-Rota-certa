import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { EXPLORE_COLLECTIONS } from '../data/exploreCollections';
import { MAP_DESTINATIONS } from '../data/mapDestinations';
import { SafeImage } from '../components/ui/SafeImage';

export const CollectionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const collection = EXPLORE_COLLECTIONS.find(c => c.id === id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!collection) {
    return (
      <div className="collection-not-found">
        <h1>Coleção não encontrada</h1>
        <button onClick={() => navigate('/explorar')}>Voltar</button>
      </div>
    );
  }
  
  // Buscar destinos reais da coleção
  const destinations = collection.destinationIds
    .map(destId => MAP_DESTINATIONS.find(d => d.id === destId))
    .filter(Boolean);
  
  return (
    <div className="collection-page">
      {/* Hero Header */}
      <div className="collection-hero">
        <div className="collection-hero-image">
          <SafeImage src={collection.image} alt={collection.title} />
        </div>
        <div className="collection-hero-overlay" />
        <div 
          className="collection-hero-color"
          style={{ background: collection.gradient, opacity: 0.3 }}
        />
        
        <button 
          className="collection-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        
        <div className="collection-hero-content">
          <span className="collection-hero-tag">{collection.tag}</span>
          <h1 className="collection-hero-title">{collection.title}</h1>
          <p className="collection-hero-subtitle">{collection.subtitle}</p>
          <div className="collection-hero-meta">
            <span>{destinations.length} destinos</span>
            <span className="collection-hero-meta-divider">•</span>
            <span>Curadoria Right Way</span>
          </div>
        </div>
      </div>
      
      {/* Destinations list */}
      <div className="collection-list">
        <div className="collection-list-header">
          <h2 className="collection-list-title">Todos os destinos</h2>
          <div className="collection-list-sort">
            <button className="sort-btn sort-btn-active">Populares</button>
            <button className="sort-btn">Preço</button>
            <button className="sort-btn">Avaliação</button>
          </div>
        </div>
        
        <div className="collection-destinations">
          {destinations.map((dest, i) => (
            <motion.button
              key={dest!.id}
              className="collection-destination-card"
              onClick={() => navigate(`/destination/${dest!.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="collection-dest-image">
                <SafeImage src={dest!.image} alt={dest!.cityName} />
                {dest!.trending && (
                  <div className="collection-dest-trending">TRENDING</div>
                )}
              </div>
              
              <div className="collection-dest-info">
                <div className="collection-dest-header">
                  <div>
                    <div className="collection-dest-country">{dest!.country}</div>
                    <h3 className="collection-dest-city">{dest!.cityName}</h3>
                  </div>
                  <div className="collection-dest-rating">
                    <span className="collection-dest-star">★</span>
                    <span>{dest!.rating}</span>
                  </div>
                </div>
                
                <p className="collection-dest-tagline">{dest!.tagline}</p>
                
                <div className="collection-dest-footer">
                  <div className="collection-dest-price">
                    <span className="collection-dest-price-label">a partir de</span>
                    <span className="collection-dest-price-value">
                      R$ {dest!.price.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <span className="collection-dest-arrow">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
