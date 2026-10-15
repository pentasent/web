'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MEET_THE_TEAM_DATA } from '@/data/careers';

export default function MeetTheTeamSection() {
  const { title, subLinkText, subLinkHref, stories } = MEET_THE_TEAM_DATA;
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = stories.length;

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const paginate = useCallback(
    (newDirection: number) => {
      setCurrentIndex((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = total - 1;
        if (next >= total) next = 0;
        return next;
      });
    },
    [total]
  );

  const goToSlide = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      paginate(1); // Swipe left -> Next
    } else if (diff < -50) {
      paginate(-1); // Swipe right -> Prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      aria-label="Meet the Pentasenters"
      className="relative isolate w-full overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white py-18 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-[3.8vw]"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(168,0,137,0.22),transparent_65%)]" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Top Centered Header (matching reference image) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.08] tracking-[-0.04em] text-white">
            {title}
          </h2>

          <div className="mt-3 sm:mt-3.5">
            <Link
              href={subLinkHref}
              className="inline-block text-[14px] sm:text-[15px] font-semibold text-white/95 hover:text-white border-b-2 border-[#f8b824] pb-0.5 transition-colors cursor-pointer"
            >
              {subLinkText}
            </Link>
          </div>
        </motion.div>

        {/* Slider Controls Wrapper */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-6">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous team member"
            className="hidden md:flex shrink-0 w-11 h-11 rounded-lg bg-[#e1d8d1] hover:bg-white text-black items-center justify-center shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f8b824] cursor-pointer select-none"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Main Card Carousel Container (Continuous track without blank flash) */}
          <div
            className="w-full max-w-4xl bg-white rounded-[20px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-white/20 relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Smooth continuous sliding track */}
            <div
              className="flex w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="w-full shrink-0 grid grid-cols-1 md:grid-cols-12 min-h-115 sm:min-h-125"
                >
                  {/* Left Content Side */}
                  <div className="md:col-span-7 p-6 sm:p-9 lg:p-12 flex flex-col justify-between text-left bg-white">
                    <div>
                      {/* Member Name & Role */}
                      <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-foreground">
                          {story.name}
                        </h3>
                        <p className="text-[13px] sm:text-[13.5px] text-primary-text mt-0.5">
                          {story.role}
                        </p>
                      </div>

                      {/* Bold Impact Headline */}
                      <h4 className="mt-5 sm:mt-6 text-[18px] xs:text-[20px] sm:text-[22px] lg:text-[23px] font-bold text-foreground leading-[1.28] tracking-[0.5]">
                        {story.headline}
                      </h4>

                      {/* Story description paragraph (Standardized to mission section scale) */}
                      <p className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-primary-text">
                        {story.description}
                      </p>
                    </div>

                    {/* Read Story Link with Yellow/Amber Underline */}
                    <div className="mt-7 sm:mt-8">
                      <Link
                        href={story.storyLinkHref}
                        className="inline-block text-[14px] sm:text-[15px] font-bold text-foreground hover:text-primary border-b-2 border-[#f8b824] pb-0.5 transition-colors cursor-pointer"
                      >
                        {story.storyLinkText}
                      </Link>
                    </div>
                  </div>

                  {/* Right Photo Side */}
                  <div className="md:col-span-5 relative min-h-75 md:min-h-full bg-[linear-gradient(145deg,#3c0032_0%,#280022_100%)] overflow-hidden flex items-end justify-center">
                    {/* Subtle purple radial glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,0,137,0.35),transparent_70%)] pointer-events-none" />

                    {/* Team member portrait */}
                    <div className="relative w-full h-full min-h-75 md:min-h-full">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        sizes="width:1024px"
                        className="object-cover object-top"
                        priority
                      />
                      {/* Bottom subtle gradient overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#280022]/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* 3D Pentasent Icon Badge on Bottom Right (matching reference image) */}
                    <div className="absolute bottom-4 right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#4a003e]/70 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center p-2.5">
                      <Image
                        src="/assets/images/logos/icon.png"
                        alt="Pentasent"
                        width={30}
                        height={30}
                        className="object-contain drop-shadow"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next team member"
            className="hidden md:flex shrink-0 w-11 h-11 rounded-lg bg-[#e1d8d1] hover:bg-white text-black items-center justify-center shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f8b824] cursor-pointer select-none"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Arrow Navigation */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous team member"
            className="w-10 h-10 rounded-lg bg-[#e1d8d1] hover:bg-white text-black flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next team member"
            className="w-10 h-10 rounded-lg bg-[#e1d8d1] hover:bg-white text-black flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Pagination Dash Indicators (matching reference image) */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-6 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
