import React from 'react';
import { motion } from 'motion/react';
import { useEasterEggStore } from '../../stores/easterEggsStore';

export const PartyMode = () => {
    const partyMode = useEasterEggStore(s => s.partyMode);
    if (!partyMode) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[200] pointer-events-none bg-gradient-to-tr from-purple-500 via-cyan-500 to-pink-500 opacity-20 animate-pulse"
        />
    );
};
