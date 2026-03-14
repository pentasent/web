import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const MeditationCardShimmer = () => {
    return (
        <div className="w-full text-left bg-warm-100 border border-warm-300 rounded-2xl p-4 flex items-center gap-4 relative">
            {/* Image Shimmer */}
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-warm-200">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Title and Plays Shimmer */}
                <div className="flex items-center justify-between mb-1.5">
                    <Skeleton className="h-5 w-1/2 rounded-md" />
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="w-3.5 h-3.5 rounded-full" />
                        <Skeleton className="h-3 w-12 rounded-md" />
                    </div>
                </div>

                {/* Description Shimmer */}
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export const MeditationListShimmer = () => {
    return (
        <div className="space-y-4 px-4 md:px-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <MeditationCardShimmer key={i} />
            ))}
        </div>
    );
};
