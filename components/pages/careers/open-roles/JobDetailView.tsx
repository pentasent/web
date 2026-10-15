'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  CheckCircle2,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  X,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import { JobDetailViewProps } from '@/types/jobs';
import JobApplicationForm from '@/components/forms/JobApplicationForm';
import { useAuth } from '@/context/auth-context';

export default function JobDetailView({ job, basePath = '/company/careers/open-roles' }: JobDetailViewProps) {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const isOwner = !!(user && job.createdByUserId && user.id === job.createdByUserId);
  const isClosedOrPaused = job.status === 'paused' || job.status === 'closed';
  const isExternal = job.applicationMode === 'external' && !!job.externalApplyUrl;

  const handleApplyClick = () => {
    if (isExternal && job.externalApplyUrl) {
      window.open(job.externalApplyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {
        // Fallback
      }
    }
  };

  const isGlobalJob = basePath === '/jobs';
  const isPentasentJob = !job.employerName || job.employerName.trim().toLowerCase() === 'pentasent' || job.sourceType === 'pentasent_created';

  // Section data validation and sanitization
  const companyMissionText = job.aboutCompany?.trim() || '';
  const hasCompanyMission = companyMissionText.length > 0;
  const companyMissionParagraphs = companyMissionText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const validOverview = (job.overview || [])
    .map((p) => p?.trim())
    .filter((p): p is string => !!p && p.length > 0);
  const hasOverview = validOverview.length > 0;

  const validResponsibilities = (job.responsibilities || [])
    .map((r) => r?.trim())
    .filter((r): r is string => !!r && r.length > 0);
  const hasResponsibilities = validResponsibilities.length > 0;

  const validMustHave = (job.mustHaveQualifications || [])
    .map((m) => m?.trim())
    .filter((m): m is string => !!m && m.length > 0);
  const hasMustHave = validMustHave.length > 0;

  const validGoodToHave = (job.goodToHaveQualifications || [])
    .map((g) => g?.trim())
    .filter((g): g is string => !!g && g.length > 0);
  const hasGoodToHave = validGoodToHave.length > 0;

  const validBenefits = (job.benefits || [])
    .map((b) => b?.trim())
    .filter((b): b is string => !!b && b.length > 0);
  const hasBenefits = validBenefits.length > 0;

  const validAboutTeam = job.aboutTeam?.trim() || '';
  const hasAboutTeam = validAboutTeam.length > 0;
  const hasCultureOrTeam = hasBenefits || hasAboutTeam;

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] sm:text-[14px] text-primary-text">
          <li>
            <Link
              href="/"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Home
            </Link>
          </li>
          <li className="flex items-center text-primary-text/40">
            <ChevronRight size={14} />
          </li>
          {isGlobalJob ? (
            <li>
              <Link
                href="/jobs"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Jobs
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/company/careers"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Careers
                </Link>
              </li>
              <li className="flex items-center text-primary-text/40">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link
                  href="/company/careers/open-roles"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Open Roles
                </Link>
              </li>
            </>
          )}
          <li className="flex items-center text-primary-text/40">
            <ChevronRight size={14} />
          </li>
          <li className="font-semibold text-foreground truncate max-w-55 sm:max-w-xs">
            {job.title}
          </li>
        </ol>
      </nav>

      {/* Role Header (Clean & Direct, No Box) */}
      <div className="pb-8">
        {/* Category & Employment Meta Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[12.5px] font-bold uppercase tracking-wider text-[#6b185f]">
            {job.department}
          </span>

          {job.employerName && job.employerName !== 'Pentasent' && (
            <>
              <span className="text-[#ded9d5]">·</span>
              <span className="text-[12.5px] font-bold text-foreground">
                {job.employerName}
              </span>
            </>
          )}

          <span className="text-[#ded9d5]">·</span>
          <span className="text-[12.5px] font-semibold text-[#1b6d47]">
            {job.locationType}
          </span>
          <span className="text-[#ded9d5]">·</span>
          <span className="text-[12.5px] text-primary-text font-medium">
            {job.employmentType}
          </span>

          {isClosedOrPaused && (
            <>
              <span className="text-[#ded9d5]">·</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle size={12} className="text-amber-600" />
                {job.status === 'paused' ? 'Hiring Paused' : 'Closed'}
              </span>
            </>
          )}

          {isOwner && (
            <>
              <span className="text-[#ded9d5]">·</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11.5px] font-bold bg-[#f4ddf0] text-primary border border-[#f0cbe8]">
                Your Created Job
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold text-foreground leading-[1.12] tracking-tight">
          {job.title}
        </h1>

        {/* Inline Metadata Specs */}
        <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-6 text-[14px] sm:text-[15px] text-primary-text">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={16} className="text-primary shrink-0" />
            <span className="text-foreground font-medium">{job.location}</span>
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5">
              <IndianRupee size={16} className="text-primary shrink-0" />
              <span className="text-foreground font-medium">{job.salary}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Briefcase size={16} className="text-primary shrink-0" />
            <span className="text-foreground font-medium">{job.experienceLevel}</span>
          </span>
          {job.timing && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} className="text-primary shrink-0" />
              <span>{job.timing}</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {isOwner ? (
            <Link
              href={`/account/jobs?edit=${job.id}`}
              className="inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-7 py-3 text-[14.5px] font-bold text-white transition-all cursor-pointer shadow-xs"
            >
              <Edit3 size={15} />
              <span>Update Job Posting</span>
            </Link>
          ) : isClosedOrPaused ? (
            <div className="inline-flex items-center gap-2 rounded bg-amber-50 border border-amber-200 px-6 py-3 text-[14px] font-bold text-amber-800">
              <AlertCircle size={16} className="text-amber-600" />
              <span>{job.status === 'paused' ? 'Applications Currently Paused' : 'Position Closed'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleApplyClick}
              className="inline-flex items-center justify-center gap-2 rounded bg-[#ffa91f] px-7 py-3 text-[15px] font-bold text-[#171318] hover:bg-[#ff9e0b] transition-all cursor-pointer shadow-xs"
            >
              <span>{isExternal ? 'Apply on Employer Site' : 'Apply for this role'}</span>
              <ArrowRight size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded border border-[#ded9d5] bg-white px-5 py-3 text-[14px] font-semibold text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
            title="Share job link"
          >
            {copiedLink ? (
              <>
                <Check size={16} className="text-[#1b6d47]" />
                <span className="text-[#1b6d47]">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={16} className="text-primary-text" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Divider below Header */}
      <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />

      {/* Main Layout: 2 Columns with Clean Dividers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Role Details Flow */}
        <div className="lg:col-span-8">
          {/* Section 1: About Company / Our Mission (Dynamic from aboutCompany) */}
          {hasCompanyMission && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Our Mission
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                About {job.employerName || 'Pentasent'}
              </h2>
              <div className="mt-4 space-y-3.5 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.75] text-primary-text">
                {companyMissionParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {hasCompanyMission && (hasOverview || hasResponsibilities || hasMustHave || hasGoodToHave || hasCultureOrTeam) && (
            <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />
          )}

          {/* Section 2: Role Overview */}
          {hasOverview && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                The Opportunity
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Role Overview
              </h2>
              <div className="mt-4 space-y-3.5 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.75] text-primary-text">
                {validOverview.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {hasOverview && (hasResponsibilities || hasMustHave || hasGoodToHave || hasCultureOrTeam) && (
            <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />
          )}

          {/* Section 3: Responsibilities */}
          {hasResponsibilities && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Impact &amp; Scope
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                What You&apos;ll Do
              </h2>
              <ul className="mt-5 space-y-3.5">
                {validResponsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                      {resp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasResponsibilities && (hasMustHave || hasGoodToHave || hasCultureOrTeam) && (
            <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />
          )}

          {/* Section 4: Must-Have Qualifications */}
          {hasMustHave && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Required Experience
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Must-Have Qualifications
              </h2>
              <ul className="mt-5 space-y-3.5">
                {validMustHave.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#edf7f1] text-[#1b6d47] flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasMustHave && (hasGoodToHave || hasCultureOrTeam) && (
            <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />
          )}

          {/* Section 5: Good-to-Have Qualifications */}
          {hasGoodToHave && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Bonus Qualifications
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Good-to-Have Qualifications
              </h2>
              <ul className="mt-5 space-y-3.5">
                {validGoodToHave.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2.5 ml-1.5 mr-1" />
                    <span className="text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasGoodToHave && hasCultureOrTeam && (
            <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />
          )}

          {/* Section 6: Benefits & Culture */}
          {hasCultureOrTeam && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Perks &amp; Culture
              </span>
              {hasBenefits && (
                <>
                  <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                    Benefits &amp; Work Culture
                  </h2>
                  <ul className={`mt-5 space-y-3.5 ${hasAboutTeam ? 'mb-7' : ''}`}>
                    {validBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {hasAboutTeam && (
                <div className={hasBenefits ? 'pt-4 border-t border-[#f0ece9]' : 'mt-1.5'}>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-foreground mb-2">
                    About the Team
                  </h3>
                  <p className="text-[15px] sm:text-[16px] leading-[1.75] text-primary-text">
                    {validAboutTeam}
                  </p>
                </div>
              )}
            </div>
          )}

          {(hasCompanyMission || hasOverview || hasResponsibilities || hasMustHave || hasGoodToHave || hasCultureOrTeam) && (
            <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />
          )}

          {/* Section 7: Apply Form Container (Direct & Open) */}
          <div ref={formRef} className="pt-2">
            {isOwner ? (
              <div className="py-6 sm:py-8">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Job Author Controls
                </span>
                <h2 className="mt-1.5 text-[26px] sm:text-[32px] font-bold text-foreground tracking-tight">
                  You posted this healthcare position
                </h2>
                <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-primary-text max-w-xl">
                  As the creator of this job opening, you can manage candidate applications, edit
                  requirements, or adjust hiring availability directly from your recruiter dashboard.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/account/jobs?edit=${job.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-7 py-3.5 text-[14.5px] font-bold text-white transition-all cursor-pointer shadow-xs"
                  >
                    <Edit3 size={15} />
                    <span>Update Job Posting</span>
                  </Link>
                  <Link
                    href="/account/jobs"
                    className="inline-flex items-center justify-center gap-2 rounded border border-[#ded9d5] bg-white px-6 py-3.5 text-[14px] font-semibold text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                  >
                    <span>View Candidates & Applications</span>
                  </Link>
                </div>
              </div>
            ) : isClosedOrPaused ? (
              <div className="py-6 sm:py-8">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-amber-800">
                  Applications Closed
                </span>
                <h2 className="mt-1.5 text-[26px] sm:text-[32px] font-bold text-foreground tracking-tight">
                  {job.status === 'paused' ? 'Applications Temporarily Paused' : 'Position Closed'}
                </h2>
                <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-primary-text max-w-xl">
                  {job.status === 'paused'
                    ? 'The hiring team is currently reviewing existing applicants and is not accepting new resumes at this time. Please check back later or explore other open vacancies.'
                    : 'This position has expired or been filled. We are no longer accepting candidate submissions for this opening. Please explore our other verified roles.'}
                </p>
                <div className="mt-6">
                  <Link
                    href={basePath}
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-7 py-3.5 text-[14.5px] font-bold text-white transition-all cursor-pointer shadow-xs"
                  >
                    <span>Browse Other Open Roles</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ) : isExternal ? (
              <div className="py-6 sm:py-8">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  External Application
                </span>
                <h2 className="mt-1.5 text-[26px] sm:text-[32px] font-bold text-foreground tracking-tight">
                  Apply on Employer Site
                </h2>
                <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-primary-text max-w-xl">
                  {job.employerName || 'This employer'} manages candidate applications directly through their official career portal.
                  Click below to be redirected to their application page.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleApplyClick}
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#ffa91f] px-8 py-3.5 text-[15px] font-bold text-[#171318] hover:bg-[#ff9e0b] transition-all cursor-pointer"
                  >
                    <span>Continue to Employer Application</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : !isFormOpen ? (
              <div className="py-6 sm:py-8">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Join Our Team
                </span>
                <h2 className="mt-1.5 text-[26px] sm:text-[32px] font-bold text-foreground tracking-tight">
                  Ready to apply for this role?
                </h2>
                <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-primary-text max-w-xl">
                  Take the next step in your career. Submit your resume, qualifications, and
                  details directly to our hiring team.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleApplyClick}
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#ffa91f] px-8 py-3.5 text-[15px] font-bold text-[#171318] hover:bg-[#ff9e0b] transition-all cursor-pointer"
                  >
                    <span>Apply for this position</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-2"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[24px] sm:text-[28px] font-bold text-foreground">
                    Candidate Application
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-medium text-primary-text hover:text-foreground hover:bg-[#faf9f8] border border-[#ded9d5] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                    <span>Close form</span>
                  </button>
                </div>

                <JobApplicationForm job={job} onCancel={handleCloseForm} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Clean Open Sidebar (Matching Press Page 'What We Offer' Side Layout) */}
        <aside className="lg:col-span-4 border-t border-[#e8e4e1] pt-10 lg:border-0 lg:pt-0">
          <div className="sticky top-28 space-y-6">
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Job Overview
              </span>
              <h3 className="mt-1 text-[22px] sm:text-[24px] font-bold leading-[1.2] text-foreground">
                Role Highlights
              </h3>
            </div>

            <div className="space-y-4 text-[14px]">
              <div>
                <span className="block text-[12px] uppercase tracking-wider text-primary-text font-medium">
                  Department
                </span>
                <span className="font-semibold text-foreground">{job.department}</span>
              </div>

              <div>
                <span className="block text-[12px] uppercase tracking-wider text-primary-text font-medium">
                  Location
                </span>
                <span className="font-semibold text-foreground">{job.location}</span>
              </div>

              <div>
                <span className="block text-[12px] uppercase tracking-wider text-primary-text font-medium">
                  Employment Type
                </span>
                <span className="font-semibold text-foreground">
                  {job.employmentType} ({job.locationType})
                </span>
              </div>

              <div>
                <span className="block text-[12px] uppercase tracking-wider text-primary-text font-medium">
                  Compensation
                </span>
                <span className="font-semibold text-foreground">{job.salary}</span>
              </div>

              <div>
                <span className="block text-[12px] uppercase tracking-wider text-primary-text font-medium">
                  Timing &amp; Hours
                </span>
                <span className="font-medium text-foreground">{job.timing}</span>
              </div>

              <div>
                <span className="block text-[12px] uppercase tracking-wider text-primary-text font-medium">
                  Date Posted
                </span>
                <span className="font-medium text-foreground">{job.postedDate}</span>
              </div>
            </div>

            <div className="pt-2">
              {isOwner ? (
                <Link
                  href={`/account/jobs?edit=${job.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-6 py-3.5 text-[15px] font-bold text-white transition-all cursor-pointer shadow-xs"
                >
                  <Edit3 size={15} />
                  <span>Update Job Posting</span>
                </Link>
              ) : isClosedOrPaused ? (
                <div className="w-full text-center py-3.5 px-4 rounded bg-amber-50 border border-amber-200 text-[14px] font-bold text-amber-800">
                  <span>{job.status === 'paused' ? 'Applications Currently Paused' : 'Position Closed'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#ffa91f] px-6 py-3.5 text-[15px] font-bold text-[#171318] hover:bg-[#ff9e0b] transition-all cursor-pointer shadow-xs"
                >
                  <span>{isExternal ? 'Apply on Employer Site' : 'Apply Now'}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>

            {/* Candidate Protection Note */}
            {/* Candidate Protection Note (For Pentasent Roles) */}
            {isPentasentJob && (
              <div className="pt-6 border-t border-[#e8e4e1]">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-[14px] mb-1.5">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Candidate Protection</span>
                </div>
                <p className="text-[13px] text-primary-text leading-relaxed">
                  Official communications only originate from verified{' '}
                  <strong className="text-foreground">@pentasent.com</strong> email addresses. We never charge application fees.
                </p>
                <Link
                  href="/company/careers/phishing-scam"
                  className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
                >
                  <span>Learn how to protect yourself</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Tracker Link */}
            <div className="pt-4 border-t border-[#e8e4e1]">
              <Link
                href="/tracker/job-status"
                className="text-[13.5px] font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <span>Track Pentasent Application Status</span>
                <ArrowRight size={13} className="text-primary" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
