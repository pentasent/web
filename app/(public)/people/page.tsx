'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { PersonProfile } from '@/types/people';
import PersonCard from '@/components/people/PersonCard';

function PeopleContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All specialties');
  const [selectedLocation, setSelectedLocation] = useState<string>('All locations');
  const [selectedTier, setSelectedTier] = useState<string>('All tiers');
  const [searchQuery, setSearchQuery] = useState<string>(qParam);

  const [prevQParam, setPrevQParam] = useState(qParam);
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setSearchQuery(qParam);
  }

  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const [people, setPeople] = useState<PersonProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live people from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchPeople = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const res = await apiClient<PersonProfile[]>('/people?limit=100');
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data)) {
          setPeople(res.data);
        } else {
          setPeople([]);
        }
      } catch (err) {
        console.warn('Unable to load live people directory:', err);
        if (isMounted) setPeople([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchPeople();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically derive specialties from interests and headlines
  const specialties = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      if (p.interests && Array.isArray(p.interests)) {
        p.interests.forEach((item) => set.add(item));
      }
      if (p.specialty) set.add(p.specialty);
    });
    return ['All specialties', ...Array.from(set).sort()];
  }, [people]);

  // Dynamically derive locations
  const locations = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      if (p.location) {
        set.add(p.location);
      }
    });
    return ['All locations', ...Array.from(set).sort()];
  }, [people]);

  const tiers = ['All tiers', 'VIP Members', 'Premium Members', 'Verified'];

  // Filtered people
  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      // Specialty Filter
      if (selectedSpecialty !== 'All specialties') {
        const specLower = selectedSpecialty.toLowerCase();
        const hasInterest = person.interests?.some((i) => i.toLowerCase().includes(specLower));
        const matchesHeadline = person.headline?.toLowerCase().includes(specLower);
        const matchesProf = person.profession?.toLowerCase().includes(specLower);
        if (!hasInterest && !matchesHeadline && !matchesProf) {
          return false;
        }
      }

      // Location Filter
      if (selectedLocation !== 'All locations') {
        const locLower = selectedLocation.toLowerCase();
        const personLocLower = (person.location || '').toLowerCase();
        if (!personLocLower.includes(locLower)) return false;
      }

      // Membership Tier Filter
      if (selectedTier !== 'All tiers') {
        if (selectedTier === 'VIP Members' && !person.isVip) return false;
        if (selectedTier === 'Premium Members' && !person.isPremium) return false;
        if (selectedTier === 'Verified' && !person.isVerified && !person.isVip && !person.isPremium) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (person.displayName || '').toLowerCase().includes(q);
        const headlineMatch = (person.headline || '').toLowerCase().includes(q);
        const bioMatch = (person.bio || '').toLowerCase().includes(q);
        const locMatch = (person.location || '').toLowerCase().includes(q);
        const interestMatch = person.interests?.some((i) => i.toLowerCase().includes(q));
        const orgMatch = person.organizations?.some((o) =>
          o.name.toLowerCase().includes(q) || o.role.toLowerCase().includes(q)
        );

        if (!nameMatch && !headlineMatch && !bioMatch && !locMatch && !interestMatch && !orgMatch) {
          return false;
        }
      }

      return true;
    });
  }, [people, selectedSpecialty, selectedLocation, selectedTier, searchQuery]);

  const handleResetFilters = () => {
    setSelectedSpecialty('All specialties');
    setSelectedLocation('All locations');
    setSelectedTier('All tiers');
    setSearchQuery('');
  };

  const isFiltered =
    selectedSpecialty !== 'All specialties' ||
    selectedLocation !== 'All locations' ||
    selectedTier !== 'All tiers' ||
    searchQuery.trim() !== '';

  const hasActiveAdvancedFilters =
    selectedSpecialty !== 'All specialties' ||
    selectedLocation !== 'All locations' ||
    selectedTier !== 'All tiers';

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section - Matching /jobs and /company/press hero section */}
      <section className="relative max-w-full mx-auto isolate flex lg:max-h-[75vh] mx-h-full flex-col justify-between overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-30 md:pb-40 lg:pt-30 lg:pb-40">
        {/* Background Graphic Image (Matching /jobs) */}
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <Image
            src="/assets/images/pages/people/people_banner.png"
            alt="Pentasent People Network Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          {/* Bottom Fade Gradient for smooth transition */}
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/60 via-secondary/60 to-transparent" />
        </div>

        {/* Main Hero Content (Fade + Blur + Scale Animation matching Jobs/Press Hero) */}
        <motion.div
          initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
        >
          {/* Eyebrow */}
          <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            Healthcare Specialists &amp; Leadership Directory
          </p>

          {/* Main Headline */}
          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Healthcare <span className="text-[#ffd3f0]">Leaders &amp; Specialists</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Connect with visionary physicians, clinical researchers, healthtech founders, and medical
            executives shaping the future of global medicine.
          </p>
        </motion.div>
      </section>

      {/* Hero Search & Filter Inputs Floating Card */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto my-10 sm:-mt-23 lg:-mt-23 md:-mt-23 w-full max-w-5xl px-4 xs:px-6 overflow-visible"
      >
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-muted text-foreground text-left">
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Row 1: Search Input - Full Width */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="hero-filter-search"
                className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
              >
                Search Specialist or Domain
              </label>
              <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  id="hero-filter-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Cardiologist, Neurosurgeon, Dr. Jane, New York, Genomics..."
                  className="w-full h-full pl-3.5 pr-10 text-[14px] sm:text-[14.5px] text-foreground placeholder:text-primary-text/70 bg-transparent border-0 outline-none"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
                />
              </div>
            </div>

            {/* Mobile-Only: Advanced Filter Toggle Button */}
            <div className="sm:hidden flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                aria-expanded={showMobileFilters}
              >
                <SlidersHorizontal size={15} className="text-primary" />
                <span>{showMobileFilters ? 'Hide Advanced Filters' : 'Advanced Filters'}</span>
                {hasActiveAdvancedFilters && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary">
                    Active
                  </span>
                )}
                <motion.span
                  animate={{ rotate: showMobileFilters ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex"
                >
                  <ChevronDown size={14} className="text-primary-text" />
                </motion.span>
              </button>

              {hasActiveAdvancedFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSpecialty('All specialties');
                    setSelectedLocation('All locations');
                    setSelectedTier('All tiers');
                  }}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile-Only: Collapsible Filters */}
            <div className="sm:hidden">
              <AnimatePresence initial={false}>
                {showMobileFilters && (
                  <motion.div
                    key="mobile-people-filters"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-1 flex flex-col gap-3">
                      {/* Specialty */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile-filter-specialty"
                          className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                        >
                          Specialty / Domain
                        </label>
                        <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                          <select
                            id="mobile-filter-specialty"
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                          >
                            {specialties.map((spec) => (
                              <option key={spec} value={spec}>
                                {spec}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile-filter-loc"
                          className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                        >
                          Location
                        </label>
                        <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                          <select
                            id="mobile-filter-loc"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                          >
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                          />
                        </div>
                      </div>

                      {/* Membership Tier */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile-filter-tier"
                          className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                        >
                          Membership Tier
                        </label>
                        <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                          <select
                            id="mobile-filter-tier"
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                            className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                          >
                            {tiers.map((tier) => (
                              <option key={tier} value={tier}>
                                {tier}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop & Tablet: 3 columns in one line */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 items-end">
              {/* Specialty */}
              <div className="flex flex-col">
                <label
                  htmlFor="hero-filter-specialty"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Specialty / Domain
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="hero-filter-specialty"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col">
                <label
                  htmlFor="hero-filter-location"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Location
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="hero-filter-location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Membership Tier */}
              <div className="flex flex-col">
                <label
                  htmlFor="hero-filter-tier"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Membership Tier
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="hero-filter-tier"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {tiers.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
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
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Clean White Background */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12 bg-white">
        {/* Results Header: Directory Title on Left, Count & Reset on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#e8e4e1]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[19px] sm:text-[22px] font-bold text-foreground">
              Specialists Directory
            </h2>
            {!isLoading && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-bold text-primary">
                {filteredPeople.length}
              </span>
            )}
          </div>

          {/* Count and filter description shifted to the right matching /jobs */}
          {isLoading ? (
            <div className="h-5 w-52 rounded bg-[#eee9e5] animate-pulse" />
          ) : (
            <div className="flex flex-wrap items-center sm:justify-end gap-x-2.5 gap-y-1 sm:text-right">
              <p className="text-[13.5px] sm:text-[14.5px] text-primary-text font-normal">
                <strong className="font-bold text-foreground">
                  {filteredPeople.length} {filteredPeople.length === 1 ? 'specialist' : 'specialists'}
                </strong>{' '}
                across{' '}
                <strong className="font-bold text-foreground">
                  {selectedSpecialty.toLowerCase()}
                </strong>{' '}
                in{' '}
                <strong className="font-bold text-foreground">
                  {selectedLocation.toLowerCase()}
                </strong>
              </p>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer ml-1"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Listings Grid - 3 cards in a row on large screens */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#ebe4dc] bg-white animate-pulse flex flex-col justify-between"
              >
                <div className="p-5 sm:p-5.5 flex flex-col flex-1">
                  {/* Header Skeleton */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-15 w-15 rounded-full bg-[#eee8e2] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-5 w-32 rounded bg-[#eee8e2]" />
                        <div className="h-5 w-12 rounded-full bg-[#eee8e2]" />
                      </div>
                      <div className="h-3.5 w-44 rounded bg-[#eee8e2] mb-2" />
                      <div className="h-3 w-32 rounded bg-[#eee8e2]" />
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div className="my-3.5 border-t border-[#f0eae4]" />

                  {/* Info Rows Skeleton */}
                  <div className="flex flex-col gap-2">
                    <div className="h-3.5 w-48 rounded bg-[#eee8e2]" />
                    <div className="h-3.5 w-36 rounded bg-[#eee8e2]" />
                    <div className="flex gap-1.5 pt-1">
                      <div className="h-5 w-14 rounded-lg bg-[#eee8e2]" />
                      <div className="h-5 w-16 rounded-lg bg-[#eee8e2]" />
                      <div className="h-5 w-14 rounded-lg bg-[#eee8e2]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person, idx) => (
              <PersonCard key={person.id} person={person} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4ece7] text-[#4a003e] mb-3">
              <Users size={26} />
            </div>
            <h3 className="text-[17px] font-bold text-foreground">No specialists found</h3>
            <p className="mt-1 text-[14px] text-primary-text max-w-md mx-auto">
              No medical professionals or researchers matched your current search and filter criteria.
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PeopleFallback() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative max-w-full mx-auto isolate flex lg:max-h-[75vh] mx-h-full flex-col justify-between overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-30 md:pb-40 lg:pt-30 lg:pb-40">
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <Image
            src="/assets/images/pages/people/people_banner.png"
            alt="Pentasent People Network Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center">
          <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            Healthcare Professionals &amp; Leadership Directory
          </p>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Healthcare <span className="text-[#ffd3f0]">Leaders &amp; Innovators</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Discover verified clinicians, pioneering medical researchers, and healthtech founders advancing modern healthcare.
          </p>
        </div>
      </section>

      {/* Filter Skeleton */}
      <div className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 z-20">
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#ded9d5] shadow-xs">
          <div className="h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Cards Shimmer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl border border-[#ded9d5] bg-[#faf9f8] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <Suspense fallback={null}>
      <PeopleContent />
    </Suspense>
  );
}
