import React from 'react';
import { motion } from 'motion/react';
import { useTripsStore } from '../stores/tripsStore';
import { calculateStats } from '../utils/statsCalculator';

export const HeroStats = () => {
    const trips = useTripsStore((s) => s.trips);
    const stats = calculateStats(trips);

    const cards = [
        { label: 'países', value: stats.countriesVisited, gradient: 'from-[#A855F7] to-[#7DD3FC]' },
        { label: 'aventuras', value: stats.totalTrips, gradient: 'from-[#7DD3FC] to-[#00E5D4]' },
        { label: 'dias', value: stats.totalDaysTraveling, gradient: 'from-[#00E5D4] to-[#A855F7]' },
        { label: 'investido', value: `R$ ${stats.totalSpent}`, gradient: 'from-[#6D28D9] to-[#A855F7]' },
    ];

    return (
        <div className="flex gap-4 p-5 overflow-x-auto">
            {cards.map((c, i) => (
                <motion.div key={i} className="min-w-[140px] h-[140px] rounded-[20px] bg-white/5 p-4 flex flex-col justify-between border border-white/5">
                    <span className="text-4xl font-Fraunces font-bold text-white tracking-tighter">{c.value}</span>
                    <span className="text-xs text-gray-400 capitalize">{c.label}</span>
                </motion.div>
            ))}
        </div>
    );
};
