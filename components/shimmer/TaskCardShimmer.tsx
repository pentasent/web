import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TaskCardShimmer = () => {
    return (
        <div className="w-full bg-warm-100 border border-warm-300 rounded-2xl p-4 flex items-center gap-4 relative">
            {/* Checkbox Shimmer */}
            <div className="p-2">
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Title Shimmer */}
                <Skeleton className="h-5 w-1/3 rounded-md mb-2" />
                
                {/* Description Shimmer */}
                <Skeleton className="h-4 w-2/3 rounded-md mb-3" />
                
                {/* Meta Tags Shimmer */}
                <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-3 w-10 rounded-md" />
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                </div>
            </div>
            
            {/* Arrow Shimmer */}
            <div className="ml-2">
                <Skeleton className="w-4 h-4 rounded" />
            </div>
        </div>
    );
};

export const TaskSubtaskShimmer = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-warm-300 bg-warm-100 shadow-sm">
                    <Skeleton className="w-5 h-5 rounded-full mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3 rounded-md" />
                        <Skeleton className="h-3 w-2/3 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const TaskListShimmer = () => {
    return (
        <div className="space-y-3 px-4 md:px-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <TaskCardShimmer key={i} />
            ))}
        </div>
    );
};
