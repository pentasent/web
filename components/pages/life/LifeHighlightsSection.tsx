'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { LIFE_HIGHLIGHTS_DATA } from '@/data/life';
import { LifeQuoteItem, LifePhotoItem } from '@/types/life';

function QuoteCard({ item, delay = 0 }: { item: LifeQuoteItem; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-between rounded-[12px] bg-background hover:bg-accent/40 transition-colors p-6 sm:p-8 border border-background hover:border-accent/5 hover:transition-colors shadow-xs min-h-55 md:min-h-0 h-full max-h-60"
    >
      <div className="flex-1 flex flex-col justify-center">
        <blockquote className="font-serif italic text-[18px] xs:text-[19px] sm:text-[20px] lg:text-[21px] leading-[1.4] text-[#1c1819]">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
        <div className="w-12 h-0.5 bg-border-2 my-4 sm:my-5" />
      </div>

      <div className="flex items-center gap-3 relative">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 shrink-0 bg-border-2 shadow-xs">
          <Image
            src={item.authorAvatar}
            alt={item.authorName}
            fill
            sizes="100px"
            className="object-cover object-center"
          />
        </div>
        <div>
          <h4 className="text-[14px] sm:text-[15px] font-bold text-foreground leading-tight">
            {item.authorName}
          </h4>
          <p className="text-[12px] sm:text-[12.5px] text-primary-text font-medium leading-tight mt-0.5">
            {item.authorRole}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PhotoCard({ item, delay = 0 }: { item: LifePhotoItem; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[12px] overflow-hidden bg-background hover:bg-accent/40 shadow-xs min-h-55 md:min-h-0 h-full max-h-60"
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="width:1024px"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
}

export default function LifeHighlightsSection() {
  const { badge, title, subtitle, row1, row2, row3, row4 } = LIFE_HIGHLIGHTS_DATA;

  return (
    <section
      aria-label="Life Highlights"
      className="w-full bg-white py-16 sm:py-20 lg:py-20 px-4 sm:px-8 lg:px-[3.8vw]"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
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

        {/* Mosaic Bento Grid (4 Alternating Rows) */}
        <div className="space-y-4 sm:sapace-y-0 lg:space-y-0">

          {/* Row 1: Quote wider - Photo square - Photo square */}
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr_1fr] gap-4 sm:gap-5 md:h-67.5 lg:h-72.5 xl:h-75">
            <QuoteCard item={row1[0]} delay={0.05} />
            <PhotoCard item={row1[1]} delay={0.12} />
            <PhotoCard item={row1[2]} delay={0.18} />
          </div>

          {/* Row 2: Photo square - Photo square - Quote wider */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.35fr] gap-4 sm:gap-5 md:h-67.5 lg:h-72.5 xl:h-75">
            <PhotoCard item={row2[0]} delay={0.08} />
            <PhotoCard item={row2[1]} delay={0.14} />
            <QuoteCard item={row2[2]} delay={0.2} />
          </div>

          {/* Row 3: Quote wider - Photo square - Photo square */}
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr_1fr] gap-4 sm:gap-5 md:h-67.5 lg:h-72.5 xl:h-75">
            <QuoteCard item={row3[0]} delay={0.08} />
            <PhotoCard item={row3[1]} delay={0.14} />
            <PhotoCard item={row3[2]} delay={0.2} />
          </div>

          {/* Row 4: Photo square - Photo square - Quote wider */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.35fr] gap-4 sm:gap-5 md:h-67.5 lg:h-72.5 xl:h-75">
            <PhotoCard item={row4[0]} delay={0.08} />
            <PhotoCard item={row4[1]} delay={0.14} />
            <QuoteCard item={row4[2]} delay={0.2} />
          </div>

        </div>
      </div>
    </section>
  );
}