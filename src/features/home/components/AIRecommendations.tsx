import React from 'react';
import { useUserStore } from '../../../stores/userStore';
import { motion } from 'motion/react';
import { getPersonalizedRecommendations } from '../../../services/aiRecommendations';

import { OptimizedImage } from '../../../components/common/OptimizedImage';

export const AIRecommendations = () => {
  const user = useUserStore((s) => s.user);
  const recommendations = getPersonalizedRecommendations(user);

  return (
    <div className="px-5">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold text-white font-Fraunces">✨ Pra você, {user?.name || 'Viajante'}</h2>
        <span className="text-sm text-[#7DD3FC]">Ver todos →</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-carousel px-4 -mx-4 pb-4">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            className="w-[280px] h-[360px] rounded-[20px] relative shrink-0 overflow-hidden snap-start"
          >
            <OptimizedImage 
              src={rec.image} 
              alt={rec.destination} 
              category="destination"
              className="w-full h-full" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <span className="bg-[#A855F7] text-white px-2 py-1 rounded text-xs w-max mb-2">{rec.matchPercentage}% MATCH</span>
                <h3 className="text-2xl font-bold font-Fraunces text-white">{rec.destination}</h3>
                <p className="text-sm text-gray-300">{rec.country}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
