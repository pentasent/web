'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RESEARCH_OVERVIEW_DATA } from '@/data/research';

export default function ResearchOverviewSection() {
  const { badge, title, description, image } = RESEARCH_OVERVIEW_DATA;

  return (
    <section
      aria-label="Research paths overview"
      className="w-full bg-white py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-18 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center text-left"
          >
            {/* Eyebrow */}
            {badge && (
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-3">
                {badge}
              </span>
            )}

            {/* Main Headline */}
            <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.14] sm:leading-[1.12] tracking-[-0.03em] text-foreground">
              {title}
            </h2>

            {/* Description */}
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.75] text-primary-text">
              {description}
            </p>
          </motion.div>

          {/* Right Column: Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-16/10 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-xs border border-[#ded9d5]/60"
            >
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center select-none"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
