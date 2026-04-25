import React from 'react';
import { motion } from 'motion/react';
import { Search, Settings, Plus } from 'lucide-react';
import { HeroStats } from './components/HeroStats';
import { TripsTabs } from './components/TripsTabs';
import { UpcomingTripsList } from './components/UpcomingTripsList';
import { PlannedTripsList } from './components/PlannedTripsList';
import { PastTripsList } from './components/PastTripsList';
import { useTripsStore } from './stores/tripsStore';
import { NewTripFAB } from './components/NewTripFAB';

export const TripsScreen = () => {
  const activeTab = useTripsStore((s) => s.activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-[60px] flex items-center justify-between px-5 bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-2xl font-Fraunces font-bold text-white">Minhas Viagens ✈️</h1>
        <div className="flex gap-4 text-white">
          <Search size={24} />
          <Settings size={24} />
        </div>
      </div>

      <HeroStats />
      
      <TripsTabs />

      <div className="px-5 mt-4">
        {activeTab === 'upcoming' && <UpcomingTripsList />}
        {activeTab === 'planned' && <PlannedTripsList />}
        {activeTab === 'past' && <PastTripsList />}
      </div>

      <NewTripFAB />
    </div>
  );
};
