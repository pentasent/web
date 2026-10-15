'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, ChevronRight } from 'lucide-react';
import { BlogNavTag, BlogCategory } from '@/types/blog';

interface BlogNavTabsProps {
  tags: BlogNavTag[];
  activeTag: BlogCategory;
  onSelectTag: (tag: BlogCategory) => void;
}

export default function BlogNavTabs({
  tags,
  activeTag,
  onSelectTag,
}: BlogNavTabsProps) {
  return (
    <div className="sticky top-0 z-30 w-full bg-primary shadow-sm backdrop-blur-md mt-[0.4px]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 md:px-10 lg:px-12">
        {/* Left Side: Category Tags */}
        <nav
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:gap-2 py-2"
          aria-label="Blog Category Tags"
        >
          {tags.map((tag) => {
            const isActive = activeTag === tag.value;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onSelectTag(tag.value)}
                className={`shrink-0 rounded cursor-pointer px-6 py-3 text-[13px] font-semibold transition-all sm:text-[13.5px] ${
                  isActive
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-white/80 hover:bg-border-2 hover:text-primary'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Yellow Submit Press Action Button */}
        <div className="shrink-0">
          <Link
            href="/company/press"
            className="inline-flex rounded items-center gap-1.5 bg-[#ffa91f] px-6 py-3.5 text-[13px] font-bold text-[#090909] transition-colors duration-200 hover:bg-[#f6a116] sm:text-[13.5px] cursor-pointer"
          >
            <Newspaper size={15} strokeWidth={2.2} className="shrink-0" />
            <span className="whitespace-nowrap">Submit Press</span>
            <ChevronRight size={14} strokeWidth={2.5} className="hidden sm:inline-block" />
          </Link>
        </div>
      </div>
    </div>
  );
}
