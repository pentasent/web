'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Cookie, Scale } from 'lucide-react';
import { LegalHero as LegalHeroType } from '@/types/legal';

interface LegalHeroProps {
  hero: LegalHeroType;
  iconType?: 'shield' | 'fileText' | 'cookie' | 'scale';
}

export default function LegalHero({ hero, iconType = 'shield' }: LegalHeroProps) {
  const renderIcon = () => {
    switch (iconType) {
      case 'fileText':
        return <FileText className="h-4 w-4 text-primary" strokeWidth={2.2} />;
      case 'cookie':
        return <Cookie className="h-4 w-4 text-primary" strokeWidth={2.2} />;
      case 'scale':
        return <Scale className="h-4 w-4 text-primary" strokeWidth={2.2} />;
      case 'shield':
      default:
        return <Shield className="h-4 w-4 text-primary" strokeWidth={2.2} />;
    }
  };

  return (
    <section className="relative w-full bg-border-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start text-left"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-[12.5px] sm:text-[13.5px] font-semibold text-primary tracking-wide">
            {renderIcon()}
            <span>{hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-4 text-[28px] xs:text-[32px] sm:text-[40px] lg:text-[44px] font-bold leading-[1.15] tracking-tight text-foreground">
            {hero.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-relaxed text-primary-text max-w-3xl">
            {hero.subtitle}
          </p>

          {/* Advisory / Meta Info */}
          {hero.lastUpdated && (
            <p className="mt-4 text-[12.5px] sm:text-[13px] font-medium text-muted-foreground">
              {hero.lastUpdated}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
