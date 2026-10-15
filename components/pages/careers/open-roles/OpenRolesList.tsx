'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Briefcase,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { JOB_OPENINGS, JOB_DEPARTMENTS, JOB_LOCATIONS } from '@/data/jobs';
import { JobOpening } from '@/types/jobs';
import { apiClient } from '@/lib/api';
import { JobsListShimmer } from '@/shimmer/tracker';
import JobCard from '@/components/jobs/JobCard';

export default function OpenRolesList() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All departments');
  const [selectedLocation, setSelectedLocation] = useState<string>('All locations');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Helper to ensure only Pentasent company brand hirings are displayed on this page
  const isPentasentRole = (j: JobOpening) => {
    const isPentasentSource = j.sourceType === 'pentasent_created';
    const employer = (j.employerName || '').trim().toLowerCase();
    const isPentasentEmployer = !employer || employer === 'pentasent';
    return isPentasentSource || isPentasentEmployer;
  };

  const [jobs, setJobs] = useState<JobOpening[]>(() => JOB_OPENINGS.filter(isPentasentRole));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live jobs from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchLiveJobs = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const res = await apiClient<JobOpening[]>('/jobs?sourceType=pentasent_created');
        if (!isMounted) return;
        if (res.success && res.data && res.data.length > 0) {
          const pentasentRoles = res.data.filter(isPentasentRole);
          setJobs(pentasentRoles.length > 0 ? pentasentRoles : JOB_OPENINGS.filter(isPentasentRole));
        } else {
          setJobs(JOB_OPENINGS.filter(isPentasentRole));
        }
      } catch (err) {
        console.warn('Unable to load live jobs, using cached openings:', err);
        if (isMounted) setJobs(JOB_OPENINGS.filter(isPentasentRole));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchLiveJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic filter lists from available jobs
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

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Department match
      if (
        selectedDepartment !== 'All departments' &&
        job.department.toLowerCase() !== selectedDepartment.toLowerCase()
      ) {
        return false;
      }

      // Location match
      if (selectedLocation !== 'All locations') {
        const locLower = selectedLocation.toLowerCase();
        const jobLocLower = job.location.toLowerCase();
        const jobTypeLower = (job.locationType || '').toLowerCase();

        if (locLower.includes('remote')) {
          if (!jobLocLower.includes('remote') && jobTypeLower !== 'remote') return false;
        } else if (!jobLocLower.includes(locLower)) {
          return false;
        }
      }

      // Search query match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = job.title.toLowerCase().includes(query);
        const deptMatch = job.department.toLowerCase().includes(query);
        const summaryMatch = (job.summary || '').toLowerCase().includes(query);
        const qualMatch = (job.mustHaveQualifications || []).some((q) =>
          q.toLowerCase().includes(query)
        );
        if (!titleMatch && !deptMatch && !summaryMatch && !qualMatch) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, selectedDepartment, selectedLocation, searchQuery]);

  const handleResetFilters = () => {
    setSelectedDepartment('All departments');
    setSelectedLocation('All locations');
    setSearchQuery('');
  };

  const isFiltered =
    selectedDepartment !== 'All departments' ||
    selectedLocation !== 'All locations' ||
    searchQuery.trim() !== '';

  return (
    <div className="w-full">
      {/* 3-Column Filter Controls Matching Reference Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
        {/* Department Filter */}
        <div className="flex flex-col">
          <label
            htmlFor="filter-department"
            className="text-[13.5px] font-semibold text-foreground mb-1.5"
          >
            Department
          </label>
          <div className="relative w-full h-12.5 bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
            <select
              id="filter-department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="appearance-none w-full h-full pl-4 pr-10 text-[15px] text-foreground bg-transparent border-0 outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="flex flex-col">
          <label
            htmlFor="filter-location"
            className="text-[13.5px] font-semibold text-foreground mb-1.5"
          >
            Location
          </label>
          <div className="relative w-full h-12.5 bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none w-full h-full pl-4 pr-10 text-[15px] text-foreground bg-transparent border-0 outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="flex flex-col">
          <label
            htmlFor="filter-search"
            className="text-[13.5px] font-semibold text-foreground mb-1.5"
          >
            Search
          </label>
          <div className="relative w-full h-12.5 bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
            <input
              id="filter-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles"
              className="w-full h-full pl-4 pr-10 text-[15px] text-foreground placeholder:text-primary-text/70 bg-transparent border-0 outline-none"
            />
            <Search
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Count Summary Line with Shimmer state */}
      {isLoading ? (
        <div className="mt-8 sm:mt-10 mb-8 sm:mb-10 flex justify-center">
          <div className="h-6 w-72 max-w-full rounded bg-[#eee9e5] animate-shimmer" />
        </div>
      ) : (
        <div className="mt-8 sm:mt-10 mb-8 sm:mb-10 text-center">
          <p className="text-[15px] sm:text-[16px] text-primary-text font-normal">
            <strong className="font-bold text-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}
            </strong>{' '}
            across{' '}
            <strong className="font-bold text-foreground">
              {selectedDepartment.toLowerCase()}
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
              className="mt-2.5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      )}

      {/* Loading Shimmer or Roles List */}
      {isLoading ? (
        <JobsListShimmer />
      ) : (
        <AnimatePresence mode="wait">
          {filteredJobs.length > 0 ? (
            <motion.div
              key="roles-list"
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
                  basePath="/company/careers/open-roles"
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="py-12 sm:py-16 text-center max-w-xl mx-auto"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-3.5">
                <Briefcase size={22} />
              </div>
              <h3 className="text-[20px] sm:text-[22px] font-bold text-foreground">
                No open roles found
              </h3>
              <p className="mt-2 text-[14.5px] sm:text-[15px] leading-relaxed text-primary-text">
                We couldn&apos;t find any open positions matching your search or filter criteria.
                Try selecting a different department, location, or clearing your search.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[14px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset all filters</span>
                </button>
                <Link
                  href="/company/careers"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded bg-white text-foreground text-[14px] font-semibold border border-[#ded9d5] hover:border-primary transition-colors cursor-pointer"
                >
                  Back to Careers
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Bottom Application Status Tracker Link */}
      <div className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-[#ded9d5] text-center">
        <p className="text-[14.5px] sm:text-[15.5px] text-primary-text mb-2.5">
          Already applied for a position at Pentasent?
        </p>
        <Link
          href="/tracker/job-status"
          className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
        >
          <span>Track Your Pentasent Application Status</span>
          <ArrowRight
            size={16}
            className="text-primary transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}

