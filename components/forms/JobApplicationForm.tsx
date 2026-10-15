'use client';

import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { JobOpening } from '@/types/jobs';
import {
  jobApplicationSchema,
  type JobApplicationFormData,
} from '@/lib/validations/careers';
import { uploadResumeAsset } from '@/lib/upload';
import { apiClient } from '@/lib/api';

interface JobApplicationFormProps {
  job: JobOpening;
  onSuccess?: (applicationId: string) => void;
  onCancel?: () => void;
}

const fieldBase =
  'w-full h-[52px] px-4 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-lg outline-none transition-all duration-200 placeholder:text-primary-text/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

const selectWrapper =
  'relative block w-full h-[52px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10';

const selectElement =
  'appearance-none w-full h-full pl-4 pr-11 text-[15px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer';

const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10 MB

export default function JobApplicationForm({
  job,
  onSuccess,
  onCancel,
}: JobApplicationFormProps) {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [earliestStartDate, setEarliestStartDate] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [heardFrom, setHeardFrom] = useState('');

  // Resume file state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  // Status & Validation
  const [errors, setErrors] = useState<Partial<Record<keyof JobApplicationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Resume File Upload handler
  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      setResumeError('Please upload a valid PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setResumeError('Resume file size must not exceed 10 MB.');
      return;
    }

    setResumeError(null);
    setResumeFile(file);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeError(null);
  };

  // Submit Handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resumeFile) {
      setResumeError('Please upload your resume / CV to proceed.');
      return;
    }

    const rawData = {
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      fullName,
      email,
      phone,
      currentLocation,
      linkedinUrl: linkedinUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
      experienceYears,
      earliestStartDate,
      expectedSalary: expectedSalary || undefined,
      coverLetter: coverLetter || undefined,
      heardFrom: heardFrom || undefined,
    };

    const validation = jobApplicationSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof JobApplicationFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof JobApplicationFormData;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Upload resume directly to Cloudinary media storage (folder: pentasent/jobs/resumes)
      const resumeAsset = await uploadResumeAsset(resumeFile);

      // 2. Submit candidate application to backend API
      const res = await apiClient<{ trackingNumber: string; applicationId: string; status: string }>(
        `/jobs/${job.id}/applications`,
        {
          method: 'POST',
          body: JSON.stringify({
            fullName,
            email,
            phone: phone || null,
            currentLocation: currentLocation || null,
            linkedinUrl: linkedinUrl || null,
            portfolioUrl: portfolioUrl || null,
            experienceYears: experienceYears || null,
            earliestStartDate: earliestStartDate || null,
            expectedSalary: expectedSalary || null,
            coverLetter: coverLetter || null,
            heardFrom: heardFrom || null,
            resumeUrl: resumeAsset.url,
            resumeOriginalFilename: resumeFile.name,
            resumeSizeBytes: resumeFile.size,
          }),
        }
      );

      const generatedId =
        res.data?.trackingNumber || `APP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedAppId(generatedId);
      setToastMessage(`Application submitted successfully! Tracking ID: ${generatedId}`);
      if (onSuccess) onSuccess(generatedId);
    } catch (err: unknown) {
      console.error('Job application submission error:', err);
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setResumeError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If application was successfully submitted, show confirmation card
  if (submittedAppId) {
    return (
      <div className="w-full py-8 sm:py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#166534]/10 text-[#166534] mb-6">
          <CheckCircle2 size={36} strokeWidth={2.2} />
        </div>

        <h3 className="text-[24px] sm:text-[28px] font-bold text-foreground tracking-tight">
          Application Received!
        </h3>

        <p className="mt-3 text-[15px] sm:text-[16px] text-primary-text max-w-lg mx-auto leading-[1.7]">
          Thank you, <strong className="text-foreground">{fullName}</strong>. We have received your application for the{' '}
          <strong className="text-foreground">{job.title}</strong> position.
        </p>

        <div className="mt-6 inline-flex flex-col items-center bg-[#faf9f8] border border-[#ded9d5] rounded px-6 py-4">
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            Your Application Tracking ID
          </span>
          <span className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-primary mt-0.5 font-mono">
            {submittedAppId}
          </span>
        </div>

        <p className="mt-4 text-[13px] sm:text-[14px] text-primary-text/80 max-w-md mx-auto">
          Save this tracking ID. You can check your application review progress anytime on our status tracker.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/tracker/job-status?id=${submittedAppId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#ffa91f] px-7 py-3.5 text-[15px] font-bold text-[#171318] hover:bg-[#ff9e0b] transition-all cursor-pointer"
          >
            <span>Track Application Status</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/company/careers/open-roles"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded border border-[#ded9d5] bg-white px-7 py-3.5 text-[15px] font-semibold text-foreground hover:bg-[#faf9f8] transition-all cursor-pointer"
          >
            View More Roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ede6df] gap-4">
        <div>
          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-[#6b185f]">
            Candidate Application
          </span>
          <h3 className="text-[22px] sm:text-[26px] font-bold text-foreground tracking-tight mt-1">
            Apply for {job.title}
          </h3>
          <p className="text-[14px] text-primary-text mt-0.5">
            {job.department} · {job.location} · {job.employmentType}
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-text hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={18} />
            <span>Close form</span>
          </button>
        )}
      </div>

      {/* Safety Notice */}
      <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 p-4 text-[13.5px] leading-relaxed text-primary-text">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <span>
          Pentasent prioritizes candidate safety. We never charge application fees or ask for sensitive financial credentials. Official communications only originate from verified{' '}
          <strong className="text-foreground">@pentasent.com</strong> addresses. <Link href="/company/careers/phishing-scam" className="text-primary underline">Know more about Phishing Scams</Link>
        </span>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Ananya Sharma"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              className={`${fieldBase} ${errors.fullName ? 'border-red-500 bg-red-50/20' : ''}`}
              required
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. ananya@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`${fieldBase} ${errors.email ? 'border-red-500 bg-red-50/20' : ''}`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Row 2: Phone & Current Location */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className={`${fieldBase} ${errors.phone ? 'border-red-500 bg-red-50/20' : ''}`}
              required
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Current Location (City, Country) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="currentLocation"
              placeholder="e.g. Bengaluru, India"
              value={currentLocation}
              onChange={(e) => {
                setCurrentLocation(e.target.value);
                if (errors.currentLocation) setErrors((prev) => ({ ...prev, currentLocation: undefined }));
              }}
              className={`${fieldBase} ${errors.currentLocation ? 'border-red-500 bg-red-50/20' : ''}`}
              required
            />
            {errors.currentLocation && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.currentLocation}</p>
            )}
          </div>
        </div>

        {/* Row 3: Experience & Earliest Start Date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Years of Experience <span className="text-red-600">*</span>
            </label>
            <label className={selectWrapper}>
              <select
                value={experienceYears}
                onChange={(e) => {
                  setExperienceYears(e.target.value);
                  if (errors.experienceYears) setErrors((prev) => ({ ...prev, experienceYears: undefined }));
                }}
                className={selectElement}
                required
              >
                <option value="" disabled>Select total experience</option>
                <option value="1 - 2 Years">1 - 2 Years</option>
                <option value="3 - 5 Years">3 - 5 Years</option>
                <option value="6 - 8 Years">6 - 8 Years</option>
                <option value="9+ Years">9+ Years</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-text" />
            </label>
            {errors.experienceYears && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.experienceYears}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Earliest Start Date <span className="text-red-600">*</span>
            </label>
            <label className={selectWrapper}>
              <select
                value={earliestStartDate}
                onChange={(e) => {
                  setEarliestStartDate(e.target.value);
                  if (errors.earliestStartDate) setErrors((prev) => ({ ...prev, earliestStartDate: undefined }));
                }}
                className={selectElement}
                required
              >
                <option value="" disabled>Select availability</option>
                <option value="Immediately">Immediately</option>
                <option value="Within 15 days">Within 15 days</option>
                <option value="30 days (1 month)">30 days (1 month)</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-text" />
            </label>
            {errors.earliestStartDate && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.earliestStartDate}</p>
            )}
          </div>
        </div>

        {/* Row 4: LinkedIn & Portfolio / GitHub URLs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => {
                setLinkedinUrl(e.target.value);
                if (errors.linkedinUrl) setErrors((prev) => ({ ...prev, linkedinUrl: undefined }));
              }}
              className={`${fieldBase} ${errors.linkedinUrl ? 'border-red-500 bg-red-50/20' : ''}`}
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.linkedinUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              GitHub / Portfolio / Personal Site
            </label>
            <input
              type="url"
              name="portfolioUrl"
              placeholder="https://github.com/username or portfolio"
              value={portfolioUrl}
              onChange={(e) => {
                setPortfolioUrl(e.target.value);
                if (errors.portfolioUrl) setErrors((prev) => ({ ...prev, portfolioUrl: undefined }));
              }}
              className={`${fieldBase} ${errors.portfolioUrl ? 'border-red-500 bg-red-50/20' : ''}`}
            />
            {errors.portfolioUrl && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.portfolioUrl}</p>
            )}
          </div>
        </div>

        {/* Row 5: Expected Salary & How did you hear */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              Expected Annual Compensation (Optional)
            </label>
            <input
              type="text"
              name="expectedSalary"
              placeholder="e.g. ₹32 LPA or $90k USD"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className={fieldBase}
            />
          </div>

          <div>
            <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
              How did you hear about Pentasent?
            </label>
            <label className={selectWrapper}>
              <select
                value={heardFrom}
                onChange={(e) => setHeardFrom(e.target.value)}
                className={selectElement}
              >
                <option value="">Select an option (Optional)</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Employee Referral">Employee Referral</option>
                <option value="Company Website / Life Page">Company Website / Life Page</option>
                <option value="Twitter / X">Twitter / X</option>
                <option value="Healthcare News / Press">Healthcare News / Press</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-text" />
            </label>
          </div>
        </div>

        {/* Resume / CV Upload Box */}
        <div>
          <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
            Resume / CV <span className="text-red-600">*</span>
          </label>

          {!resumeFile ? (
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#ded9d5] bg-[#faf9f8] p-6 sm:p-8 text-center transition-all hover:bg-white hover:border-primary cursor-pointer group">
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeChange}
                className="hidden"
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
                <Upload size={22} />
              </div>
              <p className="text-[14.5px] font-semibold text-foreground">
                Click to upload or drag & drop your resume
              </p>
              <p className="text-[12.5px] text-primary-text mt-1">
                Accepted formats: PDF, DOC, DOCX (Max size: 10 MB)
              </p>
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-[#ded9d5] bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-foreground truncate">
                    {resumeFile.name}
                  </p>
                  <p className="text-[12px] text-primary-text">
                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-1.5 text-primary-text/70 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove resume"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {resumeError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 pl-1 font-medium">
              <AlertCircle size={14} />
              <span>{resumeError}</span>
            </p>
          )}
        </div>

        {/* Cover Letter / Note */}
        <div>
          <label className="block text-[13.5px] font-bold text-foreground mb-1.5">
            Cover Letter / Note for Hiring Team (Optional)
          </label>
          <textarea
            name="coverLetter"
            rows={4}
            placeholder="Tell us about yourself, why you want to join Pentasent, and what excites you about this role..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-4 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-lg outline-none transition-all duration-200 placeholder:text-primary-text/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 resize-y"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-[#ede6df] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-text max-w-sm">
            By applying, you agree that your details will be processed in accordance with our{' '}
            <Link href="/legal/privacy" className="text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#ded9d5] bg-white text-[15px] font-semibold text-foreground hover:bg-[#faf9f8] transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#ffa91f] px-8 py-3 text-[15px] font-bold text-[#171318] hover:bg-[#ff9e0b] transition-all cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin text-black" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Floating Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 right-6 z-80 bg-[#1c181a] text-white px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 text-sm font-medium max-w-md"
          >
            <CheckCircle2 size={18} className="text-[#ffa91f] shrink-0" />
            <span className="flex-1">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white shrink-0 ml-1 cursor-pointer"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
