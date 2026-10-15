import React from 'react';

export function HealthOverviewShimmer() {
  return (
    <div className="space-y-8 mt-12 sm:mt-18" aria-busy="true" aria-label="Loading health overview">
      {/* Baseline Bar skeleton */}
      <div className="bg-white border border-[#e8e2dc] rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="h-4 w-28 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-4 w-24 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-4 w-32 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-4 w-28 rounded bg-[#eee9e5] animate-shimmer" />
        </div>
        <div className="h-7 w-24 rounded-full bg-[#eee9e5] animate-shimmer" />
      </div>

      {/* Snapshot Header & Grid skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-44 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-3.5 w-64 rounded bg-[#eee9e5] animate-shimmer" />
          </div>
          <div className="h-4 w-28 rounded bg-[#eee9e5] animate-shimmer" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e8e2dc] rounded-lg p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#eee9e5] animate-shimmer" />
                <div className="h-5 w-16 rounded-full bg-[#eee9e5] animate-shimmer" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-[#eee9e5] animate-shimmer" />
                <div className="h-3 w-48 rounded bg-[#eee9e5] animate-shimmer" />
              </div>
              <div className="pt-3.5 border-t border-[#f3eee9] flex items-baseline gap-2">
                <div className="h-8 w-20 rounded bg-[#eee9e5] animate-shimmer" />
                <div className="h-4 w-10 rounded bg-[#eee9e5] animate-shimmer" />
              </div>
              <div className="pt-3.5 border-t border-[#f3eee9] flex items-center justify-between">
                <div className="h-7 w-16 rounded-lg bg-[#eee9e5] animate-shimmer" />
                <div className="h-4 w-16 rounded bg-[#eee9e5] animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellbeing & Emergency skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#eee9e5] animate-shimmer" />
              <div className="space-y-1">
                <div className="h-4 w-48 rounded bg-[#eee9e5] animate-shimmer" />
                <div className="h-3 w-36 rounded bg-[#eee9e5] animate-shimmer" />
              </div>
            </div>
            <div className="h-7 w-20 rounded-full bg-[#eee9e5] animate-shimmer" />
          </div>
          <div className="h-28 rounded-lg bg-[#faf8f5] border border-[#e8e2dc] animate-shimmer" />
        </div>

        <div className="bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#eee9e5] animate-shimmer" />
            <div className="space-y-1">
              <div className="h-4 w-36 rounded bg-[#eee9e5] animate-shimmer" />
              <div className="h-3 w-28 rounded bg-[#eee9e5] animate-shimmer" />
            </div>
          </div>
          <div className="h-28 rounded-lg bg-[#faf8f5] border border-[#e8e2dc] animate-shimmer" />
        </div>
      </div>

      {/* Activity skeleton */}
      <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#f3eee9] flex items-center justify-between">
          <div className="h-4 w-40 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-4 w-20 rounded-full bg-[#eee9e5] animate-shimmer" />
        </div>
        <div className="divide-y divide-[#f3eee9]">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-lg bg-[#eee9e5] animate-shimmer" />
                <div className="space-y-1">
                  <div className="h-3.5 w-48 rounded bg-[#eee9e5] animate-shimmer" />
                  <div className="h-3 w-32 rounded bg-[#eee9e5] animate-shimmer" />
                </div>
              </div>
              <div className="h-3 w-24 rounded bg-[#eee9e5] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
