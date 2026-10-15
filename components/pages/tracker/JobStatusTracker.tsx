'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  UserCheck,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Building2,
} from 'lucide-react';
import { JobApplicationTrackerItem } from '@/types/trackers';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import {
  JobAuthBarShimmer,
  JobApplicationListShimmer,
  JobApplicationSearchShimmer,
} from '@/shimmer/tracker';
import PostJobModal from '@/components/jobs/PostJobModal';

export default function JobStatusTracker() {
  // Lazy init from URL query to avoid synchronous setState inside effects
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (params.get('id') || params.get('app') || '').trim().toUpperCase();
    }
    return '';
  });
  const [activeResult, setActiveResult] = useState<JobApplicationTrackerItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Authenticated user state
  const { user, status, logout } = useAuth();
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;
  const userEmail = user?.email || '';

  // Applications state for logged-in candidate
  const [myApplications, setMyApplications] = useState<JobApplicationTrackerItem[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Post Job Modal state
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Fetch authenticated candidate's applications from backend
  useEffect(() => {
    let isMounted = true;

    const loadUserApplications = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      if (!isLoggedIn) {
        setMyApplications([]);
        return;
      }

      setIsLoadingApps(true);
      try {
        const res = await apiClient<{ applications: JobApplicationTrackerItem[] }>(
          '/jobs/applications/me'
        );
        if (!isMounted) return;
        if (res.success && res.data?.applications) {
          setMyApplications(res.data.applications);
        } else {
          setMyApplications([]);
        }
      } catch (err: unknown) {
        console.warn('Unable to load user job applications:', err);
        if (!isMounted) return;
        setMyApplications([]);
      } finally {
        if (isMounted) {
          setIsLoadingApps(false);
        }
      }
    };

    void loadUserApplications();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Execute Job Application Search by Tracking ID (e.g. APP-198101)
  const executeSearch = async (queryText: string) => {
    const query = queryText.trim().toUpperCase();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await apiClient<JobApplicationTrackerItem>(
        `/jobs/applications/tracker/${encodeURIComponent(query)}`
      );
      if (res.success && res.data) {
        setActiveResult(res.data);
      } else {
        setActiveResult(null);
      }
    } catch (err: unknown) {
      console.warn(`Job application ${query} not found:`, err);
      setActiveResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    void executeSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveResult(null);
    setHasSearched(false);
  };

  // Read URL query params on load (e.g. ?id=APP-198101)
  useEffect(() => {
    let isMounted = true;

    const bootstrapQueryApp = async () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const idParam = (params.get('id') || params.get('app') || '').trim().toUpperCase();
      if (!idParam) return;

      await Promise.resolve();
      if (!isMounted) return;

      setIsSearching(true);
      setHasSearched(true);
      try {
        const res = await apiClient<JobApplicationTrackerItem>(
          `/jobs/applications/tracker/${encodeURIComponent(idParam)}`
        );
        if (!isMounted) return;
        if (res.success && res.data) {
          setActiveResult(res.data);
        } else {
          setActiveResult(null);
        }
      } catch (err: unknown) {
        console.warn(`Query application bootstrap error for ${idParam}:`, err);
        if (isMounted) setActiveResult(null);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    void bootstrapQueryApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (statusKey: string, label: string) => {
    switch (statusKey) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            {label || 'Submitted'}
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            {label || 'Under Review'}
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            {label || 'Shortlisted'}
          </span>
        );
      case 'interview_scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            {label || 'Interview Scheduled'}
          </span>
        );
      case 'offer_extended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 size={13} className="text-emerald-700" />
            {label || 'Offer Extended'}
          </span>
        );
      case 'not_selected':
      case 'withdrawn':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            {label || 'Not Selected'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#faf9f8] text-foreground border border-[#ded9d5]">
            {label || statusKey}
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Title & Introduction */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold text-foreground tracking-tight leading-[1.1]">
          Job Application Tracker
        </h1>
        <p className="mt-3.5 sm:mt-4 text-[16px] sm:text-[18px] text-primary-text leading-relaxed max-w-2xl mx-auto">
          Track the real-time review progress, interview stages, and hiring status for roles
          applied to across{' '}
          <Link
            href="/jobs"
            className="font-semibold text-foreground underline decoration-[#ffa91f] underline-offset-4 hover:text-primary"
          >
            Pentasent Healthcare Jobs
          </Link>
          .
        </p>
      </div>

      {/* Primary Search Controls */}
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Application Tracking ID (e.g. APP-XXXXXX)"
              className="w-full h-13 px-4 pl-11 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded outline-none transition-all duration-200 placeholder:text-primary-text/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-text"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="h-13 px-8 rounded bg-[#ffa91f] text-[#171318] text-[15px] font-bold hover:bg-[#ff9e0b] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs disabled:opacity-60"
          >
            <span>{isSearching ? 'Tracking...' : 'Track Status'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Clear Search Action */}
        {hasSearched && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 text-[13px] text-primary hover:underline cursor-pointer font-medium"
            >
              <RotateCcw size={12} />
              <span>Clear search</span>
            </button>
          </div>
        )}
      </div>

      {/* Authentication Bar with Shimmer */}
      {isAuthLoading ? (
        <JobAuthBarShimmer />
      ) : (
        <div className="border-t border-b border-[#e8e4e1] py-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              <>
                <UserCheck size={18} className="text-[#1b6d47]" />
                <span className="text-primary-text">
                  Viewing applications for{' '}
                  <strong className="text-foreground">{userEmail}</strong>
                </span>
              </>
            ) : (
              <>
                <Briefcase size={18} className="text-primary-text" />
                <span className="text-primary-text">
                  You are tracking in guest mode. Log in to sync all your submitted applications.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Button to post a job directly from tracker */}
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Post a Job</span>
            </button>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#ded9d5] bg-white text-[13px] font-medium text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span>Log out</span>
              </button>
            ) : (
              <a
                href="http://localhost:3000/account/profile"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded bg-[#4a0139] text-white text-[13px] font-bold hover:bg-[#38012b] transition-colors cursor-pointer shadow-xs"
              >
                <LogIn size={13} />
                <span>Log In</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-12">
        {/* Specific Search Query Result */}
        {hasSearched && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Search Result
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-[13px] text-primary hover:underline cursor-pointer"
              >
                Show all my applications
              </button>
            </div>

            {isSearching ? (
              <JobApplicationSearchShimmer />
            ) : activeResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Header Information */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                      <span className="font-bold uppercase tracking-wider text-[#6b185f]">
                        {activeResult.department}
                      </span>
                      <span className="text-[#ded9d5]">·</span>
                      <span className="font-semibold text-foreground">
                        {activeResult.location}
                      </span>
                      <span className="text-[#ded9d5]">·</span>
                      <span className="text-primary-text">
                        Applied {activeResult.appliedDate}
                      </span>
                    </div>

                    {getStatusBadge(activeResult.status, activeResult.statusLabel)}
                  </div>

                  <h2 className="text-[24px] sm:text-[28px] font-bold text-foreground">
                    {activeResult.jobTitle}
                  </h2>
                  <p className="mt-1 text-[14.5px] font-mono text-primary font-semibold">
                    Tracking ID: {activeResult.id}
                  </p>
                  <p className="mt-2.5 text-[15px] sm:text-[16px] text-primary-text leading-relaxed max-w-3xl">
                    {activeResult.summary}
                  </p>
                </div>

                {/* Candidate Timeline Stepper */}
                <div className="pt-6 border-t border-[#e8e4e1]">
                  <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] block mb-1">
                    Hiring Progress
                  </span>
                  <h3 className="text-[19px] sm:text-[21px] font-bold text-foreground mb-6">
                    Application Review Stepper
                  </h3>

                  <div className="space-y-6">
                    {activeResult.timeline.map((step, idx) => {
                      const isCompleted = step.status === 'completed';
                      const isCurrent = step.status === 'current';

                      return (
                        <div key={idx} className="flex items-start gap-4">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${
                              isCompleted
                                ? 'bg-[#1b6d47] text-white'
                                : isCurrent
                                ? 'bg-[#ffa91f] text-[#171318] ring-4 ring-[#ffa91f]/20'
                                : 'bg-[#e8e4e1] text-primary-text'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                          </div>

                          <div className="flex-1 pb-4 border-b border-[#f0ede9]">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4
                                className={`text-[15px] sm:text-[16px] font-bold ${
                                  isCurrent ? 'text-primary' : 'text-foreground'
                                }`}
                              >
                                {step.title}
                              </h4>
                              {step.date && (
                                <span className="text-[12px] text-muted-foreground">
                                  {step.date}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[13.5px] text-primary-text leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Steps & Recruiter Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {activeResult.nextSteps && (
                    <div className="rounded-lg bg-[#faf9f8] border border-[#ded9d5] p-5">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Next Expected Steps
                      </span>
                      <p className="text-[14px] text-foreground font-medium leading-relaxed">
                        {activeResult.nextSteps}
                      </p>
                    </div>
                  )}

                  {activeResult.hiringTeamNote && (
                    <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-5">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                        Hiring Team Note
                      </span>
                      <p className="text-[14px] text-emerald-950 font-medium leading-relaxed">
                        {activeResult.hiringTeamNote}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="py-10 text-center bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-8">
                <AlertCircle size={28} className="mx-auto text-amber-600 mb-2" />
                <h3 className="text-[18px] font-bold text-foreground">
                  No Application Found
                </h3>
                <p className="mt-1.5 text-[14px] text-primary-text max-w-md mx-auto">
                  We could not find an application matching tracking number{' '}
                  <strong className="font-mono">{searchQuery}</strong>. Please check your tracking ID or
                  log in to view your submitted positions.
                </p>
              </div>
            )}
          </div>
        )}

        {/* User's Submitted Applications Portfolio (If Logged In) */}
        {isLoggedIn && !hasSearched && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Candidate Portfolio
                </span>
                <h2 className="text-[22px] sm:text-[26px] font-bold text-foreground">
                  Your Submitted Applications
                </h2>
              </div>

              <span className="text-[13px] text-muted-foreground">
                {myApplications.length} {myApplications.length === 1 ? 'application' : 'applications'} on file
              </span>
            </div>

            {isLoadingApps ? (
              <JobApplicationListShimmer />
            ) : myApplications.length > 0 ? (
              <div className="divide-y divide-[#e8e4e1] border-t border-b border-[#e8e4e1]">
                {myApplications.map((app) => {
                  const isExpanded = expandedId === app.id;

                  return (
                    <div key={app.id} className="py-6">
                      <div
                        onClick={() => toggleExpand(app.id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-[12px]">
                            <span className="font-bold uppercase tracking-wider text-[#6b185f]">
                              {app.department}
                            </span>
                            <span className="text-[#ded9d5]">·</span>
                            <span className="font-medium text-muted-foreground">
                              {app.location}
                            </span>
                            <span className="text-[#ded9d5]">·</span>
                            <span className="font-mono font-bold text-primary">
                              {app.id}
                            </span>
                          </div>

                          <h3 className="text-[18px] sm:text-[20px] font-bold text-foreground group-hover:text-primary transition-colors">
                            {app.jobTitle}
                          </h3>

                          <p className="text-[13.5px] text-primary-text line-clamp-1 max-w-2xl">
                            {app.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {getStatusBadge(app.status, app.statusLabel)}
                          <button
                            type="button"
                            className="p-1 rounded text-muted-foreground group-hover:text-foreground"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Stepper */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-6 pt-5 border-t border-[#f0ede9] space-y-5"
                          >
                            <div className="space-y-4">
                              {app.timeline.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                                      step.status === 'completed'
                                        ? 'bg-[#1b6d47] text-white'
                                        : step.status === 'current'
                                        ? 'bg-[#ffa91f] text-[#171318]'
                                        : 'bg-[#e8e4e1] text-primary-text'
                                    }`}
                                  >
                                    {step.status === 'completed' ? <CheckCircle2 size={12} /> : idx + 1}
                                  </div>
                                  <div>
                                    <h4 className="text-[14px] font-bold text-foreground">
                                      {step.title}
                                    </h4>
                                    <p className="text-[13px] text-primary-text">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {app.nextSteps && (
                              <div className="p-3.5 rounded bg-[#faf9f8] border border-[#ded9d5] text-[13px]">
                                <strong className="text-foreground">Next Step: </strong>
                                <span className="text-primary-text">{app.nextSteps}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 sm:py-16 text-center max-w-md mx-auto">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-3.5">
                  <Briefcase size={22} />
                </div>
                <h3 className="text-[19px] sm:text-[20px] font-bold text-foreground">
                  No Submitted Applications Yet
                </h3>
                <p className="mt-2 text-[14px] text-primary-text leading-relaxed">
                  You haven&apos;t applied to any roles on Pentasent under this account yet.
                  Browse our open positions to discover clinical and engineering opportunities.
                </p>
                <div className="mt-5">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[13.5px] font-bold hover:bg-primary-hover shadow-2xs"
                  >
                    <span>Browse Open Positions</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobCreated={(newJob) => {
          // Open public listing or feedback
          console.log('Job posted successfully:', newJob);
        }}
      />
    </div>
  );
}
