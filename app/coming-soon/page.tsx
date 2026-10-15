'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calculator,
  Newspaper,
  Briefcase,
  Home,
} from 'lucide-react';
import ComingSoonNotifyForm from '@/components/forms/ComingSoonNotifyForm';
import { COMING_SOON_DATA, ExploreLink } from '@/data/coming-soon';

export default function ComingSoonPage() {
  const { badge, hero, explore, mailbox, bottomBanner } = COMING_SOON_DATA;

  const renderExploreIcon = (iconName: ExploreLink['icon']) => {
    switch (iconName) {
      case 'calculator':
        return <Calculator className="w-3.5 h-3.5 text-primary" />;
      case 'newspaper':
        return <Newspaper className="w-3.5 h-3.5 text-primary" />;
      case 'briefcase':
        return <Briefcase className="w-3.5 h-3.5 text-primary" />;
      case 'home':
      default:
        return <Home className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-white text-primary-text flex flex-col justify-between">
      {/* =========================================================
          MAIN COMING SOON CONTENT
          ========================================================= */}
      <main className="mx-auto w-full max-w-7xl px-4 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Message & Notification Form */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-border-background border border-border-2 text-xs font-semibold tracking-wide text-foreground uppercase mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-3 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-3"></span>
              </span>
              <span>{badge.label}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] lg:text-[44px] font-bold leading-[1.15] tracking-tight text-foreground">
              {hero.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="mt-5 text-[15px] sm:text-[17px] lg:text-[17.5px] leading-[1.65] text-primary-text max-w-xl">
              {hero.description}
            </p>

            {/* Shifted Notification Form */}
            <div className="mt-8 w-full max-w-lg">
              <ComingSoonNotifyForm />
            </div>

            {/* Quick Links to Available Resources */}
            <div className="mt-10 pt-6 border-t border-border-2 w-full max-w-xl">
              <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase block mb-3">
                {explore.title}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {explore.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-border-background hover:bg-muted/50 border border-border-2 text-xs font-medium text-foreground transition-colors cursor-pointer"
                  >
                    {renderExploreIcon(link.icon)}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Mailbox Envelope Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center lg:justify-end py-6"
          >
            {/* Ambient Background Aura */}
            <div
              className="absolute w-[320px] sm:w-105 h-80 sm:h-105 rounded-full bg-linear-to-tr from-primary/15 via-primary/10 to-transparent blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Floating Mailbox Image */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-full max-w-85 xs:max-w-[380px] sm:max-w-110 lg:max-w-120 drop-shadow-sm"
            >
              <Image
                src={mailbox.src}
                alt={mailbox.alt}
                width={mailbox.width}
                height={mailbox.height}
                priority
                className="w-full h-auto object-contain select-none pointer-events-none"
              />
            </motion.div>
          </motion.div>

        </div>
      </main>

      {/* Subtle bottom note banner matching border-background */}
      <section className="w-full bg-border-background border-t border-border-2 py-6 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-chart-3" />
            <span>{bottomBanner.tagline}</span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={bottomBanner.contactHref}
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              {bottomBanner.contactText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
