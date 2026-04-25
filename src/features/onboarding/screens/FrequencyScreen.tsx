import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { frequencyOptions } from '../data/onboardingData';
import { NavigationButton } from '../components/CommonComponents';

export const FrequencyScreen = () => {
    const { state, setFrequency, nextStep } = useOnboarding();
    return (
        <div className="flex flex-col h-full gap-5">
            <h2 className="text-3xl font-bold">Quantas viagens por ano?</h2>
            {frequencyOptions.map(f => (
                <button
                    key={f.id}
                    onClick={() => setFrequency(f.id)}
                    className={`p-5 rounded-xl border flex items-center gap-4 ${state.frequency === f.id ? 'border-[#A855F7] bg-[#A855F7]/10' : 'border-white/10 bg-white/5'}`}
                >
                    <div className="text-3xl">{f.icon}</div>
                    <div className="flex-1 text-left">
                        <div className="font-bold">{f.label}</div>
                        <div className="text-sm text-gray-400">{f.sub}</div>
                    </div>
                </button>
            ))}
            <NavigationButton onClick={nextStep} label="PRÓXIMO" disabled={!state.frequency} />
        </div>
    );
};
