import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from '../hooks/useOnboarding';

export const LoadingScreen = () => {
    const { nextStep } = useOnboarding();
    useEffect(() => {
        const timer = setTimeout(nextStep, 5000);
        return () => clearTimeout(timer);
    }, [nextStep]);
    
    return (
        <div className="flex flex-col items-center justify-center h-full gap-5">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 border-4 border-t-[#A855F7] border-[#A855F7]/30 rounded-full" />
            <h2 className="text-2xl font-bold">Analisando seu perfil...</h2>
        </div>
    );
};
