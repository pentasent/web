import React from 'react';

/**
 * SupportAuthBarShimmer
 * Skeleton for the Account Login / User session bar in SupportStatusTracker.
 * Prevents UI flicker while authentication status is being checked.
 */
export function SupportAuthBarShimmer() {
  return (
    <div
      className="border-t border-b border-[#e8e4e1] py-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-[14px]"
      aria-busy="true"
      aria-label="Loading authentication status"
    >
      <div className="flex items-center gap-2.5">
        <div className="h-4 w-4 rounded-full bg-[#faf8f6] animate-shimmer shrink-0" />
        <div className="h-4 w-60 max-w-[65vw] rounded bg-[#faf8f6] animate-shimmer" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 rounded bg-[#faf8f6] animate-shimmer" />
      </div>
    </div>
  );
}

/**
 * SupportTicketListShimmer
 * Skeleton for user ticket cards list while loading from backend.
 * Exactly matches typography, spacing, and borders of the real ticket cards.
 */
export function SupportTicketListShimmer() {
  return (
    <div aria-busy="true" aria-label="Loading support tickets">
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="h-3.5 w-32 rounded bg-[#faf8f6] animate-shimmer mb-2" />
          <div className="h-7 w-60 rounded bg-[#faf8f6] animate-shimmer" />
        </div>
        <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
      </div>

      {/* Tickets cards skeleton */}
      <div className="divide-y divide-[#e8e4e1] border-t border-b border-[#e8e4e1]">
        {[1, 2].map((idx) => (
          <div key={idx} className="py-6 space-y-3.5">
            {/* Metadata Badges row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                <span className="text-[#ded9d5]">·</span>
                <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                <span className="text-[#ded9d5]">·</span>
                <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
                <span className="text-[#ded9d5]">·</span>
                <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
              <div className="h-4 w-36 rounded bg-[#faf8f6] animate-shimmer" />
            </div>

            {/* Subject */}
            <div className="h-6 w-3/4 max-w-xl rounded bg-[#faf8f6] animate-shimmer" />

            {/* Summary lines */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-4/5 rounded bg-[#faf8f6] animate-shimmer" />
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
 * SupportTicketSearchShimmer
 * Skeleton for ticket inquiry search result and investigation progress.
 * Displayed while retrieving ticket details from the backend.
 */
export function SupportTicketSearchShimmer() {
  return (
    <div
      className="space-y-8"
      aria-busy="true"
      aria-label="Retrieving ticket investigation status"
    >
      <div className="space-y-3.5">
        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
          <span className="text-[#ded9d5]">·</span>
          <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
          <span className="text-[#ded9d5]">·</span>
          <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
          <span className="text-[#ded9d5]">·</span>
          <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
        </div>

        {/* Large Subject Title */}
        <div className="h-8 w-3/4 max-w-2xl rounded bg-[#faf8f6] animate-shimmer" />

        {/* Summary paragraph */}
        <div className="space-y-2 max-w-3xl">
          <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
        </div>

        {/* Meta row: Category, Specialist, Last Activity */}
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="h-4 w-36 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-44 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-32 rounded bg-[#faf8f6] animate-shimmer" />
        </div>
      </div>

      <div className="border-t border-[#e8e4e1]" />

      {/* Stepper Skeleton */}
      <div>
        <div className="h-3.5 w-28 rounded bg-[#faf8f6] animate-shimmer mb-1.5" />
        <div className="h-6 w-64 rounded bg-[#faf8f6] animate-shimmer mb-6" />

        <div className="space-y-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#faf8f6] animate-shimmer shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-4 w-40 rounded bg-[#faf8f6] animate-shimmer" />
                  <div className="h-3.5 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                </div>
                <div className="h-3.5 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
