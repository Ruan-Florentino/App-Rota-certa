import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const NewTripFAB = () => {
    const navigate = useNavigate();
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/planner')}
            className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-gradient-to-r from-[#A855F7] to-[#00E5D4] flex items-center justify-center shadow-lg shadow-[#A855F7]/30"
        >
            <Plus size={32} className="text-white" />
        </motion.button>
    );
};
