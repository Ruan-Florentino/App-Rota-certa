import React from 'react';
import { useEasterEggStore } from '../../stores/easterEggsStore';
import { motion } from 'motion/react';

const EGGS = [
  { id: 'konami', icon: '🎮', name: 'Aventureiro', hint: 'Lembra do código clássico dos games?' },
  { id: 'logo-tap-7', icon: '🎉', name: 'Party Animal', hint: 'Dê um toque carinhoso no logo (várias vezes)' },
  { id: 'shake-inspiration', icon: '📱', name: 'Inspirado', hint: 'Sacuda as ideias' },
  { id: 'long-press-name', icon: '💜', name: 'Grato', hint: 'Segure seu próprio nome' },
  { id: 'dev-mode', icon: '🛠️', name: 'Developer', hint: 'Só devs conhecem esse' },
  { id: 'anniversary', icon: '🎂', name: 'Veterano', hint: 'Aguarde o momento certo' },
  { id: 'centenary', icon: '🏆', name: 'Centenário', hint: 'Explore, explore, explore' },
];

export const SecretsTab = () => {
    const discovered = useEasterEggStore(s => s.discovered);
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold text-white">Progresso: {discovered.length}/{EGGS.length}</h2>
            <div className="grid grid-cols-2 gap-4">
                {EGGS.map(egg => (
                    <div key={egg.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-4xl">{discovered.includes(egg.id) ? egg.icon : '❓'}</div>
                        <p className="text-white font-bold">{discovered.includes(egg.id) ? egg.name : '???'}</p>
                        {!discovered.includes(egg.id) && <p className="text-xs text-gray-400">{egg.hint}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};
