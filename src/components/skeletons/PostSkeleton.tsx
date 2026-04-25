// src/components/skeletons/PostSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const PostSkeleton = () => (
    <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
            <BaseSkeleton variant="circle" width={32} height={32} />
            <BaseSkeleton variant="text" width={120} height={16} />
        </div>
        <BaseSkeleton variant="rect" width="100%" height={300} />
        <div className="flex gap-4">
            <BaseSkeleton variant="rect" width={24} height={24} />
            <BaseSkeleton variant="rect" width={24} height={24} />
            <BaseSkeleton variant="rect" width={24} height={24} />
        </div>
        <BaseSkeleton variant="text" width="60%" height={12} />
        <BaseSkeleton variant="text" width="40%" height={12} />
    </div>
);
