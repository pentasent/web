import React from 'react';

/**
 * AccountCardShimmer Component
 * High-fidelity loading skeleton for the user card inside AccountDrawer.
 * Matches exact dimensions, borders, and warm neutral shimmer animation.
 */
export default function AccountCardShimmer() {
  return (
    <div
      className="rounded-xl border border-[#e8dfd8] bg-white p-4 shadow-xs"
      aria-busy="true"
      aria-label="Loading account details"
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar skeleton */}
        <div className="relative h-12 w-12 shrink-0 rounded-full border border-[#ded9d5] overflow-hidden bg-[#faf8f6]">
          <div className="h-full w-full animate-shimmer" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name & Badge */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 rounded-md animate-shimmer" />
            <div className="h-4 w-14 rounded-md animate-shimmer" />
          </div>

          {/* Account Flag / Role Pill */}
          <div className="h-4 w-24 rounded-full animate-shimmer" />

          {/* Blurred Email Line */}
          <div className="h-3 w-36 rounded-md animate-shimmer" />
        </div>
      </div>

      {/* Quick Links Skeleton */}
      <div className="mt-3 pt-2.5 border-t border-[#f3eee9] grid grid-cols-2 gap-1.5">
        <div className="h-7 rounded-md animate-shimmer" />
        <div className="h-7 rounded-md animate-shimmer" />
      </div>

      {/* Footer Status & Action Skeleton */}
      <div className="mt-2.5 pt-2 border-t border-[#f3eee9] flex items-center justify-between">
        <div className="h-3 w-20 rounded animate-shimmer" />
        <div className="h-3 w-14 rounded animate-shimmer" />
      </div>
    </div>
  );
}
