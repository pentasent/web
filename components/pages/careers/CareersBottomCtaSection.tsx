'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CAREERS_BOTTOM_CTA_DATA } from '@/data/careers';

export default function CareersBottomCtaSection() {
  const { title, subtitle, primaryButton, secondaryButton } =
    CAREERS_BOTTOM_CTA_DATA;

  return (
    <section
      aria-label="More of our story"
      className="relative w-full isolate bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Headline */}
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.12] tracking-[-0.035em] text-white">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-white/80 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Buttons Row (No shadows) */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4.5 w-full max-w-xs sm:max-w-none mx-auto">
            {/* Primary Action Button */}
            <Link
              href={primaryButton.href}
              className="w-full sm:w-auto sm:min-w-48 inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-3.5 rounded-lg bg-[#ffa91f] text-[#171318] text-[15px] sm:text-[16px] font-bold hover:bg-[#ff9e0b] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              {primaryButton.text}
            </Link>

            {/* Secondary Action Button */}
            <Link
              href={secondaryButton.href}
              className="w-full sm:w-auto sm:min-w-48 inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-3.5 rounded-lg bg-transparent text-white text-[15px] sm:text-[16px] font-semibold border-2 border-[#ffa91f] hover:bg-white/10 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              {secondaryButton.text}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
