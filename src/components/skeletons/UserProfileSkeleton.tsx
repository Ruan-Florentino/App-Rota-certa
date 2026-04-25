// src/components/skeletons/UserProfileSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const UserProfileSkeleton = () => (
    <div className="space-y-4">
        <BaseSkeleton variant="rect" width="100%" height={200} />
        <div className="px-5 flex gap-4 -mt-16">
            <BaseSkeleton variant="circle" width={120} height={120} />
            <div className="mt-16 space-y-2">
                <BaseSkeleton variant="text" width={150} height={20} />
                <BaseSkeleton variant="text" width={100} height={16} />
            </div>
        </div>
        <div className="px-5 grid grid-cols-3 gap-4">
            <BaseSkeleton variant="text" width="100%" height={20} />
            <BaseSkeleton variant="text" width="100%" height={20} />
            <BaseSkeleton variant="text" width="100%" height={20} />
        </div>
    </div>
);
