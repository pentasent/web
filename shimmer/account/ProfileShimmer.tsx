import React from 'react';

/**
 * ProfileShimmer Component
 * High-fidelity loading skeleton replicating the 2-column Account Profile layout:
 * - Left column: Public Identity & Credentials Card skeleton
 * - Right column: Personal Information Form skeleton
 * Uses Pentasent's warm neutral .animate-shimmer effect for seamless zero-layout-shift loading.
 */
export default function ProfileShimmer() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12"
      aria-busy="true"
      aria-label="Loading profile data"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* =========================================================
            LEFT COLUMN: Public Identity & Credentials Card Skeleton
            ========================================================= */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-7 shadow-2xs">
            <div className="flex flex-col items-center text-center">
              {/* Avatar circle skeleton */}
              <div className="relative h-24 w-24 rounded-full border-2 border-[#ded9d5]/80 overflow-hidden bg-[#faf9f8]">
                <div className="h-full w-full animate-shimmer" />
              </div>

              {/* Name skeleton */}
              <div className="mt-4 h-6 w-36 rounded-md animate-shimmer" />

              {/* Headline skeleton */}
              <div className="mt-2.5 h-4 w-52 rounded-md animate-shimmer" />

              {/* Location skeleton */}
              <div className="mt-3 h-3.5 w-28 rounded-md animate-shimmer" />

              {/* Divider & Identity status skeleton */}
              <div className="mt-5 pt-4 border-t border-[#ded9d5] w-full flex items-center justify-between">
                <div className="h-3.5 w-20 rounded-md animate-shimmer" />
                <div className="h-5 w-24 rounded-full animate-shimmer" />
              </div>
            </div>

            {/* Clinical & Research Interests skeleton */}
            <div className="mt-6 pt-5 border-t border-[#ded9d5] space-y-3">
              <div className="h-3.5 w-44 rounded-md animate-shimmer" />
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <div className="h-7 w-24 rounded-md animate-shimmer" />
                <div className="h-7 w-20 rounded-md animate-shimmer" />
                <div className="h-7 w-28 rounded-md animate-shimmer" />
              </div>
            </div>

            {/* Contact Details Summary skeleton */}
            <div className="mt-6 pt-5 border-t border-[#ded9d5] space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-20 rounded-md animate-shimmer" />
                <div className="h-3.5 w-36 rounded-md animate-shimmer" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-20 rounded-md animate-shimmer" />
                <div className="h-3.5 w-28 rounded-md animate-shimmer" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-16 rounded-md animate-shimmer" />
                <div className="h-3.5 w-20 rounded-md animate-shimmer" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-24 rounded-md animate-shimmer" />
                <div className="h-3.5 w-24 rounded-md animate-shimmer" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-16 rounded-md animate-shimmer" />
                <div className="h-3.5 w-32 rounded-md animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Personal Information Form Skeleton
            ========================================================= */}
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-8 shadow-2xs min-w-0">
            {/* Header row skeleton */}
            <div className="flex items-center justify-between pb-5 border-b border-[#ded9d5] flex-wrap gap-4">
              <div className="space-y-2">
                <div className="h-6 w-44 rounded-md animate-shimmer" />
                <div className="h-4 w-72 max-w-full rounded-md animate-shimmer" />
              </div>
              {/* Edit button skeleton */}
              <div className="h-9 w-28 rounded-md border border-[#ded9d5] animate-shimmer" />
            </div>

            {/* Form Fields skeleton */}
            <div className="mt-6 space-y-5 min-w-0">
              {/* Prefix and Display Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
                <div className="sm:col-span-1 min-w-0 space-y-1.5">
                  <div className="h-3.5 w-16 rounded-md animate-shimmer" />
                  <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                </div>
                <div className="sm:col-span-2 min-w-0 space-y-1.5">
                  <div className="h-3.5 w-32 rounded-md animate-shimmer" />
                  <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                </div>
              </div>

              {/* Email Address & Mobile Number with Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
                <div className="min-w-0 space-y-1.5">
                  <div className="h-3.5 w-24 rounded-md animate-shimmer" />
                  <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <div className="h-3.5 w-28 rounded-md animate-shimmer" />
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <div className="w-[84px] sm:w-[92px] shrink-0 h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                    <div className="flex-1 h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                  </div>
                </div>
              </div>

              {/* Gender & Date of Birth Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
                <div className="min-w-0 space-y-1.5">
                  <div className="h-3.5 w-20 rounded-md animate-shimmer" />
                  <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <div className="h-3.5 w-32 rounded-md animate-shimmer" />
                  <div className="grid grid-cols-3 gap-2 min-w-0">
                    <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                    <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                    <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                  </div>
                </div>
              </div>

              {/* Professional Headline */}
              <div className="min-w-0 space-y-1.5">
                <div className="h-3.5 w-56 rounded-md animate-shimmer" />
                <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
              </div>

              {/* Location and Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
                <div className="min-w-0 space-y-1.5">
                  <div className="h-3.5 w-20 rounded-md animate-shimmer" />
                  <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <div className="h-3.5 w-28 rounded-md animate-shimmer" />
                  <div className="h-[48px] rounded-md border border-[#ded9d5] animate-shimmer" />
                </div>
              </div>

              {/* Bio & Clinical Background */}
              <div className="min-w-0 space-y-1.5">
                <div className="h-3.5 w-64 rounded-md animate-shimmer" />
                <div className="h-[110px] rounded-md border border-[#ded9d5] animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
