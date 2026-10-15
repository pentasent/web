'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RESEARCH_PROCESS_DATA } from '@/data/research';

function ProcessIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'lightning':
      return (
        <svg
          viewBox="0 0 44 44"
          className="w-10 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Dark Shadow Depth */}
          <path
            d="M23 2L10 23H20L16 40L33 19H23L27 2H23Z"
            fill="#20001f"
            transform="translate(2.5, 2)"
          />
          {/* Gold Foreground Lightning Bolt */}
          <path
            d="M21 2L9 23H19L15 40L32 19H22L26 2H21Z"
            fill="#ffa91f"
          />
        </svg>
      );

    case 'lock':
      return (
        <svg
          viewBox="0 0 44 44"
          className="w-10 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Crisp White Shackle */}
          <path
            d="M14 20V13C14 8.58172 17.5817 5 22 5C26.4183 5 30 8.58172 30 13V20"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Dark Shadow Underbody */}
          <rect x="12" y="21" width="22" height="18" rx="4" fill="#20001f" />
          {/* Gold Lock Body */}
          <rect x="11" y="19" width="22" height="18" rx="4" fill="#ffa91f" />
          {/* Lock Keyhole */}
          <circle cx="22" cy="26" r="2.2" fill="#20001f" />
          <path d="M21 26H23V31.5H21V26Z" fill="#20001f" />
        </svg>
      );

    case 'check':
      return (
        <svg
          viewBox="0 0 44 44"
          className="w-10 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Dark 3D Depth Under Checkmark */}
          <path
            d="M9 25L18 34L35 12"
            stroke="#20001f"
            strokeWidth="7"
            strokeLinecap="square"
            strokeLinejoin="miter"
            transform="translate(2.5, 3)"
          />
          {/* Gold Checkmark Foreground */}
          <path
            d="M9 24L18 33L35 11"
            stroke="#ffa91f"
            strokeWidth="7"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default function ResearchProcessSection() {
  const { title, intro, subIntro, steps } = RESEARCH_PROCESS_DATA;

  return (
    <section
      aria-label="How we do research"
      className="w-full bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-left"
        >
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.12] sm:leading-[1.1] tracking-[-0.03em] text-white">
            {title}
          </h2>

          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-white/80">
            {intro}
          </p>

          {subIntro && (
            <p className="mt-1 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-white/90 font-medium">
              {subIntro}
            </p>
          )}
        </motion.div>

        {/* 3 Process Steps */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-14">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: idx * 0.12,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-start text-left group"
            >
              {/* Dual-Tone Illustrated Icon */}
              <div className="mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-105">
                <ProcessIcon icon={step.icon} />
              </div>

              {/* Step Text */}
              <p className="text-[15px] sm:text-[16px] leading-[1.65] text-white/90 font-medium">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
