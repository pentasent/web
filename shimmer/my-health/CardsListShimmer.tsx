import React from 'react';

export function CardsListShimmer({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      aria-busy="true"
      aria-label="Loading items"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-[#e8e2dc] rounded-lg p-5 space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-5 w-16 rounded-full bg-[#eee9e5] animate-shimmer" />
          </div>
          <div className="h-3.5 w-48 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="pt-3 border-t border-[#f3eee9] flex items-center justify-between">
            <div className="h-3.5 w-24 rounded bg-[#eee9e5] animate-shimmer" />
            <div className="h-6 w-14 rounded-lg bg-[#eee9e5] animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
