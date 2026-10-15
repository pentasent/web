'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost, BlogCategory } from '@/types/blog';

interface BlogArticlesGridProps {
  articles: BlogPost[];
  selectedCategory: BlogCategory;
  onResetCategory: () => void;
}

export default function BlogArticlesGrid({
  articles,
  selectedCategory,
  onResetCategory,
}: BlogArticlesGridProps) {
  return (
    <section className="w-full bg-white border-t border-[#e8e4e1] px-4 py-12 sm:px-8 sm:py-16 md:px-10 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e8e4e1]">
          <div>
            <span className="text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#6b185f]">
              Pentasent Perspectives
            </span>
            <h2 className="mt-1 text-[26px] sm:text-[32px] font-bold text-foreground tracking-tight">
              {selectedCategory === 'All'
                ? 'More stories & perspectives'
                : `Stories in ${selectedCategory}`}
            </h2>
          </div>

          {selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={onResetCategory}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-[#5c0049] cursor-pointer"
            >
              <span>View all stories</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Empty State */}
        {articles.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen size={38} className="mx-auto text-muted-foreground/60 mb-3" />
            <h3 className="text-lg font-bold text-foreground">
              No articles currently in {selectedCategory}
            </h3>
            <p className="mt-1.5 text-sm text-primary-text max-w-md mx-auto">
              Our editorial desk publishes new perspectives regularly. Check back soon or browse all stories.
            </p>
            <button
              type="button"
              onClick={onResetCategory}
              className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Show all articles
            </button>
          </div>
        ) : (
          /* 2 Cards / Columns on Large Screen (Clean, No Box Border, No Shadow) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-10 sm:gap-y-12 mt-8">
            <AnimatePresence mode="popLayout">
              {articles.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="group flex flex-col justify-between border-b border-border-2/40 pb-6 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    {/* Header Row: Category, Date, and Read Time */}
                    <div className="flex items-center justify-between gap-2 text-[12px] sm:text-[12.5px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-[0.16em] text-[#6b185f]">
                          {post.category}
                        </span>
                        <span className="text-[#ded9d5]">·</span>
                        <span className="text-primary-text font-medium">
                          {post.date}
                        </span>
                      </div>

                      <span className="text-[12px] font-medium text-primary-text">
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title & Interactive Arrow */}
                    <div className="flex items-start justify-between gap-3 mt-1">
                      <h3 className="text-[19px] sm:text-[21px] font-bold text-foreground leading-[1.3] tracking-tight group-hover:text-primary transition-colors duration-200">
                        {post.title}
                      </h3>
                      <div className="shrink-0 pt-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-[14px] sm:text-[15px] leading-[1.65] text-primary-text line-clamp-3 mt-1">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read Story Link */}
                  <div className="mt-4 pt-2">
                    <span className="text-primary font-bold text-[13px] inline-flex items-center gap-1 group-hover:underline">
                      <span>Read story</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
