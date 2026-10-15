import React from 'react';

/**
 * EventsListShimmer
 * Skeleton for the open, unboxed events directory and search list during data fetch.
 * Designed without box containers to match ProductCard's clean open layout.
 */
export function EventsListShimmer() {
  return (
    <div
      className="divide-y divide-[#e8e4e1]"
      aria-busy="true"
      aria-label="Loading healthcare events"
    >
      {[1, 2, 3, 4, 5].map((idx) => (
        <div key={idx} className="py-6 sm:py-7 flex items-start gap-4 sm:gap-6">
          {/* Banner Thumbnail Skeleton */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />

          {/* Details Skeleton */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Badges row: type, format, pricing */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
              <span className="text-[#ded9d5]">·</span>
              <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
              <span className="text-[#ded9d5]">·</span>
              <div className="h-4 w-16 rounded bg-[#faf8f6] animate-shimmer" />
            </div>

            {/* Event Title */}
            <div className="h-6 w-3/5 max-w-md rounded bg-[#faf8f6] animate-shimmer" />

            {/* Short Description */}
            <div className="h-4 w-4/5 max-w-xl rounded bg-[#faf8f6] animate-shimmer" />

            {/* Meta row: Date, Venue/Online, Organizer */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-36 rounded bg-[#faf8f6] animate-shimmer" />
            </div>
          </div>

          {/* Action / Date pill Skeleton */}
          <div className="shrink-0 flex flex-col items-center justify-center w-20 h-14 sm:w-24 sm:h-16 rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
        </div>
      ))}
    </div>
  );
}

/**
 * EventDetailShimmer
 * Skeleton for the full 2-column event detail page.
 */
export function EventDetailShimmer() {
  return (
    <div className="w-full space-y-8 mt-16" aria-busy="true" aria-label="Loading event details">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 rounded bg-[#faf8f6] animate-shimmer" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-16 rounded bg-[#faf8f6] animate-shimmer" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-32 rounded bg-[#faf8f6] animate-shimmer" />
      </div>

      {/* Hero Skeleton */}
      <div className="space-y-4">
        <div className="h-48 sm:h-72 w-full rounded-2xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-5 w-24 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-5 w-20 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-5 w-16 rounded bg-[#faf8f6] animate-shimmer" />
        </div>
        <div className="h-8 w-2/3 rounded bg-[#faf8f6] animate-shimmer" />
        <div className="h-4 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
      </div>

      {/* Main Divider */}
      <div className="border-t border-[#e8e4e1] my-8" />

      {/* 2-Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-6 w-40 rounded bg-[#faf8f6] animate-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-4/6 rounded bg-[#faf8f6] animate-shimmer" />
          </div>
          <div className="h-32 w-full rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-48 w-full rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
          <div className="h-32 w-full rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
        </div>
      </div>
    </div>
  );
}

/**
 * AccountEventsListShimmer
 * Skeleton for user account events list tab.
 */
export function AccountEventsListShimmer() {
  return (
    <div className="divide-y divide-[#e8e4e1] bg-white rounded-xl border border-[#e8e4e1] p-4 sm:p-6">
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="py-5 flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-5 w-2/3 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-1/2 rounded bg-[#faf8f6] animate-shimmer" />
          </div>
          <div className="h-9 w-20 rounded bg-[#faf8f6] animate-shimmer shrink-0" />
        </div>
      ))}
    </div>
  );
}
