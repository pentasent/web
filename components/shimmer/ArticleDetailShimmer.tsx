"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

export const ArticleDetailShimmer = () => {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-pink-50/50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 xl:px-20 py-12 lg:py-20 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* ================= LEFT COLUMN: CONTENT ================= */}
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Breadcrumbs Shimmer */}
            <div className="flex items-center gap-2 mb-8">
              <Skeleton className="h-4 w-12 bg-pink-100/50" />
              <Skeleton className="h-4 w-4 bg-pink-100/50 rounded-full" />
              <Skeleton className="h-4 w-20 bg-pink-100/50" />
            </div>

            {/* Title Shimmer */}
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-pink-100/60 rounded-2xl" />
              <Skeleton className="h-12 w-3/4 bg-pink-100/60 rounded-2xl" />
            </div>

            {/* Meta Row Shimmer */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32 rounded-full bg-pink-100/50" />
                <Skeleton className="h-8 w-24 rounded-full bg-pink-100/50" />
                <Skeleton className="h-6 w-20 bg-pink-100/50" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full bg-pink-100/50" />
            </div>

            {/* Banner Shimmer */}
            <Skeleton className="w-full aspect-[16/9] rounded-[40px] bg-pink-100/20 shadow-sm" />

            {/* Content Blocks Shimmer */}
            <div className="space-y-6">
              <Skeleton className="h-5 w-full bg-pink-100/20" />
              <Skeleton className="h-5 w-full bg-pink-100/20" />
              <Skeleton className="h-5 w-4/5 bg-pink-100/20" />
              
              <Skeleton className="h-8 w-1/2 bg-pink-100/25 rounded-lg mt-12" />
              <Skeleton className="h-5 w-full bg-pink-100/20" />
              <Skeleton className="h-5 w-full bg-pink-100/20" />
            </div>

            {/* Author Bio Card Shimmer */}
            <div className="mt-20 p-10 rounded-[40px] bg-warm-100/50 border border-pink-100/30 flex items-center gap-8 shadow-sm">
              <Skeleton className="w-24 h-24 rounded-full bg-pink-50/50" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-40 bg-pink-50/50" />
                <Skeleton className="h-5 w-full bg-pink-50/50" />
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SIDEBAR ================= */}
          <aside className="w-full lg:w-[380px] space-y-12">
            {/* Share Shimmer */}
            <div className="bg-warm-100/50 p-8 rounded-[32px] border border-pink-100/30 space-y-6">
              <Skeleton className="h-4 w-32 bg-pink-50/50" />
              <div className="flex gap-4">
                <Skeleton className="h-11 w-11 rounded-full bg-pink-50/50" />
                <Skeleton className="h-11 w-11 rounded-full bg-pink-50/50" />
                <Skeleton className="h-11 w-11 rounded-full bg-pink-50/50" />
                <Skeleton className="h-11 w-11 rounded-full bg-pink-50/50" />
              </div>
            </div>

            {/* Related Blogs Shimmer */}
            <div className="bg-warm-100/50 p-8 rounded-[32px] border border-pink-100/30 space-y-8">
              <Skeleton className="h-4 w-32 bg-pink-50/50" />
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-2xl bg-pink-50/50" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-3 w-20 bg-pink-50/50" />
                    <Skeleton className="h-4 w-full bg-pink-50/50" />
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Shimmer */}
            <Skeleton className="h-[300px] w-full rounded-[40px] bg-pink-100/20" />
          </aside>
        </div>
      </div>
    </div>
  );
};
