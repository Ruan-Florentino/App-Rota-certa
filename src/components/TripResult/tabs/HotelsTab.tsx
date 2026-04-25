import React from 'react';
import { motion } from 'motion/react';
import { Trip } from '../../../types';
import { HotelResults } from '../../hotels/HotelResults';

interface HotelsTabProps {
  currentTrip: Trip;
  renderPrice?: (amount: number) => React.ReactNode;
  openLink?: (url?: string) => void;
  getBookingLink?: () => string;
}

export const HotelsTab: React.FC<HotelsTabProps> = ({ currentTrip }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pt-4"
    >
      <div className="w-full">
        {/* Componente premium de busca de hoteis nativa */}
        <HotelResults destination={currentTrip.destination} />
      </div>
    </motion.div>
  );
};
