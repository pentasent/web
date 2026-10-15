import React from 'react';

export function MetricGridShimmer({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      aria-busy="true"
      aria-label="Loading tracking metrics"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-[#e8e2dc] rounded-lg p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#eee9e5] animate-shimmer" />
            <div className="h-5 w-16 rounded-full bg-[#eee9e5] animate-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-3 w-48 rounded bg-[#eee9e5] animate-shimmer" />
          </div>
          <div className="pt-3 border-t border-[#f3eee9] flex items-baseline gap-2">
            <div className="h-8 w-20 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-4 w-10 rounded bg-[#eee9e5] animate-shimmer" />
          </div>
          <div className="pt-3 border-t border-[#f3eee9] flex items-center justify-between">
            <div className="h-7 w-16 rounded-lg bg-[#eee9e5] animate-shimmer" />
            <div className="h-4 w-16 rounded bg-[#eee9e5] animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
