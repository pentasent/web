'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CAREERS_STATS_DATA } from '@/data/careers';

export default function CareersStatsSection() {
  const { title, subtitle, stats } = CAREERS_STATS_DATA;

  return (
    <section
      aria-label="Our growth on display"
      className="relative isolate w-full overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-20 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-[3.8vw]"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(168,0,137,0.18),transparent_65%)]" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24"
        >
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.035em] text-white">
            {title}
          </h2>

          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16.5px] leading-relaxed text-white/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* 6 Stats Grid (2 rows x 3 columns on large screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 lg:gap-y-20 gap-x-8 sm:gap-x-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: index * 0.07 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center text-center group"
            >
              {/* Stat Value with Lilac Accent on Suffix as shown in reference */}
              <div className="text-[52px] xs:text-[60px] sm:text-[68px] lg:text-[68px] font-extrabold tracking-tight text-white leading-none">
                {stat.prefix && <span>{stat.prefix}</span>}
                <span>{stat.value}</span>
                {stat.suffix && (
                  <span className="text-[#ffd3f0] font-bold ml-0.5">
                    {stat.suffix}
                  </span>
                )}
              </div>

              {/* Stat Label */}
              <p className="mt-3 sm:mt-4 text-[15px] sm:text-[16.5px] font-normal text-white/80 tracking-tight leading-snug max-w-xs">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
