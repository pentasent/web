'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CAREERS_JOURNEY_DATA } from '@/data/careers';
import { CareersMilestoneBlock } from '@/types/careers';

// Canvas rendering helper for each milestone block
function MilestoneCanvas({ block }: { block: CareersMilestoneBlock }) {
  const { canvas } = block;

  // Block 1: 2025 Ideation Canvas
  if (block.id === 'block-2025') {
    return (
      <div className="relative w-full h-100 sm:h-115 bg-[#f4efe9] rounded-[22px] p-6 sm:p-8 flex items-center justify-center overflow-hidden border border-[#eae4dd]">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-black/4 pointer-events-none" />
        <div className="absolute -top-4 -right-4 w-48 h-48 rounded-full border border-black/3 pointer-events-none" />

        {/* Main Mockup Card: Browser window style */}
        <div className="relative z-10 w-[84%] sm:w-[80%] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#e4ded6] overflow-hidden -rotate-1 transition-transform hover:rotate-0 duration-300">
          {/* Browser header bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#fbf9f6] border-b border-[#e8e2db]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e86f68]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f4be41]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#62c554]" />
            </div>
            <span className="text-[11px] font-mono text-[#8a847e] tracking-tight">
              pentasent.com/timeline
            </span>
            <div className="w-8" />
          </div>

          {/* Yellow Badge over card */}
          <div className="absolute top-8 left-4 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#f8b824] text-black shadow-sm">
              {canvas.tag || 'Pentasent 1.0'}
            </span>
          </div>

          {/* Document Content / Image preview */}
          <div className="relative h-44 sm:h-52 w-full bg-[#fdfcfa] p-4 pt-10">
            {canvas.primaryImage ? (
              <Image
                src={canvas.primaryImage}
                alt={canvas.title || 'Day 0 Architecture'}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-top opacity-85"
              />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent" />
          </div>
        </div>

        {/* Overlapping Team / Lab Card on Bottom Right */}
        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-20 w-36 sm:w-44 bg-white rounded-xl p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.1)] border border-[#e4ded6] rotate-2 transition-transform hover:rotate-0 duration-300">
          <div className="relative h-24 sm:h-28 w-full rounded-lg overflow-hidden bg-[#3c0032]">
            {canvas.secondaryImage ? (
              <Image
                src={canvas.secondaryImage}
                alt="Ankit Kumar"
                fill
                sizes="180px"
                className="object-cover object-top"
              />
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f8b824] text-black">
              Ankit Kumar
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Small Domain / IP Tag on Bottom Left */}
        <div className="absolute bottom-5 left-5 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-[#e4ded6] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-[#090909]">pentasent.com</span>
          <span className="text-[10px] text-[#7a746e]">· IP Registered</span>
        </div>
      </div>
    );
  }

  // Block 2: 2026 Android & Web Launch Canvas
  if (block.id === 'block-mid-2026') {
    return (
      <div className="relative w-full h-100 sm:h-115 bg-[#f4efe9] rounded-[22px] p-6 sm:p-8 flex items-center justify-center overflow-hidden border border-[#eae4dd]">
        {/* Subtle decorative background curves */}
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border border-black/4 pointer-events-none" />

        {/* App Frame Card */}
        <div className="relative z-10 w-[88%] sm:w-[82%] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#e4ded6] overflow-hidden -rotate-1">
          {/* Header bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#fbf9f6] border-b border-[#e8e2db]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e86f68]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f4be41]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#62c554]" />
            </div>
            <span className="text-[11px] font-mono text-[#8a847e] tracking-tight">
              Pentasent Health Hub
            </span>
            <div className="w-8" />
          </div>

          {/* Yellow Badge */}
          <div className="absolute top-8 left-4 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#f8b824] text-black shadow-sm">
              {canvas.tag || 'V1 Android & Web'}
            </span>
          </div>

          {/* Preview Image */}
          <div className="relative h-44 sm:h-52 w-full bg-primary p-3 pt-10">
            {canvas.primaryImage ? (
              <Image
                src={canvas.primaryImage}
                alt={canvas.title || 'Pentasent Android & Web'}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-center"
              />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Floating Bold Yellow Stat Card on Bottom Right (matching reference image) */}
        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-20 w-44 sm:w-52 bg-[#f8b824] rounded-2xl p-4 shadow-[0_12px_28px_rgba(248,184,36,0.28)] border-2 border-black/10 text-black">
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-black"
                aria-hidden="true"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full text-black">
              Milestone
            </span>
          </div>
          <div className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-black leading-none">
            {canvas.statBadge?.value || '1.5M+'}
          </div>
          <div className="mt-1 text-[11px] sm:text-[12px] font-semibold text-black/80">
            {canvas.statBadge?.label || 'Active Members'}
          </div>
        </div>

        {/* Feature badge chips on bottom left */}
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1.5">
          <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-[#090909] shadow-sm border border-[#e4ded6] inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f8b824]" />
            MAYA AI Active
          </span>
          <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-[#090909] shadow-sm border border-[#e4ded6] inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Medication & Yoga Live
          </span>
        </div>
      </div>
    );
  }

  // Block 3: Version 2.0 (15 Sep 2026) Canvas
  return (
    <div className="relative w-full h-100 sm:h-115 bg-[#f4efe9] rounded-[22px] p-6 sm:p-8 flex items-center justify-center overflow-hidden border border-[#eae4dd]">
      {/* Decorative background radiating circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-black/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-black/3 pointer-events-none" />

      {/* Main Preview Card: Dark modern glass / brand canvas */}
      <div className="relative z-10 w-[88%] sm:w-[84%] bg-[#2a0024] rounded-2xl shadow-[0_12px_36px_rgba(42,0,36,0.18)] border border-[#4a0139]/40 overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#6b185f]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Content header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f8b824]" />
            <span className="text-[12px] font-bold text-white tracking-wide">
              Pentasent 2.0
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#f8b824] bg-[#f8b824]/10 border border-[#f8b824]/20 px-2 py-0.5 rounded-full">
            Ecosystem
          </span>
        </div>

        {/* Image preview / Engineering display */}
        <div className="relative h-40 sm:h-44 w-full bg-[#1e001a]">
          {canvas.primaryImage ? (
            <Image
              src={canvas.primaryImage}
              alt="Pentasent 2.0 Architecture"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-center opacity-70"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-[#2a0024] via-transparent to-transparent" />
        </div>
      </div>

      {/* Big Yellow Stat Card on Bottom Right (matching reference image) */}
      <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-20 w-48 sm:w-56 bg-[#f8b824] rounded-2xl p-4 sm:p-5 shadow-[0_12px_28px_rgba(248,184,36,0.32)] border-2 border-black/10 text-black">
        <div className="flex items-center justify-between mb-2">
          <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 text-black"
              aria-hidden="true"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full text-black">
            Funding
          </span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-black leading-none">
          {canvas.statBadge?.value || 'Pre-Seed'}
        </div>
        <div className="mt-1 text-[11px] sm:text-[12px] font-semibold text-black/80">
          {canvas.statBadge?.label || 'Investment Round'}
        </div>
      </div>

      {/* 3 Dark Icon Chips on bottom left (matching reference image) */}
      <div className="absolute bottom-5 left-5 z-20 hidden sm:flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#2a0024] border border-[#4a0139]/50 flex items-center justify-center shadow-sm text-[#f8b824]">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 16v-1a4 4 0 00-2.5-3.7 5.5 5.5 0 012.5 3.7v1h-1zM4 16v-1a4 4 0 012.5-3.7A5.5 5.5 0 004 15v1H3z" />
          </svg>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#2a0024] border border-[#4a0139]/50 flex items-center justify-center shadow-sm text-[#f8b824]">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#2a0024] border border-[#4a0139]/50 flex items-center justify-center shadow-sm text-[#f8b824]">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function CareersJourneySection() {
  const { title, subtitle, prefaceTag, prefaceYear, prefaceText, blocks, callout } =
    CAREERS_JOURNEY_DATA;

  return (
    <section
      aria-label="Our Journey and Achievements"
      className="w-full bg-white py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-[3.8vw]"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Top Centered Section Headline (as in reference image) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.04em] text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Intro preface milestone block (as in reference image: "The groundwork is laid for...") */}
        {(prefaceTag || prefaceYear || prefaceText) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mt-14 sm:mt-18"
          >
            {prefaceTag && (
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                {prefaceTag}
              </span>
            )}
            {prefaceYear && (
              <h3 className="text-[26px] xs:text-[28px] sm:text-[32px] font-bold text-foreground mt-2 tracking-tight">
                {prefaceYear}
              </h3>
            )}
            {prefaceText && (
              <p className="mt-2.5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
                {prefaceText}
              </p>
            )}
          </motion.div>
        )}

        {/* Milestone Rows (Each row matching the reference image layout) */}
        <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-28 lg:space-y-32">
          {blocks.map((block) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
            >
              {/* Left Column: Visual Canvas */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <MilestoneCanvas block={block} />
              </div>

              {/* Right Column: Year Header & Milestones List */}
              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center pt-2">
                {/* Large Year Header */}
                <h3 className="text-[26px] xs:text-[28px] sm:text-[32px] font-bold tracking-tight text-foreground">
                  {block.yearHeader}
                </h3>

                {/* Milestone Items Stack */}
                <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                  {block.milestones.map((milestone, idx) => (
                    <div key={milestone.id}>
                      {idx > 0 && (
                        <div className="w-full h-px bg-[#e5e0db] my-6 sm:my-7" />
                      )}

                      {/* Date pill tag (e.g. 05 September 2025, 01 April 2026) */}
                      {milestone.dateTag && (
                        <div className="mb-2">
                          <span className="inline-flex items-center text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#6b185f] bg-[#6b185f]/8 px-2.5 py-0.5 rounded-full">
                            {milestone.dateTag}
                          </span>
                        </div>
                      )}

                      {/* Milestone Title */}
                      <h4 className="text-[19px] sm:text-[21px] lg:text-[22px] font-bold text-foreground leading-snug">
                        {milestone.title}
                      </h4>

                      {/* Milestone Description */}
                      <p className="mt-2.5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
                        {milestone.description}
                      </p>

                      {/* Sub-items list (e.g. for the 4 Verticals in Milestone 4) */}
                      {milestone.subItems && milestone.subItems.length > 0 && (
                        <div className="mt-5 grid grid-cols-1 gap-3.5 sm:gap-4 pl-1">
                          {milestone.subItems.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3.5 sm:p-4 rounded-xl bg-[#faf7f4] border border-[#eee7e0] flex items-start gap-3"
                            >
                              <span className="shrink-0 w-6 h-6 rounded-full bg-[#f8b824] text-black font-bold text-[12px] flex items-center justify-center mt-0.5 shadow-sm">
                                {sIdx + 1}
                              </span>
                              <div>
                                <h5 className="text-[14.5px] sm:text-[15px] font-bold text-foreground">
                                  {sub.name}
                                </h5>
                                <p className="text-[14px] sm:text-[14.5px] leading-[1.65] text-primary-text mt-1">
                                  {sub.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Optional inline link if specified */}
                      {milestone.linkText && milestone.linkHref && (
                        <div className="mt-3">
                          <Link
                            href={milestone.linkHref}
                            className="inline-flex items-center text-[14px] font-semibold text-[#6b185f] hover:underline cursor-pointer"
                          >
                            {milestone.linkText} &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout Section: "So what happens next? Come join us" (matching reference image) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-28 text-center max-w-xl mx-auto"
        >
          <span className="text-[12px] sm:text-[13px] font-medium text-[#7c756f] tracking-wide">
            {callout.yearTag}
          </span>
          <h3 className="mt-2 text-[28px] xs:text-[32px] sm:text-[36px] font-bold tracking-tight text-foreground">
            {callout.title}
          </h3>
          <p className="mt-3.5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
            {callout.subtitle}
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href={callout.ctaHref}
              className="group inline-flex flex-col items-center justify-center text-[15px] sm:text-[16px] font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <span>{callout.ctaText}</span>
              {/* Bold golden/amber underline bar matching reference image */}
              <span className="mt-1 h-[2.5px] w-full bg-[#f8b824] group-hover:bg-primary transition-colors rounded-full" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
