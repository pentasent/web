import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const BeatCardShimmer = () => {
    return (
        <div className="w-full text-left bg-warm-100 border border-warm-300 rounded-2xl p-4 flex items-center gap-4 relative">
            {/* Image Shimmer */}
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Title Shimmer */}
                <div className="flex items-center justify-between mb-1">
                    <Skeleton className="h-5 w-1/2 rounded-md" />
                </div>

                {/* Description Shimmer */}
                <Skeleton className="h-4 w-3/4 rounded-md mb-2" />

                <div className="flex items-center justify-between mt-auto">
                    {/* Tag Shimmer */}
                    <Skeleton className="h-5 w-16 rounded-full" />

                    {/* Plays Shimmer */}
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="w-3.5 h-3.5 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BeatTagsShimmer = () => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="flex-shrink-0 w-24 h-8 rounded-full" />
            ))}
        </div>
    );
};

export const BeatListShimmer = () => {
    return (
        <div className="space-y-4 px-4 md:px-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <BeatCardShimmer key={i} />
            ))}
        </div>
    );
};
