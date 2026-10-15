import React from 'react';

export function HealthProfileShimmer() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading health profile form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-12 rounded-lg bg-[#faf7f4] border border-[#e8e2dc] animate-shimmer" />
          <div className="h-3 w-40 rounded bg-[#eee9e5] animate-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-12 rounded-lg bg-[#faf7f4] border border-[#e8e2dc] animate-shimmer" />
          <div className="h-3 w-40 rounded bg-[#eee9e5] animate-shimmer" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-[#eee9e5] animate-shimmer" />
        <div className="h-12 rounded-lg bg-[#faf7f4] border border-[#e8e2dc] animate-shimmer" />
        <div className="h-3 w-44 rounded bg-[#eee9e5] animate-shimmer" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-48 rounded bg-[#eee9e5] animate-shimmer" />
        <div className="h-28 rounded-lg bg-[#faf7f4] border border-[#e8e2dc] animate-shimmer" />
        <div className="h-3 w-56 rounded bg-[#eee9e5] animate-shimmer" />
      </div>

      <div className="pt-3 flex justify-end">
        <div className="h-10 w-36 rounded-lg bg-[#eee9e5] animate-shimmer" />
      </div>
    </div>
  );
}
