import React from 'react';

/**
 * ProductsListShimmer
 * Skeleton for the open, unboxed products directory and search list during data fetch.
 * Designed without box containers to match JobCard's clean open layout.
 */
export function ProductsListShimmer() {
  return (
    <div
      className="divide-y divide-[#e8e4e1]"
      aria-busy="true"
      aria-label="Loading healthcare products"
    >
      {[1, 2, 3, 4, 5].map((idx) => (
        <div key={idx} className="py-6 sm:py-7 flex items-start gap-4 sm:gap-6">
          {/* Logo / Monogram & Mobile Upvote Column Skeleton */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
            {/* Mobile Upvote Button Skeleton (Under Product Image) */}
            <div className="sm:hidden w-14 h-11 rounded-lg bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
          </div>

          {/* Details Skeleton */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Category, verification and company badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
              <span className="text-[#ded9d5]">·</span>
              <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
              <span className="text-[#ded9d5]">·</span>
              <div className="h-4 w-16 rounded bg-[#faf8f6] animate-shimmer" />
            </div>

            {/* Product Title */}
            <div className="h-6 w-3/5 max-w-md rounded bg-[#faf8f6] animate-shimmer" />

            {/* Tagline */}
            <div className="h-4 w-4/5 max-w-xl rounded bg-[#faf8f6] animate-shimmer" />

            {/* Meta specs row: rating, reviews, pricing */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
            </div>
          </div>

          {/* Desktop Upvote Button Skeleton (Large screen) */}
          <div className="hidden sm:flex shrink-0 self-center flex-col items-center justify-center sm:min-w-[58px] sm:h-16 rounded-lg bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
        </div>
      ))}
    </div>
  );
}

/**
 * ProductDetailShimmer
 * Skeleton for the full 2-column product detail page.
 */
export function ProductDetailShimmer() {
  return (
    <div className="w-full space-y-8" aria-busy="true" aria-label="Loading product details">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3.5 w-16 rounded bg-[#faf8f6] animate-shimmer" />
        <span className="text-[#ded9d5]">/</span>
        <div className="h-3.5 w-20 rounded bg-[#faf8f6] animate-shimmer" />
        <span className="text-[#ded9d5]">/</span>
        <div className="h-3.5 w-32 rounded bg-[#faf8f6] animate-shimmer" />
      </div>

      {/* Hero Header Area */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 pb-8 border-b border-[#e8e4e1]">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
            <span className="text-[#ded9d5]">·</span>
            <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
          </div>
          <div className="h-9 w-3/4 max-w-lg rounded bg-[#faf8f6] animate-shimmer" />
          <div className="h-4 w-full max-w-2xl rounded bg-[#faf8f6] animate-shimmer" />
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="h-10 w-32 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-10 w-28 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-10 w-24 rounded bg-[#faf8f6] animate-shimmer" />
          </div>
        </div>
      </div>

      {/* 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-4">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Gallery Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-64 sm:h-80 w-full rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <div className="h-6 w-36 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-4/6 rounded bg-[#faf8f6] animate-shimmer" />
          </div>

          {/* Features */}
          <div className="space-y-4 pt-4">
            <div className="h-6 w-40 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="space-y-3">
              {[1, 2, 3].map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#faf8f6] animate-shimmer shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-48 rounded bg-[#faf8f6] animate-shimmer" />
                    <div className="h-3.5 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-32 rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
          <div className="space-y-3 p-5 rounded-xl border border-[#e8e4e1]">
            <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-40 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-4 w-32 rounded bg-[#faf8f6] animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * AccountProductsListShimmer
 * Skeleton for /account/products dashboard list.
 */
export function AccountProductsListShimmer() {
  return (
    <div className="divide-y divide-[#e8e4e1]" aria-busy="true" aria-label="Loading your products">
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-72 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="flex items-center gap-3">
                <div className="h-3.5 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                <div className="h-3.5 w-24 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="h-9 w-20 rounded bg-[#faf8f6] animate-shimmer" />
            <div className="h-9 w-20 rounded bg-[#faf8f6] animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ProductCategoriesShimmer
 * Skeleton for the popular categories pills in the sidebar.
 */
export function ProductCategoriesShimmer() {
  return (
    <div className="flex flex-wrap gap-2" aria-busy="true" aria-label="Loading categories">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
        <div
          key={idx}
          className="h-8 w-24 rounded-full bg-[#faf8f6] animate-shimmer border border-[#f0ece9]"
        />
      ))}
    </div>
  );
}

