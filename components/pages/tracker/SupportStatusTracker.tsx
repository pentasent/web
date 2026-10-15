'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LifeBuoy,
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
  Headphones,
  Loader2,
} from 'lucide-react';
import { SupportTicketTrackerItem } from '@/types/trackers';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import {
  SupportAuthBarShimmer,
  SupportTicketListShimmer,
  SupportTicketSearchShimmer,
} from '@/shimmer/tracker';

export default function SupportStatusTracker() {
  // Lazy init from URL to prevent synchronous setState inside effects
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (params.get('id') || params.get('ticket') || '').trim().toUpperCase();
    }
    return '';
  });
  const [activeResult, setActiveResult] = useState<SupportTicketTrackerItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Authenticated user state
  const { user, status, logout } = useAuth();
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;
  const userEmail = user?.email || '';

  // Tickets state for logged-in user
  const [myTickets, setMyTickets] = useState<SupportTicketTrackerItem[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch authenticated user's tickets from backend API without synchronous setState in effect
  useEffect(() => {
    let isMounted = true;

    const loadUserTickets = async () => {
      // Yield to microtask queue to avoid synchronous render cascading in effect body
      await Promise.resolve();
      if (!isMounted) return;

      if (!isLoggedIn) {
        setMyTickets([]);
        return;
      }

      setIsLoadingTickets(true);
      try {
        const res = await apiClient<{ tickets: SupportTicketTrackerItem[] }>('/support/my-tickets');
        if (!isMounted) return;
        if (res.success && res.data?.tickets) {
          setMyTickets(res.data.tickets);
        } else {
          setMyTickets([]);
        }
      } catch (err: unknown) {
        console.warn('Unable to load user support tickets:', err);
        if (!isMounted) return;
        setMyTickets([]);
      } finally {
        if (isMounted) {
          setIsLoadingTickets(false);
        }
      }
    };

    void loadUserTickets();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Execute Ticket search
  const executeSearch = async (queryText: string) => {
    const query = queryText.trim().toUpperCase();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await apiClient<SupportTicketTrackerItem>(
        `/support/tracker/${encodeURIComponent(query)}`
      );
      if (res.success && res.data) {
        setActiveResult(res.data);
      } else {
        setActiveResult(null);
      }
    } catch (err: unknown) {
      console.warn(`Support ticket ${query} not found:`, err);
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

  // Read URL query params on load (e.g. ?id=TCK-481920 or ?ticket=TCK-481920)
  useEffect(() => {
    let isMounted = true;

    const bootstrapQueryTicket = async () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const idParam = (params.get('id') || params.get('ticket') || '').trim().toUpperCase();
      if (!idParam) return;

      // Yield to microtask queue to avoid synchronous render cascading in effect body
      await Promise.resolve();
      if (!isMounted) return;

      setIsSearching(true);
      setHasSearched(true);
      try {
        const res = await apiClient<SupportTicketTrackerItem>(
          `/support/tracker/${encodeURIComponent(idParam)}`
        );
        if (!isMounted) return;
        if (res.success && res.data) {
          setActiveResult(res.data);
        } else {
          setActiveResult(null);
        }
      } catch (err: unknown) {
        console.warn(`Support ticket ${idParam} query error:`, err);
        if (!isMounted) return;
        setActiveResult(null);
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    void bootstrapQueryTicket();

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
          Support Ticket Tracker
        </h1>
        <p className="mt-3.5 sm:mt-4 text-[16px] sm:text-[18px] text-primary-text leading-relaxed max-w-2xl mx-auto">
          Check the resolution status, technical queue priority, and specialist notes for requests
          logged via{' '}
          <Link
            href="/help"
            className="font-semibold text-foreground underline decoration-[#ffa91f] underline-offset-4 hover:text-primary"
          >
            Pentasent Help Center
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
              placeholder="Enter Ticket ID (e.g. TCK-481920)"
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
            className="h-13 px-8 rounded bg-[#ffa91f] text-[#171318] text-[15px] font-bold hover:bg-[#ff9e0b] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSearching ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-black" />
                <span>Searching...</span>
              </span>
            ) : (
              <>
                <span>Track Ticket</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Helper row with clean ticket code badge & clear action */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[13px] text-primary-text">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-primary-text/80">Ticket Format:</span>
            <span className="font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-[#faf9f8] border border-[#ded9d5]">
              TCK-XXXXXX
            </span>
          </div>

          {hasSearched && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
            >
              <RotateCcw size={12} />
              <span>Clear search</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Login Bar */}
      {isAuthLoading ? (
        <SupportAuthBarShimmer />
      ) : !isLoggedIn ? (
        <div className="border-t border-b border-[#e8e4e1] py-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          <div className="flex flex-wrap items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2 text-primary-text">
              <LogIn size={16} className="text-primary" />
              <span>
                Track all requests filed under your account email address.
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
        </div>
      ) : (
        <div className="border-t border-b border-[#e8e4e1] py-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-[14px]">
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
        </div>
      )}

      {/* Main Content Area */}
      <div>
        {/* CASE 1: SEARCH ACTIVE & LOADING */}
        {hasSearched && isSearching && (
          <SupportTicketSearchShimmer />
        )}

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
                <span className="text-[12.5px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Priority: {activeResult.priorityLabel || activeResult.priority}
                </span>
                <span className="text-[#ded9d5]">·</span>
                <span className="text-[13px] text-primary-text">
                  Logged on {activeResult.createdDate}
                </span>
              </div>

              <h2 className="text-[26px] sm:text-[32px] font-bold text-foreground">
                {activeResult.subject}
              </h2>

              <p className="mt-2 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text max-w-3xl">
                {activeResult.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-primary-text">
                <span className="inline-flex items-center gap-1.5">
                  <Headphones size={14} className="text-primary shrink-0" />
                  <span>Category: <strong className="text-foreground">{activeResult.categoryLabel || activeResult.category}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck size={14} className="text-primary shrink-0" />
                  <span>Assigned: <strong className="text-foreground">{activeResult.assignedSpecialist}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-primary shrink-0" />
                  <span>Last Activity: <strong className="text-foreground">{activeResult.lastUpdated}</strong></span>
                </span>
              </div>
            </div>

            <div className="border-t border-[#e8e4e1]" />

            {/* Timeline Stepper */}
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Resolution Queue
              </span>
              <h3 className="mt-1 text-[22px] sm:text-[25px] font-bold text-foreground">
                Support Investigation Progress
              </h3>

              <div className="mt-6 space-y-6">
                {activeResult.timeline && activeResult.timeline.length > 0 ? (
                  activeResult.timeline.map((step, idx) => (
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
                  ))
                ) : (
                  <p className="text-sm text-primary-text">
                    Investigation timeline updates will appear as the support team reviews your ticket.
                  </p>
                )}
              </div>
            </div>

            {/* Resolution Notes */}
            {activeResult.resolutionNotes && (
              <div className="border-t border-[#e8e4e1] pt-6">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Specialist Diagnosis
                </span>
                <p className="mt-2 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                  {activeResult.resolutionNotes}
                </p>
              </div>
            )}

            {/* Links */}
            <div className="border-t border-[#e8e4e1] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/help"
                className="group inline-flex items-center gap-2 text-[15px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all cursor-pointer"
              >
                <span>Visit Pentasent Help Center</span>
                <ArrowRight size={15} className="text-primary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/company/contact"
                className="text-[14px] font-semibold text-primary hover:underline"
              >
                Contact Support Directly
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
              No support ticket found
            </h3>
            <p className="mt-2 text-[14.5px] sm:text-[15px] leading-relaxed text-primary-text">
              We couldn&apos;t locate any support ticket matching ID{' '}
              <strong className="text-foreground font-mono">{searchQuery}</strong>. Please check your
              confirmation email or reach out to our support specialists.
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
                href="/help"
                className="inline-flex items-center px-5 py-2.5 rounded bg-white text-foreground text-[14px] font-semibold border border-[#ded9d5] hover:border-primary transition-colors cursor-pointer"
              >
                Search Help Center
              </Link>
            </div>
          </div>
        )}

        {/* CASE 3: NO SEARCH - AUTH LOADING */}
        {!hasSearched && isAuthLoading && (
          <SupportTicketListShimmer />
        )}

        {/* CASE 4: USER LOGGED IN - LIST OR EMPTY STATE */}
        {!hasSearched && !isAuthLoading && isLoggedIn && (
          <div>
            {isLoadingTickets ? (
              <SupportTicketListShimmer />
            ) : myTickets.length > 0 ? (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                      Active Support Queue
                    </span>
                    <h2 className="mt-1 text-[24px] sm:text-[28px] font-bold text-foreground">
                      Your Support Tickets ({myTickets.length})
                    </h2>
                  </div>

                  <Link
                    href="/company/contact"
                    className="inline-flex items-center gap-1.5 text-[14px] font-bold text-primary hover:underline"
                  >
                    <span>Create new ticket</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="divide-y divide-[#e8e4e1] border-t border-b border-[#e8e4e1]">
                  {myTickets.map((tck) => {
                    const isExpanded = expandedId === tck.id;
                    return (
                      <div key={tck.id} className="py-6 transition-colors">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[12.5px]">
                              <span className="font-mono font-bold text-[#6b185f]">
                                {tck.id}
                              </span>
                              <span className="text-[#ded9d5]">·</span>
                              <span className="font-semibold text-[#1b6d47]">
                                {tck.statusLabel}
                              </span>
                              <span className="text-[#ded9d5]">·</span>
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                                {tck.priorityLabel || tck.priority} Priority
                              </span>
                              <span className="text-[#ded9d5]">·</span>
                              <span className="text-primary-text">
                                Logged {tck.createdDate}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleExpand(tck.id)}
                              className="inline-flex items-center gap-1 text-[13.5px] font-bold text-primary hover:underline cursor-pointer"
                            >
                              <span>{isExpanded ? 'Hide Details' : 'View Investigation Progress'}</span>
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </div>

                          <h3 className="text-[20px] sm:text-[23px] font-bold text-foreground">
                            {tck.subject}
                          </h3>

                          <p className="text-[14.5px] sm:text-[15px] leading-[1.65] text-primary-text">
                            {tck.summary}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13px] sm:text-[13.5px] text-primary-text">
                            <span>Specialist: <strong className="text-foreground">{tck.assignedSpecialist}</strong></span>
                            <span>Category: <strong className="text-foreground">{tck.categoryLabel || tck.category}</strong></span>
                            <span>Last Updated: <strong className="text-primary">{tck.lastUpdated}</strong></span>
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
                                  Investigation Steps
                                </h4>
                                <div className="space-y-4 mb-4">
                                  {tck.timeline && tck.timeline.length > 0 ? (
                                    tck.timeline.map((step, idx) => (
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
                                    ))
                                  ) : (
                                    <p className="text-xs text-primary-text">
                                      Initial triage in progress. Steps will be recorded here.
                                    </p>
                                  )}
                                </div>
                                {tck.resolutionNotes && (
                                  <p className="text-[13.5px] text-primary-text leading-relaxed">
                                    <strong>Engineer Remarks:</strong> {tck.resolutionNotes}
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
              /* REQUIRED EMPTY STATE (User logged in and no tickets) */
              <div className="py-12 sm:py-16 text-center max-w-xl mx-auto">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-3.5">
                  <LifeBuoy size={22} />
                </div>
                <h3 className="text-[22px] sm:text-[25px] font-bold text-foreground">
                  You have no active support tickets
                </h3>
                <p className="mt-2.5 text-[15px] sm:text-[15.5px] leading-relaxed text-primary-text">
                  You do not have any open inquiries with our patient, clinical, or developer support teams.
                  Need guidance with the Pentasent platform? Explore our self-service guides or get in touch.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3">
                  <Link
                    href="/help"
                    className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                  >
                    <span>Visit Pentasent Help Center</span>
                    <ArrowRight
                      size={16}
                      className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/company/contact"
                    className="text-[14px] font-medium text-primary hover:underline mt-1"
                  >
                    Contact Support Directly &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CASE 5: DEFAULT INITIAL VIEW (Non-logged in user, no search active) */}
        {!hasSearched && !isAuthLoading && !isLoggedIn && (
          <div className="py-8 sm:py-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Two Ways to Check Support Status
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-foreground">
                Search with your Ticket ID or Sign in
              </h2>
              <p className="text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                When you log an issue or technical question with Pentasent Support, you receive a ticket ID (e.g.{' '}
                <code className="font-mono text-primary">TCK-XXXXXX</code>).
                Enter it above to see investigation progress, or sign in to view all your recent support tickets.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/help"
                  className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                >
                  <span>Visit Help Center</span>
                  <ArrowRight
                    size={16}
                    className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/company/contact"
                  className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                >
                  <span>Open a New Ticket</span>
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
