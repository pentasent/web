'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Newspaper,
  Calendar,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  UserCheck,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PressReleaseTrackerItem } from '@/types/trackers';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import {
  PressAuthBarShimmer,
  PressSubmissionListShimmer,
  PressSubmissionSearchShimmer,
} from '@/shimmer/tracker';

export default function PressStatusTracker() {
  // Lazy init from URL query to avoid synchronous setState inside effects
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (params.get('id') || params.get('pr') || '').trim().toUpperCase();
    }
    return '';
  });
  const [activeResult, setActiveResult] = useState<PressReleaseTrackerItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Authenticated user state
  const { user, status, logout } = useAuth();
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;
  const userEmail = user?.email || '';

  // Submissions state for logged-in user
  const [mySubmissions, setMySubmissions] = useState<PressReleaseTrackerItem[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch authenticated user's submissions from backend without cascading renders
  useEffect(() => {
    let isMounted = true;

    const loadUserSubmissions = async () => {
      // Yield to microtask queue to avoid synchronous render cascading
      await Promise.resolve();
      if (!isMounted) return;

      if (!isLoggedIn) {
        setMySubmissions([]);
        return;
      }

      setIsLoadingSubmissions(true);
      try {
        const res = await apiClient<{ submissions: PressReleaseTrackerItem[] }>(
          '/press/my-submissions'
        );
        if (!isMounted) return;
        if (res.success && res.data?.submissions) {
          setMySubmissions(res.data.submissions);
        } else {
          setMySubmissions([]);
        }
      } catch (err: unknown) {
        console.warn('Unable to load user press submissions:', err);
        if (!isMounted) return;
        setMySubmissions([]);
      } finally {
        if (isMounted) {
          setIsLoadingSubmissions(false);
        }
      }
    };

    void loadUserSubmissions();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Execute Press Release Search by Tracking ID (e.g. PR-829104)
  const executeSearch = async (queryText: string) => {
    const query = queryText.trim().toUpperCase();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await apiClient<PressReleaseTrackerItem>(
        `/press/tracker/${encodeURIComponent(query)}`
      );
      if (res.success && res.data) {
        setActiveResult(res.data);
      } else {
        setActiveResult(null);
      }
    } catch (err: unknown) {
      console.warn(`Press release ${query} not found:`, err);
      setActiveResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Search by ID handler
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    void executeSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveResult(null);
    setHasSearched(false);
  };

  // Read URL query params on load (e.g. ?id=PR-829104 or ?pr=PR-829104) without synchronous effect setState
  useEffect(() => {
    let isMounted = true;

    const bootstrapQuerySubmission = async () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const idParam = (params.get('id') || params.get('pr') || '').trim().toUpperCase();
      if (!idParam) return;

      // Yield to microtask queue to avoid synchronous render cascading in effect body
      await Promise.resolve();
      if (!isMounted) return;

      setIsSearching(true);
      setHasSearched(true);
      try {
        const res = await apiClient<PressReleaseTrackerItem>(
          `/press/tracker/${encodeURIComponent(idParam)}`
        );
        if (!isMounted) return;
        if (res.success && res.data) {
          setActiveResult(res.data);
        } else {
          setActiveResult(null);
        }
      } catch (err: unknown) {
        console.warn(`Query press release bootstrap error for ${idParam}:`, err);
        if (isMounted) setActiveResult(null);
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    void bootstrapQuerySubmission();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full">
      {/* Title & Introduction */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold text-foreground tracking-tight leading-[1.1]">
          Press Release Status Tracker
        </h1>
        <p className="mt-3.5 sm:mt-4 text-[16px] sm:text-[18px] text-primary-text leading-relaxed max-w-2xl mx-auto">
          Monitor the editorial review, clinical citation verification, and syndicated publication
          schedule of releases submitted to{' '}
          <Link
            href="/company/press"
            className="font-semibold text-foreground underline decoration-[#ffa91f] underline-offset-4 hover:text-primary"
          >
            Pentasent Press Wire
          </Link>
          .
        </p>
      </div>

      {/* Primary Search Controls */}
      <div className="max-w-3xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Press Release ID (e.g. PR-829104)"
              className="w-full h-13 px-4 pl-11 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded outline-none transition-all duration-200 placeholder:text-primary-text/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-text"
            />
          </div>

          <button
            type="submit"
            className="h-13 px-8 rounded bg-[#ffa91f] text-[#171318] text-[15px] font-bold hover:bg-[#ff9e0b] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Track Status</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {hasSearched && (
          <div className="mt-3 flex items-center justify-end text-[13px] text-primary-text">
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
            >
              <RotateCcw size={12} />
              <span>Clear search</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Login / User Bar with Shimmer */}
      {isAuthLoading ? (
        <PressAuthBarShimmer />
      ) : (
        <div className="border-t border-b border-[#e8e4e1] py-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          {!isLoggedIn ? (
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2 text-primary-text">
                <LogIn size={16} className="text-primary" />
                <span>
                  Media partner or enterprise PR team? Sign in to view all your organization&apos;s submissions.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-[13px] ml-1"
                >
                  <span>Account Login</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <UserCheck size={16} className="text-[#1b6d47]" />
                <span>
                  Signed in as <strong className="text-primary">{userEmail}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#ded9d5] text-[13px] font-semibold text-primary-text hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div>
        {/* CASE 0: SEARCHING STATE WITH SHIMMER */}
        {hasSearched && isSearching && <PressSubmissionSearchShimmer />}

        {/* CASE 1: SEARCH ACTIVE & FOUND */}
        {hasSearched && !isSearching && activeResult && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                <span className="text-[13px] font-mono font-bold text-[#6b185f]">
                  {activeResult.id}
                </span>
                <span className="text-[#ded9d5]">·</span>
                <span className="text-[12.5px] font-semibold text-[#1b6d47] uppercase tracking-wider">
                  {activeResult.statusLabel}
                </span>
                <span className="text-[#ded9d5]">·</span>
                <span className="text-[13px] text-primary-text">
                  Submitted on {activeResult.submittedDate}
                </span>
              </div>

              <h2 className="text-[26px] sm:text-[32px] font-bold text-foreground">
                {activeResult.title}
              </h2>

              <p className="mt-2 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text max-w-3xl">
                {activeResult.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-primary-text">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={14} className="text-primary shrink-0" />
                  <span>{activeResult.companyOrOrganization}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Newspaper size={14} className="text-primary shrink-0" />
                  <span>{activeResult.category}</span>
                </span>
                {activeResult.scheduledPublishDate && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary shrink-0" />
                    <span>
                      Target Publish Date:{' '}
                      <strong className="text-foreground">{activeResult.scheduledPublishDate}</strong>
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-[#e8e4e1]" />

            {/* Timeline Stepper */}
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Editorial Workflow
              </span>
              <h3 className="mt-1 text-[22px] sm:text-[25px] font-bold text-foreground">
                Distribution &amp; Verification Progress
              </h3>

              <div className="mt-6 space-y-6">
                {activeResult.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      {step.status === 'completed' && (
                        <div className="w-6 h-6 rounded-full bg-[#edf7f1] text-[#1b6d47] flex items-center justify-center">
                          <CheckCircle2 size={16} strokeWidth={2.4} />
                        </div>
                      )}
                      {step.status === 'current' && (
                        <div className="w-6 h-6 rounded-full bg-[#ffa91f]/20 text-[#171318] flex items-center justify-center ring-2 ring-[#ffa91f]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffa91f]" />
                        </div>
                      )}
                      {step.status === 'upcoming' && (
                        <div className="w-6 h-6 rounded-full bg-[#f2efec] text-primary-text flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-primary-text/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`text-[16px] font-bold ${
                            step.status === 'current'
                              ? 'text-primary'
                              : step.status === 'completed'
                              ? 'text-foreground'
                              : 'text-primary-text'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-[12.5px] font-medium text-primary-text">
                            {step.date}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[14.5px] text-primary-text leading-[1.6]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Notes */}
            {activeResult.editorialNote && (
              <div className="border-t border-[#e8e4e1] pt-6">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Editorial Board Remarks
                </span>
                <p className="mt-2 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                  {activeResult.editorialNote}
                </p>
              </div>
            )}

            {/* Links */}
            <div className="border-t border-[#e8e4e1] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/company/press#submit-pr"
                className="group inline-flex items-center gap-2 text-[15px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all cursor-pointer"
              >
                <span>Submit Another Press Release</span>
                <ArrowRight size={15} className="text-primary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/company/press"
                className="text-[14px] font-semibold text-primary hover:underline"
              >
                View Live Press Releases Wire
              </Link>
            </div>
          </motion.div>
        )}

        {/* CASE 2: SEARCH ACTIVE & NOT FOUND */}
        {hasSearched && !isSearching && !activeResult && (
          <div className="py-12 sm:py-16 text-center max-w-xl mx-auto border-t border-b border-[#e8e4e1]">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3.5">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-[20px] sm:text-[22px] font-bold text-foreground">
              No press release found
            </h3>
            <p className="mt-2 text-[14.5px] sm:text-[15px] leading-relaxed text-primary-text">
              We couldn&apos;t locate any announcement matching ID{' '}
              <strong className="text-foreground font-mono">{searchQuery}</strong>. Please verify your reference
              number or submit a new press inquiry.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[14px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Try Another ID</span>
              </button>
              <Link
                href="/company/press#submit-pr"
                className="inline-flex items-center px-5 py-2.5 rounded bg-white text-foreground text-[14px] font-semibold border border-[#ded9d5] hover:border-primary transition-colors cursor-pointer"
              >
                Submit New Release
              </Link>
            </div>
          </div>
        )}

        {/* CASE 3: USER LOGGED IN - PORTFOLIO LIST OR EMPTY STATE */}
        {!hasSearched && (isAuthLoading || (isLoggedIn && isLoadingSubmissions)) && (
          <PressSubmissionListShimmer />
        )}

        {!hasSearched && !isAuthLoading && isLoggedIn && !isLoadingSubmissions && (
          <div>
            {mySubmissions.length > 0 ? (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                      Media Portfolio
                    </span>
                    <h2 className="mt-1 text-[24px] sm:text-[28px] font-bold text-foreground">
                      Submitted Press Releases ({mySubmissions.length})
                    </h2>
                  </div>

                  <Link
                    href="/company/press#submit-pr"
                    className="inline-flex items-center gap-1.5 text-[14px] font-bold text-primary hover:underline"
                  >
                    <span>Submit new release</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="divide-y divide-[#e8e4e1] border-t border-b border-[#e8e4e1]">
                  {mySubmissions.map((pr) => {
                    const isExpanded = expandedId === pr.id;
                    return (
                      <div key={pr.id} className="py-6 transition-colors">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[12.5px]">
                              <span className="font-mono font-bold text-[#6b185f]">
                                {pr.id}
                              </span>
                              <span className="text-[#ded9d5]">·</span>
                              <span className="font-semibold text-[#1b6d47]">
                                {pr.statusLabel}
                              </span>
                              <span className="text-[#ded9d5]">·</span>
                              <span className="text-primary-text">
                                Submitted {pr.submittedDate}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleExpand(pr.id)}
                              className="inline-flex items-center gap-1 text-[13.5px] font-bold text-primary hover:underline cursor-pointer"
                            >
                              <span>{isExpanded ? 'Hide Details' : 'View Editorial Progress'}</span>
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </div>

                          <h3 className="text-[20px] sm:text-[23px] font-bold text-foreground">
                            {pr.title}
                          </h3>

                          <p className="text-[14.5px] sm:text-[15px] leading-[1.65] text-primary-text">
                            {pr.summary}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13px] sm:text-[13.5px] text-primary-text">
                            <span>Organization: <strong className="text-foreground">{pr.companyOrOrganization}</strong></span>
                            <span>Category: <strong className="text-foreground">{pr.category}</strong></span>
                            <span>Stage: <strong className="text-primary">{pr.currentStage}</strong></span>
                          </div>

                          {/* Expandable Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-[#f0edea]"
                              >
                                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#6b185f] mb-3">
                                  Editorial Timeline
                                </h4>
                                <div className="space-y-4 mb-4">
                                  {pr.timeline.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      <div className="mt-0.5 shrink-0">
                                        {step.status === 'completed' && (
                                          <CheckCircle2 size={16} className="text-[#1b6d47]" />
                                        )}
                                        {step.status === 'current' && (
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffa91f] block mt-1" />
                                        )}
                                        {step.status === 'upcoming' && (
                                          <span className="w-2 h-2 rounded-full bg-[#ded9d5] block mt-1" />
                                        )}
                                      </div>
                                      <div className="text-[13.5px]">
                                        <span className="font-semibold text-foreground">
                                          {step.title}
                                        </span>
                                        {step.date && (
                                          <span className="text-primary-text ml-2">({step.date})</span>
                                        )}
                                        <p className="text-primary-text mt-0.5">{step.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {pr.editorialNote && (
                                  <p className="text-[13.5px] text-primary-text leading-relaxed">
                                    <strong>Editorial Note:</strong> {pr.editorialNote}
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* REQUIRED EMPTY STATE (User logged in and nothing submitted) */
              <div className="py-12 sm:py-16 text-center max-w-xl mx-auto">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-3.5">
                  <Newspaper size={22} />
                </div>
                <h3 className="text-[22px] sm:text-[25px] font-bold text-foreground">
                  You haven&apos;t submitted any press releases yet
                </h3>
                <p className="mt-2.5 text-[15px] sm:text-[15.5px] leading-relaxed text-primary-text">
                  Your organization does not have any active press submissions on file. Broadcast your clinical
                  discovery, funding milestone, or institutional partnership to 4.8M monthly healthcare readers.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3">
                  <Link
                    href="/company/press#submit-pr"
                    className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                  >
                    <span>Submit a New Press Release</span>
                    <ArrowRight
                      size={16}
                      className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/company/press"
                    className="text-[14px] font-medium text-primary hover:underline mt-1"
                  >
                    Learn about Pentasent Press Distribution &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CASE 4: DEFAULT INITIAL VIEW (Not logged in and not searching) */}
        {!hasSearched && !isAuthLoading && !isLoggedIn && (
          <div className="py-8 sm:py-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Two Ways to Check Press Status
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-foreground">
                Search with your Press ID or Sign in
              </h2>
              <p className="text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                When you submitted an announcement on our{' '}
                <Link
                  href="/company/press#submit-pr"
                  className="text-foreground font-semibold underline decoration-[#ffa91f] underline-offset-4 hover:text-primary"
                >
                  press release submission portal
                </Link>
                , you received a tracking number (e.g.{' '}
                <code className="font-mono text-primary font-bold">PR-XXXXXX</code>). Enter it above to see real-time
                editorial reviews and distribution updates.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/company/press#submit-pr"
                  className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                >
                  <span>Submit a New Press Release</span>
                  <ArrowRight
                    size={16}
                    className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/company/press"
                  className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                >
                  <span>Visit Press Hub</span>
                  <ArrowRight
                    size={16}
                    className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
