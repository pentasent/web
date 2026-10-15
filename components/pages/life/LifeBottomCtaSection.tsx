'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LIFE_BOTTOM_CTA_DATA } from '@/data/life';

export default function LifeBottomCtaSection() {
  const { title, subtitle, primaryButton, secondaryButton, backgroundImage } =
    LIFE_BOTTOM_CTA_DATA;

  return (
    <section
      aria-label="Join Pentasent"
      className="relative w-full isolate bg-[#3d0033] bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Graphic Image with light view */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src={backgroundImage}
          alt="Pentasent Culture Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom opacity-35 sm:opacity-40 mix-blend-screen"
        />
        {/* Soft Ambient Radial and Linear Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#4a003e]/75 via-transparent to-[#350030]/85" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-[radial-gradient(ellipse_at_center,rgba(255,211,240,0.14),transparent_70%)]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
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
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-white/85 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Buttons Row: side-by-side on sm+ screen, full-width stacked on mobile */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto">
            {/* Primary Action Button (I'm an engineer) */}
            <Link
              href={primaryButton.href}
              className="w-full sm:w-auto sm:min-w-47.5 inline-flex items-center justify-center px-7 py-3.5 rounded-[10px] bg-[#ffa91f] text-[#090909] text-[15px] sm:text-[16px] font-bold shadow-[0_4px_16px_rgba(255,169,31,0.25)] hover:bg-[#ff9e0b] hover:shadow-[0_6px_20px_rgba(255,169,31,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {primaryButton.text}
            </Link>

            {/* Secondary Action Button (Tell me a story) */}
            <Link
              href={secondaryButton.href}
              className="w-full sm:w-auto sm:min-w-47.5 inline-flex items-center justify-center px-7 py-3.5 rounded-[10px] bg-transparent text-white text-[15px] sm:text-[16px] font-semibold border-2 border-[#ffa91f]/90 hover:border-[#ffa91f] hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {secondaryButton.text}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
