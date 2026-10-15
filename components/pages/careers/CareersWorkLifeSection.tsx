'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CAREERS_WORK_CULTURE_DATA } from '@/data/careers';

export default function CareersWorkLifeSection() {
  const { badge, title, subtitle, items } = CAREERS_WORK_CULTURE_DATA;

  return (
    <section
      aria-label="Join us and work culture at Pentasent"
      className="w-full bg-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        {(badge || title) && (
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            {badge && (
              <span className="inline-block text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-3">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Alternating Items: Join us, Working at Pentasent, Research at */}
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

                  {/* Career Card Text Link */}
                  {item.linkText && item.linkHref && (
                    <div className="mt-6 sm:mt-8">
                      <Link
                        href={item.linkHref}
                        className="group inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold text-foreground border-b-2 border-[#e5a83b] pb-0.5 hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                      >
                        <span>{item.linkText}</span>
                        <ArrowRight
                          size={17}
                          className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  )}
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
                  <div className="group relative w-full aspect-4/3.5 sm:aspect-square max-w-125 lg:max-w-none rounded-[20px] bg-border-background p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-all duration-500 shadow-xs">
                    <div className="relative w-full h-full rounded-[20px] overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="width:1024px"
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
