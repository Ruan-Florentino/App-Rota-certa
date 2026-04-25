import React from 'react';
import { useCommunityStore } from './stores/communityStore';
import { CommunityHeader } from './components/CommunityHeader';
import { FeedScreen } from './screens/FeedScreen';
import { ReelsScreen } from './screens/ReelsScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';

export const CommunityScreen = () => {
    const activeTab = useCommunityStore(s => s.activeTab);
    return (
        <div className="min-h-screen bg-[#020617] pb-24">
            <CommunityHeader />
            {activeTab === 'feed' && <FeedScreen />}
            {activeTab === 'reels' && <ReelsScreen />}
            {activeTab === 'discover' && <DiscoverScreen />}
            {activeTab === 'notifications' && <NotificationsScreen />}
        </div>
    );
};
