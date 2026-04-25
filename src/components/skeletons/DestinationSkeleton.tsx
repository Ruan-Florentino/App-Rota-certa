// src/components/skeletons/DestinationSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const DestinationSkeleton = () => (
    <div className="relative overflow-hidden rounded-xl h-[380px] w-full">
        <BaseSkeleton variant="rect" width="100%" height="100%" />
        <div className="absolute bottom-4 left-4 right-4">
            <BaseSkeleton variant="text" width="60%" height={24} />
            <BaseSkeleton variant="text" width="40%" height={16} />
        </div>
    </div>
);
