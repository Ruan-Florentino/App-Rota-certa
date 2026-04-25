import React, { useState } from 'react';
import { motion } from 'motion/react';

export const CompassSpinner = ({ onStop }: { onStop: (dir: string) => void }) => {
    const [rotating, setRotating] = useState(true);

    return (
        <motion.div
            className="w-[280px] h-[280px] rounded-full border-4 border-purple-500 flex items-center justify-center"
            animate={{ rotate: rotating ? 3600 : 0 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            onAnimationComplete={() => {
                setRotating(false);
                onStop('North');
            }}
        >
            <motion.div className="w-1 h-32 bg-purple-500" />
        </motion.div>
    );
};
