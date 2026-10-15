"use client";

import { motion } from 'framer-motion';
// import { Check } from 'lucide-react';
import { SectionsCards } from '@/data/home';
import Link from 'next/link';
import type {
  // SectionCard,
  ImageCardProps,
  BenefitSectionProps,
  HeadingBlockProps,
} from '@/types/landing';

const ImageCard = ({
  src = '',
  alt = '',
  className = '',
  imageClassName = '',
  delay = 0,
}: ImageCardProps) => {
  return (
    <motion.div
      className={`overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f2eee9] border border-[#ded9d5]/60 shadow-2xs ${className}`}
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        delay,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName}`}
        initial={{
          scale: 1.05,
        }}
        whileInView={{
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        whileHover={{
          scale: 1.025,
        }}
        transition={{
          scale: {
            duration: 5,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      />
    </motion.div>
  );
};

const HeadingBlock = ({ card }: HeadingBlockProps) => (
  <motion.div
    className="relative z-10"
    initial={{
      opacity: 0,
      y: 18,
    }}
    whileInView={{
      opacity: 1,
      y: 0,
    }}
    viewport={{
      once: true,
      amount: 0.15,
    }}
    transition={{
      delay: 0.1,
      duration: 0.65,
      ease: 'easeOut',
    }}
  >
    <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-primary-text/80">
      {card.tagLine}
    </p>

    <h2 className="mt-2.5 sm:mt-3.5 max-w-2xl text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-semibold leading-[1.12] sm:leading-[1.06] tracking-[-0.03em] text-foreground md:mb-20 mb-0 lg:mb-0 sm:mb-0">
    {/* <h2 className="mt-2.5 sm:mt-3.5 max-w-xl text-[28px] xs:text-[32px] sm:text-[38px] lg:text-[42px] font-semibold leading-[1.12] sm:leading-[1.06] tracking-[-0.03em] text-foreground"> */}
      {card.titleBefore}{' '}

      <span style={{ color: card.accent }}>
        {card.titleHighlight}
      </span>{' '}

      {card.titleAfter}
    </h2>
  </motion.div>
);

const BenefitSection = ({ card }: BenefitSectionProps) => {

  return (
    <section className="relative min-h-0 overflow-hidden text-foreground py-10 sm:py-14 lg:py-18 lg:mt-10" id={card.link}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 xs:px-6 sm:px-10 lg:px-8 xl:px-12">

        {/* MOBILE & TABLET HEADING: Top of section on < lg viewports */}
        <div className="relative block lg:hidden mb-6 sm:mb-8">
          {/* Soft ambient glow under mobile/tablet title */}
          <motion.div
            className="pointer-events-none absolute -left-6 -top-6 z-0 h-44 w-44 sm:h-56 sm:w-56 rounded-full"
            initial={{
              opacity: 0,
              scale: 0.72,
              filter: 'blur(30px)',
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              background: `radial-gradient(
                circle at center,
                ${card.accent}35 0%,
                ${card.accent}20 25%,
                ${card.accent}08 55%,
                transparent 75%
              )`,
            }}
          />
          <HeadingBlock card={card} />
        </div>

        {/* 2-COLUMN DESKTOP GRID / 1-COLUMN MOBILE & TABLET CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,0.88fr)_minmax(480px,1.25fr)] gap-8 md:gap-10 lg:gap-12 xl:gap-14 items-start">

          {/* LEFT COLUMN: Portrait Card + Details */}
          {/* On mobile: vertical. On tablet (md): side-by-side grid. On desktop: vertical */}
          <div className="w-full flex flex-col md:grid md:grid-cols-2 md:gap-8 md:items-center lg:flex lg:flex-col lg:items-stretch lg:gap-0">

            {/* Portrait - disciplined, clean height that floats gracefully */}
            <motion.div
              className={`relative w-full md:col-span-1 mt-4 sm:mt-6 md:mt-0 h-60 xs:h-68 sm:h-74 md:h-64 lg:h-72 xl:h-76 overflow-visible rounded-2xl sm:rounded-3xl border border-black/4 shadow-2xs ${card.bg}`}
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.65,
                ease: 'easeOut',
              }}
            >
              <motion.img
                src={card.images.portrait}
                alt={card.titleHighlight}
                className="absolute inset-x-0 bottom-0 h-[112%] sm:h-[116%] w-full object-contain object-bottom -translate-y-3 sm:-translate-y-5 pointer-events-none drop-shadow-xs"
                initial={{
                  scale: 1.05,
                }}
                whileInView={{
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.1,
                  ease: 'easeOut',
                }}
              />
            </motion.div>

            {/* Benefits & Button */}
            <motion.div
              className="md:col-span-1 flex flex-col justify-center mt-6 lg:mt-8"
              initial={{
                opacity: 0,
                y: 16,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] lg:text-[26px] font-semibold leading-[1.18] tracking-[-0.03em] text-foreground">
                {card.subtitle}
              </h3>

              <p className="mt-2.5 sm:mt-3.5 max-w-lg text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] text-primary-text">
                {card.desc}
              </p>

              {/* <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                {card.benifits.map((benefit, benefitIndex) => (
                  <motion.li
                    key={benefit}
                    className="flex items-center gap-2.5 text-[14px] sm:text-[15px] font-medium text-primary-text"
                    initial={{
                      opacity: 0,
                      x: -8,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.35 + benefitIndex * 0.06,
                      duration: 0.35,
                    }}
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                      style={{
                        backgroundColor: card.accent,
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>

                    {benefit}
                  </motion.li>
                ))}
              </ul> */}

              <Link href={`/${card.link}`} className="mt-6 sm:mt-7 inline-block w-fit">
                <motion.span
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="inline-flex min-w-40 sm:min-w-44 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] font-semibold tracking-wide text-white shadow-2xs hover:shadow-xs transition-all"
                  style={{
                    backgroundColor: card.accent,
                  }}
                >
                  {card.linkText}
                </motion.span>
              </Link>

              {/* <Link href={`/${card.link}`} style={{ "--card-accent": card.accent, } as React.CSSProperties & Record<string, string>}
                className="mt-6 sm:mt-auto inline-flex w-fit items-center gap-2 border-b-[3px] border-(--card-accent) pb-1 pt-4 sm:pt-6 text-[15px] sm:text-[16px] font-semibold leading-none cursor-pointer text-(--card-accent) transition-colors duration-200 hover:border-[#d59a00]">
                {card.linkText}
              </Link> */}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Desktop Heading + Dual Editorial Images */}
          {/* On desktop: Heading is on top, and Dual Images are snug directly below it */}
          {/* On tablet/mobile: Heading is hidden here (already rendered above), so Dual Images sit below Left Column */}
          <div className="relative w-full flex flex-col mt-4 md:mt-2 lg:mt-0">

            {/* Soft centered accent glow */}
            <motion.div
              className="pointer-events-none absolute -left-8 lg:-left-12 -top-4 lg:-top-6 z-0 h-56 w-56 sm:h-72 sm:w-72 lg:h-88 lg:w-88 rounded-full"
              initial={{
                opacity: 0,
                scale: 0.72,
                filter: 'blur(30px)',
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                background: `radial-gradient(
                  circle at center,
                  ${card.accent}38 0%,
                  ${card.accent}22 25%,
                  ${card.accent}08 55%,
                  transparent 75%
                )`,
              }}
            />

            {/* Desktop Heading */}
            <div className="hidden lg:block mb-5 xl:mb-6 relative z-10">
              <HeadingBlock card={card} />
            </div>

            {/* Dual Editorial Images — disciplined, clean heights */}
            <div className="relative z-10 grid grid-cols-2 items-start gap-3.5 sm:gap-5 lg:gap-6">

              {/* First image — slightly lower offset */}
              <ImageCard
                src={card.images.joyful}
                alt={`${card.tag} pentasent`}
                delay={0.4}
                className="lg:mt-8 h-48 xs:h-56 sm:h-64 md:h-70 lg:h-80 xl:h-88"
                imageClassName="object-[50%_42%]"
              />

              {/* Second image — standard height */}
              <ImageCard
                src={card.images.walking}
                alt={`${card.tag} walking`}
                delay={0.28}
                className="h-48 xs:h-56 sm:h-64 md:h-70 lg:h-80 xl:h-88"
                imageClassName="object-[50%_45%]"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default function Benifits() {
  return (
    <div className="overflow-hidden w-full">
      {SectionsCards.map((card) => (
        <BenefitSection
          key={card.tag}
          card={card}
        />
      ))}
    </div>
  );
}