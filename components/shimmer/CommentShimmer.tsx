import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CommentShimmer = ({ isReply = false }: { isReply?: boolean }) => {
    return (
        <div className="flex gap-3 relative mb-4">
            {/* Avatar Shimmer */}
            <Skeleton className={`rounded-full shrink-0 ${isReply ? 'w-6 h-6' : 'w-8 h-8'} mt-1`} />
            
            <div className="flex-1">
                {/* Content Bubble Shimmer */}
                <div className="bg-warm-200/30 rounded-2xl px-4 py-3 space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
                
                {/* Actions Shimmer */}
                <div className="flex items-center gap-4 mt-2 px-3">
                    <Skeleton className="h-3 w-16 rounded-sm" />
                    <Skeleton className="h-3 w-10 rounded-sm" />
                    {!isReply && <Skeleton className="h-3 w-10 rounded-sm" />}
                </div>
            </div>
        </div>
    );
};

export const CommentListShimmer = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i}>
                    <CommentShimmer />
                    {i === 1 && (
                        <div className="pl-8 sm:pl-11 mt-2">
                            <CommentShimmer isReply={true} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
