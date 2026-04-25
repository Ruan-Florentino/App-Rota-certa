// src/components/skeletons/ChartSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const ChartSkeleton = () => (
    <div className="flex gap-2 h-48 items-end">
        <BaseSkeleton variant="rect" width={30} height={100} />
        <BaseSkeleton variant="rect" width={30} height={150} />
        <BaseSkeleton variant="rect" width={30} height={80} />
        <BaseSkeleton variant="rect" width={30} height={120} />
    </div>
);
