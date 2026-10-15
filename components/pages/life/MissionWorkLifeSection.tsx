'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LIFE_MISSION_WORKLIFE_DATA } from '@/data/life';

export default function MissionWorkLifeSection() {
  const { badge, title, items } = LIFE_MISSION_WORKLIFE_DATA;

  return (
    <section
      aria-label="Our Mission and Work Culture"
      className="w-full bg-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Optional Header if provided */}
        {(badge || title) && (
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            {badge && (
              <span className="inline-block text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Alternating Mission & Growth Items */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          {items.map((item, idx) => {
            const isImageRight = item.imagePosition === 'right';

            return (
              <div
                key={item.id || idx}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center"
              >
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col justify-center ${
                    isImageRight
                      ? 'order-1 lg:order-1'
                      : 'order-1 lg:order-2 lg:pl-4'
                  }`}
                >
                  {item.badge && (
                    <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-primary mb-2">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-[28px] xs:text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.12] tracking-[-0.03em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-xl">
                    {item.description}
                  </p>
                </motion.div>

                {/* Graphic Card */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`w-full flex justify-center ${
                    isImageRight
                      ? 'order-2 lg:order-2'
                      : 'order-2 lg:order-1'
                  }`}
                >
                  <div className="group relative w-full aspect-4/3.5 sm:aspect-square max-w-125 lg:max-w-none rounded-[20px] bg-[#ede6df] p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-all duration-500">
                    <div className="relative w-full h-full rounded-[20px] overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="width: 1024px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-104 select-none"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
