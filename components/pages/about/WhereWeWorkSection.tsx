'use client';

import { GLOBAL_OFFICES } from '@/data/about';
import { motion } from 'framer-motion';

// Crisp, vector-rendered SVG country flags
function FlagIcon({ country }: { country: string }) {
  switch (country) {
    case 'India':
      return (
        <svg viewBox="0 0 640 480" className="h-full w-full object-cover">
          <rect width="640" height="160" fill="#FF9933" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#128807" />
          <circle cx="320" cy="240" r="44" fill="none" stroke="#000080" strokeWidth="5" />
          <circle cx="320" cy="240" r="9" fill="#000080" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="320"
              y1="240"
              x2={320 + 42 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={240 + 42 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#000080"
              strokeWidth="2"
            />
          ))}
        </svg>
      );

    case 'United Kingdom':
      return (
        <svg viewBox="0 0 60 30" className="h-full w-full object-cover">
          <rect width="60" height="30" fill="#012169" />
          <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="2.2" />
          <path d="M30 0 v30 M0 15 h60" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M30 0 v30 M0 15 h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );

    case 'Singapore':
      return (
        <svg viewBox="0 0 60 36" className="h-full w-full object-cover">
          <rect width="60" height="18" fill="#ED2939" />
          <rect y="18" width="60" height="18" fill="#FFFFFF" />
          <circle cx="13" cy="9" r="6" fill="#FFFFFF" />
          <circle cx="15.2" cy="9" r="5" fill="#ED2939" />
          <circle cx="19.5" cy="5.8" r="0.9" fill="#FFFFFF" />
          <circle cx="21.5" cy="8.6" r="0.9" fill="#FFFFFF" />
          <circle cx="19.8" cy="11.4" r="0.9" fill="#FFFFFF" />
          <circle cx="16.8" cy="10.8" r="0.9" fill="#FFFFFF" />
          <circle cx="16.8" cy="6.8" r="0.9" fill="#FFFFFF" />
        </svg>
      );

    case 'United Arab Emirates':
      return (
        <svg viewBox="0 0 60 30" className="h-full w-full object-cover">
          <rect width="60" height="10" fill="#00732F" />
          <rect y="10" width="60" height="10" fill="#FFFFFF" />
          <rect y="20" width="60" height="10" fill="#000000" />
          <rect width="16" height="30" fill="#FF0000" />
        </svg>
      );

    case 'Switzerland':
      return (
        <svg viewBox="0 0 32 32" className="h-full w-full object-cover">
          <rect width="32" height="32" fill="#D52B1E" />
          <rect x="13" y="6" width="6" height="20" fill="#FFFFFF" />
          <rect x="6" y="13" width="20" height="6" fill="#FFFFFF" />
        </svg>
      );

    case 'Germany':
      return (
        <svg viewBox="0 0 60 36" className="h-full w-full object-cover">
          <rect width="60" height="12" fill="#000000" />
          <rect y="12" width="60" height="12" fill="#DD0000" />
          <rect y="24" width="60" height="12" fill="#FFCE00" />
        </svg>
      );

    case 'France':
      return (
        <svg viewBox="0 0 60 36" className="h-full w-full object-cover">
          <rect width="20" height="36" fill="#002654" />
          <rect x="20" width="20" height="36" fill="#FFFFFF" />
          <rect x="40" width="20" height="36" fill="#ED2939" />
        </svg>
      );

    case 'Italy':
      return (
        <svg viewBox="0 0 60 36" className="h-full w-full object-cover">
          <rect width="20" height="36" fill="#009246" />
          <rect x="20" width="20" height="36" fill="#FFFFFF" />
          <rect x="40" width="20" height="36" fill="#CE2B37" />
        </svg>
      );

    case 'United States':
      return (
        <svg viewBox="0 0 60 32" className="h-full w-full object-cover">
          <rect width="60" height="32" fill="#B22234" />
          <path
            d="M0 4.57h60 M0 9.14h60 M0 13.71h60 M0 18.28h60 M0 22.85h60 M0 27.42h60"
            stroke="#FFFFFF"
            strokeWidth="2.3"
          />
          <rect width="24" height="17.2" fill="#3C3B6E" />
          <circle cx="5" cy="4" r="0.8" fill="#FFFFFF" />
          <circle cx="12" cy="4" r="0.8" fill="#FFFFFF" />
          <circle cx="19" cy="4" r="0.8" fill="#FFFFFF" />
          <circle cx="8.5" cy="8.5" r="0.8" fill="#FFFFFF" />
          <circle cx="15.5" cy="8.5" r="0.8" fill="#FFFFFF" />
          <circle cx="5" cy="13" r="0.8" fill="#FFFFFF" />
          <circle cx="12" cy="13" r="0.8" fill="#FFFFFF" />
          <circle cx="19" cy="13" r="0.8" fill="#FFFFFF" />
        </svg>
      );

    default:
      return null;
  }
}


export default function WhereWeWorkSection() {
  return (
    <section
      aria-label="Where we work"
      className="relative isolate overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(112,0,91,0.25),transparent_70%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl text-left">
          <motion.p
            className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#ffd3f0]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Global Presence
          </motion.p>

          <motion.h2
            className="mt-2.5 sm:mt-3 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-white"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            Where we work
          </motion.h2>

          <motion.p
            className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-white/80"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Pentasent’s global network connects practitioners, researchers, and healthcare innovators across strategic epicenters worldwide.
          </motion.p>
        </div>

        {/* Global Offices Grid (Responsive: 1 col on mobile, 2 col on sm, 3 col on md, 4 col on lg) */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 sm:gap-y-12 lg:gap-y-14">
          {GLOBAL_OFFICES.map((office, idx) => (
            <motion.div
              key={office.id}
              className="group flex flex-col text-left transition-transform duration-200"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                delay: (idx % 4) * 0.08 + 0.05,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Flag Icon */}
              <div className="mb-3.5 inline-flex h-4.5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-[3px] shadow-sm ring-1 ring-white/20 select-none">
                <FlagIcon country={office.country} />
              </div>

              {/* City Name & Optional Coming Soon Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[19px] sm:text-[21px] font-semibold text-white tracking-tight">
                  {office.city}
                </h3>
                {office.isComingSoon && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide bg-[#ffd3f0]/20 text-[#ffd3f0] border border-[#ffd3f0]/30 shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffd3f0] animate-pulse" />
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Region and Country (No specific street addresses as requested) */}
              <p className="mt-1 text-[14px] sm:text-[14.5px] font-medium text-white/90">
                {office.region}, {office.country}
              </p>

              {/* Clean Relevant Hub Context */}
              <p className="mt-1.5 text-[13px] sm:text-[13.5px] leading-relaxed text-white/60">
                {office.focus}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
