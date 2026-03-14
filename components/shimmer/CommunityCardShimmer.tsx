import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CommunityCardShimmer = () => {
    return (
        <div className="w-full bg-warm-100 rounded-2xl overflow-hidden shadow-sm border border-warm-300">
            {/* Banner Shimmer */}
            <div className="h-32 sm:h-80 relative w-full bg-indigo-50/30">
                 <Skeleton className="w-full h-full rounded-none" />
                 
                {/* Logo Overlapping Banner */}
                <div className="absolute -bottom-6 left-4 sm:left-6 p-1 bg-warm-100 rounded-2xl shadow-sm">
                    <Skeleton className="w-14 h-14 rounded-xl" />
                </div>
            </div>

            <div className="pt-10 px-4 sm:px-6 pb-5">
                {/* Title */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <Skeleton className="h-7 w-2/3 rounded-lg" />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-5">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-warm-300/50" />
                    <div className="flex items-center gap-1.5 ml-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CommunityListShimmer = () => {
    return (
        <div className="space-y-10">
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="w-5 h-5 rounded-md" />
                    <Skeleton className="h-6 w-40 rounded-md" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <CommunityCardShimmer key={i} />
                    ))}
                </div>
            </section>
        </div>
    );
};
