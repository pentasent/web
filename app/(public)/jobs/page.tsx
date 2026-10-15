'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Briefcase,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Building2,
  PlusCircle,
  FileCheck2,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { JobOpening } from '@/types/jobs';
import { apiClient } from '@/lib/api';
import { JobsListShimmer } from '@/shimmer/tracker';
import JobCard from '@/components/jobs/JobCard';

function JobsContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';

  const [selectedDepartment, setSelectedDepartment] = useState<string>('All departments');
  const [selectedLocation, setSelectedLocation] = useState<string>('All locations');
  const [selectedLocationType, setSelectedLocationType] = useState<string>('All modes');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('All types');
  const [searchQuery, setSearchQuery] = useState<string>(qParam);

  const [prevQParam, setPrevQParam] = useState(qParam);
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setSearchQuery(qParam);
  }

  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all live jobs from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchAllJobs = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const res = await apiClient<JobOpening[]>('/jobs?limit=100');
        if (!isMounted) return;
        if (res.success && res.data) {
          // Sort latest first
          const sorted = [...res.data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          setJobs(sorted);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.warn('Unable to load global jobs:', err);
        if (isMounted) setJobs([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchAllJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter options derived from live jobs
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return ['All departments', ...Array.from(set)];
  }, [jobs]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.location) set.add(j.location);
    });
    return ['All locations', ...Array.from(set)];
  }, [jobs]);

  const locationTypes = ['All modes', 'Remote', 'Hybrid', 'On-site'];
  const employmentTypes = ['All types', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (
        selectedDepartment !== 'All departments' &&
        job.department.toLowerCase() !== selectedDepartment.toLowerCase()
      ) {
        return false;
      }

      if (selectedLocation !== 'All locations') {
        const locLower = selectedLocation.toLowerCase();
        const jobLocLower = job.location.toLowerCase();
        if (!jobLocLower.includes(locLower)) return false;
      }

      if (
        selectedLocationType !== 'All modes' &&
        job.locationType.toLowerCase() !== selectedLocationType.toLowerCase()
      ) {
        return false;
      }

      if (
        selectedEmploymentType !== 'All types' &&
        job.employmentType.toLowerCase() !== selectedEmploymentType.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = job.title.toLowerCase().includes(q);
        const deptMatch = job.department.toLowerCase().includes(q);
        const empMatch = (job.employerName || '').toLowerCase().includes(q);
        const summaryMatch = (job.summary || '').toLowerCase().includes(q);
        if (!titleMatch && !deptMatch && !empMatch && !summaryMatch) return false;
      }

      return true;
    });
  }, [
    jobs,
    selectedDepartment,
    selectedLocation,
    selectedLocationType,
    selectedEmploymentType,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedDepartment('All departments');
    setSelectedLocation('All locations');
    setSelectedLocationType('All modes');
    setSelectedEmploymentType('All types');
    setSearchQuery('');
  };

  const isFiltered =
    selectedDepartment !== 'All departments' ||
    selectedLocation !== 'All locations' ||
    selectedLocationType !== 'All modes' ||
    selectedEmploymentType !== 'All types' ||
    searchQuery.trim() !== '';

  const hasActiveAdvancedFilters =
    selectedDepartment !== 'All departments' ||
    selectedLocationType !== 'All modes' ||
    selectedEmploymentType !== 'All types';

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section - Matching /company/press hero section */}
      <section className="relative max-w-full mx-auto isolate flex lg:max-h-[75vh] mx-h-full flex-col justify-between overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-30 md:pb-40 lg:pt-30 lg:pb-40">
        {/* Background Graphic Image (Light subtle view matching /company/press) */}
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <Image
            src="/assets/images/pages/jobs/job_circle_bubble_banner.png"
            alt="Pentasent Careers Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          {/* Bottom Fade Gradient for smooth transition */}
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/60 via-secondary/60 to-transparent" />
        </div>

        {/* Main Hero Content (Fade + Blur + Scale Animation matching Press Hero) */}
        <motion.div
          initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
        >
          {/* Careers Eyebrow */}
          <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            Healthcare Careers Network
          </p>

          {/* Main Headline */}
          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Healthcare <span className="text-[#ffd3f0]">Careers &amp; Positions</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Discover clinical AI, medical practice, digital health, and healthtech leadership
            openings across leading hospitals, clinics, and health enterprises.
          </p>
        </motion.div>
      </section>

        {/* Hero Search & Filter Inputs Card */}
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
                  Search Role or Employer
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <input
                    id="hero-filter-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. AI Engineer, Cardiologist, Pentasent..."
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
                      setSelectedDepartment('All departments');
                      setSelectedLocationType('All modes');
                      setSelectedEmploymentType('All types');
                    }}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Mobile-Only: Collapsible 3 Filters with smooth slide down / slide up */}
              <div className="sm:hidden">
                <AnimatePresence initial={false}>
                  {showMobileFilters && (
                    <motion.div
                      key="mobile-advanced-filters"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 flex flex-col gap-3">
                        {/* Department */}
                        <div className="flex flex-col">
                          <label
                            htmlFor="mobile-filter-dept"
                            className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                          >
                            Department
                          </label>
                          <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                            <select
                              id="mobile-filter-dept"
                              value={selectedDepartment}
                              onChange={(e) => setSelectedDepartment(e.target.value)}
                              className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                            >
                              {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                            />
                          </div>
                        </div>

                        {/* Work Mode */}
                        <div className="flex flex-col">
                          <label
                            htmlFor="mobile-filter-mode"
                            className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                          >
                            Work Mode
                          </label>
                          <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                            <select
                              id="mobile-filter-mode"
                              value={selectedLocationType}
                              onChange={(e) => setSelectedLocationType(e.target.value)}
                              className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                            >
                              {locationTypes.map((mode) => (
                                <option key={mode} value={mode}>
                                  {mode}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                            />
                          </div>
                        </div>

                        {/* Employment */}
                        <div className="flex flex-col">
                          <label
                            htmlFor="mobile-filter-type"
                            className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                          >
                            Employment
                          </label>
                          <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                            <select
                              id="mobile-filter-type"
                              value={selectedEmploymentType}
                              onChange={(e) => setSelectedEmploymentType(e.target.value)}
                              className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                            >
                              {employmentTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
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

              {/* Desktop & Tablet: Rest screen visible direct (3 columns in one line) */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 items-end">
                {/* Department */}
                <div className="flex flex-col">
                  <label
                    htmlFor="hero-filter-dept"
                    className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                  >
                    Department
                  </label>
                  <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                    <select
                      id="hero-filter-dept"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                    />
                  </div>
                </div>

                {/* Work Mode */}
                <div className="flex flex-col">
                  <label
                    htmlFor="hero-filter-mode"
                    className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                  >
                    Work Mode
                  </label>
                  <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                    <select
                      id="hero-filter-mode"
                      value={selectedLocationType}
                      onChange={(e) => setSelectedLocationType(e.target.value)}
                      className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                    >
                      {locationTypes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                    />
                  </div>
                </div>

                {/* Employment */}
                <div className="flex flex-col">
                  <label
                    htmlFor="hero-filter-type"
                    className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                  >
                    Employment
                  </label>
                  <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                    <select
                      id="hero-filter-type"
                      value={selectedEmploymentType}
                      onChange={(e) => setSelectedEmploymentType(e.target.value)}
                      className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                    >
                      {employmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
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

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12">
        {/* 2-Column Layout On Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Job Listings - Completely Unboxed Direct Divide-y */}
          <div className="lg:col-span-8 min-w-0">
            {/* Header row at top of Job Listings: Open Positions & Right-aligned count summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-5 border-b border-[#e8e4e1]">
              <div className="flex items-center gap-2">
                <h2 className="text-[19px] sm:text-[21px] font-bold text-foreground">
                  Open Positions
                </h2>
                {!isLoading && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-bold text-primary">
                    {filteredJobs.length}
                  </span>
                )}
              </div>

              {/* Positions count shifted to the right of the job cards section */}
              {isLoading ? (
                <div className="h-5 w-52 rounded bg-[#eee9e5] animate-shimmer" />
              ) : (
                <div className="flex flex-wrap items-center sm:justify-end gap-x-2.5 gap-y-1 sm:text-right">
                  <p className="text-[13.5px] sm:text-[14.5px] text-primary-text font-normal">
                    <strong className="font-bold text-foreground">
                      {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
                    </strong>{' '}
                    across{' '}
                    <strong className="font-bold text-foreground">
                      {selectedDepartment.toLowerCase()}
                    </strong>{' '}
                    in{' '}
                    <strong className="font-bold text-foreground">
                      {selectedLocationType.toLowerCase()}
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

            {isLoading ? (
              <JobsListShimmer />
            ) : (
              <AnimatePresence mode="wait">
                {filteredJobs.length > 0 ? (
                  <motion.div
                    key="global-jobs-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-[#e8e4e1]"
                  >
                    {filteredJobs.map((job: JobOpening, index: number) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        basePath="/jobs"
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  /* Empty State - Direct & Unboxed */
                  <motion.div
                    key="global-empty-state"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="py-12 sm:py-16 text-center max-w-md mx-auto"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-3.5">
                      <Briefcase size={22} />
                    </div>
                    <h3 className="text-[20px] font-bold text-foreground">
                      No matching roles found
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-primary-text">
                      Try clearing filters, selecting a different work mode, or searching with
                      broader healthcare terms.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[13.5px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Reset all filters</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Simple, Unboxed with Dividers) */}
          <div className="lg:col-span-4 divide-y divide-[#e8e4e1]">
            {/* Pentasent Careers Section */}
            <div className="pb-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#f4ddf0] text-primary">
                  <Sparkles size={11} />
                  Pentasent Hiring
                </span>
              </div>
              <h3 className="text-[18px] font-bold text-foreground">
                Join the Pentasent Core Team
              </h3>
              <p className="mt-2 text-[13.5px] sm:text-[15.5px] leading-relaxed text-primary-text">
                We are building the open digital backbone for clinical collaboration, medical AI,
                and patient health records. Work on high-impact systems.
              </p>
              <div className="mt-3.5">
                <Link
                  href="/company/careers/open-roles"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <span>View Pentasent open roles</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Post & Manage Jobs Callout */}
            <div className="py-7">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Building2 size={18} />
                <h3 className="text-[17px] font-bold text-foreground">
                  Hiring for Your Institution?
                </h3>
              </div>
              <p className="text-[13.5px] sm:text-[15.5px] leading-relaxed text-primary-text mb-4">
                Post clinical vacancies, track qualified candidates, and manage interviews directly
                through the Pentasent recruiter workspace.
              </p>
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/account/jobs"
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-primary-hover transition-colors cursor-pointer shadow-2xs"
                >
                  <PlusCircle size={15} />
                  <span>Post a New Job</span>
                </Link>
                <Link
                  href="/account/jobs"
                  className="w-full inline-flex items-center justify-center gap-2 rounded border border-[#ded9d5] bg-white px-4 py-2 text-[13px] font-semibold text-foreground hover:border-primary transition-colors cursor-pointer"
                >
                  <span>Manage Your Jobs</span>
                </Link>
              </div>
            </div>

            {/* Application Tracker Card */}
            <div className="py-7">
              <div className="flex items-center gap-2 text-[#1b6d47] mb-2">
                <FileCheck2 size={18} />
                <h3 className="text-[16px] font-bold text-foreground">
                  Track Your Applications
                </h3>
              </div>
              <p className="text-[13px] sm:text-[15.5px] leading-relaxed text-primary-text mb-3.5">
                Have you already applied for a role on Pentasent? Check review progress,
                interviewer feedback, and decision stages in real-time.
              </p>
              <Link
                href="/tracker/job-status"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline cursor-pointer"
              >
                <span>Open Application Tracker</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Candidate Safety Notice */}
            <div className="pt-7">
              <div className="flex items-center gap-2 text-foreground font-bold text-[14.5px] mb-2">
                <ShieldCheck size={18} className="text-primary shrink-0" />
                <span>Candidate Safety Notice</span>
              </div>
              <p className="text-[13.5px] sm:text-[15.5px] leading-relaxed text-primary-text">
                Pentasent never asks candidates for recruitment fees. If any employer requests payment, pause and report the listing immediately.
              </p>
              <div className="mt-3">
                <Link
                  href="/company/careers/phishing-scam"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  <span>Learn how to protect yourself</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsFallback() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-full mx-auto isolate flex lg:max-h-[75vh] mx-h-full flex-col justify-between overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-30 md:pb-40 lg:pt-30 lg:pb-40">
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <Image
            src="/assets/images/pages/jobs/job_circle_bubble_banner.png"
            alt="Pentasent Careers Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center">
          <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            Healthcare Careers Network
          </p>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Healthcare <span className="text-[#ffd3f0]">Careers &amp; Positions</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Explore active openings across clinical medicine, hospital administration, healthtech engineering, and biomedical operations.
          </p>
        </div>
      </section>

      {/* Filter Skeleton */}
      <div className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 z-20">
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#ded9d5] shadow-xs">
          <div className="h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Shimmer List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 pb-24">
        <JobsListShimmer />
      </div>
    </div>
  );
}

export default function GlobalJobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsContent />
    </Suspense>
  );
}
