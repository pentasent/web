import React from 'react';

/**
 * PressAuthBarShimmer
 * Skeleton for the Account Login / User session bar in PressStatusTracker.
 * Prevents UI flicker while authentication status is being checked.
 */
export function PressAuthBarShimmer() {
  return (
    <div
      className="border-t border-b border-[#e8e4e1] py-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-[14px]"
      aria-busy="true"
      aria-label="Loading authentication status"
    >
      <div className="flex items-center gap-2.5">
        <div className="h-4 w-4 rounded-full bg-[#faf8f6] animate-shimmer shrink-0" />
        <div className="h-4 w-64 max-w-[65vw] rounded bg-[#faf8f6] animate-shimmer" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 rounded bg-[#faf8f6] animate-shimmer" />
      </div>
    </div>
  );
}

/**
 * PressSubmissionListShimmer
 * Skeleton for user press releases portfolio list while loading from backend.
 * Matches layout, typography, and card spacing of press cards.
 */
export function PressSubmissionListShimmer() {
  return (
    <div aria-busy="true" aria-label="Loading press submissions">
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="h-3.5 w-36 rounded bg-[#faf8f6] animate-shimmer mb-2" />
          <div className="h-7 w-64 rounded bg-[#faf8f6] animate-shimmer" />
        </div>
        <div className="h-4 w-32 rounded bg-[#faf8f6] animate-shimmer" />
      </div>

      {/* Press release cards skeleton */}
      <div className="divide-y divide-[#e8e4e1] border-t border-b border-[#e8e4e1]">
        {[1, 2].map((idx) => (
          <div key={idx} className="py-6 space-y-3.5">
            {/* Metadata Badges row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                <span className="text-[#ded9d5]">·</span>
                <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
                <span className="text-[#ded9d5]">·</span>
                <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
              <div className="h-4 w-36 rounded bg-[#faf8f6] animate-shimmer" />
            </div>

            {/* Title */}
            <div className="h-6 w-4/5 max-w-xl rounded bg-[#faf8f6] animate-shimmer" />

            {/* Summary lines */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
            </div>

            {/* Footer metadata */}
            <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="h-3.5 w-40 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-3.5 w-32 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-3.5 w-28 rounded bg-[#faf8f6] animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PressSubmissionSearchShimmer
 * Skeleton for press release search result and editorial review progress.
 * Displayed while retrieving tracking details from the backend.
 */
export function PressSubmissionSearchShimmer() {
  return (
    <div
      className="space-y-8"
      aria-busy="true"
      aria-label="Retrieving press release review status"
    >
      <div className="space-y-3.5">
        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
          <span className="text-[#ded9d5]">·</span>
          <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
          <span className="text-[#ded9d5]">·</span>
          <div className="h-4 w-32 rounded bg-[#faf8f6] animate-shimmer" />
        </div>

        {/* Large Title */}
        <div className="h-8 w-3/4 max-w-2xl rounded bg-[#faf8f6] animate-shimmer" />

        {/* Summary paragraph */}
        <div className="space-y-2 max-w-3xl">
          <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
        </div>

        {/* Meta row: Category, Organization, Schedule */}
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="h-4 w-40 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-48 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-36 rounded bg-[#faf8f6] animate-shimmer" />
        </div>
      </div>

      <div className="border-t border-[#e8e4e1]" />

      {/* Stepper Skeleton */}
      <div>
        <div className="h-3.5 w-32 rounded bg-[#faf8f6] animate-shimmer mb-1.5" />
        <div className="h-6 w-72 rounded bg-[#faf8f6] animate-shimmer mb-6" />

        <div className="space-y-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#faf8f6] animate-shimmer shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-4 w-48 rounded bg-[#faf8f6] animate-shimmer" />
                  <div className="h-3.5 w-24 rounded bg-[#faf8f6] animate-shimmer" />
                </div>
                <div className="h-3.5 w-4/5 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
