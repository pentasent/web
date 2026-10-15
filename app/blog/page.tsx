'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BLOG_TAGS, BLOG_POSTS } from '@/data/blog';
import { BlogCategory } from '@/types/blog';
import BlogNavTabs from '@/components/pages/blog/BlogNavTabs';
import BlogFeaturedHero from '@/components/pages/blog/BlogFeaturedHero';
import BlogArticlesGrid from '@/components/pages/blog/BlogArticlesGrid';

function BlogContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>(qParam);

  const [prevQParam, setPrevQParam] = useState(qParam);
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setSearchQuery(qParam);
  }

  // Filtered posts based on selected category and optional search query
  const filteredPosts = useMemo(() => {
    let posts =
      selectedCategory === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [selectedCategory, searchQuery]);

  // Featured post: if in "All", prefer the post flagged with isFeatured; otherwise, the first filtered post
  const featuredPost = useMemo(() => {
    if (selectedCategory === 'All') {
      return BLOG_POSTS.find((p) => p.isFeatured) ?? BLOG_POSTS[0];
    }
    return filteredPosts[0] ?? BLOG_POSTS[0];
  }, [selectedCategory, filteredPosts]);

  // Side list posts (up to 5 posts displayed vertically as in the mockup screenshot)
  const sidePosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return BLOG_POSTS.filter((p) => p.id !== featuredPost?.id).slice(0, 5);
    }
    const remainingInFiltered = filteredPosts.filter((p) => p.id !== featuredPost?.id);
    if (remainingInFiltered.length > 0) {
      return remainingInFiltered.slice(0, 5);
    }
    // Fallback if category has only 1 post: show other recent insights
    return BLOG_POSTS.filter((p) => p.id !== featuredPost?.id).slice(0, 5);
  }, [selectedCategory, filteredPosts, featuredPost]);

  // Grid posts (remaining suggested articles)
  const gridPosts = useMemo(() => {
    const excludedIds = new Set([
      featuredPost?.id,
      ...sidePosts.map((p) => p.id),
    ]);

    if (selectedCategory === 'All') {
      return BLOG_POSTS.filter((p) => !excludedIds.has(p.id));
    }
    return filteredPosts.filter((p) => p.id !== featuredPost?.id);
  }, [selectedCategory, filteredPosts, featuredPost, sidePosts]);

  return (
    <main className="min-h-screen w-full bg-white pt-16">
      {/* Blog Hero Header */}
      {/* <header className="w-full bg-white px-4 pb-8 sm:px-8 sm:pb-10 md:px-10 lg:px-12 border-b border-[#f0eae5]">
        <div className="mx-auto max-w-7xl">
          <span className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-primary">
            Pentasent Newsroom & Insights
          </span>
          <h1 className="mt-2 text-[32px] xs:text-[38px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.055em] text-foreground leading-[1.05]">
            Stories & perspectives in healthcare
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] sm:text-[16.5px] leading-relaxed text-primary-text">
            Exploring the ideas, clinical innovations, product breakthroughs, and people shaping modern healthcare.
          </p>
        </div>
      </header> */}

      {/* Sticky Navigation Bar with Primary Background & Tag Filtering */}
      <BlogNavTabs
        tags={BLOG_TAGS}
        activeTag={selectedCategory}
        onSelectTag={(category) => setSelectedCategory(category)}
      />

      {/* Main Section: Featured Hero (Left Card + Right Vertical Stories List) */}
      {featuredPost && (
        <BlogFeaturedHero
          featuredPost={featuredPost}
          sidePosts={sidePosts}
        />
      )}

      {/* Suggested / Category Articles Grid */}
      <BlogArticlesGrid
        articles={gridPosts}
        selectedCategory={selectedCategory}
        onResetCategory={() => setSelectedCategory('All')}
      />
    </main>
  );
}

export default function BlogPage() {
  return (
    // <Suspense fallback={null}>
    //   <BlogContent />
    // </Suspense>
    <BlogContent />
  );
}
