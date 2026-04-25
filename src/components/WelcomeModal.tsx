import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../stores/userStore';

export const WelcomeModal = () => {
    const setSeen = useUserStore((s) => s.setHasSeenWelcome);
    const user = useUserStore((s) => s.user);
    
    if (!user) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-[#141928] p-8 rounded-3xl border border-white/10 w-full text-center"
                >
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user.name}!</h2>
                    <p className="text-gray-400 mb-6">Seu perfil foi criado com sucesso.</p>
                    <div className="text-left bg-white/5 p-4 rounded-xl mb-6">
                        <p>✅ {user.initialBadges.length} Badge(s) desbloqueada(s)</p>
                        <p>✅ Level {user.level} alcançado</p>
                    </div>
                    <button onClick={() => setSeen(true)} className="w-full py-4 rounded-xl bg-[#A855F7] font-bold">Explorar</button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
