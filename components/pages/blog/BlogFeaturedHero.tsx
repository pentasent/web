'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogFeaturedHeroProps {
  featuredPost: BlogPost;
  sidePosts: BlogPost[];
}

export default function BlogFeaturedHero({
  featuredPost,
  sidePosts,
}: BlogFeaturedHeroProps) {
  return (
    <section className="w-full bg-white px-4 py-8 sm:px-8 sm:py-12 md:px-10 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          {/* =========================================================
              LEFT COLUMN: Featured Story with Large Visual Card
              ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group flex flex-col lg:col-span-7"
          >
            {/* Meta Category & Date */}
            <div className="flex items-center gap-2 text-[12.5px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="text-primary font-bold">{featuredPost.category}</span>
              <span className="text-[#ded9d5]">|</span>
              <span>{featuredPost.date}</span>
            </div>

            {/* Headline */}
            <h2 className="mt-3 text-[26px] xs:text-[30px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.12] tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary cursor-pointer">
              {featuredPost.title}
            </h2>

            {/* Large Visual Card (Matches attached screenshot style) */}
            <div className="relative mt-6 w-full aspect-4/3 overflow-hidden rounded-2xl bg-[#2f0036] shadow-md">
              <Image
                src={featuredPost.featuredImage || '/assets/images/pages/blog/featured_ai.jpg'}
                alt={featuredPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Excerpt */}
            <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.68] text-primary-text">
              {featuredPost.excerpt}
            </p>

            {/* Read Time & Action */}
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <span>{featuredPost.readTime}</span>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 group-hover:underline cursor-pointer">
                <span>Read story</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </motion.article>

          {/* =========================================================
              RIGHT COLUMN: Vertical List of Stories with Dividers
              ========================================================= */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col divide-y divide-[#e8e4e1] lg:col-span-5 pt-2 lg:pt-0"
            aria-label="Recent Stories"
          >
            {sidePosts.map((post, idx) => (
              <article
                key={post.id}
                className={`group py-5.5 transition-colors cursor-pointer ${
                  idx === 0 ? 'pt-0' : ''
                } ${idx === sidePosts.length - 1 ? 'pb-0' : ''}`}
              >
                {/* Meta Category & Date */}
                <div className="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="text-primary font-bold">{post.category}</span>
                  <span className="text-[#ded9d5]">|</span>
                  <span>{post.date}</span>
                </div>

                {/* Article Headline */}
                <h3 className="mt-2 text-[17px] sm:text-[19px] lg:text-[20px] font-bold leading-[1.28] tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>

                {/* Read time */}
                <p className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <span>{post.readTime}</span>
                  <span className="text-[#ded9d5]">·</span>
                  <span className="text-primary group-hover:underline">Read insight →</span>
                </p>
              </article>
            ))}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
