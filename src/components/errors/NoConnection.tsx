// src/components/errors/NoConnection.tsx
import React from 'react';
import { GlobeIllustration } from './illustrations/GlobeIllustration';

export const NoConnection = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <GlobeIllustration />
        <h2 className="text-xl font-bold text-white">Ops, sem internet!</h2>
        <p className="text-gray-400 text-center">Parece que você saiu da rota. Verifique sua conexão.</p>
        <button onClick={onRetry} className="bg-[#A855F7] text-white px-6 py-2 rounded-full">Tentar novamente</button>
    </div>
);
