import React from 'react';
import { motion } from 'motion/react';
import { FlightSearch } from '../../flights/FlightSearch';
import { Trip } from '../../../types';

interface FlightsTabProps {
  currentTrip: Trip;
  renderPrice?: (amount: number) => React.ReactNode;
  openLink?: (url?: string) => void;
  getGoogleFlightsLink?: () => string;
}

export const FlightsTab: React.FC<FlightsTabProps> = ({ currentTrip }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pt-4"
    >
      <div className="w-full">
        {/* Usando o componente premium solicitado no Sprint 3 que substitui links de concorrentes */}
        <FlightSearch />
      </div>
    </motion.div>
  );
};
