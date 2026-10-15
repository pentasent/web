'use client';

import { PRESS_HERO_DATA } from '@/data/press';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Image from 'next/image';

export default function PressHero() {
  const { badge, subtitle, metrics } = PRESS_HERO_DATA;

  return (
    <section className="relative max-w-full mx-auto isolate flex lg:max-h-[85vh] mx-h-full flex-col justify-between overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-30 lg:pb-20">
      {/* Background Graphic Image (Light subtle view as shown in mockup) */}
      <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
        <Image
          src="/assets/images/pages/press/press_banner_one.png"
          alt="Pentasent Press Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 mix-blend-screen"
        />
        {/* Bottom Fade Gradient for smooth transition */}
        <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/60 via-secondary/60 to-transparent" />
      </div>

      {/* Main Hero Content (Fade + Blur + Scale Animation from home hero) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
      >
        {/* Newsroom Eyebrow */}
        <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
          {badge}
        </p>

        {/* Main Headline */}
        <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
          Rewriting <span className="text-[#ffd3f0]">the story</span> of healthcare
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
          {subtitle}
        </p>
      </motion.div>

      {/* Bottom Metrics / Accolades Row (Doctors, Clinics, Products, Users, Monthly Traffic) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-16 w-full max-w-7xl px-4 xs:px-6 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 lg:gap-6">
          {metrics.map((item, idx) => (
            <motion.div
              key={item.id}
              className="flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.08, duration: 0.6 }}
            >
              {/* Golden Trophy Icon */}
              <div className="mb-2.5 sm:mb-3 flex h-7 w-7 items-center justify-center">
                <Trophy className="h-5 w-5 text-[#f5a623] transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Bold Stat Value */}
              <h3 className="text-[17px] xs:text-[18px] sm:text-[20px] font-bold tracking-tight text-white">
                {item.value}
              </h3>

              {/* Stat Sublabel */}
              <p className="mt-1 text-[12px] sm:text-[13px] leading-snug text-white/70 max-w-42.5">
                {item.sublabel}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
