'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, X } from 'lucide-react';
import { MEDICAL_DISCLAIMER_TEXT } from '@/data/tools';
import type { ToolsHeroProps } from '@/types/tools';

export default function ToolsHero({
  badge = 'Pentasent Health Tools',
  title,
  description,
}: ToolsHeroProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <header className="w-full bg-border-background border-b border-[#ded9d5]">
      {/* Main Hero Header Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge & Disclaimer Trigger Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12px] sm:text-[13px] font-semibold text-primary tracking-wide">
              <Sparkles size={14} className="text-[#ffa91f]" />
              <span>{badge}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsDisclaimerOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-all cursor-pointer ${
                isDisclaimerOpen
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
              title={isDisclaimerOpen ? 'Hide Health Disclaimer' : 'Show Health Disclaimer'}
              aria-label={isDisclaimerOpen ? 'Hide Health Disclaimer' : 'Show Health Disclaimer'}
            >
              <Info size={13} className={isDisclaimerOpen ? 'text-white' : 'text-primary'} />
              <span>Disclaimer</span>
            </button>
          </div>

          <h1 className="text-[28px] xs:text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.15]">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-[15px] sm:text-[16.5px] leading-relaxed text-primary-text">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Smoothly Collapsible Full-Width Disclaimer Panel */}
      <AnimatePresence>
        {isDisclaimerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full border-t border-[#ded9d5] bg-border-background/95 overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 md:px-10 lg:px-12">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5">
                    <Info size={14} strokeWidth={2.4} />
                  </div>
                  <div className="text-xs sm:text-[13px] leading-relaxed text-primary-text">
                    <strong className="font-bold text-foreground block mb-0.5">
                      Educational Health Disclaimer
                    </strong>
                    <p>{MEDICAL_DISCLAIMER_TEXT}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDisclaimerOpen(false)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-primary-text hover:text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
                  aria-label="Close health disclaimer"
                  title="Close disclaimer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
