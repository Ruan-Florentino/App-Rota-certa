// src/components/errors/EmptySearch.tsx
import React from 'react';
import { SearchIllustration } from './illustrations/SearchIllustration';

export const EmptySearch = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <SearchIllustration />
        <h2 className="text-xl font-bold text-white">Nenhum resultado 🔍</h2>
        <p className="text-gray-400 text-center">Tente outros termos ou explore sugestões</p>
    </div>
);
