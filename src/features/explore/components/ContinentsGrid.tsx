import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { SafeImage } from '../../../components/ui/SafeImage';

interface Continent {
  id: string;
  name: string;
  description: string;
  image: string;
  destinations: number;
  accentColor: string;
}

const CONTINENTS: Continent[] = [
  {
    id: 'brasil',
    name: 'Brasil',
    description: 'Do Nordeste à Amazônia',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1000&q=80',
    destinations: 28,
    accentColor: '#F59E0B',
  },
  {
    id: 'america-sul',
    name: 'América do Sul',
    description: 'Patagônia, Andes e Caribe',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&q=80',
    destinations: 18,
    accentColor: '#10B981',
  },
  {
    id: 'america-norte',
    name: 'América do Norte',
    description: 'EUA, Canadá e México',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000&q=80',
    destinations: 22,
    accentColor: '#3B82F6',
  },
  {
    id: 'europa',
    name: 'Europa',
    description: 'Clássicos imperdíveis',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=80',
    destinations: 42,
    accentColor: '#8B5CF6',
  },
  {
    id: 'asia',
    name: 'Ásia',
    description: 'Exótica e milenar',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&q=80',
    destinations: 36,
    accentColor: '#EC4899',
  },
  {
    id: 'africa',
    name: 'África',
    description: 'Safaris e desertos',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1000&q=80',
    destinations: 14,
    accentColor: '#F97316',
  },
  {
    id: 'oceania',
    name: 'Oceania',
    description: 'Paraísos do Pacífico',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1000&q=80',
    destinations: 12,
    accentColor: '#06B6D4',
  },
];

export const ContinentsGrid: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="continents-list">
      {CONTINENTS.map((continent, i) => (
        <motion.button
          key={continent.id}
          className="continent-row"
          onClick={() => navigate(`/continente/${continent.id}`)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="continent-row-image">
            <SafeImage src={continent.image} alt={continent.name} />
            <div 
              className="continent-row-gradient" 
              style={{ background: `linear-gradient(135deg, ${continent.accentColor}60 0%, transparent 70%)` }}
            />
          </div>
          
          <div className="continent-row-content">
            <div className="continent-row-text">
              <h3 className="continent-row-name">{continent.name}</h3>
              <p className="continent-row-desc">{continent.description}</p>
            </div>
            
            <div className="continent-row-footer">
              <div 
                className="continent-row-badge"
                style={{ 
                  background: `${continent.accentColor}20`, 
                  color: continent.accentColor, 
                  borderColor: `${continent.accentColor}40` 
                }}
              >
                {continent.destinations} destinos
              </div>
              <span 
                className="continent-row-arrow" 
                style={{ color: continent.accentColor }}
              >→</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
