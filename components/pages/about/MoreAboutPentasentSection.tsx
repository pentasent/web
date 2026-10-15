'use client';

import { MORE_ABOUT_PENTASENT } from '@/data/about';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function MoreAboutPentasentSection() {
  return (
    <section
      aria-label="More about Pentasent"
      className="min-h-0 bg-white px-4 py-12 text-[#090909] sm:px-6 sm:py-16 lg:px-8 xl:px-12 lg:py-20 w-full overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center sm:text-left">
          <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-2 sm:mb-3">
            More about Pentasent
          </p>
          <motion.h2
            className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-semibold leading-[1.08] sm:leading-[1.02] tracking-[-0.03em] text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              ease: 'easeOut',
            }}
          >
            Discover our <span className="text-border-2">ecosystem</span>
          </motion.h2>

          <p className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl">
            Explore our research initiatives, clinical technology innovations, and leadership guiding global healthcare.
          </p>
        </div>

        {/* Cards Grid (Identical design, theme & style to LeadershipSection cards) */}
        <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7">
          {MORE_ABOUT_PENTASENT.map((item, index) => (
            <motion.article
              key={`${item.id}-${index}`}
              className="group flex flex-col overflow-hidden rounded-[12px] bg-background hover:bg-accent/40 shadow-[0_1px_0_rgba(0,0,0,0.02)] border-4 border-background hover:border-accent/5 hover:transition-colors"
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: index * 0.1 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Photo Area with Deep Burgundy Background & Subtle Hover Scale */}
              <div className="relative h-60 sm:h-80 shrink-0 overflow-hidden bg-[linear-gradient(145deg,#450036_0%,#38002c_60%,#2d0023_100%)]">
                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,0,137,0.18),transparent_65%)]" />

                <motion.div
                  className="relative h-full w-full flex items-end justify-center"
                  initial={false}
                  whileHover={{
                    scale: 1.015,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="width: 1024px"
                    className="object-cover object-center select-none"
                    priority={index === 0}
                  />
                </motion.div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 flex-col px-5 py-6 xs:px-6 xs:py-7 sm:px-8 sm:py-8 lg:px-9 lg:pb-9 lg:pt-9">
                <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] lg:text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2.5 sm:mt-3 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] text-primary-text flex-1">
                  {item.description}
                </p>

                <Link
                  href={item.linkHref}
                  className="mt-6 sm:mt-auto inline-flex w-fit items-center gap-2 border-b-[3px] border-[#d59a00] pb-1 pt-4 sm:pt-6 text-[15px] sm:text-[16px] font-semibold leading-none transition-colors hover:border-primary hover:text-primary cursor-pointer"
                >
                  {item.linkText}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
