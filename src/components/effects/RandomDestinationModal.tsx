import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CompassSpinner } from './CompassSpinner';

export const RandomDestinationModal = ({ onClose }: { onClose: () => void }) => {
    const [destination, setDestination] = useState<string | null>(null);

    return (
        <motion.div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center" onClick={onClose}>
            {!destination ? (
                <CompassSpinner onStop={setDestination} />
            ) : (
                <div className="bg-[#0A0E1A] p-8 rounded-2xl text-center text-white">
                    <h2 className="text-2xl font-bold">Destino: {destination}</h2>
                    <button className="mt-4 bg-purple-500 px-6 py-2 rounded-full" onClick={onClose}>Explorar</button>
                </div>
            )}
        </motion.div>
    );
};
