import React from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from '../hooks/useOnboarding';
import { destinationsOptions } from '../data/onboardingData';
import { NavigationButton } from '../components/CommonComponents';

export const DestinationScreen = () => {
    const { state, toggleDestination, nextStep } = useOnboarding();
    return (
        <div className="flex flex-col h-full gap-5">
            <h2 className="text-3xl font-bold">Pra onde você sonha ir?</h2>
            <div className="flex flex-wrap gap-2 flex-1 content-start">
                {destinationsOptions.map(d => (
                    <motion.button
                        key={d}
                        onClick={() => toggleDestination(d)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full border ${state.destinations.includes(d) ? 'border-[#A855F7] bg-[#A855F7]' : 'border-white/10 bg-white/5'}`}
                    >
                        {d}
                    </motion.button>
                ))}
            </div>
            <input type="text" placeholder="Outro destino? Digite aqui..." className="w-full p-4 rounded-xl bg-white/5 border border-white/10" />
            <NavigationButton onClick={nextStep} label="PRÓXIMO" disabled={state.destinations.length === 0} />
        </div>
    );
};
