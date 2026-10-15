'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { JobOpening, RecruiterCandidateDto } from '@/types/jobs';
import PostJobModal from '@/components/jobs/PostJobModal';
import JobCard from '@/components/jobs/JobCard';
import { JobsListShimmer } from '@/shimmer/tracker';
import {
  Briefcase,
  PlusCircle,
  Users,
  Eye,
  ExternalLink,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  X,
  ChevronDown,
  Mail,
  Phone,
  Globe,
  Loader2,
  AlertCircle,
  Filter,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  MoreHorizontal,
} from 'lucide-react';

export default function AccountJobsPage() {
  const { user, status } = useAuth();
  const copy = ACCOUNT_HERO_COPY.jobs;
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;

  const [myJobs, setMyJobs] = useState<JobOpening[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobOpening | null>(null);
  const [openMenuJobId, setOpenMenuJobId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected job for candidate management
  const [selectedJobForCandidates, setSelectedJobForCandidates] = useState<JobOpening | null>(null);
  const [candidates, setCandidates] = useState<RecruiterCandidateDto[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [candidateFilterStatus, setCandidateFilterStatus] = useState<string>('all');
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  // Lock background scroll when delete modal or candidate modal is open
  useEffect(() => {
    if (deletingJob || selectedJobForCandidates) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [deletingJob, selectedJobForCandidates]);

  // Load created jobs
  const fetchMyJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await apiClient<JobOpening[]>('/jobs/mine');
      if (res.success && res.data) {
        setMyJobs(res.data);
      } else {
        setMyJobs([]);
      }
    } catch (err) {
      console.warn('Unable to load user created jobs:', err);
      setMyJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      if (isLoggedIn) {
        void fetchMyJobs();
      } else if (!isAuthLoading) {
        setIsLoadingJobs(false);
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isAuthLoading]);

  // Check URL query for ?edit=jobId or ?edit=slug on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && myJobs.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const editParam = urlParams.get('edit');
      if (editParam) {
        const found = myJobs.find((j) => j.id === editParam || j.slug === editParam);
        if (found) {
          setEditingJob(found);
        }
      }
    }
  }, [myJobs]);

  // Close action dropdown menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuJobId(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuJobId(null);
      }
    };
    if (openMenuJobId) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenuJobId]);

  // Toggle hiring/resume intake status (active vs paused) with optimistic UI & background API
  const handleToggleHiringStatus = (job: JobOpening) => {
    const nextStatus = job.status === 'published' ? 'paused' : 'published';
    const prevStatus = job.status;

    // Instant optimistic update on UI
    setMyJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
    );

    const statusLabel =
      nextStatus === 'published'
        ? 'Active (Accepting Resumes)'
        : 'Hiring Paused (Not Accepting Resumes)';

    setToastMsg({
      type: 'success',
      text: `"${job.title}" is now ${statusLabel}.`,
    });
    setTimeout(() => setToastMsg(null), 4000);

    // Background update - do not block UI
    void apiClient(`/jobs/${job.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    }).catch((err) => {
      console.error('Failed to update job status in background:', err);
      // Revert optimistic update on failure
      setMyJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: prevStatus } : j))
      );
      setToastMsg({
        type: 'error',
        text: `Failed to update status for "${job.title}". Reverted changes.`,
      });
      setTimeout(() => setToastMsg(null), 4000);
    });
  };

  // Confirm delete and expire job with optimistic UI & background bulk updates
  const handleConfirmDelete = () => {
    if (!deletingJob) return;
    const targetId = deletingJob.id;
    const targetTitle = deletingJob.title;

    // Instant optimistic UI update: remove job from list immediately
    setMyJobs((prev) => prev.filter((j) => j.id !== targetId));
    setDeletingJob(null);

    setToastMsg({
      type: 'info',
      text: `Job "${targetTitle}" deleted and closed. All applicant statuses updated in background.`,
    });
    setTimeout(() => setToastMsg(null), 5000);

    // Background delete - triggers bulk status update for all candidates without blocking UI
    void apiClient(`/jobs/${targetId}`, {
      method: 'DELETE',
    }).catch((err) => {
      console.error('Failed to delete job in background:', err);
      // Refresh to restore accurate state on error
      void fetchMyJobs();
      setToastMsg({
        type: 'error',
        text: `Failed to delete "${targetTitle}". Please try again.`,
      });
      setTimeout(() => setToastMsg(null), 4000);
    });
  };

  // Load candidates for a specific job
  const handleOpenCandidates = async (job: JobOpening) => {
    setSelectedJobForCandidates(job);
    setIsLoadingCandidates(true);
    try {
      const res = await apiClient<{ candidates: RecruiterCandidateDto[] }>(
        `/jobs/${job.id}/candidates`
      );
      if (res.success && res.data?.candidates) {
        setCandidates(res.data.candidates);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.warn('Unable to load job candidates:', err);
      setCandidates([]);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  const handleCloseCandidates = () => {
    setSelectedJobForCandidates(null);
    setCandidates([]);
    setStatusSuccessMsg(null);
  };

  // Update candidate status
  const handleUpdateStatus = async (
    candidateId: string,
    newStatus: string,
    newStage?: string
  ) => {
    setUpdatingCandidateId(candidateId);
    setStatusSuccessMsg(null);
    try {
      const res = await apiClient<RecruiterCandidateDto>(
        `/jobs/applications/${candidateId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status: newStatus,
            stage: newStage || newStatus,
            stageLabel: newStatus.replace(/_/g, ' ').toUpperCase(),
            hiringTeamNote: `Status updated to ${newStatus} by recruiter on ${new Date().toLocaleDateString()}`,
          }),
        }
      );

      if (res.success && res.data) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? { ...c, ...res.data } : c))
        );
        setStatusSuccessMsg('Candidate status updated successfully');
        setTimeout(() => setStatusSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      console.error('Failed to update candidate status:', err);
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  // Filtered jobs
  const filteredJobs = myJobs.filter((j) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      j.title.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      (j.employerName || '').toLowerCase().includes(q)
    );
  });

  // Filtered candidates
  const filteredCandidates = candidates.filter((c) => {
    if (candidateFilterStatus === 'all') return true;
    return c.status === candidateFilterStatus;
  });

  return (
    <main className="min-h-screen bg-white">
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ded9d5]">
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground">
              Your Posted Healthcare Jobs
            </h2>
            <p className="text-[13.5px] sm:text-[14px] text-primary-text mt-0.5">
              Manage your clinical vacancies, view applicants, and update review stages.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPostJobModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary-hover px-5 py-2.5 text-[14px] font-bold text-white transition-all cursor-pointer shadow-2xs"
          >
            <PlusCircle size={16} />
            <span>Post a New Job</span>
          </button>
        </div>

        {/* Filter and Search Bar: Only shown when jobs exist and loading is complete */}
        {!isLoadingJobs && myJobs.length > 0 && (
          <div className="my-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your postings..."
                className="w-full h-10 pl-9 pr-4 text-[13.5px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-md outline-none focus:border-primary focus:bg-white"
              />
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <span className="text-[13px] text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'posting' : 'postings'}
            </span>
          </div>
        )}

        {/* Job Listings, Shimmer, or Empty State */}
        {isLoadingJobs ? (
          <JobsListShimmer />
        ) : myJobs.length === 0 ? (
          <div className="py-14 sm:py-16 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-3.5">
              <Briefcase size={22} />
            </div>
            <h3 className="text-[19px] sm:text-[21px] font-bold text-foreground">
              No Created Jobs Yet
            </h3>
            <p className="mt-2 text-[14px] sm:text-[15px] text-primary-text leading-relaxed">
              You haven&apos;t posted any healthcare jobs yet. Post vacancies to attract top medical
              innovators, clinical researchers, and engineers.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[13.5px] font-bold hover:bg-primary-hover shadow-2xs cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>Post Your First Job</span>
              </button>
            </div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="divide-y divide-[#e8e4e1]">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                basePath="/jobs"
                index={index}
                isOwner={true}
                actions={
                  <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                    {/* Left: Candidates direct access & Status badge */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {job.applicationMode === 'platform' && (
                        <button
                          type="button"
                          onClick={() => handleOpenCandidates(job)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-[12.5px] font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <Users size={13} />
                          <span>Candidates ({job.applicationsCount || 0})</span>
                        </button>
                      )}

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border ${
                          job.status === 'published'
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold'
                            : job.status === 'paused'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-800 font-semibold'
                            : 'bg-rose-50/80 border-rose-200 text-rose-800 font-semibold'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            job.status === 'published'
                              ? 'bg-emerald-600'
                              : job.status === 'paused'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        <span>
                          {job.status === 'published'
                            ? 'Accepting Resumes'
                            : job.status === 'paused'
                            ? 'Hiring Paused'
                            : 'Closed'}
                        </span>
                      </span>
                    </div>

                    {/* Right: Three-dots Action Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuJobId(openMenuJobId === job.id ? null : job.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12.5px] font-semibold transition-all cursor-pointer shadow-2xs ${
                          openMenuJobId === job.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8]'
                        }`}
                        title="Manage position actions"
                        aria-haspopup="true"
                        aria-expanded={openMenuJobId === job.id}
                      >
                        <MoreHorizontal size={16} />
                        <span>Actions</span>
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {openMenuJobId === job.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 bottom-full mb-1.5 w-52 rounded-lg bg-white border border-[#ded9d5] shadow-xl py-1.5 z-40 text-[13px]"
                          >
                            {job.applicationMode === 'platform' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuJobId(null);
                                  handleOpenCandidates(job);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                              >
                                <Users size={14} className="text-primary shrink-0" />
                                <span>Candidates ({job.applicationsCount || 0})</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                setEditingJob(job);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                            >
                              <Edit3 size={14} className="text-foreground/70 shrink-0" />
                              <span>Update Position</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                handleToggleHiringStatus(job);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                            >
                              {job.status === 'published' ? (
                                <>
                                  <PauseCircle size={14} className="text-amber-600 shrink-0" />
                                  <span>Pause Hiring Intake</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle size={14} className="text-emerald-600 shrink-0" />
                                  <span>Resume Candidate Intake</span>
                                </>
                              )}
                            </button>

                            <a
                              href={`/jobs/${job.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenMenuJobId(null)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                            >
                              <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                              <span>View Public Page</span>
                            </a>

                            <div className="my-1 border-t border-[#ded9d5]" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                setDeletingJob(job);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-rose-600 font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} className="text-rose-600 shrink-0" />
                              <span>Delete & Close Job</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center max-w-sm mx-auto">
            <p className="text-[14.5px] text-primary-text">
              No postings match &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2.5 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Candidate Management Drawer / Modal */}
      <AnimatePresence>
        {selectedJobForCandidates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCandidates}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
            >
              {/* Drawer Header (Fixed shrink-0) */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
                <div>
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-primary">
                    Candidate Management
                  </span>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground">
                    Applicants for: {selectedJobForCandidates.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleCloseCandidates}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status filter bar (Fixed shrink-0) */}
              <div className="shrink-0 px-6 py-3 border-b border-[#f0ece9] bg-[#faf8f6] flex flex-wrap items-center justify-between gap-3 text-[13px]">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-muted-foreground" />
                  <span className="font-semibold text-foreground">Status Filter:</span>
                  <select
                    value={candidateFilterStatus}
                    onChange={(e) => setCandidateFilterStatus(e.target.value)}
                    className="h-8 px-2 rounded-md border border-[#ded9d5] bg-white text-[13px] outline-none"
                  >
                    <option value="all">All Applicants</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="offer_extended">Offer Extended</option>
                    <option value="not_selected">Not Selected</option>
                  </select>
                </div>

                {statusSuccessMsg && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <CheckCircle2 size={13} />
                    {statusSuccessMsg}
                  </span>
                )}
              </div>

              {/* Candidates List Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoadingCandidates ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading candidate applications...</span>
                  </div>
                ) : filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[17px] font-bold text-foreground">
                              {candidate.candidateName}
                            </h4>
                            <span className="font-mono text-[11px] font-bold text-primary px-1.5 py-0.5 rounded bg-white border border-[#ded9d5]">
                              {candidate.trackingNumber}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-primary-text">
                            <span className="inline-flex items-center gap-1">
                              <Mail size={13} className="text-muted-foreground" />
                              <a href={`mailto:${candidate.candidateEmail}`} className="hover:underline">
                                {candidate.candidateEmail}
                              </a>
                            </span>

                            {candidate.candidatePhone && (
                              <span className="inline-flex items-center gap-1">
                                <Phone size={13} className="text-muted-foreground" />
                                <span>{candidate.candidatePhone}</span>
                              </span>
                            )}

                            {candidate.candidateLocation && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={13} className="text-muted-foreground" />
                                <span>{candidate.candidateLocation}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Updater Dropdown */}
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[12px] font-bold uppercase text-muted-foreground">
                            Status:
                          </label>
                          <select
                            disabled={updatingCandidateId === candidate.id}
                            value={candidate.status}
                            onChange={(e) => handleUpdateStatus(candidate.id, e.target.value)}
                            className="h-9 px-3 text-[13px] font-bold rounded-md bg-white border border-[#ded9d5] text-foreground outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview_scheduled">Interview Scheduled</option>
                            <option value="offer_extended">Offer Extended</option>
                            <option value="not_selected">Not Selected</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Details row: Experience, Start, Salary */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[12.5px] border-t border-[#ded9d5]/60">
                        <div>
                          <strong className="text-foreground">Experience: </strong>
                          <span className="text-primary-text">
                            {candidate.experienceYears || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <strong className="text-foreground">Earliest Start: </strong>
                          <span className="text-primary-text">
                            {candidate.earliestStartDate || 'Flexible'}
                          </span>
                        </div>
                        <div>
                          <strong className="text-foreground">Expected Salary: </strong>
                          <span className="text-primary-text">
                            {candidate.expectedSalary || 'Negotiable'}
                          </span>
                        </div>
                      </div>

                      {/* Cover letter */}
                      {candidate.coverLetter && (
                        <div className="p-3 rounded bg-white border border-[#ded9d5]/60 text-[13px] text-primary-text leading-relaxed">
                          <strong className="text-foreground block mb-1">Candidate Note:</strong>
                          {candidate.coverLetter}
                        </div>
                      )}

                      {/* Resume Download & Profile links */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-3 text-[13px]">
                          {candidate.resumeUrl && (
                            <a
                              href={candidate.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#ded9d5] text-primary font-bold hover:border-primary transition-colors cursor-pointer"
                            >
                              <FileText size={14} />
                              <span>View / Download Resume</span>
                            </a>
                          )}

                          {candidate.linkedinUrl && (
                            <a
                              href={candidate.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink size={13} />
                              <span>LinkedIn</span>
                            </a>
                          )}

                          {candidate.portfolioUrl && (
                            <a
                              href={candidate.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Globe size={13} />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>

                        <span className="text-[12px] text-muted-foreground">
                          Applied {new Date(candidate.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Users size={28} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-[15px] font-semibold text-foreground">
                      No candidates found
                    </p>
                    <p className="text-[13px] mt-1">
                      No candidates match the selected status filter for this position.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer (Fixed shrink-0 with colored background #faf8f6) */}
              <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCandidates}
                  className="px-4 py-2 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf9f8] text-[13px] font-semibold text-foreground transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingJob(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
            >
              {/* Header (Fixed shrink-0) */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-[17.5px] font-bold text-foreground">
                      Delete & Close Position?
                    </h3>
                    <p className="text-[12px] text-muted-foreground">
                      Recruitment & vacancy management
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeletingJob(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <p className="text-[14px] text-primary-text leading-relaxed">
                  Are you sure you want to delete <strong className="text-foreground">{deletingJob.title}</strong>?
                </p>
                <div className="text-[12.5px] text-muted-foreground bg-[#faf9f8] p-3.5 rounded-lg border border-[#ded9d5] space-y-1.5">
                  <p className="flex items-center gap-1.5 text-foreground font-medium">
                    <span>•</span> Listing will be expired and removed immediately.
                  </p>
                  <p className="flex items-center gap-1.5 text-foreground font-medium">
                    <span>•</span> New candidate submissions will be blocked.
                  </p>
                  <p className="flex items-center gap-1.5 text-foreground font-medium">
                    <span>•</span> All candidate applications will be closed in the background.
                  </p>
                </div>
              </div>

              {/* Footer (Fixed shrink-0 with colored background #faf8f6) */}
              <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingJob(null)}
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Trash2 size={14} />
                  <span>Delete & Close Job</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 rounded-lg shadow-lg border text-[13px] font-medium flex items-center gap-2.5 ${
              toastMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : toastMsg.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-[#ded9d5] text-foreground'
            }`}
          >
            <CheckCircle2
              size={16}
              className={toastMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}
            />
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post / Edit Job Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen || !!editingJob}
        jobToEdit={editingJob}
        onClose={() => {
          setIsPostJobModalOpen(false);
          setEditingJob(null);
        }}
        onJobCreated={(newJob) => {
          setMyJobs((prev) => [newJob, ...prev]);
        }}
        onJobUpdated={(updatedJob) => {
          setMyJobs((prev) =>
            prev.map((j) => (j.id === updatedJob.id ? { ...j, ...updatedJob } : j))
          );
        }}
      />
    </main>
  );
}
