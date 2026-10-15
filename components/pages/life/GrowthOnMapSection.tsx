'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { LIFE_GROWTH_ON_MAP_DATA } from '@/data/life';

export default function GrowthOnMapSection() {
  const { title, subtitle, image, alt } = LIFE_GROWTH_ON_MAP_DATA;

  return (
    <section
      aria-label="Our Growth on the Map"
      className="w-full bg-white pt-16 sm:pt-20 lg:pt-28 pb-8 sm:pb-12 text-foreground overflow-hidden"
    >
      {/* Centered Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] sm:leading-[1.04] tracking-[-0.035em] text-foreground"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Full Width Graphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full mt-8 sm:mt-12 lg:mt-16 flex justify-center"
      >
        <div className="relative w-full max-w-450 mx-auto px-4 sm:px-6 lg:px-8">
          <Image
            src={image}
            alt={alt}
            width={2000}
            height={1050}
            priority
            sizes="width: 1600px"
            className="w-full h-auto object-contain object-bottom select-none mx-auto"
          />
        </div>
      </motion.div>
    </section>
  );
}
