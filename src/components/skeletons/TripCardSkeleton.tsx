// src/components/skeletons/TripCardSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const TripCardSkeleton = () => (
    <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5 space-y-3">
        <BaseSkeleton variant="rect" width="100%" height={160} />
        <BaseSkeleton variant="text" width="80%" height={20} />
        <BaseSkeleton variant="text" width="50%" height={16} />
        <div className="flex gap-2">
            <BaseSkeleton variant="rect" width={60} height={24} />
            <BaseSkeleton variant="rect" width={60} height={24} />
        </div>
    </div>
);
