'use client';

import { LATEST_NEWS_ARTICLES } from '@/data/about';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function LatestNewsSection() {
  return (
    <section
      aria-label="Catch up on latest news"
      className="min-h-0 bg-white px-4 py-14 text-[#090909] sm:px-6 sm:py-18 lg:px-8 xl:px-12 lg:py-24 w-full overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-left max-w-3xl">
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
            Catch up on the latest news
          </motion.h2>

          <motion.p
            className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: 'easeOut',
            }}
          >
            Visit our{' '}
            <Link
              href="/company/press"
              className="font-semibold text-primary border-b border-primary pb-0.5 hover:opacity-80 transition-opacity"
            >
              newsroom
            </Link>{' '}
            for additional press coverage, media resources, and announcements.
          </motion.p>
        </div>

        {/* Cards Grid (Matching the LeadershipSection card structure & effects) */}
        <div className="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {LATEST_NEWS_ARTICLES.map((article, index) => (
            <motion.article
              key={`${article.id}-${index}`}
              className="group flex flex-col overflow-hidden rounded-[12px] bg-[#f2eeeb] hover:bg-[#eae5e1] shadow-[0_1px_0_rgba(0,0,0,0.02)] border-4 border-[#f2eeeb] hover:border-accent/10 transition-colors"
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
              {/* Photo Area with Deep Burgundy Background & Subtle Hover Scale (Ankit photo placeholder) */}
              <div className="relative h-60 shrink-0 overflow-hidden bg-[linear-gradient(145deg,#450036_0%,#38002c_60%,#2d0023_100%)]">
                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,0,137,0.18),transparent_65%)]" />

                {/* Source Publication Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/40 text-white/90 backdrop-blur-md border border-white/10 shadow-xs">
                    {article.source}
                  </span>
                </div>

                <motion.div
                  className="relative h-full w-full flex items-end justify-center"
                  initial={false}
                  whileHover={{
                    scale: 1.015,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="width:1024px"
                    className="object-cover object-center select-none"
                    priority={index === 0}
                  />
                </motion.div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 flex-col px-5 py-6 xs:px-6 xs:py-7 sm:px-8 sm:py-8 lg:px-9 lg:pb-9 lg:pt-9">
                <h3 className="text-[19px] xs:text-[21px] sm:text-[22px] lg:text-[24px] font-semibold leading-[1.28] tracking-[-0.03em] text-foreground">
                  {article.title}
                </h3>

                <div className="mt-6 sm:mt-auto pt-4 sm:pt-6">
                  <Link
                    href={article.linkHref}
                    className="inline-flex w-fit items-center gap-2 border-b-[3px] border-[#d59a00] pb-1 text-[15px] sm:text-[16px] font-semibold leading-none transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  >
                    {article.linkText}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
