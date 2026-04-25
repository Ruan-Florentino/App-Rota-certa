// src/components/skeletons/ListItemSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const ListItemSkeleton = () => (
    <div className="flex items-center gap-3 p-3">
        <BaseSkeleton variant="circle" width={40} height={40} />
        <div className="flex-1 space-y-2">
            <BaseSkeleton variant="text" width="70%" height={16} />
            <BaseSkeleton variant="text" width="40%" height={12} />
        </div>
    </div>
);
