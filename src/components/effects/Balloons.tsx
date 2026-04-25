import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Balloons = ({ active, onComplete }: { active: boolean, onComplete?: () => void }) => {
    const [balloons, setBalloons] = useState<number[]>([]);

    useEffect(() => {
        if (active) {
            setBalloons(Array.from({ length: 30 }, (_, i) => i));
            const timer = setTimeout(() => onComplete?.(), 5000);
            return () => clearTimeout(timer);
        }
    }, [active, onComplete]);

    return (
        <AnimatePresence>
            {active && balloons.map(i => (
                <motion.div
                    key={i}
                    className="fixed bottom-0 w-8 h-10 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] z-[150]"
                    style={{ 
                        left: Math.random() * 100 + '%',
                        backgroundColor: ['#A855F7', '#00E5D4', '#7DD3FC'][Math.floor(Math.random() * 3)]
                    }}
                    initial={{ y: '100vh', opacity: 1 }}
                    animate={{ y: '-120vh', opacity: 0 }}
                    transition={{ 
                        duration: 3 + Math.random() * 2, 
                        delay: Math.random() * 2,
                        ease: "easeInOut" 
                    }}
                />
            ))}
        </AnimatePresence>
    );
};
