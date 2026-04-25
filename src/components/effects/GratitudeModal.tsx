import React from 'react';
import { motion } from 'motion/react';

export const GratitudeModal = ({ onClose }: { onClose: () => void }) => (
    <motion.div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6" onClick={onClose}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 text-white"
        >
            <h1 className="font-Fraunces text-4xl">Obrigado por viajar conosco 💜</h1>
            <p className="text-gray-300">Que suas próximas aventuras sejam inesquecíveis</p>
        </motion.div>
    </motion.div>
);
