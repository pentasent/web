'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  MessageSquare,
  ArrowRight,
  Lock,
  Sparkles,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { PublicCommunityDTO } from '@/types/communities';
import { apiClient } from '@/lib/api';
import CommunityCard from '@/components/communities/CommunityCard';
import PaidCommunityModal from '@/components/communities/PaidCommunityModal';
import { CommunitiesGridShimmer } from '@/shimmer/tracker/CommunityTrackerShimmer';

function CommunitiesContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';

  const [communities, setCommunities] = useState<PublicCommunityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>(qParam);

  const [prevQParam, setPrevQParam] = useState(qParam);
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setSearchQuery(qParam);
  }
  const [selectedTopic, setSelectedTopic] = useState('All topics');
  const [selectedAccess, setSelectedAccess] = useState('All access types');
  const [selectedSort, setSelectedSort] = useState('most_members');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Paid Community Modal State
  const [selectedPaidCommunity, setSelectedPaidCommunity] = useState<PublicCommunityDTO | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient<PublicCommunityDTO[]>('/communities?limit=50');
        if (isMounted && res.success && res.data) {
          setCommunities(res.data);
        }
      } catch (err) {
        console.warn('Failed to load communities:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchCommunities();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive unique topics list from live communities
  const topicOptions = useMemo(() => {
    const set = new Set<string>();
    communities.forEach((c) => {
      if (c.tags) {
        c.tags.forEach((t) => set.add(t));
      }
    });
    return ['All topics', ...Array.from(set)];
  }, [communities]);

  const accessOptions = ['All access types', 'Public Circles', 'Private / Curated'];

  const sortOptions = [
    { label: 'Most Members', value: 'most_members' },
    { label: 'Most Active Discussions', value: 'most_active' },
    { label: 'Alphabetical (A-Z)', value: 'alphabetical' },
  ];

  const hasActiveAdvancedFilters =
    selectedTopic !== 'All topics' ||
    selectedAccess !== 'All access types' ||
    selectedSort !== 'most_members';

  const isFiltered = searchQuery.trim() !== '' || hasActiveAdvancedFilters;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All topics');
    setSelectedAccess('All access types');
    setSelectedSort('most_members');
  };

  // Filter and sort communities
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const list = communities.filter((comm) => {
      // Search query
      if (q) {
        const matchesName = comm.name.toLowerCase().includes(q);
        const matchesTagline = (comm.tagline || '').toLowerCase().includes(q);
        const matchesDesc = comm.description.toLowerCase().includes(q);
        const matchesTag = comm.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      // Topic filter
      if (selectedTopic !== 'All topics' && !comm.tags?.includes(selectedTopic)) {
        return false;
      }

      // Access type filter
      if (selectedAccess === 'Public Circles' && comm.visibility !== 'public') {
        return false;
      }
      if (selectedAccess === 'Private / Curated' && comm.visibility !== 'private') {
        return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (selectedSort === 'most_members') {
        return b.memberCount - a.memberCount;
      }
      if (selectedSort === 'most_active') {
        return b.postCount - a.postCount;
      }
      if (selectedSort === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [communities, searchQuery, selectedTopic, selectedAccess, selectedSort]);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HERO SECTION (Matching /products page hero style & layout) */}
      <section className="relative w-full bg-[#180915] text-white pt-24 pb-36 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/pages/communities/community_banner.png"
            alt="Pentasent Communities Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
        >
          <div className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            {/* <Sparkles size={13} className="text-[#ffd3f0]" /> */}
            <span>Healthcare Ecosystem Circles</span>
          </div>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Discover Healthcare <span className="text-[#ffd3f0]">Communities</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Connect with clinicians, researchers, innovators, and patient advocates across specialized medical disciplines and collaborative circles.
          </p>
        </motion.div>
      </section>

      {/* FILTER SEARCH BAR (Sticky / floating over hero, matching /products page) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 overflow-visible z-20"
      >
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#ded9d5] text-foreground text-left">
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Search Input */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="community-filter-search"
                className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
              >
                Search Healthcare Communities
              </label>
              <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  id="community-filter-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Cardiology, Oncology, Neurotech, Clinical AI, Founders..."
                  className="w-full h-full pl-3.5 pr-10 text-[14px] sm:text-[14.5px] text-foreground placeholder:text-primary-text/70 bg-transparent border-0 outline-none"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
                />
              </div>
            </div>

            {/* Desktop Filters: 3 columns */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 items-end">
              {/* Topic / Discipline */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-topic"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Medical Topic
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-topic"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {topicOptions.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Access Type */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-access"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Access Type
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-access"
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {accessOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-sort"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Sort By
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-sort"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={15} className="text-primary" />
                <span>{showMobileFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
                {hasActiveAdvancedFilters && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary">
                    Active
                  </span>
                )}
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile Collapsible Dropdowns */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sm:hidden overflow-hidden pt-3 border-t border-[#f0ece9] flex flex-col gap-3"
                >
                  {/* Topic */}
                  <div className="flex flex-col">
                    <label className="text-[11.5px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                      Medical Topic
                    </label>
                    <div className="relative w-full h-10 bg-[#faf9f8] border border-[#ded9d5] rounded-lg">
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="appearance-none w-full h-full pl-3 pr-8 text-[13.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer"
                      >
                        {topicOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                      />
                    </div>
                  </div>

                  {/* Access Type */}
                  <div className="flex flex-col">
                    <label className="text-[11.5px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                      Access Type
                    </label>
                    <div className="relative w-full h-10 bg-[#faf9f8] border border-[#ded9d5] rounded-lg">
                      <select
                        value={selectedAccess}
                        onChange={(e) => setSelectedAccess(e.target.value)}
                        className="appearance-none w-full h-full pl-3 pr-8 text-[13.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer"
                      >
                        {accessOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex flex-col">
                    <label className="text-[11.5px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                      Sort By
                    </label>
                    <div className="relative w-full h-10 bg-[#faf9f8] border border-[#ded9d5] rounded-lg">
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="appearance-none w-full h-full pl-3 pr-8 text-[13.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer"
                      >
                        {sortOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <section className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 pt-10 pb-20">
        {/* Results Header with Active Filters / Reset */}
        <div className="flex items-center justify-between pb-6 border-b border-[#f0ece9]">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-44 rounded-md animate-shimmer border border-[#f0ece9]/60" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[14px] sm:text-[15px] font-bold text-foreground">
                {filtered.length} {filtered.length === 1 ? 'Community' : 'Communities'} Found
              </span>
              {isFiltered && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f4ddf0] text-primary">
                  Filtered
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/account/communities"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-primary hover:underline"
            >
              <Users size={13} />
              <span>My Circles & Creation</span>
            </Link>

            {isFiltered && !isLoading && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Clear all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Communities Grid: 3 cards per row on large screen as requested */}
        {isLoading ? (
          <div className="mt-8">
            <CommunitiesGridShimmer />
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comm, idx) => (
              <CommunityCard
                key={comm.id}
                community={comm}
                index={idx}
                onPaidClick={(c) => setSelectedPaidCommunity(c)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Users size={22} />
            </div>
            <h3 className="text-[17px] font-bold text-foreground">
              No Communities Match Your Filters
            </h3>
            <p className="mt-1 text-[14px] text-primary-text max-w-md mx-auto">
              Try adjusting your search terms, selecting &quot;All topics&quot;, or clearing the access filter.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-bold transition-all cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset all filters</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Paid Community Modal */}
      {selectedPaidCommunity && (
        <PaidCommunityModal
          isOpen={!!selectedPaidCommunity}
          onClose={() => setSelectedPaidCommunity(null)}
          communityName={selectedPaidCommunity.name}
          price={selectedPaidCommunity.price}
          currency={selectedPaidCommunity.currency}
        />
      )}
    </div>
  );
}

function CommunitiesFallback() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full bg-[#180915] text-white pt-24 pb-36 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/pages/communities/community_banner.png"
            alt="Pentasent Communities Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center relative z-10">
          <div className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            <span>Healthcare Ecosystem Circles</span>
          </div>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Discover Healthcare <span className="text-[#ffd3f0]">Communities</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Connect with clinicians, researchers, innovators, and patient advocates across specialized medical disciplines and collaborative circles.
          </p>
        </div>
      </section>

      {/* FILTER SKELETON */}
      <div className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 z-20">
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#ded9d5] shadow-xs">
          <div className="h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* SHIMMER GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 pb-24">
        <CommunitiesGridShimmer />
      </section>
    </div>
  );
}

export default function CommunitiesPage() {
  return (
    // <Suspense fallback={<CommunitiesFallback />}>
    //   <CommunitiesContent />
    // </Suspense>
    <CommunitiesContent />
  );
}
