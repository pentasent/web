'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { DELETE_ACCOUNT_HERO } from '@/data/delete-account';

export default function DeleteAccountHero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#991b1b] bg-[linear-gradient(135deg,#7f1d1d_0%,#b42318_52%,#991b1b_100%)] text-white py-12 sm:py-16 lg:py-20 border-b border-red-950/30">
      {/* Subtle Danger Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,180,180,0.18),transparent_60%)]"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start text-left"
        >
          {/* Danger Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3.5 py-1 text-[12.5px] sm:text-[13.5px] font-semibold text-white tracking-wide backdrop-blur-xs">
            <AlertTriangle className="h-4 w-4 text-red-100" strokeWidth={2.2} />
            <span>{DELETE_ACCOUNT_HERO.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-4 text-[28px] xs:text-[32px] sm:text-[40px] lg:text-[44px] font-bold leading-[1.15] tracking-tight text-white">
            {DELETE_ACCOUNT_HERO.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-relaxed text-red-50/90 max-w-3xl">
            {DELETE_ACCOUNT_HERO.subtitle}
          </p>

          {/* Meta / Irreversibility Tag */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] sm:text-[13px] font-medium text-red-100/80">
            <ShieldAlert className="h-4 w-4 text-red-200 shrink-0" />
            <span>{DELETE_ACCOUNT_HERO.lastUpdated}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

