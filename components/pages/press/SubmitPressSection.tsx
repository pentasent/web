'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PressReleaseForm from '@/components/forms/PressReleaseForm';
import PressPublishingDrawer from '@/components/pages/press/PressPublishingDrawer';
import { PRESS_OFFERINGS_INFO } from '@/data/press';
import { PressReleaseFormData } from '@/lib/validations/press';
import {
  Check,
  X,
} from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';

export default function SubmitPressSection() {
  const [toastData, setToastData] = useState<{ message: string; trackingNumber?: string } | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [validatedData, setValidatedData] = useState<PressReleaseFormData | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => {
      setToastData(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [toastData]);

  // When form validation passes, open the right-side publishing options drawer
  const handleOpenDrawer = (
    data: PressReleaseFormData,
    banner: File | null,
    doc: File | null
  ) => {
    setValidatedData(data);
    setBannerFile(banner);
    setDocumentFile(doc);
    setIsDrawerOpen(true);
  };

  // When user completes submission in the drawer
  const handleDrawerConfirm = (payload: unknown) => {
    const data = payload as { trackingNumber?: string };
    const trackingNumber = data?.trackingNumber;
    setToastData({
      message: trackingNumber
        ? `Press release submitted! Tracking ID: ${trackingNumber}`
        : 'Press release submitted successfully! Our editorial team has received your submission.',
      trackingNumber,
    });
    // Clear form on successful submission from drawer
    setFormKey((prev) => prev + 1);
    setValidatedData(null);
    setBannerFile(null);
    setDocumentFile(null);
  };

  return (
    <section
      id="submit-pr"
      className="relative w-full max-w-full mx-auto bg-white text-primary-text py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-[3.8vw]">
        <div className="grid max-w-full grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-[6vw] items-start">

          {/* =========================================================
              LEFT COLUMN: Press Release Submission Form (Slide-up Animation)
              ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="mb-8">
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Submit Press Release
              </span>
              <h2 className="mt-2 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.04em] text-foreground">
                Distribute your healthcare announcement
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
                Publish your news across the Pentasent healthcare network. Fill in your announcement
                details below to select your publishing options.
              </p>
            </div>

            {/* Clean Streamlined Form Component */}
            <div className="bg-white rounded-xl border border-[#ded9d5] p-5 sm:p-7 lg:p-8 shadow-xs">
              <PressReleaseForm key={formKey} onValidSubmit={handleOpenDrawer} />
            </div>
          </motion.div>

          {/* =========================================================
              RIGHT COLUMN: What We Offer & Media Information (Slide-up Animation)
              ========================================================= */}
          <motion.div
            className="border-t border-[#e8e4e1] pt-12 lg:border-0 lg:pt-0"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Section Header */}
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Distribution & Reach
              </span>
              <h2 className="mt-2 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.1] tracking-[-0.04em] text-foreground">
                What we offer
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
                Connect your story directly to 12,000+ verified doctors, clinical practices, hospital
                executives, and over 4.8 million monthly active healthcare visitors.
              </p>
            </div>

            {/* Offerings: Open layout matching Contact page */}
            <div className="mt-10 sm:mt-12 space-y-10 sm:space-y-11">
              {PRESS_OFFERINGS_INFO.map((offering, idx) => (
                <article key={offering.id} className="first:mt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#7d7976]">
                      0{idx + 1}
                    </span>
                    <span className="text-[#ded9d5]">·</span>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#6b185f]">
                      {offering.badge}
                    </span>
                  </div>

                  <h3 className="text-[clamp(1.35rem,2vw,1.6rem)] font-bold leading-[1.15] tracking-[-0.035em] text-foreground">
                    {offering.title}
                  </h3>

                  <p className="mt-3 text-primary-text text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] tracking-[0.005em]">
                    {offering.description}
                  </p>

                  {/* ONLY the first card (Multi-Channel Social Broadcast) shows the image */}
                  {idx === 0 && (
                    <div className="mt-4.5 overflow-hidden rounded-xl border-4 border-[#ded9d5] shadow-xs">
                      <Image
                        src="/assets/images/pages/press/social_press_post.png"
                        alt="Multi-Channel Social Broadcast Preview"
                        width={700}
                        height={500}
                        className="w-full h-auto object-cover select-none"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* =========================================================
          RIGHT-SIDE PUBLISHING OPTIONS DRAWER
          ========================================================= */}
      <PressPublishingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        formData={validatedData}
        bannerFile={bannerFile}
        documentFile={documentFile}
        onConfirm={handleDrawerConfirm}
      />

      {/* =========================================================
          TOAST NOTIFICATION (Auto-dismissing)
          ========================================================= */}
      <AnimatePresence>
        {toastData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 right-6 z-80 bg-[#1c181a] text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 text-sm font-medium max-w-md border border-[#3e343b]"
          >
            <Check size={20} className="text-[#ffa91f] shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="flex-1">
              <p className="text-[14px] leading-snug">{toastData.message}</p>
              {toastData.trackingNumber && (
                <div className="mt-2">
                  <Link
                    href={`/tracker/press-status?id=${toastData.trackingNumber}`}
                    className="inline-flex items-center gap-1 text-[13px] font-bold text-[#ffa91f] hover:underline"
                  >
                    <span>Track Status Live</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToastData(null)}
              className="text-white/60 hover:text-white shrink-0 ml-1 cursor-pointer"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
