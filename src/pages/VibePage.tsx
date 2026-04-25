import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MAP_DESTINATIONS } from '../data/mapDestinations';
import { SafeImage } from '../components/ui/SafeImage';

interface VibeInfo {
  label: string;
  description: string;
  gradient: string;
  categories: string[];
  destinationIds: string[];
}

const VIBES_DATA: Record<string, VibeInfo> = {
  'romance': {
    label: 'Romance',
    description: 'Para momentos inesquecíveis a dois',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
    categories: ['island', 'historical'],
    destinationIds: ['maldivas', 'bora-bora', 'santorini', 'veneza', 'paris', 'bali', 'mykonos'],
  },
  'aventura': {
    label: 'Aventura',
    description: 'Para os que buscam adrenalina',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
    categories: ['adventure', 'mountain'],
    destinationIds: ['patagonia', 'queenstown', 'reykjavik', 'cappadocia', 'chapada-diamantina', 'cape-town', 'interlaken'],
  },
  'relax': {
    label: 'Relax',
    description: 'Descanso e tranquilidade pura',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
    categories: ['beach', 'island'],
    destinationIds: ['maldivas', 'bora-bora', 'bali', 'phuket', 'tulum', 'zanzibar', 'fernando-noronha'],
  },
  'festa': {
    label: 'Festa',
    description: 'Vida noturna intensa',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
    categories: ['city', 'beach'],
    destinationIds: ['las-vegas', 'miami', 'ibiza', 'mykonos', 'bangkok', 'rio', 'cancun', 'berlim'],
  },
  'cultura': {
    label: 'Cultura',
    description: 'História, arte e patrimônio',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    categories: ['historical'],
    destinationIds: ['roma', 'paris', 'kyoto', 'istanbul', 'praga', 'cusco', 'ouro-preto', 'veneza', 'cairo'],
  },
  'natureza': {
    label: 'Natureza',
    description: 'Paisagens selvagens e exuberantes',
    gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
    categories: ['adventure', 'mountain'],
    destinationIds: ['patagonia', 'chapada-diamantina', 'reykjavik', 'bariloche', 'interlaken', 'queenstown'],
  },
  'gastronomia': {
    label: 'Gastronomia',
    description: 'Sabores que viram lembrança',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    categories: ['city'],
    destinationIds: ['toquio', 'bangkok', 'roma', 'barcelona', 'lisboa', 'osaka', 'cidade-mexico', 'sao-paulo'],
  },
  'familia': {
    label: 'Família',
    description: 'Pra toda a tribo curtir junto',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    categories: ['city', 'beach'],
    destinationIds: ['cancun', 'tulum', 'miami', 'lisboa', 'toquio', 'singapura', 'florianopolis'],
  },
};

export const VibePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const vibe = id ? VIBES_DATA[id] : null;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!vibe) {
    return (
      <div className="collection-not-found">
        <h1>Vibe não encontrada</h1>
        <button onClick={() => navigate('/explorar')}>Voltar</button>
      </div>
    );
  }
  
  const destinations = vibe.destinationIds
    .map(destId => MAP_DESTINATIONS.find(d => d.id === destId))
    .filter(Boolean);
  
  return (
    <div className="collection-page">
      <div className="collection-hero collection-hero-vibe" style={{ background: vibe.gradient }}>
        <div className="collection-hero-pattern" />
        
        <button 
          className="collection-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        
        <div className="collection-hero-content collection-hero-content-center">
          <span className="collection-hero-tag collection-hero-tag-white">
            VIBE
          </span>
          <h1 className="collection-hero-title collection-hero-title-xl">{vibe.label}</h1>
          <p className="collection-hero-subtitle">{vibe.description}</p>
          <div className="collection-hero-meta">
            <span>{destinations.length} destinos selecionados</span>
          </div>
        </div>
      </div>
      
      <div className="collection-list">
        <div className="collection-list-header">
          <h2 className="collection-list-title">Perfeito pra essa vibe</h2>
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

export default VibePage;
