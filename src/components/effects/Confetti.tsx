import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Confetti = ({ active, onDone }: { active: boolean, onDone: () => void }) => {
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        if (active) {
            setParticles(Array.from({ length: 50 }, (_, i) => i));
            setTimeout(onDone, 3000);
        }
    }, [active, onDone]);

    return (
        <AnimatePresence>
            {active && particles.map(i => (
                <motion.div
                    key={i}
                    className="fixed w-2 h-2 rounded-full z-[200]"
                    style={{ 
                        left: Math.random() * 100 + '%',
                        backgroundColor: ['#A855F7', '#00E5D4', '#7DD3FC'][Math.floor(Math.random() * 3)]
                    }}
                    initial={{ top: -10, opacity: 1 }}
                    animate={{ top: '100vh', opacity: 0 }}
                    transition={{ duration: 2 + Math.random() * 2, ease: "linear" }}
                />
            ))}
        </AnimatePresence>
    );
};
