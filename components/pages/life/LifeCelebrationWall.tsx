'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Sparkles } from 'lucide-react';
import { LIFE_CELEBRATIONS_DATA } from '@/data/life';

export default function LifeCelebrationWall() {
  const { badge, title, subtitle, cards } = LIFE_CELEBRATIONS_DATA;

  return (
    <section
      aria-label="Global Celebrations Wall"
      className="relative w-full bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-[3.8vw] text-white overflow-hidden"
    >
      {/* Ambient Lighting & Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-[radial-gradient(ellipse_at_center,rgba(255,211,240,0.14),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute -bottom-32 right-0 w-137.5 h-87.5 bg-[radial-gradient(ellipse_at_center,rgba(168,0,137,0.22),transparent_70%)] pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#ffd3f0] mb-2.5">
            <Sparkles size={14} className="text-[#ffa91f]" />
            {badge}
          </span>
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.035em] text-white">
            {title}
          </h2>
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16.5px] leading-relaxed text-white/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* 4 Cards Celebration Wall Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 mt-12 sm:mt-16 lg:mt-20">
          {cards.map((card, idx) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: idx * 0.1 + 0.1,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#33002a] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.20)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.28)] hover:border-white/20 flex flex-col justify-end aspect-[3/4.2] sm:aspect-[3/4.4] lg:aspect-3/4.5"
            >
              {/* Photo Background */}
              <Image
                src={card.image}
                alt={`${card.title} - ${card.country}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 select-none"
              />

              {/* Bottom Gradient Fade for readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/5 transition-opacity duration-300 pointer-events-none" />

              {/* Subtle top illumination on hover */}
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Content Overlay */}
              <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end">
                {/* Location / Country Tag */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 w-fit mb-2.5 shadow-xs">
                  <Globe size={12} className="text-[#ffa91f]" />
                  {card.country}
                </span>

                {/* Card Title */}
                <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-tight group-hover:text-[#ffd3f0] transition-colors">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="mt-1.5 text-[12.5px] sm:text-[13px] text-white/80 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {card.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
