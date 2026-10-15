'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { PHISHING_SCAM_DATA } from '@/data/phishingScam';

export default function PhishingScamHero() {
  const { hero } = PHISHING_SCAM_DATA;

  return (
    <section className="relative w-full bg-border-background mt-20 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start text-left"
        >
          {/* Eyebrow / Security Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-[12.5px] sm:text-[13.5px] font-semibold text-primary tracking-wide">
            <ShieldAlert className="h-4 w-4 text-primary" strokeWidth={2.2} />
            <span>{hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-4 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.15] tracking-tight text-foreground">
            {hero.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-relaxed text-primary-text max-w-3xl">
            {hero.subtitle}
          </p>

          {/* Advisory Meta info */}
          {hero.lastUpdated && (
            <p className="mt-4 text-[12.5px] sm:text-[13px] font-medium text-muted-foreground">
              {hero.lastUpdated}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
