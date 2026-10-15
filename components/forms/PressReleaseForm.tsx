'use client';

import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { PRESS_CATEGORIES } from '@/data/press';
import {
  pressReleaseFormSchema,
  type PressReleaseFormData,
} from '@/lib/validations/press';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  ChevronDown,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const fieldBase =
  'w-full h-[52px] px-4 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded outline-none transition-all duration-200 placeholder:text-primary-text focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

const selectWrapper =
  'relative block w-full h-[52px] bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10';

const selectElement =
  'appearance-none w-full h-full pl-4 pr-11 text-[15px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer';

const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10 MB

interface PressReleaseFormProps {
  onValidSubmit: (
    data: PressReleaseFormData,
    banner: File | null,
    document: File | null
  ) => void;
}

export default function PressReleaseForm({ onValidSubmit }: PressReleaseFormProps) {
  // Submitter details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Press release content
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [releaseDateType, setReleaseDateType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  // Files
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ banner?: string; document?: string }>({});

  // Validation
  const [errors, setErrors] = useState<Partial<Record<keyof PressReleaseFormData, string>>>({});

  const handleBannerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_BANNER_SIZE) {
        setFileErrors((prev) => ({
          ...prev,
          banner: 'Banner image exceeds 5MB limit. Please choose a smaller file.',
        }));
        return;
      }
      setFileErrors((prev) => ({ ...prev, banner: undefined }));
      setBannerFile(file);
    }
  };

  const handleDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_DOC_SIZE) {
        setFileErrors((prev) => ({
          ...prev,
          document: 'Document file exceeds 10MB limit. Please choose a smaller file.',
        }));
        return;
      }
      setFileErrors((prev) => ({ ...prev, document: undefined }));
      setDocumentFile(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawData = {
      fullName,
      email,
      phone,
      company,
      websiteUrl,
      title,
      category,
      releaseDateType,
      scheduledDate,
      summary,
      content,
      baseTierId: 'free-standard',
      selectedToolkitIds: [],
    };

    const validationResult = pressReleaseFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof PressReleaseFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof PressReleaseFormData;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);

      // Scroll smoothly to the first error
      const firstErrorKey = Object.keys(fieldErrors)[0];
      const element = document.querySelector(`[name="${firstErrorKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    // Pass validated data and files to open the sidebar
    onValidSubmit(validationResult.data, bannerFile, documentFile);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* ---------------------------------------------
          Section 1: Organization & Contact Information
          --------------------------------------------- */}
      <div>
        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#090909] tracking-tight mb-3">
          1. Submitter & Organization Details
        </h3>
        <div className="space-y-3.5">
          {/* Row: Full Name & Work Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <input
                className={`${fieldBase} ${errors.fullName ? 'border-red-500 bg-red-50/20' : ''}`}
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                required
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 pl-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <input
                className={`${fieldBase} ${errors.email ? 'border-red-500 bg-red-50/20' : ''}`}
                type="email"
                name="email"
                placeholder="Work Email Address *"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 pl-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row: Phone & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <input
                className={`${fieldBase} ${errors.phone ? 'border-red-500 bg-red-50/20' : ''}`}
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                required
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 pl-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                className={`${fieldBase} ${errors.company ? 'border-red-500 bg-red-50/20' : ''}`}
                type="text"
                name="company"
                placeholder="Organization or Company Name *"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
                }}
                required
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-600 pl-1">{errors.company}</p>
              )}
            </div>
          </div>

          {/* Product / Company Website */}
          <div>
            <input
              className={`${fieldBase} ${errors.websiteUrl ? 'border-red-500 bg-red-50/20' : ''}`}
              type="url"
              name="websiteUrl"
              placeholder="Product or Website URL (e.g. https://example.com) *"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                if (errors.websiteUrl) setErrors((prev) => ({ ...prev, websiteUrl: undefined }));
              }}
              required
            />
            {errors.websiteUrl && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.websiteUrl}</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------
          Section 2: Press Release Content
          --------------------------------------------- */}
      <div className="pt-2 border-t border-[#ded9d5]">
        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#090909] tracking-tight mb-3">
          2. Press Release Details
        </h3>
        <div className="space-y-3.5">
          {/* Headline with Live Character Counter */}
          <div>
            <div className="relative">
              <input
                className={`${fieldBase} pr-20 ${errors.title ? 'border-red-500 bg-red-50/20' : ''}`}
                type="text"
                name="title"
                placeholder="Press Release Headline / Title (10 - 120 chars) *"
                value={title}
                maxLength={120}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                required
              />
              <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono select-none ${
                title.length > 110 ? 'text-amber-600 font-bold' : 'text-[#7d7976]'
              }`}>
                {title.length}/120
              </span>
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.title}</p>
            )}
          </div>

          {/* Row: Sector Category & Target Release Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <label className={selectWrapper}>
              <select
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={selectElement}
              >
                <option value="" disabled>Select Healthcare Sector *</option>
                {PRESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={19} strokeWidth={1.7} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#46413f]" />
            </label>

            {/* Target Release Date Type */}
            <div className="flex gap-2 items-center bg-[#faf9f8] border border-[#ded9d5] rounded p-1.5 h-13">
              <button
                type="button"
                onClick={() => setReleaseDateType('immediate')}
                className={`flex-1 h-full rounded text-[13px] font-medium transition-all cursor-pointer ${
                  releaseDateType === 'immediate'
                    ? 'bg-white shadow-xs text-[#090909] font-semibold border border-[#ded9d5]/60'
                    : 'text-[#5f5c5a] hover:text-[#090909]'
                }`}
              >
                Immediate Release
              </button>
              <button
                type="button"
                onClick={() => setReleaseDateType('scheduled')}
                className={`flex-1 h-full rounded text-[13px] font-medium transition-all cursor-pointer ${
                  releaseDateType === 'scheduled'
                    ? 'bg-white shadow-xs text-[#090909] font-semibold border border-[#ded9d5]/60'
                    : 'text-[#5f5c5a] hover:text-[#090909]'
                }`}
              >
                Schedule Date
              </button>
            </div>
          </div>

          {/* Scheduled Date Input (if scheduled) */}
          {releaseDateType === 'scheduled' && (
            <div>
              <input
                type="date"
                name="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className={fieldBase}
              />
            </div>
          )}

          {/* Executive Summary with Live Character Counter */}
          <div>
            <label className="relative block w-full pt-6 pb-2 px-4 bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
              <div className="absolute left-4 right-4 top-1.5 flex items-center justify-between">
                <span className="text-xs text-[#413c3a]">
                  Executive Summary / Subheadline (30 - 350 chars) *
                </span>
                <span className={`text-[11px] font-mono select-none ${
                  summary.length > 330 ? 'text-amber-600 font-bold' : 'text-[#7d7976]'
                }`}>
                  {summary.length}/350
                </span>
              </div>
              <textarea
                name="summary"
                rows={2}
                maxLength={350}
                placeholder="Brief 1-2 sentence overview of your key announcement..."
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  if (errors.summary) setErrors((prev) => ({ ...prev, summary: undefined }));
                }}
                className="block w-full resize-none text-[15px] text-[#23201f] bg-transparent border-0 outline-none"
              />
            </label>
            {errors.summary && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.summary}</p>
            )}
          </div>

          {/* Full PR Content with Live Character Counter */}
          <div>
            <label className="relative block w-full pt-6 pb-2 px-4 bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
              <div className="absolute left-4 right-4 top-1.5 flex items-center justify-between">
                <span className="text-xs text-[#413c3a]">
                  Full Press Release Content (100 - 5,000 chars) *
                </span>
                <span className={`text-[11px] font-mono select-none ${
                  content.length > 4800 ? 'text-amber-600 font-bold' : 'text-[#7d7976]'
                }`}>
                  {content.length}/5000
                </span>
              </div>
              <textarea
                name="content"
                rows={6}
                maxLength={5000}
                placeholder="Paste the complete text of your press release, including body paragraphs, details, and boilerplates..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                }}
                className="block w-full resize-y text-[15px] text-[#23201f] bg-transparent border-0 outline-none"
              />
            </label>
            {errors.content && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.content}</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------
          Section 3: Upload PR Banner & Document (Separate with Size Checks)
          --------------------------------------------- */}
      <div className="pt-2 border-t border-[#ded9d5]">
        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#090909] tracking-tight mb-1">
          3. Media & Document Uploads
        </h3>
        <p className="text-xs text-[#5f5c5a] mb-3">
          Upload your high-resolution banner image (max 5MB) and press release document (max 10MB) separately.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Banner Upload Box */}
          <div className={`relative border-2 border-dashed rounded-lg p-4 bg-[#faf9f8] hover:bg-[#f6f3f0] transition-colors flex flex-col items-center justify-center text-center min-h-27.5 ${
            fileErrors.banner ? 'border-red-500 bg-red-50/10' : 'border-[#ded9d5]'
          }`}>
            {bannerFile ? (
              <div className="flex items-center gap-2 text-left w-full">
                <ImageIcon className="h-6 w-6 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#090909] truncate">{bannerFile.name}</p>
                  <p className="text-[11px] text-[#5f5c5a]">{(bannerFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBannerFile(null)}
                  className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                  aria-label="Remove banner"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <Upload className="h-5 w-5 text-[#5f5c5a] mb-1" />
                <span className="text-xs font-semibold text-[#090909]">Upload PR Banner Image</span>
                <span className="text-[11px] text-[#7d7976]">PNG, JPG, or WEBP (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBannerUpload}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Document Upload Box */}
          <div className={`relative border-2 border-dashed rounded-lg p-4 bg-[#faf9f8] hover:bg-[#f6f3f0] transition-colors flex flex-col items-center justify-center text-center min-h-27.5 ${
            fileErrors.document ? 'border-red-500 bg-red-50/10' : 'border-[#ded9d5]'
          }`}>
            {documentFile ? (
              <div className="flex items-center gap-2 text-left w-full">
                <FileText className="h-6 w-6 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#090909] truncate">{documentFile.name}</p>
                  <p className="text-[11px] text-[#5f5c5a]">{(documentFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDocumentFile(null)}
                  className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                  aria-label="Remove document"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <FileText className="h-5 w-5 text-[#5f5c5a] mb-1" />
                <span className="text-xs font-semibold text-[#090909]">Upload PR Document File</span>
                <span className="text-[11px] text-[#7d7976]">PDF, DOC, or DOCX (Max 10MB)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>

        {/* File size errors */}
        {(fileErrors.banner || fileErrors.document) && (
          <div className="mt-2 space-y-1">
            {fileErrors.banner && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={13} /> {fileErrors.banner}
              </p>
            )}
            {fileErrors.document && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={13} /> {fileErrors.document}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------
          Streamlined Submit Action: Opens Publishing Sidebar
          --------------------------------------------- */}
      <div className="pt-3">
        <button
          className="w-full h-14 border-0 rounded bg-[#ffa91f] text-[#090909] text-[15px] font-bold cursor-pointer transition-colors duration-200 hover:bg-[#f6a116] flex items-center justify-center gap-2 shadow-xs"
          type="submit"
        >
          <span>Submit Press Release</span>
          <ArrowRight size={17} />
        </button>
        {/* <p className="mt-2 text-center text-xs text-[#7d7976]">
          Next step: Choose free standard review or 24-hr express distribution in the side drawer.
        </p> */}
      </div>
    </form>
  );
}
