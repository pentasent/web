'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RESEARCH_QUOTE_DATA } from '@/data/research';

export default function ResearchQuoteSection() {
  const { eyebrow, quote, authorName, authorRole, image, imageAlt } =
    RESEARCH_QUOTE_DATA;

  return (
    <section
      aria-label="In their own words"
      className="w-full bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 xl:gap-20 items-center">
          {/* Left Column: Portrait Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none aspect-square sm:aspect-[4/4.2] rounded-[24px] overflow-hidden bg-[linear-gradient(145deg,#3c0032_0%,#280022_100%)] border-4 border-white/10 group">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,0,137,0.35),transparent_70%)] pointer-events-none" />

              <Image
                src={image}
                alt={imageAlt || `${authorName} - ${authorRole}`}
                fill
                sizes="width: 1024px"
                className="object-cover object-top select-none transition-transform duration-700 ease-out group-hover:scale-103"
                priority
              />

              {/* Bottom subtle gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#280022]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column: Quote & Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Eyebrow */}
            {eyebrow && (
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#ffd3f0] mb-4 sm:mb-6">
                {eyebrow}
              </span>
            )}

            {/* Big Headline Quote */}
            <blockquote className="text-[30px] sm:text-[36px] font-bold leading-[1.2] sm:leading-[1.18] tracking-tight text-white">
              {quote}
            </blockquote>

            {/* Attribution */}
            <p className="mt-6 sm:mt-8 text-[15px] sm:text-[16px] lg:text-[17px] text-white/85 font-medium">
              — {authorName}, {authorRole}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
