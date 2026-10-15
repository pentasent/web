'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { USER_FEEDBACK_DATA } from '@/data/feedback';
import type { FeedbackItem } from '@/types/landing';

const row1Items = [...USER_FEEDBACK_DATA.row1, ...USER_FEEDBACK_DATA.row1];
const row2Items = [...USER_FEEDBACK_DATA.row2, ...USER_FEEDBACK_DATA.row2];

export default function UserFeedbackSection() {
  const renderItem = (item: FeedbackItem, index: number) => {
    if (item.type === 'photo') {
      return (
        <div
          key={`${item.id}-${index}`}
          className="relative w-75 xs:w-[340px] sm:w-95 h-51.25 sm:h-56.25 shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#ded9d5] shadow-2xs group/photo select-none"
        >
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 300px, (max-width: 768px) 340px, 380px"
            className="object-cover object-center group-hover/photo:scale-105 transition-transform duration-500"
          />
        </div>
      );
    }

    return (
      <div
        key={`${item.id}-${index}`}
        className={`w-75 xs:w-[340px] sm:w-95 h-51.25 sm:h-56.25 shrink-0 ${
          item.bg || 'bg-[#faf9f8]'
        } border border-[#ded9d5] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow duration-300 select-none`}
      >
        <div>
          {/* Card Header: Name & 5 Chart Yellow Stars */}
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[16px] sm:text-[17px] text-foreground tracking-tight">
              {item.author}
            </span>
            <div className="flex items-center gap-0.5 text-[#ffad25]">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-[#ffad25] text-[#ffad25]"
                />
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.58] text-primary-text font-normal line-clamp-4">
            {item.content}
          </p>
        </div>

        {/* Member Role / Verified Tag */}
        {item.role && (
          <div className="pt-2.5 border-t border-black/5 flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-semibold text-primary-text/80">
            <CheckCircle2 size={13} className="shrink-0 text-chart-4" />
            <span>{item.role}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      aria-label="What people say about Pentasent"
      className="w-full bg-white py-16 sm:pb-20 lg:pb-28 overflow-hidden relative"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-4 xs:px-6 sm:px-8 text-center mb-12 sm:mb-16">
        <motion.p
          className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.18em] text-[#6b6568]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {USER_FEEDBACK_DATA.tagline}
        </motion.p>

        <motion.h2
          className="mt-3 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-semibold leading-[1.08] sm:leading-[1.02] tracking-[-0.03em] text-foreground"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.05, ease: 'easeOut' }}
        >
          {USER_FEEDBACK_DATA.titleBefore}
          <span className="text-chart-4 font-bold">
            {USER_FEEDBACK_DATA.titleHighlight}
          </span>
          {USER_FEEDBACK_DATA.titleAfter}
        </motion.h2>

        <motion.p
          className="mt-3.5 sm:mt-4 max-w-2xl mx-auto text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] text-primary-text"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
        >
          {USER_FEEDBACK_DATA.subtitle}
        </motion.p>
      </div>

      {/* Infinite Horizontal Feedback Sliders with Edge Gradients */}
      <div className="relative w-full overflow-hidden flex flex-col gap-5 sm:gap-6">
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 md:w-36 bg-linear-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 md:w-36 bg-linear-to-l from-white via-white/80 to-transparent z-20" />

        {/* Row 1 (Glides Left) */}
        <div className="flex w-full overflow-hidden group">
          <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6 animate-marquee-left group-hover:paused">
            {row1Items.map((item, idx) => renderItem(item, idx))}
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6 animate-marquee-left group-hover:paused"
          >
            {row1Items.map((item, idx) => renderItem(item, idx + 100))}
          </div>
        </div>

        {/* Row 2 (Glides Right) */}
        <div className="flex w-full overflow-hidden group">
          <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6 animate-marquee-right group-hover:paused">
            {row2Items.map((item, idx) => renderItem(item, idx))}
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6 animate-marquee-right group-hover:paused"
          >
            {row2Items.map((item, idx) => renderItem(item, idx + 100))}
          </div>
        </div>
      </div>
    </section>
  );
}
