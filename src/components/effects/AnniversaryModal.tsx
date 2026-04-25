import React from 'react';
import { motion } from 'motion/react';
import { useUserStore } from '../../stores/userStore';

export const AnniversaryModal = ({ onClose }: { onClose: () => void }) => {
    const user = useUserStore(s => s.user);
    const years = user ? new Date().getFullYear() - new Date(user.joinedAt).getFullYear() : 1;
    
    return (
        <motion.div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6" onClick={onClose}>
            <div className="bg-[#0A0E1A] p-8 rounded-2xl text-center text-white">
                <h1 className="font-Fraunces text-4xl">🎉 Parabéns!</h1>
                <p>{years} ano(s) viajando conosco</p>
            </div>
        </motion.div>
    );
};
