import React from 'react';

export function MetricDetailShimmer() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading metric trend details">
      {/* 4 Stats Cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="p-4 rounded-lg border border-[#e8e2dc] bg-white space-y-2">
            <div className="h-3 w-20 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-7 w-24 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-3 w-16 rounded bg-[#eee9e5] animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f3eee9] flex items-center justify-between">
          <div className="h-4 w-36 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-3 w-20 rounded bg-[#eee9e5] animate-shimmer" />
        </div>
        <div className="divide-y divide-[#f3eee9]">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="h-4 w-32 rounded bg-[#eee9e5] animate-shimmer" />
              <div className="h-4 w-24 rounded bg-[#eee9e5] animate-shimmer" />
              <div className="h-4 w-28 rounded bg-[#eee9e5] animate-shimmer" />
              <div className="h-4 w-16 rounded bg-[#eee9e5] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
