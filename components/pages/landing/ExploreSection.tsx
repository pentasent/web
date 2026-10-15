'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Pill,
  Users,
  Stethoscope,
  Building2,
  CalendarDays,
  BriefcaseBusiness,
  MoveRight,
} from 'lucide-react';
import { EXPLORE_ECOSYSTEM_DATA } from '@/data/home';
import type { ExploreCardItem } from '@/types/landing';


export default function ExploreSection() {
  const getCardIcon = (iconName: ExploreCardItem['iconName'] | string) => {
    switch (iconName) {
      case 'products':
        return <Pill size={24} className="text-[#9c7e8e]" />;
      case 'communities':
        return <Users size={24} className="text-[#9c7e8e]" />;
      case 'people':
        return <Stethoscope size={24} className="text-[#9c7e8e]" />;
      case 'organisations':
        return <Building2 size={24} className="text-[#9c7e8e]" />;
      case 'events':
        return <CalendarDays size={24} className="text-[#9c7e8e]" />;
      case 'jobs':
      default:
        return <BriefcaseBusiness size={24} className="text-[#9c7e8e]" />;
    }
  };

  return (
    <section
      aria-label="Explore Pentasent Ecosystem"
      className="min-h-0 bg-[#f2eeeb] px-4 py-14 text-foreground sm:px-6 sm:py-18 lg:px-8 xl:px-12 lg:py-24 w-full overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-semibold leading-[1.08] sm:leading-[1.02] tracking-[-0.03em] text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              ease: 'easeOut',
            }}
          >
            {EXPLORE_ECOSYSTEM_DATA.title}
          </motion.h2>

          <motion.p
            className="mt-3.5 max-w-2xl mx-auto sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: 'easeOut',
            }}
          >
            {EXPLORE_ECOSYSTEM_DATA.subtitle}
          </motion.p>
        </div>

        {/* 6 Cards Grid (3x2 on desktop) */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12">
          {EXPLORE_ECOSYSTEM_DATA.cards.map((card, index) => (
            <motion.article
              key={card.id}
              className="pt-6 sm:pt-7 flex items-start gap-4 sm:gap-5 group"
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: index * 0.07 + 0.05,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* 3D Themed Gradient Icon Badge */}
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#3f0032_0%,#2d0024_60%,#1e0018_100%)] text-white border border-black/5 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {/* Inner radial accent glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(213,154,0,0.22),transparent_70%)] pointer-events-none" />
                <div className="relative z-10">
                  {getCardIcon(card.iconName)}
                </div>
              </div>

              {/* Content Block */}
              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  href={card.href}
                  className="flex items-center justify-between gap-2 group/title"
                >
                  <h3 className="text-[19px] sm:text-[20px] font-bold text-foreground tracking-tight leading-tight group-hover/title:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <MoveRight
                    size={17}
                    className="text-foreground/45 group-hover/title:text-primary group-hover/title:translate-x-1 transition-all shrink-0"
                  />
                </Link>

                <p className="mt-2 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.6] text-primary-text line-clamp-3">
                  {card.description}
                </p>

                <Link
                  href={card.href}
                  className="mt-3.5 inline-flex w-fit items-center gap-1.5 border-b-2 border-[#d59a00] pb-0.5 text-[13.5px] sm:text-[14px] font-semibold text-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
                >
                  {card.actionText}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Banner Card */}
        <motion.div
          className="mt-14 sm:mt-18 lg:mt-22 overflow-hidden rounded-xl bg-muted/30 border border-[#ded9d5] p-6 sm:p-8 lg:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Graphic Illustration + Text */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 w-full lg:w-auto text-center sm:text-left">
              {/* Planetary / Healthcare Glow Box */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl bg-[linear-gradient(145deg,#3f0032_0%,#2b0022_60%,#1a0015_100%)] flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                <div className="absolute h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-[radial-gradient(circle_at_32%_32%,#f472b6_0%,#c026d3_40%,#701a75_75%,#3b0764_100%)] shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-white/25" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="max-w-xl">
                <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] font-bold text-foreground tracking-tight leading-[1.2]">
                  {EXPLORE_ECOSYSTEM_DATA.banner.title}
                </h3>
                <p className="mt-2 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-primary-text">
                  {EXPLORE_ECOSYSTEM_DATA.banner.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href={EXPLORE_ECOSYSTEM_DATA.banner.primaryAction.href}
                className="inline-flex min-w-32 items-center justify-center rounded-lg bg-[#ea990c] hover:bg-[#d98b0a] px-6 py-2.5 sm:py-3 text-[14px] font-semibold text-white shadow-2xs hover:shadow-xs transition-all whitespace-nowrap cursor-pointer"
              >
                {EXPLORE_ECOSYSTEM_DATA.banner.primaryAction.label}
              </Link>
              <Link
                href={EXPLORE_ECOSYSTEM_DATA.banner.secondaryAction.href}
                className="inline-flex min-w-32 items-center justify-center rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf9f8] px-6 py-2.5 sm:py-3 text-[14px] font-semibold text-foreground transition-all whitespace-nowrap cursor-pointer"
              >
                {EXPLORE_ECOSYSTEM_DATA.banner.secondaryAction.label}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
