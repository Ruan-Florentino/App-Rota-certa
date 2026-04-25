import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Vibe {
  id: string;
  label: string;
  description: string;
  gradient: string;
  shadow: string;
}

const VIBES: Vibe[] = [
  { 
    id: 'romance', 
    label: 'Romance', 
    description: 'Destinos apaixonantes',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)', 
    shadow: 'rgba(236,72,153,.4)' 
  },
  { 
    id: 'aventura', 
    label: 'Aventura', 
    description: 'Adrenalina pura',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)', 
    shadow: 'rgba(239,68,68,.4)' 
  },
  { 
    id: 'relax', 
    label: 'Relax', 
    description: 'Descanso merecido',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)', 
    shadow: 'rgba(6,182,212,.4)' 
  },
  { 
    id: 'festa', 
    label: 'Festa', 
    description: 'Vida noturna intensa',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)', 
    shadow: 'rgba(245,158,11,.4)' 
  },
  { 
    id: 'cultura', 
    label: 'Cultura', 
    description: 'História e arte',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', 
    shadow: 'rgba(139,92,246,.4)' 
  },
  { 
    id: 'natureza', 
    label: 'Natureza', 
    description: 'Paisagens selvagens',
    gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)', 
    shadow: 'rgba(16,185,129,.4)' 
  },
  { 
    id: 'gastronomia', 
    label: 'Gastronomia', 
    description: 'Sabores do mundo',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)', 
    shadow: 'rgba(249,115,22,.4)' 
  },
  { 
    id: 'familia', 
    label: 'Família', 
    description: 'Pra toda a tribo',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', 
    shadow: 'rgba(59,130,246,.4)' 
  },
];

export const VibeChips: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="vibe-grid">
      {VIBES.map((vibe, i) => (
        <motion.button
          key={vibe.id}
          className="vibe-chip"
          onClick={() => navigate(`/vibe/${vibe.id}`)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, type: 'spring', damping: 18 }}
          whileTap={{ scale: 0.94 }}
          style={{ 
            background: vibe.gradient,
            boxShadow: `0 10px 30px ${vibe.shadow}`,
          }}
        >
          <div className="vibe-chip-glow" />
          <div className="vibe-chip-content">
            <span className="vibe-chip-label">{vibe.label}</span>
            <span className="vibe-chip-desc">{vibe.description}</span>
          </div>
          <span className="vibe-chip-arrow">→</span>
        </motion.button>
      ))}
    </div>
  );
};
