'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface CertificateVerifierProps {
  onVerify: (certificateId: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  initialQuery?: string;
}

export default function CertificateVerifier({
  onVerify,
  isLoading,
  errorMessage,
  initialQuery = '',
}: CertificateVerifierProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;
    onVerify(clean);
  };


  return (
    <div className="w-full">
      {/* Title & Introduction */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold text-foreground tracking-tight leading-[1.1]">
          Employee Certificate Verification
        </h1>
        <p className="mt-3.5 sm:mt-4 text-[16px] sm:text-[18px] text-primary-text leading-relaxed max-w-2xl mx-auto">
          Verify the authenticity of completion certificates, experience letters, and credentials issued by{' '}
          <Link
            href="/company/about"
            className="font-semibold text-foreground underline decoration-[#ffa91f] underline-offset-4 hover:text-primary"
          >
            Pentasent Inc
          </Link>
          .
        </p>
      </div>

      {/* Primary Search Controls (Exact Tracker Style) */}
      <div className="max-w-3xl mx-auto mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Certificate ID (e.g. PEN-CERT-6M2Q9H) or Verification Code"
              className="w-full h-13 px-4 pl-11 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded outline-none transition-all duration-200 placeholder:text-primary-text/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-text"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="h-13 px-8 rounded bg-[#ffa91f] text-[#171318] text-[15px] font-bold hover:bg-[#ff9e0b] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <span>{isLoading ? 'Verifying...' : 'Verify Credential'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {searchQuery && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1 text-[13px] text-primary hover:underline cursor-pointer font-medium"
            >
              <RotateCcw size={12} />
              <span>Clear input</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-[14px]">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-rose-700 mt-0.5 text-[13px]">
              Please check the Certificate ID or Verification Code on the physical or digital document.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
