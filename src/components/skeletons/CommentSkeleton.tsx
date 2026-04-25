// src/components/skeletons/CommentSkeleton.tsx
import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const CommentSkeleton = () => (
    <div className="flex gap-2 p-3">
        <BaseSkeleton variant="circle" width={32} height={32} />
        <div className="flex-1 space-y-1">
            <BaseSkeleton variant="text" width="30%" height={12} />
            <BaseSkeleton variant="text" width="90%" height={16} />
        </div>
    </div>
);
