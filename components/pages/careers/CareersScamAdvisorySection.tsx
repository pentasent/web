'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CAREERS_SCAM_ADVISORY_DATA } from '@/data/careers';

export default function CareersScamAdvisorySection() {
  const { title, description, linkText, linkHref } = CAREERS_SCAM_ADVISORY_DATA;

  return (
    <section
      aria-label="Recruiting scam advisory"
      className="w-full bg-white pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.15] tracking-tight text-foreground">
          {title}
        </h2>

        <p className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl">
          {description}
        </p>

        <div className="mt-5 sm:mt-6">
          <Link
            href={linkHref}
            className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#ffa91f] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
          >
            <span>{linkText}</span>
            <ArrowRight
              size={16}
              className="text-primary transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
