'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  LayoutList,
  CheckCircle2,
} from 'lucide-react';
import { PITCH_DECK_META, PITCH_DECK_SLIDES } from '@/data/pitch-deck';
import type { DeckSlide, PitchDeckMeta } from '@/types/investors';

export default function PitchDeckPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'continuous'>('slides');
  const [showThumbnails, setShowThumbnails] = useState(false);

  const totalSlides = PITCH_DECK_SLIDES.length;
  const currentSlide = PITCH_DECK_SLIDES[currentSlideIndex];

  const goToPrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slides') return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, goToPrev, goToNext]);

  return (
    <div className="min-h-screen bg-white text-foreground pb-20">
      {/* ──────────────────────────────────────────────────────────
          TOP DECK CONTROL HEADER
         ────────────────────────────────────────────────────────── */}
      <div className="sticky top-16 sm:top-18 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#ded9d5] py-3.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Back Link & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/company/investors"
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors"
                title="Back to Investor Relations"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] sm:text-[13px] font-semibold text-primary">Pre-Seed Presentation</span>
                  <span className="text-[10.5px] sm:text-[11px] px-2 py-0.5 rounded-full bg-chart-3 text-secondary font-bold">
                    €750k
                  </span>
                </div>
                <h1 className="text-[14.5px] sm:text-[15.5px] font-bold text-foreground truncate max-w-xs sm:max-w-md">
                  Building the operating layer for connected healthcare
                </h1>
              </div>
            </div>

            {/* Center/Right: View Mode Toggle & Downloads */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* View Switcher: Slide-by-slide vs Continuous */}
              <div className="inline-flex rounded-lg bg-[#faf9f8] p-0.5 border border-[#ded9d5] text-[13px] sm:text-[13.5px]">
                <button
                  onClick={() => setViewMode('slides')}
                  type="button"
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    viewMode === 'slides'
                      ? 'bg-white text-primary shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Slides
                </button>
                <button
                  onClick={() => setViewMode('continuous')}
                  type="button"
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    viewMode === 'continuous'
                      ? 'bg-white text-primary shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Document View
                </button>
              </div>

              {/* View as PDF in browser */}
              <a
                href={PITCH_DECK_META.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#ded9d5] bg-white text-[13px] sm:text-[13.5px] font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <span>View PDF</span>
              </a>

              {/* Download PDF */}
              <a
                href={PITCH_DECK_META.pdfPath}
                download="Pentasent_Investor_Pitch_Deck_PreSeed_2026.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#ded9d5] bg-white text-[13px] sm:text-[13.5px] font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-muted-foreground" />
                <span>PDF</span>
              </a>

              {/* Download PPTX */}
              <a
                href={PITCH_DECK_META.pptxPath}
                download="Pentasent_Investor_Pitch_Deck_PreSeed_2026.pptx"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-white text-[13px] sm:text-[13.5px] font-semibold hover:bg-primary-hover transition-all shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PPTX</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          VIEW MODE 1: INTERACTIVE SLIDE-BY-SLIDE VIEWER
         ────────────────────────────────────────────────────────── */}
      {viewMode === 'slides' && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 sm:pt-8">
          {/* Main Slide Card Container */}
          <div className="relative w-full rounded-xl bg-white border border-[#ded9d5] shadow-2xs overflow-hidden min-h-130 sm:min-h-145 flex flex-col justify-between p-6 sm:p-10 transition-all">
            {/* Slide Header: Badge + Slide Counter */}
            <div className="flex items-center justify-between border-b border-[#ded9d5]/60 pb-3.5">
              <span className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-mono font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {currentSlide.badge}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[13px] sm:text-[13.5px] font-medium text-muted-foreground">
                  Slide <strong className="text-foreground">{currentSlide.slideNum}</strong> of {totalSlides}
                </span>
                <button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  type="button"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                  title="Toggle Slide Thumbnails"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Body Content */}
            <div className="my-auto py-6">
              {/* Title & Subtitle */}
              <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-foreground leading-tight tracking-tight">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="mt-3 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-3xl">
                  {currentSlide.subtitle}
                </p>
              )}

              {/* Special rendering for Slide 1 (Cover) */}
              {currentSlide.slideNum === 1 && currentSlide.metrics && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {currentSlide.metrics.map((m, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                      <div className="text-[12px] sm:text-[12.5px] font-bold text-muted-foreground uppercase tracking-wide">
                        {m.label}
                      </div>
                      <div className="mt-1.5 text-3xl sm:text-4xl font-extrabold text-primary">{m.value}</div>
                      {m.subtext && (
                        <div className="text-[13px] sm:text-[13.5px] text-muted-foreground mt-1">{m.subtext}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Special rendering for Slide 7 (Why Now Stats) */}
              {currentSlide.slideNum === 7 && currentSlide.metrics && (
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentSlide.metrics.map((m, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                      <div className="text-2xl sm:text-3xl font-extrabold text-primary">{m.value}</div>
                      <div className="mt-1.5 text-[15px] sm:text-[16px] font-bold text-foreground">{m.label}</div>
                      <div className="text-[13px] sm:text-[13.5px] text-muted-foreground mt-1 leading-normal">
                        {m.subtext}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special rendering for Slide 13 (Fundraise Breakdown) */}
              {currentSlide.slideNum === 13 && currentSlide.breakdown && (
                <div className="mt-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {currentSlide.metrics?.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#faf9f8] border border-[#ded9d5] text-center shadow-2xs">
                        <div className="text-[12.5px] font-semibold text-muted-foreground uppercase">{m.label}</div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">{m.value}</div>
                      </div>
                    ))}
                  </div>
                  {currentSlide.breakdown.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#faf9f8] border border-[#ded9d5]/70 flex flex-col shadow-2xs">
                      <div className="flex justify-between text-[15px] sm:text-[16px] font-bold text-foreground">
                        <span>{item.label}</span>
                        <span className="text-primary font-extrabold">{item.percentage}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-[#ded9d5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-[13.5px] sm:text-[14px] text-muted-foreground mt-1.5">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* General Details Grid */}
              {currentSlide.details && currentSlide.slideNum !== 13 && (
                <div
                  className={`mt-7 grid gap-4 sm:gap-5 ${
                    currentSlide.details.length >= 6
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : currentSlide.details.length === 4
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {currentSlide.details.map((d, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 sm:p-5 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] flex flex-col justify-between transition-all shadow-2xs"
                    >
                      <div>
                        <div className="text-[15px] sm:text-[16px] font-bold text-foreground tracking-tight">
                          {d.title}
                        </div>
                        <p className="mt-2 text-[14.5px] sm:text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">
                          {d.desc}
                        </p>
                      </div>
                      {d.bullet && (
                        <div className="mt-3 text-[13.5px] sm:text-[14px] font-semibold text-primary">
                          {d.bullet.join(' ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Slide Bullet Points */}
              {currentSlide.points && (
                <div className="mt-7 space-y-2.5">
                  {currentSlide.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 text-[15px] sm:text-[16px] text-foreground/90 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div className="border-t border-[#ded9d5]/60 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-[13px] sm:text-[13.5px] text-muted-foreground gap-2">
              <div className="italic text-foreground/80 font-medium">
                {currentSlide.takeaway || currentSlide.sources || currentSlide.highlight}
              </div>
              <div className="text-[13.5px] sm:text-[14px] font-bold text-primary">
                Pentasent
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="mt-5 flex items-center justify-between bg-white p-3 rounded-xl border border-[#ded9d5] shadow-2xs">
            <button
              onClick={goToPrev}
              disabled={currentSlideIndex === 0}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#ded9d5] text-[13.5px] sm:text-[14px] font-semibold text-foreground hover:bg-[#faf9f8] hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md px-2">
              {PITCH_DECK_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-6 bg-primary'
                      : 'w-2.5 bg-[#ded9d5] hover:bg-primary/50'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentSlideIndex === totalSlides - 1}
              type="button"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-md text-[13.5px] sm:text-[14px] font-semibold text-white bg-primary hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Thumbnails Drawer */}
          {showThumbnails && (
            <div className="mt-5 p-5 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
              <div className="flex items-center justify-between mb-4 text-[13.5px] font-bold text-foreground">
                <span>All {totalSlides} Slides</span>
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="text-muted-foreground hover:text-foreground text-[12.5px] font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {PITCH_DECK_SLIDES.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setShowThumbnails(false);
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'border-primary bg-primary/5 font-bold text-primary shadow-2xs'
                        : 'border-[#ded9d5] hover:border-primary/40 bg-[#faf9f8] text-muted-foreground'
                    }`}
                  >
                    <div className="font-mono text-[11px]">Slide {s.slideNum}</div>
                    <div className="truncate text-[12px] mt-0.5 text-foreground font-medium">{s.badge}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          VIEW MODE 2: CONTINUOUS DOCUMENT VIEW
         ────────────────────────────────────────────────────────── */}
      {viewMode === 'continuous' && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 space-y-10">
          {PITCH_DECK_SLIDES.map((slide) => (
            <div
              key={slide.slideNum}
              id={`slide-${slide.slideNum}`}
              className="p-7 sm:p-10 rounded-xl bg-white border border-[#ded9d5] shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-[#ded9d5]/60 pb-3 mb-5">
                <span className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-mono font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {slide.badge}
                </span>
                <span className="text-[12.5px] sm:text-[13px] font-mono text-muted-foreground">
                  Slide {slide.slideNum} of {totalSlides}
                </span>
              </div>

              <h2 className="text-2xl sm:text-[30px] font-bold text-foreground tracking-tight leading-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="mt-2.5 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {slide.subtitle}
                </p>
              )}

              {/* Metrics */}
              {slide.metrics && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {slide.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="p-4 sm:p-5 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                      <div className="text-[12px] sm:text-[12.5px] font-bold text-muted-foreground uppercase tracking-wide">
                        {m.label}
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">{m.value}</div>
                      {m.subtext && (
                        <div className="text-[13px] text-muted-foreground mt-1 leading-normal">{m.subtext}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Breakdown */}
              {slide.breakdown && (
                <div className="mt-6 space-y-3">
                  {slide.breakdown.map((b, bIdx) => (
                    <div key={bIdx} className="p-4 rounded-xl bg-[#faf9f8] border border-[#ded9d5]/70 shadow-2xs">
                      <div className="flex justify-between text-[15px] sm:text-[16px] font-bold text-foreground">
                        <span>{b.label}</span>
                        <span className="text-primary font-bold">{b.percentage}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-[#ded9d5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${b.percentage}%` }}
                        />
                      </div>
                      <p className="text-[13.5px] sm:text-[14px] text-muted-foreground mt-1.5">{b.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              {slide.details && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {slide.details.map((d, dIdx) => (
                    <div key={dIdx} className="p-4 sm:p-5 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                      <div className="text-[15px] sm:text-[16px] font-bold text-foreground tracking-tight">
                        {d.title}
                      </div>
                      <p className="mt-2 text-[14.5px] sm:text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">
                        {d.desc}
                      </p>
                      {d.bullet && (
                        <div className="mt-2.5 text-[13.5px] sm:text-[14px] font-semibold text-primary">
                          {d.bullet.join(' ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Points */}
              {slide.points && (
                <div className="mt-5 space-y-2">
                  {slide.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-[15px] sm:text-[16px] text-foreground/90 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Takeaway / Footnote */}
              {(slide.takeaway || slide.sources || slide.highlight) && (
                <div className="mt-6 pt-3 border-t border-[#ded9d5]/60 text-[13px] sm:text-[13.5px] italic text-muted-foreground leading-relaxed">
                  {slide.takeaway || slide.sources || slide.highlight}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
