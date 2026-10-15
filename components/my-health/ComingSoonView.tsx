'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

interface ComingSoonViewProps {
  moduleName: string;
  badge: string;
  description: string;
  futureFeatures: string[];
}

export default function ComingSoonView({
  moduleName,
  badge,
  description,
  futureFeatures,
}: ComingSoonViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <div className="bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[12px] font-bold text-amber-800 mb-4">
          <Clock size={13} />
          <span>{badge}</span>
        </div>

        <h2 className="text-[26px] sm:text-[32px] font-extrabold text-foreground tracking-tight">
          {moduleName}
        </h2>

        <p className="mt-2 text-[15px] sm:text-[16px] text-primary-text leading-relaxed max-w-2xl">
          {description}
        </p>

        {/* Feature roadmap cards */}
        <div className="mt-8 pt-8 border-t border-[#f3eee9]">
          <h3 className="text-[12.5px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Roadmap Architecture
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {futureFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-4.5 rounded-lg border border-[#e8e2dc] bg-[#faf7f4] flex items-start gap-3.5 hover:border-primary/30 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-white border border-[#e4ded7] flex items-center justify-center shrink-0 mt-0.5 text-primary font-bold text-[12px]">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground">
                    {feat}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-normal">
                    Integrated with user-controlled consent & cryptographic privacy controls.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 p-4.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 text-[13.5px] text-emerald-950 leading-relaxed">
          <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong>Strict Privacy Boundary:</strong> Pentasent My Health is strictly isolated from public directories, people searches, and corporate discovery. You maintain full ownership of all longitudinal records.
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/my-health"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e8e2dc] bg-[#faf7f4] text-[13px] font-bold text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Health Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
