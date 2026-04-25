// src/components/errors/GenericError.tsx
import React from 'react';
import { PlaneIllustration } from './illustrations/PlaneIllustration';

export const GenericError = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <PlaneIllustration />
        <h2 className="text-xl font-bold text-white">Algo saiu da rota ✈️</h2>
        <p className="text-gray-400 text-center">{error}</p>
        <button onClick={onRetry} className="bg-[#A855F7] text-white px-6 py-2 rounded-full">Tentar de novo</button>
    </div>
);
