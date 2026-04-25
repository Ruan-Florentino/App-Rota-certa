// src/lib/prefetch.ts
export function prefetchRoute(routeName: string) {
    switch (routeName) {
        case 'profile':
            import('@/features/profile/ProfileScreen');
            break;
        case 'trips':
            import('@/features/trips/TripsScreen');
            break;
        case 'explore':
            import('@/features/explore/ExploreScreen');
            break;
        case 'community':
            import('@/features/community/CommunityScreen');
            break;
    }
}
