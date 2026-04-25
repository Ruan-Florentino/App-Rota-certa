/**
 * DEV-ONLY component.
 * Tree-shaken from production builds via import.meta.env.DEV check.
 * NEVER ship to production users.
 */
import React from 'react';
import { useEasterEggStore } from '../../stores/easterEggsStore';
import { toast } from 'sonner';

export const DevModePanel = () => {
    // 🛡️ Guard: NUNCA renderizar em produção
    if (!import.meta.env.DEV) {
        return null;
    }

    const toggleDevMode = useEasterEggStore((s: any) => s.toggleDevMode);
    
    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-yellow-500/20 border border-yellow-500 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                    DEV ONLY
                </span>
                <span className="text-yellow-200 text-xs text-nowrap">
                    Não visível em produção
                </span>
            </div>
            
            <div className="p-4 bg-red-900/20 border border-red-500 rounded-xl space-y-2 mt-2">
                <h2 className="text-red-500 font-bold">🛠️ DEV TOOLS</h2>
                <button onClick={() => {
                    toast.info('Triggering...', {
                        description: 'Modo dev ativo',
                    });
                }} className="w-full text-left text-white p-2 text-sm">Trigger Action</button>
                <button onClick={toggleDevMode} className="w-full text-left text-red-500 p-2 text-sm font-bold">Toggle Dev Mode OFF</button>
            </div>
        </div>
    );
};
