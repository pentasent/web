import React from 'react';

/**
 * CommunitiesGridShimmer
 * Skeleton for the 3-column /communities listing page.
 */
export function CommunitiesGridShimmer() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading healthcare communities"
    >
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div
          key={idx}
          className="rounded-lg border border-[#ded9d5] bg-white overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Top Banner Skeleton */}
            <div className="h-38 sm:h-40 w-full animate-shimmer border-b border-[#f0ece9]" />

            {/* Avatar & Topic Row Skeleton */}
            <div className="-mt-7 px-5 flex items-end justify-between">
              <div className="w-14 h-14 rounded-lg animate-shimmer shrink-0 border-2 border-white" />
              <div className="h-5 w-24 rounded-md animate-shimmer mb-1" />
            </div>

            {/* Content Body Skeleton */}
            <div className="px-5 pt-3 pb-4 space-y-2.5">
              <div className="h-5 w-3/4 rounded animate-shimmer" />
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 w-full rounded animate-shimmer" />
                <div className="h-3.5 w-4/5 rounded animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Footer specs */}
          <div className="px-5 py-3.5 border-t border-[#f0ece9] bg-[#faf8f6]/70 flex items-center justify-between">
            <div className="h-4 w-28 rounded animate-shimmer" />
            <div className="h-4 w-20 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * CommunityDetailShimmer
 * Skeleton for the unboxed 2-column community detail page.
 */
export function CommunityDetailShimmer() {
  return (
    <div className="w-full" aria-busy="true" aria-label="Loading community details">
      {/* Breadcrumb Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 pt-6 pb-3">
        <div className="h-4 w-44 rounded animate-shimmer" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <div className="w-full h-44 sm:h-52 md:h-60 rounded-2xl animate-shimmer border border-[#e8e4e1]" />
      </div>

      {/* Community Header Skeleton */}
      <div className="bg-white pb-7 sm:pb-8 pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
          {/* Avatar and Action button row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 px-1 sm:px-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl animate-shimmer shrink-0 border-4 border-white" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-24 rounded-lg animate-shimmer shrink-0" />
              <div className="h-10 w-32 rounded-lg animate-shimmer shrink-0" />
            </div>
          </div>

          {/* Title and metadata skeleton */}
          <div className="pt-5 space-y-2.5 px-1 sm:px-2">
            <div className="h-4 w-32 rounded animate-shimmer" />
            <div className="h-8 w-72 sm:w-96 rounded animate-shimmer" />
            <div className="h-4.5 w-60 sm:w-80 rounded animate-shimmer" />
            <div className="flex items-center gap-3 pt-3 border-t border-[#f0ece9]">
              <div className="h-4 w-28 rounded animate-shimmer" />
              <div className="h-4 w-24 rounded animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navbar Skeleton (Matching AccountNavTabs exactly) */}
      <div className="sticky top-0 z-20 w-full mt-16 border-b border-[#ded9d5] bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 flex items-center gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-24 rounded-md animate-shimmer" />
          ))}
        </div>
      </div>

      {/* 2-Column Content Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-4 rounded-lg animate-shimmer border border-[#f0ece9] h-24" />

            <div className="divide-y divide-[#e8e4e1]">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="py-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full animate-shimmer" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 rounded animate-shimmer" />
                      <div className="h-3 w-20 rounded animate-shimmer" />
                    </div>
                  </div>
                  <div className="h-5 w-4/5 rounded animate-shimmer" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full rounded animate-shimmer" />
                    <div className="h-3.5 w-5/6 rounded animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <div className="h-4 w-28 rounded animate-shimmer" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded animate-shimmer" />
                <div className="h-3.5 w-4/5 rounded animate-shimmer" />
              </div>
            </div>
            <div className="pt-4 border-t border-[#e8e4e1] space-y-3">
              <div className="h-4 w-28 rounded animate-shimmer" />
              <div className="h-10 w-full rounded-lg animate-shimmer" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * AccountCommunitiesShimmer
 * Skeleton for the /account/communities list view.
 */
export function AccountCommunitiesShimmer() {
  return (
    <div className="divide-y divide-[#e8e4e1]" aria-busy="true" aria-label="Loading your communities">
      {[1, 2, 3, 4].map((idx) => (
        <div key={idx} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg animate-shimmer shrink-0 border border-[#ded9d5]" />
            <div className="min-w-0 space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-44 rounded animate-shimmer" />
                <div className="h-4 w-16 rounded animate-shimmer" />
              </div>
              <div className="h-3.5 w-72 rounded animate-shimmer" />
              <div className="h-3 w-48 rounded animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-16 rounded-lg animate-shimmer" />
            <div className="h-8 w-16 rounded-lg animate-shimmer" />
            <div className="h-8 w-8 rounded-lg animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
