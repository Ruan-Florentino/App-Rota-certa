import React from 'react';
import { useCommunityStore } from '../stores/communityStore';
import { LayoutGrid, MessageSquare, Bell, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useTapCounter } from '../../../hooks/useTapCounter';
import { triggerPartyMode } from '../../../lib/easterEggs';

export const CommunityHeader = () => {
    const { activeTab, setActiveTab } = useCommunityStore();
    const { tap, count } = useTapCounter(7, triggerPartyMode);
    const tabs = ['feed', 'reels', 'discover', 'notifications'] as const;

    return (
        <div className="sticky top-0 z-50 bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-white/5">
            <div className="h-[60px] flex items-center justify-between px-5">
                <motion.h1 
                    onClick={tap}
                    animate={count > 2 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: count > 2 ? Infinity : 0, duration: 0.8 }}
                    className="text-2xl font-Fraunces font-bold text-white cursor-pointer"
                >Right Way</motion.h1>
                <div className="flex gap-4 text-white">
                    <Plus size={24} />
                    <MessageSquare size={24} />
                    <Bell size={24} />
                </div>
            </div>
            <div className="flex px-5 pb-2 gap-2">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1 rounded-full text-xs font-bold ${activeTab === tab ? 'bg-gradient-to-r from-[#A855F7] to-[#00E5D4]' : 'bg-white/5'}`}>
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};
