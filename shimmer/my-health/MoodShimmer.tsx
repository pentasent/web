import React from 'react';

export function MoodShimmer() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading mood and wellbeing data">
      <div className="bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-44 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-9 w-32 rounded-lg bg-[#eee9e5] animate-shimmer" />
        </div>
        <div className="h-32 rounded-lg bg-[#faf7f4] border border-[#e8e2dc]/70 animate-shimmer" />
      </div>

      <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f3eee9] flex items-center justify-between">
          <div className="h-4 w-36 rounded bg-[#eee9e5] animate-shimmer" />
          <div className="h-3 w-20 rounded bg-[#eee9e5] animate-shimmer" />
        </div>
        <div className="divide-y divide-[#f3eee9]">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="p-6 space-y-2">
              <div className="h-4 w-36 rounded bg-[#eee9e5] animate-shimmer" />
              <div className="h-3.5 w-64 rounded bg-[#eee9e5] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
