'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PRESS_BASE_TIERS,
  PRESS_TOOLKIT_ADDONS,
} from '@/data/press';
import type { PressPublishingDrawerProps } from '@/types/press';
import { apiClient } from '@/lib/api';
import { uploadPressAsset } from '@/lib/upload';
import {
  X,
  Zap,
  Info,
  Check,
  Loader2,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export type { PressPublishingDrawerProps };

export default function PressPublishingDrawer({
  isOpen,
  onClose,
  formData,
  bannerFile,
  documentFile,
  onConfirm,
}: PressPublishingDrawerProps) {
  const [baseTierId, setBaseTierId] = useState('free-standard');
  const [selectedToolkitIds, setSelectedToolkitIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadStep, setUploadStep] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock outside webpage scroll when drawer is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset drawer state when closed after exit transition finishes to prevent cascading renders
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
        setUploadStep(null);
        setSubmissionError(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Calculate live total price
  const baseTier = PRESS_BASE_TIERS.find((t) => t.id === baseTierId) || PRESS_BASE_TIERS[0];
  const toolkitsCost = selectedToolkitIds.reduce((sum, id) => {
    const item = PRESS_TOOLKIT_ADDONS.find((t) => t.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const totalPrice = baseTier.price + toolkitsCost;

  const toggleToolkit = (id: string) => {
    setSelectedToolkitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinalSubmit = async () => {
    if (!formData || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      let bannerUrl: string | null = null;
      let bannerPublicId: string | null = null;
      let documentUrl: string | null = null;
      let documentPublicId: string | null = null;

      // 1. Upload Banner Image if present
      if (bannerFile) {
        setUploadStep('Uploading banner image...');
        const bannerResult = await uploadPressAsset(bannerFile, 'pentasent/press/banners');
        bannerUrl = bannerResult.url;
        bannerPublicId = bannerResult.publicId || null;
      }

      // 2. Upload Document if present
      if (documentFile) {
        setUploadStep('Uploading press release document...');
        const docResult = await uploadPressAsset(documentFile, 'pentasent/press/documents');
        documentUrl = docResult.url;
        documentPublicId = docResult.publicId || null;
      }

      // 3. Submit Press Release Payload to Backend
      setUploadStep('Finalizing submission...');

      const response = await apiClient<{
        trackingNumber: string;
        status: string;
        message: string;
        totalMinor: number;
        currency: string;
        createdAt: string;
      }>('/press/submissions', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company,
          websiteUrl: formData.websiteUrl,
          title: formData.title,
          category: formData.category,
          releaseDateType: formData.releaseDateType,
          scheduledDate: formData.scheduledDate || null,
          summary: formData.summary,
          content: formData.content,
          baseTierId,
          selectedToolkitIds,
          bannerImageUrl: bannerUrl,
          bannerImagePublicId: bannerPublicId,
          bannerOriginalFilename: bannerFile?.name || null,
          bannerSizeBytes: bannerFile?.size || null,
          bannerMimeType: bannerFile?.type || null,
          documentFileUrl: documentUrl,
          documentFilePublicId: documentPublicId,
          documentOriginalFilename: documentFile?.name || null,
          documentSizeBytes: documentFile?.size || null,
          documentMimeType: documentFile?.type || null,
          source: 'pentasent_press_release_portal',
        }),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to submit press release.');
      }

      setIsSubmitted(true);
      onConfirm(response.data);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error('Final press submission error:', err);
      setSubmissionError(
        err instanceof Error ? err.message : 'An error occurred during submission. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setUploadStep(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay (fades in same as account drawer and search) */}
          <motion.div
            aria-label="Close publishing drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-60 cursor-default bg-[#190019]"
          />

          {/* Slide-out Sidebar Drawer from right */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-70 w-full max-w-[540px] bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0eae5] bg-[#faf8f6] shrink-0">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Step 2 of 2
                </span>
                <h3 className="text-[19px] sm:text-[21px] font-bold text-[#090909] leading-tight">
                  Publishing &amp; Distribution
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-1 rounded-full text-[#7d7976] hover:text-[#090909] hover:bg-[#eae4df] transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Drawer Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-7 text-[#1e1c1b]">

              {/* Release Overview Summary Capsule */}
              {formData && (
                <div className="rounded-xl bg-[#faf9f8] p-4 border border-[#ded9d5] text-xs space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <FileText size={15} />
                    <span className="truncate">{formData.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5f5c5a]">
                    <span className="inline-flex items-center gap-1">
                      <Building2 size={13} /> {formData.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} />{' '}
                      {formData.releaseDateType === 'scheduled' && formData.scheduledDate
                        ? `Scheduled: ${formData.scheduledDate}`
                        : 'Immediate Wire Distribution'}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Alert Display */}
              {submissionError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1 leading-relaxed">{submissionError}</div>
                </div>
              )}

              {/* 1. Base Publication Tier Selection */}
              <div>
                <h4 className="text-[15px] font-bold text-[#090909] tracking-tight mb-2">
                  1. Select Publication Speed
                </h4>
                <div className="space-y-2.5">
                  {PRESS_BASE_TIERS.map((tier) => {
                    const isSelected = baseTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setBaseTierId(tier.id)}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-xs'
                            : 'border-[#ded9d5] bg-white hover:border-[#b3aba5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[14.5px] text-[#090909]">{tier.name}</span>
                          <span className="font-extrabold text-[15.5px] text-primary">
                            {tier.price === 0 ? 'FREE' : `$${tier.price}`}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] text-[#5f5c5a] leading-normal">{tier.description}</p>
                        <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-medium text-[#090909]">
                          <span className="inline-flex items-center gap-1">
                            {tier.price > 0 ? (
                              <Zap size={13} className="text-[#ffa91f]" />
                            ) : (
                              <Info size={13} className="text-primary" />
                            )}
                            {tier.badge}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-primary font-bold text-xs">
                              <Check size={14} strokeWidth={3} /> Selected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Optional Promotion Toolkits */}
              <div>
                <h4 className="text-[15px] font-bold text-[#090909] tracking-tight mb-1">
                  2. Custom Distribution Toolkits (Optional)
                </h4>
                <p className="text-xs text-[#5f5c5a] mb-3">
                  Check any toolkits you want to add to your publication. Total updates automatically.
                </p>

                <div className="space-y-2">
                  {PRESS_TOOLKIT_ADDONS.map((addon) => {
                    const isChecked = selectedToolkitIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#ffa91f] bg-[#ffa91f]/5'
                            : 'border-[#ded9d5] bg-white hover:bg-[#faf9f8]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleToolkit(addon.id)}
                          className="mt-1 h-4 w-4 rounded border-[#ded9d5] text-primary focus:ring-primary accent-[#5c0049]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13.5px] font-bold text-[#090909]">{addon.title}</span>
                            <span className="text-[13.5px] font-bold text-[#b87600] shrink-0">
                              +${addon.price}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#5f5c5a] mt-0.5 leading-snug">{addon.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Fixed Bottom Footer: Summary & Action Button */}
            <div className="shrink-0 border-t border-[#f0eae5] bg-[#fdfcfa] px-6 py-5 sm:px-8 space-y-3.5">

              {/* Itemized Price Breakdown */}
              <div className="rounded-lg bg-border-background p-3.5 border border-[#e8e4e1] space-y-1">
                <div className="flex items-center justify-between text-xs text-[#5f5c5a]">
                  <span>Tier: {baseTier.name}</span>
                  <span className="font-semibold text-[#090909]">
                    {baseTier.price === 0 ? 'FREE' : `$${baseTier.price}`}
                  </span>
                </div>
                {selectedToolkitIds.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#5f5c5a]">
                    <span>Toolkits ({selectedToolkitIds.length} selected)</span>
                    <span className="font-semibold text-[#090909]">+${toolkitsCost}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#ded9d5] flex items-center justify-between mt-1">
                  <span className="text-[14px] font-bold text-[#090909]">Total Due</span>
                  <span className="text-[18px] font-extrabold text-primary">
                    {totalPrice === 0 ? 'FREE' : `$${totalPrice} USD`}
                  </span>
                </div>
              </div>

              {/* Action Button: Free Submit or Proceed to Payment */}
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || isSubmitted}
                className="w-full h-13.5 rounded bg-[#ffa91f] text-[#090909] text-[15px] font-bold cursor-pointer transition-colors duration-200 hover:bg-[#f6a116] flex items-center justify-center gap-2 disabled:opacity-75 shadow-xs"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-black" />
                    <span>{uploadStep || 'Processing submission...'}</span>
                  </span>
                ) : isSubmitted ? (
                  <span className="inline-flex items-center gap-1.5 text-[#090909]">
                    <Check size={18} strokeWidth={3} /> Submitted successfully!
                  </span>
                ) : totalPrice === 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <span>Continue Submitting Free</span>
                    <ArrowRight size={16} />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span>Proceed to Payment · ${totalPrice}</span>
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>

              {/* Disclaimer */}
              <p className="text-[11px] leading-relaxed text-[#7d7976] text-center">
                Pentasent reserves the right to reject submissions. In such cases, a full refund will be issued.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
