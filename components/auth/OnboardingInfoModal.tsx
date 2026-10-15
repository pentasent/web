'use client';

import React, { useEffect } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { ONBOARDING_MODAL_DATA, ONBOARDING_MODAL_LABELS } from '@/data/auth';
import type {
  OnboardingInfoType,
  OnboardingInfoModalProps,
} from '@/types/auth';

export type { OnboardingInfoType, OnboardingInfoModalProps };

export default function OnboardingInfoModal({
  isOpen,
  type,
  onClose,
  onSelectOption,
}: OnboardingInfoModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const data = ONBOARDING_MODAL_DATA[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      {/* Modal Container: Height capped to 88vh with flex-col so it NEVER overflows the screen */}
      <div
        className="relative w-full max-w-xl max-h-[88vh] sm:max-h-[84vh] bg-white border border-[#ded9d5] rounded-xl flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at top of modal */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-[#ded9d5] bg-white flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Info size={13} />
              {data.badge}
            </span>
            <h3 className="text-xl sm:text-[24px] font-bold text-foreground tracking-tight mt-2.5">
              {data.title}
            </h3>
            <p className="text-[14px] sm:text-[15px] text-muted-foreground mt-1 leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={ONBOARDING_MODAL_LABELS.closeAriaLabel}
            className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] border border-transparent hover:border-[#ded9d5] transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content Body - Perfectly scrollable inside the modal bounds */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Core Principle Notice */}
          <div className="p-4 rounded-lg bg-[#faf9f8] border border-[#ded9d5] flex items-start gap-3">
            <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[14px] sm:text-[15px] text-foreground leading-relaxed">
              <strong className="font-semibold text-foreground">{ONBOARDING_MODAL_LABELS.architecturePrincipleHeading}</strong>{' '}
              {data.principle}
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="font-bold text-primary uppercase tracking-wider text-[12.5px] sm:text-[13px] mb-1.5">
              {ONBOARDING_MODAL_LABELS.targetAudienceHeading}
            </h4>
            <p className="text-[15px] sm:text-[16px] text-primary-text leading-relaxed">
              {data.targetAudience}
            </p>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="font-bold text-primary uppercase tracking-wider text-[12.5px] sm:text-[13px] mb-1.5">
              {ONBOARDING_MODAL_LABELS.capabilitiesHeading}
            </h4>
            <p className="text-[15px] sm:text-[16px] text-primary-text leading-relaxed">
              {data.capabilities}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-primary uppercase tracking-wider text-[12.5px] sm:text-[13px] mb-2.5">
              {ONBOARDING_MODAL_LABELS.featuresHeading}
            </h4>
            <ul className="space-y-2.5">
              {data.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[14.5px] sm:text-[15.5px] text-foreground leading-relaxed">
                  <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions - Fixed at bottom of modal */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-[#ded9d5] bg-[#faf9f8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-md border border-[#ded9d5] text-[13.5px] sm:text-[14px] font-medium text-foreground hover:bg-white hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            {ONBOARDING_MODAL_LABELS.closeButton}
          </button>
          {onSelectOption && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectOption(type);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-md bg-primary text-[14px] sm:text-[15px] font-semibold text-white hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
            >
              <span>{ONBOARDING_MODAL_LABELS.chooseOptionButton}</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
