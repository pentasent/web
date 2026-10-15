'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { JobOpening } from '@/types/jobs';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (newJob: JobOpening) => void;
  onJobUpdated?: (updatedJob: JobOpening) => void;
  jobToEdit?: JobOpening | null;
}

const fieldBase =
  'w-full min-w-0 h-[48px] px-3.5 text-[14px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-md outline-none transition-all duration-200 placeholder:text-primary-text/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

const selectWrapper =
  'relative block w-full min-w-0 h-[48px] bg-[#faf9f8] border border-[#ded9d5] rounded-md transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10';

const selectElement =
  'appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer';

const textareaBase =
  'w-full min-w-0 p-3 text-[14px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-md outline-none transition-all duration-200 placeholder:text-primary-text/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 leading-relaxed';

type LocationType = 'Remote' | 'Hybrid' | 'On-site';
type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
type JobStatus = 'published' | 'paused' | 'closed';

function parseLocationType(val?: string): LocationType {
  if (val === 'Remote' || val === 'Hybrid' || val === 'On-site') return val;
  return 'Remote';
}

function parseEmploymentType(val?: string): EmploymentType {
  if (val === 'Full-time' || val === 'Part-time' || val === 'Contract' || val === 'Internship') return val;
  return 'Full-time';
}

function parseJobStatus(val?: string): JobStatus {
  if (val === 'published' || val === 'paused' || val === 'closed') return val;
  return 'published';
}

interface PostJobFormModalContentProps {
  onClose: () => void;
  onJobCreated?: (newJob: JobOpening) => void;
  onJobUpdated?: (updatedJob: JobOpening) => void;
  jobToEdit?: JobOpening | null;
}

function PostJobFormModalContent({
  onClose,
  onJobCreated,
  onJobUpdated,
  jobToEdit,
}: PostJobFormModalContentProps) {
  const { user, status } = useAuth();
  const isLoggedIn = status === 'authenticated' && !!user;

  // Form Fields initialized from jobToEdit without dummy pre-filled text
  const [title, setTitle] = useState(jobToEdit?.title || '');
  const [department, setDepartment] = useState(jobToEdit?.department || '');
  const [employerName, setEmployerName] = useState(jobToEdit?.employerName || '');
  const [location, setLocation] = useState(jobToEdit?.location || '');
  const [locationType, setLocationType] = useState<LocationType>(
    parseLocationType(jobToEdit?.locationType)
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    parseEmploymentType(jobToEdit?.employmentType)
  );
  const [experienceDisplayText, setExperienceDisplayText] = useState(
    jobToEdit?.experienceLevel || ''
  );
  const [salaryDisplayText, setSalaryDisplayText] = useState(jobToEdit?.salary || '');
  const [timingText, setTimingText] = useState(jobToEdit?.timing || '');
  const [summary, setSummary] = useState(jobToEdit?.summary || '');
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    (jobToEdit?.responsibilities || []).join('\n')
  );
  const [mustHaveText, setMustHaveText] = useState(
    (jobToEdit?.mustHaveQualifications || []).join('\n')
  );
  const [goodToHaveText, setGoodToHaveText] = useState(
    (jobToEdit?.goodToHaveQualifications || []).join('\n')
  );
  const [benefitsText, setBenefitsText] = useState((jobToEdit?.benefits || []).join('\n'));
  const [aboutTeam, setAboutTeam] = useState(jobToEdit?.aboutTeam || '');
  const [aboutCompany, setAboutCompany] = useState(jobToEdit?.aboutCompany || '');
  const [applicationMode, setApplicationMode] = useState<'platform' | 'external'>(
    jobToEdit?.applicationMode || 'platform'
  );
  const [externalApplyUrl, setExternalApplyUrl] = useState(jobToEdit?.externalApplyUrl || '');
  const [statusValue, setStatusValue] = useState<JobStatus>(
    jobToEdit ? parseJobStatus(jobToEdit.status) : 'published'
  );
  const [isPromoted, setIsPromoted] = useState(!!jobToEdit?.isPromoted);

  // Status & Validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successJob, setSuccessJob] = useState<JobOpening | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isLoggedIn) {
      setErrorMsg('You must be logged in to post or update a healthcare job listing.');
      return;
    }

    if (title.trim().length < 3) {
      setErrorMsg('Job title must be at least 3 characters.');
      return;
    }

    if (summary.trim().length < 15) {
      setErrorMsg('Summary must be at least 15 characters describing the role.');
      return;
    }

    if (aboutCompany.trim().length < 10) {
      setErrorMsg('About Company / Organization Mission is required (at least 10 characters).');
      return;
    }

    if (applicationMode === 'external') {
      if (!externalApplyUrl.trim() || !/^https?:\/\//i.test(externalApplyUrl.trim())) {
        setErrorMsg('Please provide a valid external URL starting with http:// or https://');
        return;
      }
    }

    const splitLines = (t: string) =>
      t
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const payload = {
      title: title.trim(),
      department: department.trim(),
      departmentKey: department.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      employerName: employerName.trim(),
      location: location.trim(),
      locationType,
      employmentType,
      experienceDisplayText: experienceDisplayText.trim(),
      salaryDisplayText: salaryDisplayText.trim() || null,
      timingText: timingText.trim() || null,
      summary: summary.trim(),
      overview: [summary.trim()],
      responsibilities: splitLines(responsibilitiesText),
      mustHaveQualifications: splitLines(mustHaveText),
      goodToHaveQualifications: splitLines(goodToHaveText),
      benefits: splitLines(benefitsText),
      aboutTeam: aboutTeam.trim() || null,
      aboutCompany: aboutCompany.trim(),
      applicationMode,
      externalApplyUrl: applicationMode === 'external' ? externalApplyUrl.trim() : null,
      status: jobToEdit ? statusValue : 'published',
      isPromoted,
    };

    setIsSubmitting(true);
    try {
      if (jobToEdit) {
        const res = await apiClient<JobOpening>(`/jobs/${jobToEdit.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          setSuccessJob(res.data);
          if (onJobUpdated) onJobUpdated(res.data);
        } else {
          throw new Error('Failed to update job');
        }
      } else {
        const res = await apiClient<JobOpening>('/jobs', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          setSuccessJob(res.data);
          if (onJobCreated) onJobCreated(res.data);
        } else {
          throw new Error('Failed to create job');
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessJob(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      transition={{ duration: 0.25 }}
      className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
    >
          {/* Header (Fixed shrink-0) */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Briefcase size={16} />
              </div>
              <div>
                <h2 className="text-[17px] sm:text-[18px] font-bold text-foreground">
                  {jobToEdit ? 'Update Healthcare Vacancy' : 'Post a Healthcare Vacancy'}
                </h2>
                <p className="text-[12px] text-muted-foreground">
                  {jobToEdit
                    ? 'Update role details, qualifications, or adjust candidate application status.'
                    : 'Your listing will be instantly published and verified across the network.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Area */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {successJob ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-[22px] font-bold text-foreground">
                  {jobToEdit ? 'Job Listing Updated!' : 'Job Listing Published!'}
                </h3>
                <p className="text-[14px] text-primary-text max-w-md mx-auto leading-relaxed">
                  <strong className="text-foreground">{successJob.title}</strong>{' '}
                  {jobToEdit
                    ? 'has been successfully updated with your latest changes.'
                    : 'is now live on Pentasent Healthcare Jobs. Verified candidates can now review and apply.'}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`/jobs/${successJob.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white text-[13.5px] font-bold hover:bg-primary-hover transition-colors shadow-2xs"
                  >
                    <span>View Public Listing</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ) : !isLoggedIn ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <LogIn size={26} />
                </div>
                <h3 className="text-[20px] font-bold text-foreground">
                  Authentication Required
                </h3>
                <p className="text-[14px] text-primary-text max-w-md mx-auto leading-relaxed">
                  Please log in to your Pentasent account to publish verified job opportunities
                  and track candidates.
                </p>
              </div>
            ) : (
              <form id="post-job-form" onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Job Title & Employer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Medical Oncologist"
                      className={fieldBase}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Employer Name *
                    </label>
                    <input
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      placeholder="e.g. Mayo Clinic or Pentasent"
                      className={fieldBase}
                      required
                    />
                  </div>
                </div>

                {/* Department & Employment Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Engineering, Cardiology"
                      className={fieldBase}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Work Mode
                    </label>
                    <div className={selectWrapper}>
                      <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value as 'Remote' | 'Hybrid' | 'On-site')}
                        className={selectElement}
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Employment Type
                    </label>
                    <div className={selectWrapper}>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as 'Full-time' | 'Part-time' | 'Contract' | 'Internship')}
                        className={selectElement}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Location Description *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, India or Global Remote"
                      className={fieldBase}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Experience Requirement *
                    </label>
                    <input
                      type="text"
                      value={experienceDisplayText}
                      onChange={(e) => setExperienceDisplayText(e.target.value)}
                      placeholder="e.g. 3 - 6 Years"
                      className={fieldBase}
                      required
                    />
                  </div>
                </div>

                {/* Salary & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Salary / Compensation (Optional)
                    </label>
                    <input
                      type="text"
                      value={salaryDisplayText}
                      onChange={(e) => setSalaryDisplayText(e.target.value)}
                      placeholder="e.g. ₹28,00,000 - ₹42,00,000"
                      className={fieldBase}
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                      Timing / Work Hours (Optional)
                    </label>
                    <input
                      type="text"
                      value={timingText}
                      onChange={(e) => setTimingText(e.target.value)}
                      placeholder="e.g. Core overlap 11 AM - 4 PM IST"
                      className={fieldBase}
                    />
                  </div>
                </div>

                {/* About Company / Mission (Mandatory) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c]">
                      About Company / Organization Mission *
                    </label>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Mandatory
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={aboutCompany}
                    onChange={(e) => setAboutCompany(e.target.value)}
                    placeholder="Describe your organization's mission, healthcare vision, and core purpose..."
                    className={textareaBase}
                    required
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    This appears under &quot;Our Mission / About {employerName || 'Company'}&quot; on the job detail page.
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Job Role Summary *
                  </label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Briefly describe the purpose of this healthcare role and what the candidate will achieve..."
                    className={textareaBase}
                    required
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Impact &amp; Responsibilities (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    placeholder="Architect healthcare APIs&#10;Coordinate clinical trials&#10;Maintain HIPAA compliance"
                    className={textareaBase}
                  />
                </div>

                {/* Must-have Qualifications */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Must-have Qualifications (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={mustHaveText}
                    onChange={(e) => setMustHaveText(e.target.value)}
                    placeholder="Board certification in Cardiology&#10;5+ years clinical software engineering"
                    className={textareaBase}
                  />
                </div>

                {/* Good-to-have Qualifications */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Good-to-have Qualifications (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={goodToHaveText}
                    onChange={(e) => setGoodToHaveText(e.target.value)}
                    placeholder="Previous experience with EHR/FHIR systems&#10;Contributions to healthcare open-source tools"
                    className={textareaBase}
                  />
                </div>

                {/* Benefits & Work Culture */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Benefits &amp; Work Culture (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    placeholder="Comprehensive family health insurance&#10;Wellness &amp; fitness allowance&#10;Remote work stipend"
                    className={textareaBase}
                  />
                </div>

                {/* About the Team */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    About the Team (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={aboutTeam}
                    onChange={(e) => setAboutTeam(e.target.value)}
                    placeholder="Our engineering team is a high-velocity group of healthcare builders who value autonomous execution..."
                    className={textareaBase}
                  />
                </div>

                {/* Application Destination Mode */}
                <div className="p-4 rounded-lg bg-[#faf9f8] border border-[#ded9d5] space-y-3">
                  <label className="block text-[13px] font-bold text-foreground">
                    Application Mode
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 text-[13.5px] cursor-pointer">
                      <input
                        type="radio"
                        name="appMode"
                        checked={applicationMode === 'platform'}
                        onChange={() => setApplicationMode('platform')}
                        className="text-primary"
                      />
                      <span className="font-semibold text-foreground">
                        Pentasent Form (Review candidates & resume tracker here)
                      </span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-[13.5px] cursor-pointer">
                      <input
                        type="radio"
                        name="appMode"
                        checked={applicationMode === 'external'}
                        onChange={() => setApplicationMode('external')}
                        className="text-primary"
                      />
                      <span className="font-semibold text-foreground">
                        External URL (Redirect candidate to external site)
                      </span>
                    </label>
                  </div>

                  {applicationMode === 'external' && (
                    <div className="pt-2">
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4f464c] mb-1">
                        External Application URL *
                      </label>
                      <input
                        type="url"
                        value={externalApplyUrl}
                        onChange={(e) => setExternalApplyUrl(e.target.value)}
                        placeholder="https://company.careers/apply/123"
                        className={fieldBase}
                        required={applicationMode === 'external'}
                      />
                    </div>
                  )}
                </div>

                {/* Status & Hiring Availability - Only visible in edit mode */}
                {!!jobToEdit && (
                  <div className="p-4 rounded-lg bg-[#faf9f8] border border-[#ded9d5] space-y-2.5">
                    <label className="block text-[13px] font-bold text-foreground">
                      Hiring & Resume Intake Status
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setStatusValue('published')}
                        className={`px-3 py-2 rounded-md text-[13px] border text-left transition-colors cursor-pointer ${
                          statusValue === 'published'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                            : 'bg-white border-[#ded9d5] text-muted-foreground hover:bg-[#f5f2ef]'
                        }`}
                      >
                        <div className="font-semibold text-emerald-700">🟢 Active Hiring</div>
                        <div className="text-[11px] text-muted-foreground">Accepting Resumes</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusValue('paused')}
                        className={`px-3 py-2 rounded-md text-[13px] border text-left transition-colors cursor-pointer ${
                          statusValue === 'paused'
                            ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                            : 'bg-white border-[#ded9d5] text-muted-foreground hover:bg-[#f5f2ef]'
                        }`}
                      >
                        <div className="font-semibold text-amber-700">⏸️ Paused</div>
                        <div className="text-[11px] text-muted-foreground">Not Accepting Resumes</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusValue('closed')}
                        className={`px-3 py-2 rounded-md text-[13px] border text-left transition-colors cursor-pointer ${
                          statusValue === 'closed'
                            ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold'
                            : 'bg-white border-[#ded9d5] text-muted-foreground hover:bg-[#f5f2ef]'
                        }`}
                      >
                        <div className="font-semibold text-rose-700">⛔ Closed</div>
                        <div className="text-[11px] text-muted-foreground">Expired / Filled</div>
                      </button>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground">
                      {statusValue === 'published' && 'Candidates can freely submit resumes and apply for this opening.'}
                      {statusValue === 'paused' && 'Candidate submissions are temporarily halted. Candidates see "Hiring Paused".'}
                      {statusValue === 'closed' && 'This job is expired/closed. Candidates will be notified that applications are closed.'}
                    </p>
                  </div>
                )}

                {/* Promoted Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="postjob-promoted"
                    checked={isPromoted}
                    onChange={(e) => setIsPromoted(e.target.checked)}
                    className="h-4 w-4 rounded text-primary border-[#ded9d5]"
                  />
                  <label
                    htmlFor="postjob-promoted"
                    className="text-[13px] font-medium text-foreground cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={13} className="text-amber-600 fill-amber-500" />
                    <span>Highlight with Promoted badge on directory</span>
                  </label>
                </div>
              </form>
            )}
          </div>

          {/* Footer (Fixed shrink-0 with colored background #faf8f6) */}
          <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
            {successJob ? (
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
              >
                Close
              </button>
            ) : !isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <a
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors shadow-xs"
                >
                  <span>Log In to Pentasent</span>
                </a>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="post-job-form"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-5 py-2 text-[13px] font-bold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{jobToEdit ? 'Updating Job...' : 'Publishing Job...'}</span>
                    </>
                  ) : (
                    <span>{jobToEdit ? 'Update Job Listing' : 'Publish Verified Job'}</span>
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
  );
}

export default function PostJobModal({
  isOpen,
  onClose,
  onJobCreated,
  onJobUpdated,
  jobToEdit,
}: PostJobModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <PostJobFormModalContent
          key={jobToEdit ? jobToEdit.id : 'new'}
          jobToEdit={jobToEdit}
          onClose={onClose}
          onJobCreated={onJobCreated}
          onJobUpdated={onJobUpdated}
        />
      </div>
    </AnimatePresence>
  );
}
