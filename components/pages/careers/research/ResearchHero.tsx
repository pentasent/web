'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RESEARCH_HERO_DATA } from '@/data/research';

export default function ResearchHero() {
  const { badge, subtitle, ctaText, ctaHref } = RESEARCH_HERO_DATA;

  return (
    <section className="relative max-w-full mx-auto isolate flex max-h-[85vh] flex-col justify-center items-center overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-32 lg:pb-24">
      {/* Background Graphic Image (Research banner with light subtle view) */}
      <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
        <Image
          src="/assets/images/pages/careers/research_banner_one.png"
          alt="Pentasent Research Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 mix-blend-screen"
        />
        {/* Bottom Fade Gradient for smooth transition */}
        <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/60 via-secondary/60 to-transparent" />
      </div>

      {/* Main Hero Content (Fade + Blur + Scale Animation matching CareersHero) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
      >
        {/* Research Eyebrow */}
        <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
          {badge}
        </p>

        {/* Main Headline */}
       <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
          Exploring <span className="text-[#ffd3f0]">what&apos;s next</span> in healthcare
       </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
          {subtitle}
        </p>

        {/* CTA Button: Apply for Research Roles (Same as CareersHero) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10 flex items-center justify-center"
        >
          <Link
            href={ctaHref || '/company/careers/open-roles'}
            className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#ffa91f] px-7 py-3.5 sm:px-8 sm:py-4 text-[15px] sm:text-[16px] font-bold text-[#171318] shadow-sm transition-all duration-300 hover:bg-[#f6a116] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ffa91f]/20 active:translate-y-0 cursor-pointer"
          >
            <span>{ctaText || 'Apply for Research Roles'}</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
