import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { COLLECTIONS, getCollectionDestinations } from '../data/collections';
import { DestinationCard } from '../components/explore/DestinationCard';

export const CollectionDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const collection = COLLECTIONS.find(c => c.id === id);
  const destinations = getCollectionDestinations(id!);
  
  if (!collection) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Coleção não encontrada</h2>
        <button 
          className="px-6 py-2 bg-primary text-[#020617] rounded-full font-bold"
          onClick={() => navigate('/explore')}
        >
          Voltar
        </button>
      </div>
    );
  }
  
  return (
    <div className="collection-detail-page pt-safe">
      {/* Hero */}
      <div className="collection-hero">
        <div className="collection-hero-image">
          <img src={collection.coverImage} alt={collection.title} />
          <div 
            className="collection-hero-gradient"
            style={{ background: collection.gradient, opacity: 0.3 }}
          />
          <div className="collection-hero-overlay" />
        </div>
        
        <button className="back-btn-float" onClick={() => navigate(-1)}>
          ←
        </button>
        
        <button className="share-btn-float">
          ↗
        </button>
        
        <motion.div 
          className="collection-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="collection-hero-kicker">
            <div className="curator-avatar">RW</div>
            <span>Curadoria Right Way</span>
          </div>
          
          <h1 className="collection-hero-title">{collection.title}</h1>
          <p className="collection-hero-subtitle">{collection.subtitle}</p>
          
          <div className="collection-hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">{destinations.length}</span>
              <span className="hero-stat-label">destinos</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">⭐ 4.8</span>
              <span className="hero-stat-label">média</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Lista de destinos */}
      <div className="collection-destinations-list">
        <h2 className="section-title">Destinos desta coleção</h2>
        
        <div className="destinations-grid line-clamp-none">
          {destinations.map((dest: any, i: number) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <DestinationCard destination={dest} variant="grid" index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
