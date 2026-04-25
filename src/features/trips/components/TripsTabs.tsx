import React from 'react';
import { motion } from 'motion/react';
import { useTripsStore } from '../stores/tripsStore';

export const TripsTabs = () => {
    const { activeTab, setActiveTab } = useTripsStore();
    const tabs = [
        { id: 'upcoming', label: '🔥 Próximas' },
        { id: 'planned', label: '📋 Planejadas' },
        { id: 'past', label: '📸 Passadas' },
    ] as const;

    return (
        <div className="flex px-5 mt-4 border-b border-white/10">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-bold relative ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A855F7]" />
                    )}
                </button>
            ))}
        </div>
    );
};
