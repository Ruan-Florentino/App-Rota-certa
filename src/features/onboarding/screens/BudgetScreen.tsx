import React from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from '../hooks/useOnboarding';
import { NavigationButton } from '../components/CommonComponents';

export const BudgetScreen = () => {
    const { state, setBudget, nextStep } = useOnboarding();
    return (
        <div className="flex flex-col h-full gap-5 items-center justify-center">
            <h2 className="text-3xl font-bold">Qual seu orçamento médio?</h2>
            <div className="text-5xl font-bold" style={{ fontFamily: '"Fraunces", serif' }}>R$ {state.budget}</div>
            <input 
                type="range" min="1000" max="20000" step="500" value={state.budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#A855F7]"
            />
            <NavigationButton onClick={nextStep} label="PRÓXIMO" />
        </div>
    );
};
