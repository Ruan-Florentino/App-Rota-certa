import React, { useEffect } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { useUserStore } from '../../../stores/userStore';
import { getPersonalizedRecommendations } from '../../../services/aiRecommendations';
import { NavigationButton } from '../components/CommonComponents';

export const ResultScreen = () => {
    const { state, finishOnboarding } = useOnboarding();
    const user = useUserStore((s) => s.user);

    useEffect(() => {
        finishOnboarding();
    }, [finishOnboarding]);

    if (!user) return null;

    const recommendations = getPersonalizedRecommendations(user);
    const match = recommendations[0];

    return (
        <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
            <h2 className="text-3xl font-bold">Encontramos seu match perfeito! ✨</h2>
            <div className="w-full bg-white/5 p-4 rounded-xl text-left border border-white/10">
                <div className="text-xl font-bold text-[#7DD3FC]">{match.destination.toUpperCase()}, {match.country.toUpperCase()}</div>
                <div className="text-sm text-gray-400">{match.matchPercentage}% com seu perfil</div>
            </div>
            <NavigationButton onClick={() => window.location.reload()} label="COMEÇAR A USAR RIGHT WAY →" />
        </div>
    );
};
