'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BUILD_AWESOME_THINGS_DATA } from '@/data/careers';

function PillarIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'my-health':
      return (
        <svg
          viewBox="0 0 48 44"
          className="w-11 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Heart silhouette in brand burgundy */}
          <path
            d="M24 38C24 38 7 27 7 15.5C7 10 11.5 6 17 6C20.5 6 22.8 7.8 24 9.5C25.2 7.8 27.5 6 31 6C36.5 6 41 10 41 15.5C41 27 24 38 24 38Z"
            fill="#3c0032"
          />
          {/* Vital pulse line in gold/amber */}
          <path
            d="M11 18H17L20.5 11L24.5 24L27.5 15L30.5 18H37"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Vital gold spark node */}
          <circle cx="36" cy="10" r="2.2" fill="#f59e0b" />
          <circle cx="12" cy="10" r="1.3" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'healthcare':
      return (
        <svg
          viewBox="0 0 48 44"
          className="w-11 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Clinical stethoscope tubes in brand burgundy */}
          <path
            d="M14 8V18C14 23.5 18.5 28 24 28C29.5 28 34 23.5 34 18V8"
            stroke="#3c0032"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M24 28V34C24 36.2 25.8 38 28 38H31"
            stroke="#3c0032"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Chestpiece in brand burgundy */}
          <circle cx="35" cy="38" r="4.5" fill="#3c0032" />
          <circle cx="35" cy="38" r="2" fill="#ffffff" opacity="0.9" />
          {/* Golden medical cross badge */}
          <path
            d="M21 11H27V15H31V21H27V25H21V21H17V15H21V11Z"
            fill="#f59e0b"
          />
        </svg>
      );

    case 'organizations':
      return (
        <svg
          viewBox="0 0 48 44"
          className="w-11 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Institutional hospital facade in brand burgundy */}
          <path
            d="M12 38V12C12 10.3 13.3 9 15 9H33C34.7 9 36 10.3 36 12V38H12Z"
            fill="#3c0032"
          />
          {/* Base foundation line */}
          <path
            d="M7 38H41"
            stroke="#3c0032"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Golden medical cross atop facility */}
          <path
            d="M22 13H26V16H29V20H26V23H22V20H19V16H22V13Z"
            fill="#f59e0b"
          />
          {/* Modern clinical architectural windows */}
          <rect x="16.5" y="27" width="4" height="4" rx="0.5" fill="#ffffff" opacity="0.9" />
          <rect x="27.5" y="27" width="4" height="4" rx="0.5" fill="#ffffff" opacity="0.9" />
          <rect x="22" y="31" width="4" height="7" rx="0.5" fill="#f59e0b" />
        </svg>
      );

    case 'innovation':
      return (
        <svg
          viewBox="0 0 48 44"
          className="w-11 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Dual orbiting innovation rings in brand burgundy */}
          <ellipse
            cx="24"
            cy="22"
            rx="17"
            ry="7.5"
            transform="rotate(-30 24 22)"
            stroke="#3c0032"
            strokeWidth="2.5"
          />
          <ellipse
            cx="24"
            cy="22"
            rx="17"
            ry="7.5"
            transform="rotate(30 24 22)"
            stroke="#3c0032"
            strokeWidth="2.5"
          />
          {/* Central innovation nucleus */}
          <circle cx="24" cy="22" r="4.5" fill="#f5920b" />
          {/* Golden star crowned above center */}
          {/* <polygon
            points="24,5 25.8,10.5 31.5,10.5 27,13.8 28.8,19 24,15.8 19.2,19 21,13.8 16.5,10.5 22.2,10.5"
            fill="#f59e0b"
          /> */}
          {/* Golden satellite spark */}
          {/* <circle cx="36" cy="14" r="2.2" fill="#f59e0b" /> */}
        </svg>
      );

    default:
      return null;
  }
}

export default function BuildAwesomeThingsSection() {
  const { badge, title, subtitle, items } = BUILD_AWESOME_THINGS_DATA;

  return (
    <section
      aria-label="We build awesome things"
      className="w-full bg-border-background py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 text-[#090909] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header (Identical to LifePrinciplesSection of life page) */}
        <div className="text-center max-w-3xl mx-auto">
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-3 block text-center"
            >
              {badge}
            </motion.span>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.04em] text-foreground"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 4 Columns Minimal Grid (Identical to LifePrinciplesSection of life page) */}
        <div className="mt-14 sm:mt-18 lg:mt-22 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 xl:gap-12">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: index * 0.08 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-start text-left"
            >
              {/* Minimal Icon Container */}
              <div className="h-12 flex items-center mb-5 sm:mb-6">
                <PillarIcon icon={item.icon} />
              </div>

              {/* Pillar Title */}
              <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-bold text-foreground tracking-tight leading-snug">
                {item.title}
              </h3>

              {/* Pillar Description (Clear, concise summary of what we build) */}
              <p className="mt-2.5 sm:mt-3 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
