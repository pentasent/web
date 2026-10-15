'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FEATURED_TEAMS_DATA } from '@/data/careers';

export default function FeaturedTeamsSection() {
  const { badge, title, subtitle, teams } = FEATURED_TEAMS_DATA;

  return (
    <section
      aria-label="Featured Teams"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-[3.8vw]"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header (Identical to LifeHighlightsSection top section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20"
        >
          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
            {badge}
          </span>
          <h2 className="mt-2 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.04em] text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
            {subtitle}
          </p>
        </motion.div>

        {/* 3 Featured Team Cards (Identical design to About LeadershipSection cards) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {teams.map((team, index) => (
            <motion.article
              key={team.id}
              className="group flex flex-col overflow-hidden rounded-[12px] bg-background hover:bg-accent/40 shadow-[0_1px_0_rgba(0,0,0,0.02)] border-4 border-background hover:border-accent/5 hover:transition-colors"
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: index * 0.1 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Photo Area with Deep Burgundy Background & Subtle Hover Scale */}
              <div className="relative h-60 shrink-0 overflow-hidden bg-[linear-gradient(145deg,#450036_0%,#38002c_60%,#2d0023_100%)]">
                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,0,137,0.18),transparent_65%)]" />

                <motion.div
                  className="relative h-full w-full flex items-center justify-center overflow-hidden"
                  initial={false}
                  whileHover={{
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Image
                    src={team.image}
                    alt={team.title}
                    fill
                    sizes="width:1024px"
                    className="object-cover object-center select-none"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 flex-col px-5 py-6 xs:px-6 xs:py-7 sm:px-8 sm:py-8 lg:px-9 lg:pb-9 lg:pt-9">
                <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] lg:text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground">
                  {team.title}
                </h3>

                <p className="mt-2.5 sm:mt-3 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] text-primary-text flex-1">
                  {team.description}
                </p>

                <Link
                  href={team.linkHref}
                  className="mt-6 sm:mt-auto inline-flex w-fit items-center gap-2 border-b-[3px] border-[#d59a00] pb-1 pt-4 sm:pt-6 text-[15px] sm:text-[16px] font-semibold leading-none transition-colors hover:border-primary hover:text-primary cursor-pointer"
                >
                  {team.linkText}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
