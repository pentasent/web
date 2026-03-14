import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const JournalCardShimmer = () => {
    return (
        <div className="w-full bg-warm-100 border border-warm-300 rounded-2xl p-4 flex items-center gap-4 relative">
            {/* Date Badge Shimmer */}
            <div className="flex flex-col items-center justify-center bg-warm-200 rounded-xl min-w-[60px] h-[60px] border border-warm-300 p-2 shrink-0">
                <Skeleton className="h-6 w-8 rounded-md mb-1" />
                <Skeleton className="h-3 w-10 rounded-sm" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Title and Mood Shimmer */}
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-1/3 rounded-md" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                
                {/* Content Shimmer */}
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                </div>
            </div>
            
            {/* Arrow Shimmer */}
            <div className="ml-2">
                <Skeleton className="w-4 h-4 rounded" />
            </div>
        </div>
    );
};

export const JournalListShimmer = () => {
    return (
        <div className="space-y-10 px-4 md:px-0">
            {[1, 2].map((section) => (
                <section key={section}>
                    <div className="flex items-center mb-4 border-b border-warm-300 pb-2">
                         <Skeleton className="h-4 w-32 rounded-md" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <JournalCardShimmer key={i} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
