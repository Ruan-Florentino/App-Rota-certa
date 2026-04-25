import React from 'react';
import { motion } from 'motion/react';

export const CentenaryCelebration = ({ onClose }: { onClose: () => void }) => (
    <motion.div className="fixed inset-0 z-[300] bg-black/90 flex flex-col items-center justify-center p-6" onClick={onClose}>
        <h1 className="font-Fraunces text-7xl text-white">🎆 CENTENÁRIO</h1>
        <p className="text-gray-300">Você atingiu 100 viagens planejadas!</p>
    </motion.div>
);
