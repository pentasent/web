'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RESEARCH_APPLY_CTA_DATA } from '@/data/research';

export default function ResearchApplyCtaSection() {
  const { badge, title, description, buttonText, buttonHref } =
    RESEARCH_APPLY_CTA_DATA;

  return (
    <section
      aria-label="Apply for research positions"
      className="w-full bg-border-background py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          {badge && (
            <span className="inline-block text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-3">
              {badge}
            </span>
          )}

          {/* Headline */}
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.12] sm:leading-[1.1] tracking-[-0.03em] text-foreground">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl mx-auto">
            {description}
          </p>

          {/* Apply Button in Center */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center">
            <Link
              href={buttonHref || '/company/careers/open-roles'}
              className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#ffa91f] px-8 py-3.5 sm:px-9 sm:py-4 text-[15px] sm:text-[16px] font-bold text-[#171318] transition-all duration-300 hover:bg-[#f6a116] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{buttonText || 'Apply now'}</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
