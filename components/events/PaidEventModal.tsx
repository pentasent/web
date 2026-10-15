'use client';

import React, { useEffect } from 'react';
import { X, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

interface PaidEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  priceAmount: number | null;
  currency: string;
}

export default function PaidEventModal({
  isOpen,
  onClose,
  eventTitle,
  priceAmount,
  currency,
}: PaidEventModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Window Container */}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden">
        {/* Header (Fixed shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#faf0f8] text-primary flex items-center justify-center shrink-0">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-foreground leading-snug">
                Online Payment
              </h3>
              <p className="text-[12.5px] text-primary-text">
                Platform Ticketing Preview
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-primary-text hover:text-foreground hover:bg-[#f6f2ee] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Coming Soon</span>
          </div>

          <h4 className="text-[18px] font-bold text-foreground">
            Paid Ticketing Coming Soon
          </h4>

          <p className="text-[14px] leading-relaxed text-primary-text">
            Direct platform ticketing for <strong className="text-foreground">{eventTitle}</strong> ({priceAmount ? `$${priceAmount} ${currency}` : 'Paid Event'}) will be enabled shortly with institutional invoicing and secure gateway integration.
          </p>

          <div className="p-3.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9] text-[13px] text-primary-text flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
            <span>To reserve an early seat or request an institutional invoice, please contact the organizing committee directly.</span>
          </div>
        </div>

        {/* Footer (Fixed shrink-0) */}
        <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
