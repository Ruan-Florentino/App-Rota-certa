import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { HeroCollection } from '../features/explore/components/HeroCollection';
import { CollectionCarousel } from '../features/explore/components/CollectionCarousel';
import { ContinentsGrid } from '../features/explore/components/ContinentsGrid';
import { VibeChips } from '../features/explore/components/VibeChips';
import { MysteryDestination } from '../features/explore/components/MysteryDestination';
import { EXPLORE_COLLECTIONS } from '../data/exploreCollections';
import { Search } from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // Primeira coleção = hero, resto = carrossel
  const [heroCollection, ...restCollections] = EXPLORE_COLLECTIONS;
  
  return (
    <div className="explore-page">
      {/* Header */}
      <header className="explore-header">
        <div>
          <h1 className="explore-title">Explorar</h1>
          <p className="explore-subtitle">Onde você vai hoje?</p>
        </div>
        <button className="explore-search-btn" onClick={() => navigate('/explore/search')}>
          <Search className="w-5 h-5 mx-auto" />
        </button>
      </header>
      
      {/* Mystery Destination */}
      <section className="explore-section explore-section-first">
        <MysteryDestination />
      </section>
      
      {/* Hero Collection (DESTAQUE GIGANTE) */}
      <section className="explore-section">
        <HeroCollection collection={heroCollection} />
      </section>
      
      {/* Mapa interativo CTA */}
      <section className="explore-section">
        <motion.button
          className="map-cta-banner"
          onClick={() => navigate('/explorar/mapa')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="map-cta-glow" />
          <div className="map-cta-content">
            <div className="map-cta-icon">
              <Search className="w-8 h-8 text-cyan-400 opacity-60" />
            </div>
            <div className="map-cta-text">
              <div className="map-cta-title">Explorar o mundo em 3D</div>
              <div className="map-cta-desc">80+ destinos num globo interativo</div>
            </div>
            <div className="map-cta-arrow">→</div>
          </div>
        </motion.button>
      </section>
      
      {/* Coleções da equipe — SCROLL HORIZONTAL */}
      <section className="explore-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Coleções da equipe</h2>
            <p className="section-subtitle">Selecionadas a dedo pra você</p>
          </div>
          <button className="section-link" onClick={() => navigate('/explorar')}>
            Ver todas
          </button>
        </div>
        <CollectionCarousel collections={restCollections} />
      </section>
      
      {/* Por continente */}
      <section className="explore-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Por continente</h2>
            <p className="section-subtitle">Explore o planeta inteiro</p>
          </div>
        </div>
        <ContinentsGrid />
      </section>
      
      {/* Vibe de hoje */}
      <section className="explore-section explore-section-last">
        <div className="section-header">
          <div>
            <h2 className="section-title">A vibe de hoje</h2>
            <p className="section-subtitle">Como você está se sentindo?</p>
          </div>
        </div>
        <VibeChips />
      </section>
    </div>
  );
};
