import React from 'react';
import { useUserStore } from '../../../stores/userStore';
import { motion } from 'motion/react';

export const NextTripCard = () => {
  const user = useUserStore((s) => s.user);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="h-[160px] rounded-[20px] bg-gradient-to-r from-[#A855F7] to-[#7DD3FC] flex flex-col justify-center p-6 text-white shadow-lg shadow-[#A855F7]/30"
    >
      <h2 className="text-xl font-bold font-Fraunces">Sua próxima aventura te espera</h2>
      <p className="text-sm opacity-80 mt-1">Que tal explorar {user?.dreamDestinations[0] || 'seus sonhos'}?</p>
      <button className="mt-4 w-40 py-2 rounded-full bg-white text-[#A855F7] font-bold text-sm">✨ Planejar agora</button>
    </motion.div>
  );
};
