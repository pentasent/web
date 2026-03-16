import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const HorizontalMiniCardShimmer = () => {
  return (
    <div className="flex gap-6 items-start group flex-wrap lg:flex-nowrap w-full">
      <Skeleton className="relative lg:w-[160px] lg:h-[140px] w-full h-[200px] md:h-[320px] rounded-2xl flex-shrink-0" />
      <div className="flex flex-col justify-between h-[140px] flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-4/5 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const BlogHorizontalCardShimmer = () => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start w-full">
      <Skeleton className="relative w-full md:w-[340px] h-[170px] rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export const GridArticleCardShimmer = () => {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="relative w-full h-[180px] rounded-2xl" />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-4/5 rounded-md" />
      </div>
    </div>
  );
};

export const FeaturedArticleShimmer = () => {
  return (
    <div className="space-y-6 w-full">
      <Skeleton className="relative w-full h-[320px] rounded-3xl" />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};

export const ArticlesPageShimmer = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 space-y-16">
      {/* Featured Section Shimmer */}
      <section>
        <Skeleton className="h-8 w-60 mb-8" />
        <div className="grid lg:grid-cols-2 gap-10">
          <FeaturedArticleShimmer />
          <div className="lg:space-y-10">
            {[1, 2, 3].map((i) => (
              <HorizontalMiniCardShimmer key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Large Card Shimmer */}
      <section className="lg:py-16 py-12">
        <BlogHorizontalCardShimmer />
      </section>

      {/* Grid Section Shimmer */}
      <section className="pb-20">
        <Skeleton className="h-8 w-60 mb-10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <GridArticleCardShimmer key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};
