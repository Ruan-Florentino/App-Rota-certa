import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Fireworks = ({ active, onComplete }: { active: boolean, onComplete?: () => void }) => {
    const [explosions, setExplosions] = useState<number[]>([]);

    useEffect(() => {
        if (active) {
            setExplosions(Array.from({ length: 5 }, (_, i) => i));
            const timer = setTimeout(() => onComplete?.(), 4000);
            return () => clearTimeout(timer);
        }
    }, [active, onComplete]);

    return (
        <AnimatePresence>
            {active && explosions.map(exp => (
                <motion.div
                    key={exp}
                    className="fixed inset-0 z-[150] pointer-events-none"
                >
                    {Array.from({ length: 20 }).map((_, p) => (
                        <motion.div
                            key={p}
                            className="absolute w-2 h-2 rounded-full bg-yellow-400"
                            initial={{ top: '50%', left: '50%', scale: 0 }}
                            animate={{ 
                                top: Math.random() * 60 + 20 + '%', 
                                left: Math.random() * 60 + 20 + '%',
                                scale: 1 
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                        />
                    ))}
                </motion.div>
            ))}
        </AnimatePresence>
    );
};
