'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LIFE_PRINCIPLES_DATA } from '@/data/life';

function PrincipleIcon({ icon }: { icon: string }) {
  switch (icon) {
case 'cultural-captain':
  return (
    <svg
      viewBox="0 0 54 44"
      className="w-11 h-9 select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Back growth bar */}
      <path
        d="M11 35H17V22H11V35Z"
        fill="#3c0032"
      />

      {/* Middle growth bar */}
      <path
        d="M20 35H27V16H20V35Z"
        fill="#3c0032"
      />

      {/* Main growth bar */}
      <path
        d="M30 35H38V9H30V35Z"
        fill="#f97316"
      />

      {/* Growth arrow shaft */}
      <path
        d="M35 20L43 12L46 15L38 23Z"
        fill="#f97316"
      />

      {/* Growth arrow head */}
      <path
        d="M40 10H48V18L45 15L40 10Z"
        fill="#3c0032"
      />

      {/* Base line */}
      <path
        d="M8 35H45C46.1 35 47 35.9 47 37C47 38.1 46.1 39 45 39H8C6.9 39 6 38.1 6 37C6 35.9 6.9 35 8 35Z"
        fill="#3c0032"
      />

      {/* Growth highlights */}
      <circle cx="34" cy="13" r="1.3" fill="#ffffff" opacity="0.9" />
      <circle cx="24" cy="20" r="1.3" fill="#ffffff" opacity="0.9" />
      <circle cx="14" cy="26" r="1.3" fill="#ffffff" opacity="0.9" />
    </svg>
  );

    case 'up-to-speed':
      return (
        <svg
          viewBox="0 0 46 46"
          className="w-10 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Dark purple offset back sparkle */}
          <path
            d="M17 6C17 14 11 20 3 20C11 20 17 26 17 34C17 26 23 20 31 20C23 20 17 14 17 6Z"
            fill="#3c0032"
          />
          {/* Vibrant gold foreground sparkle */}
          <path
            d="M26 3C26 14.5 16.5 24 5 24C16.5 24 26 33.5 26 45C26 33.5 35.5 24 47 24C35.5 24 26 14.5 26 3Z"
            fill="#f59e0b"
          />
          {/* Small secondary sparkle at bottom right */}
          <path
            d="M40 33C40 36 38 38 35 38C38 38 40 40 40 43C40 40 42 38 45 38C42 38 40 36 40 33Z"
            fill="#3c0032"
          />
        </svg>
      );

    case 'stealthy-star':
      return (
        <svg
          viewBox="0 0 50 46"
          className="w-11 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Speed / motion trail lines */}
          <line
            x1="8"
            y1="37"
            x2="19"
            y2="26"
            stroke="#3c0032"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="13"
            y1="41"
            x2="24"
            y2="30"
            stroke="#3c0032"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="44"
            x2="26"
            y2="36"
            stroke="#3c0032"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Purple drop-shadow star */}
          <polygon
            points="31,7 34.5,17 45,17 36.5,23.5 39.5,33.5 31,27.5 22.5,33.5 25.5,23.5 17,17 27.5,17"
            fill="#3c0032"
            transform="translate(-3.5, 3.5)"
          />
          {/* Gold star */}
          <polygon
            points="31,7 34.5,17 45,17 36.5,23.5 39.5,33.5 31,27.5 22.5,33.5 25.5,23.5 17,17 27.5,17"
            fill="#f59e0b"
          />
        </svg>
      );

    case 'dream-team':
      return (
        <svg
          viewBox="0 0 48 46"
          className="w-10 h-10 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Left person (purple) */}
          <circle cx="16" cy="22" r="4.2" fill="#3c0032" />
          <path
            d="M9 36C9 30 12.5 27.5 16.5 27.5C18.5 27.5 20 28.5 21 29.5C19 31.5 18 33.5 18 36H9Z"
            fill="#3c0032"
          />

          {/* Right person (gold/amber) */}
          <circle cx="32" cy="22" r="4.2" fill="#f59e0b" />
          <path
            d="M39 36C39 30 35.5 27.5 31.5 27.5C29.5 27.5 28 28.5 27 29.5C29 31.5 30 33.5 30 36H39Z"
            fill="#f59e0b"
          />

          {/* Center person in front (purple) */}
          <circle cx="24" cy="18" r="4.8" fill="#3c0032" />
          <path
            d="M16.5 36C16.5 28.5 20 25 24 25C28 25 31.5 28.5 31.5 36H16.5Z"
            fill="#3c0032"
          />

          {/* Golden star crowned above center person */}
          <polygon
            points="24,5 25.5,9.5 30,9.5 26.5,12 28,16.5 24,13.8 20,16.5 21.5,12 18,9.5 22.5,9.5"
            fill="#f59e0b"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default function LifePrinciplesSection() {
  const { badge, title, subtitle, items } = LIFE_PRINCIPLES_DATA;

  return (
    <section
      aria-label="Our Principles & Recognition"
      className="w-full bg-[#f2eeeb] py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 text-foreground overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-[13px] sm:text-[14px] font-medium tracking-[0.03em] text-[#6b6764] mb-3 block text-center"
            >
              {badge}
            </motion.span>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 4 Columns Grid */}
        <div className="mt-14 sm:mt-18 lg:mt-22 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 xl:gap-12">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: index * 0.08 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-start text-left"
            >
              {/* Icon Container */}
              <div className="h-12 flex items-center mb-5 sm:mb-6">
                <PrincipleIcon icon={item.icon} />
              </div>

              {/* Title */}
              <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-bold text-foreground tracking-tight leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2.5 sm:mt-3 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
