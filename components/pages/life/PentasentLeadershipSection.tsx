'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PENTASENT_LEADERSHIP_DATA } from '@/data/life';

export default function PentasentLeadershipSection() {
  const { title, subtitle, principles } = PENTASENT_LEADERSHIP_DATA;

  return (
    <section
      aria-label="Pentasent Leadership Principles"
      className="min-h-0 bg-[#f2eeeb] px-4 py-14 text-foreground sm:px-6 sm:py-18 lg:px-8 xl:px-12 lg:py-24 w-full overflow-hidden"
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
            {title}
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
            {subtitle}
          </motion.p>
        </div>

        {/* Cards Grid (Identical to Join the Team component styling) */}
        <div className="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {principles.map((principle, index) => (
            <motion.article
              key={principle.id}
              className="group flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)] border-4 border-background"
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
                delay: index * 0.08 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Photo Area with Deep Burgundy Background & Subtle Hover Scale */}
              <div className="relative h-60 shrink-0 overflow-hidden bg-[linear-gradient(145deg,#450036_0%,#38002c_60%,#2d0023_100%)]">
                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,0,137,0.18),transparent_65%)]" />

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
                    src={principle.image}
                    alt={principle.title}
                    fill
                    sizes="width: 1024px"
                    className="object-cover object-center select-none"
                    priority={index === 0}
                  />
                </motion.div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 flex-col px-5 py-6 xs:px-6 xs:py-7 sm:px-8 sm:py-8 lg:px-9 lg:pb-9 lg:pt-8">
                {/* Step Number */}
                <span className="text-[13px] font-bold text-[#7d7976] mb-2 tracking-wider">
                  {principle.step}
                </span>

                <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] lg:text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground">
                  {principle.title}
                </h3>

                <p className="mt-2.5 sm:mt-3 text-[15px] sm:text-[16px] leading-[1.65] text-primary-text">
                  {principle.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
