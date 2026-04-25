// src/components/errors/NotFound.tsx
import React from 'react';
import { CompassIllustration } from './illustrations/CompassIllustration';

export const NotFound = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <CompassIllustration />
        <h2 className="text-xl font-bold text-white">Essa rota não existe 🧭</h2>
        <p className="text-gray-400 text-center">A página que você procura sumiu do mapa</p>
        <a href="/" className="bg-[#A855F7] text-white px-6 py-2 rounded-full">Voltar ao início</a>
    </div>
);
