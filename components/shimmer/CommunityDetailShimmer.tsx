import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CommunityDetailShimmer = () => {
    return (
        <div className="flex flex-col h-full bg-warm-100 lg:rounded-2xl overflow-hidden relative overflow-y-auto w-full scrollbar-hide snap-x snap-mandatory">
            {/* Banner Shimmer */}
            <div className="h-44 sm:h-52 relative w-full bg-indigo-50/30 shrink-0">
                <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="px-4 sm:px-6 md:px-8 pt-0 pb-10 flex-1 relative bg-warm-100">
                {/* Logo & Title Block */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4 sm:gap-6 relative -top-12 sm:-top-16">
                    <div className="flex items-end gap-4 sm:gap-5 mb-3">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden bg-warm-100 border-4 border-white shadow-md shrink-0">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="pb-1 pt-12">
                            <Skeleton className="h-8 w-48 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-10 relative -top-8 sm:-top-12">
                    {/* Join Button Shimmer */}
                    <Skeleton className="w-full h-12 rounded-xl" />

                    {/* About Shimmer */}
                    <section>
                        <Skeleton className="h-4 w-20 mb-3 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                            <Skeleton className="h-4 w-4/5 rounded-md" />
                        </div>
                    </section>

                    {/* General Info Shimmer */}
                    <section>
                        <Skeleton className="h-4 w-28 mb-4 rounded-md" />
                        <div className="flex flex-col bg-warm-100 rounded-2xl px-5 border border-warm-300 divide-y divide-warm-300 shadow-sm">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between py-4">
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                    <Skeleton className="h-4 w-16 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Admins Shimmer */}
                    <section>
                        <Skeleton className="h-4 w-32 mb-4 rounded-md" />
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-warm-100 border border-warm-300 rounded-xl shadow-sm">
                                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32 rounded-md" />
                                        <Skeleton className="h-3 w-40 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Channels Shimmer */}
                    <section>
                        <Skeleton className="h-4 w-24 mb-4 rounded-md" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-warm-300 bg-warm-100">
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-32 rounded-md" />
                                            <Skeleton className="h-3 w-24 rounded-md" />
                                        </div>
                                    </div>
                                    <Skeleton className="w-16 h-8 rounded-xl ml-4" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
