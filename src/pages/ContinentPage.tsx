import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MAP_DESTINATIONS } from '../data/mapDestinations';
import { SafeImage } from '../components/ui/SafeImage';

interface ContinentInfo {
  name: string;
  description: string;
  image: string;
  accentColor: string;
  countryCodes: string[];
}

const CONTINENTS_DATA: Record<string, ContinentInfo> = {
  'brasil': {
    name: 'Brasil',
    description: 'Do Nordeste à Amazônia, descubra o gigante latino-americano',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80',
    accentColor: '#F59E0B',
    countryCodes: ['BR'],
  },
  'america-sul': {
    name: 'América do Sul',
    description: 'Patagônia, Andes e praias tropicais',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&q=80',
    accentColor: '#10B981',
    countryCodes: ['AR', 'PE', 'CL', 'CO', 'UY'],
  },
  'america-norte': {
    name: 'América do Norte',
    description: 'EUA, Canadá e México em todos os climas',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80',
    accentColor: '#3B82F6',
    countryCodes: ['US', 'CA', 'MX', 'CU'],
  },
  'europa': {
    name: 'Europa',
    description: 'História, arte e gastronomia em cada esquina',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80',
    accentColor: '#8B5CF6',
    countryCodes: ['FR', 'GB', 'IT', 'ES', 'GR', 'NL', 'DE', 'PT', 'CZ', 'AT', 'HU', 'IE', 'IS', 'DK', 'CH', 'TR', 'HR'],
  },
  'asia': {
    name: 'Ásia',
    description: 'O continente mais diverso e surpreendente',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80',
    accentColor: '#EC4899',
    countryCodes: ['JP', 'TH', 'ID', 'SG', 'MY', 'VN', 'KR', 'HK', 'CN', 'AE', 'MV', 'JO'],
  },
  'africa': {
    name: 'África',
    description: 'Berço da humanidade, terra de safáris e mistérios',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80',
    accentColor: '#F97316',
    countryCodes: ['ZA', 'MA', 'EG', 'TZ', 'ZM'],
  },
  'oceania': {
    name: 'Oceania',
    description: 'Paraísos do Pacífico e aventuras extremas',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&q=80',
    accentColor: '#06B6D4',
    countryCodes: ['AU', 'NZ', 'PF'],
  },
};

export const ContinentPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const continent = id ? CONTINENTS_DATA[id] : null;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!continent) {
    return (
      <div className="collection-not-found">
        <h1>Continente não encontrado</h1>
        <button onClick={() => navigate('/explorar')}>Voltar</button>
      </div>
    );
  }
  
  const destinations = MAP_DESTINATIONS.filter(d => 
    continent.countryCodes.includes(d.countryCode)
  );
  
  return (
    <div className="collection-page">
      <div className="collection-hero">
        <div className="collection-hero-image">
          <SafeImage src={continent.image} alt={continent.name} />
        </div>
        <div className="collection-hero-overlay" />
        <div 
          className="collection-hero-color"
          style={{ 
            background: `linear-gradient(135deg, ${continent.accentColor}80 0%, transparent 100%)`, 
            opacity: 0.5 
          }}
        />
        
        <button 
          className="collection-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        
        <div className="collection-hero-content">
          <span 
            className="collection-hero-tag"
            style={{ 
              background: `${continent.accentColor}30`, 
              borderColor: `${continent.accentColor}60`,
              color: '#fff',
            }}
          >
            CONTINENTE
          </span>
          <h1 className="collection-hero-title">{continent.name}</h1>
          <p className="collection-hero-subtitle">{continent.description}</p>
          <div className="collection-hero-meta">
            <span>{destinations.length} destinos</span>
            <span className="collection-hero-meta-divider">•</span>
            <span>{continent.countryCodes.length} países</span>
          </div>
        </div>
      </div>
      
      <div className="collection-list">
        <div className="collection-list-header">
          <h2 className="collection-list-title">Destinos em {continent.name}</h2>
        </div>
        
        <div className="collection-destinations">
          {destinations.map((dest, i) => (
            <motion.button
              key={dest.id}
              className="collection-destination-card"
              onClick={() => navigate(`/destination/${dest.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="collection-dest-image">
                <SafeImage src={dest.image} alt={dest.cityName} />
                {dest.trending && (
                  <div className="collection-dest-trending">TRENDING</div>
                )}
              </div>
              
              <div className="collection-dest-info">
                <div className="collection-dest-header">
                  <div>
                    <div className="collection-dest-country">{dest.country}</div>
                    <h3 className="collection-dest-city">{dest.cityName}</h3>
                  </div>
                  <div className="collection-dest-rating">
                    <span className="collection-dest-star">★</span>
                    <span>{dest.rating}</span>
                  </div>
                </div>
                
                <p className="collection-dest-tagline">{dest.tagline}</p>
                
                <div className="collection-dest-footer">
                  <div className="collection-dest-price">
                    <span className="collection-dest-price-label">a partir de</span>
                    <span className="collection-dest-price-value">
                      R$ {dest.price.toLocaleString('pt-BR')}
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

export default ContinentPage;
