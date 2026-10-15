'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { PHISHING_SCAM_DATA } from '@/data/phishingScam';

export default function DomainChecker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    message: string;
    domain?: string;
  }>({
    status: 'idle',
    message: '',
  });

  const officialDomains = PHISHING_SCAM_DATA.verification.officialDomains.map((d) =>
    d.replace(/^@/, '').toLowerCase()
  );

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = query.trim().toLowerCase();

    if (!cleanInput) {
      setResult({ status: 'idle', message: '' });
      return;
    }

    // Extract domain part if input is an email address
    let domain = cleanInput;
    if (cleanInput.includes('@')) {
      const parts = cleanInput.split('@');
      domain = parts[parts.length - 1];
    }
    // Remove protocol or paths if user pasted a URL
    domain = domain.replace(/^https?:\/\//, '').split('/')[0];

    const isOfficial = officialDomains.some(
      (off) => domain === off || domain.endsWith(`.${off}`)
    );

    if (isOfficial) {
      setResult({
        status: 'valid',
        domain,
        message: `Verified: "@${domain}" is an official Pentasent domain. Communications from this address are authorized.`,
      });
    } else {
      setResult({
        status: 'invalid',
        domain,
        message: `Warning: "@${domain}" is NOT an official Pentasent domain. Do not share credentials, payment, or personal documents.`,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-border-2/50 bg-border-background/60 p-6 sm:p-8">
      <div className="flex items-center gap-2.5 text-primary">
        <ShieldCheck className="h-5 w-5" />
        <h4 className="text-[17px] sm:text-[18px] font-bold text-foreground tracking-tight">
          Quick Domain & Email Verification
        </h4>
      </div>
      <p className="mt-1.5 text-[14px] sm:text-[14.5px] text-primary-text leading-relaxed">
        Received an email claiming to be from Pentasent? Enter the email address or domain below to quickly verify its authenticity.
      </p>

      <form onSubmit={handleCheck} className="mt-4 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (result.status !== 'idle') {
                setResult({ status: 'idle', message: '' });
              }
            }}
            placeholder="e.g. recruiter@pentasent.com or pentasent-jobs.com"
            className="w-full h-11 pl-10 pr-4 text-[14.5px] text-[#1e1c1b] bg-white border border-[#ded9d5] rounded-xl outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <button
          type="submit"
          className="h-11 px-5 rounded-xl bg-primary text-white text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-xs cursor-pointer shrink-0"
        >
          Verify Domain
        </button>
      </form>

      {/* Verification Results */}
      {result.status === 'valid' && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#ecfdf3] border border-[#a6f4c5] p-3.5 text-[#027a48]">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-[13.5px] sm:text-[14px] leading-snug">
            <span className="font-bold">{result.message}</span>
          </div>
        </div>
      )}

      {result.status === 'invalid' && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#fef3f2] border border-[#fecdca] p-3.5 text-[#b42318]">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-[13.5px] sm:text-[14px] leading-snug">
            <span className="font-bold">{result.message}</span>
            <span className="block mt-1 text-[12.5px] text-[#7a271a]">
              Please forward the message details to <a href="mailto:phishing@pentasent.com" className="underline font-semibold">phishing@pentasent.com</a> immediately.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
