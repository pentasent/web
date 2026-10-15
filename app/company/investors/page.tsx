'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import { useInvestorNav } from '@/components/pages/investors/InvestorNavContext';
import type { InvestorTabId } from '@/types/investors';
import {
  FOUNDERS_LETTER_DATA,
  MARKET_OPPORTUNITY_DATA,
  INVESTOR_PRODUCTS_DATA,
  PRE_SEED_FUNDRAISE_DATA,
  GOVERNANCE_DATA,
  ANNUAL_MEETING_DATA,
  INVESTOR_NEWS_DATA,
} from '@/data/investors';

export default function InvestorsPage() {
  const { activeTab, setActiveTab } = useInvestorNav();
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: InvestorTabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined' && mainContentRef.current) {
      const rect = mainContentRef.current.getBoundingClientRect();
      if (rect.top < 80) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full bg-white text-foreground">
      {/* ──────────────────────────────────────────────────────────
          MAIN CONTENT AREA (Renders selected tab cleanly)
         ────────────────────────────────────────────────────────── */}
      <main ref={mainContentRef} className="w-full bg-white py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ──────────────────────────────────────────────────────
              TAB 1: OVERVIEW (Core Vision Statement & Hero Only)
             ────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Vision & Founder Excerpt */}
              <div className="lg:col-span-7 flex flex-col items-start">
                {/* Pre-Seed Indicator Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] sm:text-[12.5px] font-semibold tracking-wide mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pre-Seed Round Open (€750k Target)</span>
                </div>

                {/* Emblem & Headline */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-[#faf9f8] p-2.5 flex items-center justify-center border border-[#ded9d5] shadow-2xs shrink-0">
                    <Image
                      src="/assets/images/logos/penta-icon-gradient.svg"
                      alt="Pentasent"
                      width={52}
                      height={52}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.15]">
                    {FOUNDERS_LETTER_DATA.headline}
                  </h1>
                </div>

                {/* Core Vision Statement */}
                <div className="mt-2 max-w-2xl">
                  <p className="text-[17px] sm:text-[18px] leading-[1.7] text-muted-foreground font-normal">
                    {FOUNDERS_LETTER_DATA.heroQuote}
                  </p>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => handleTabChange('founders-letter')}
                      className="text-[15px] sm:text-[16px] font-semibold text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Read full founders&apos; letter</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Founder Handwritten Signature Image */}
                <div className="mt-8 pt-6 border-t border-[#ded9d5] w-full max-w-md">
                  <div className="my-1.5">
                    <Image
                      src="/assets/signatures/ankit_sign_black.png"
                      alt="Ankit Kumar Signature"
                      width={190}
                      height={60}
                      className="h-12 sm:h-14 w-auto object-contain select-none"
                      priority
                    />
                  </div>
                  <p className="mt-2 text-[15px] sm:text-[16px] text-foreground font-semibold">
                    {FOUNDERS_LETTER_DATA.author}
                  </p>
                  <p className="text-[13px] sm:text-[13.5px] text-muted-foreground font-medium">
                    {FOUNDERS_LETTER_DATA.authorRole}
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026"
                    className="h-11 sm:h-12 px-5 rounded-md bg-primary text-white text-[14px] sm:text-[14.5px] font-semibold hover:bg-primary-hover transition-all shadow-2xs inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Pitch Deck</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleTabChange('thesis')}
                    className="h-11 sm:h-12 px-5 rounded-md border border-[#ded9d5] bg-white hover:bg-[#faf9f8] hover:border-primary text-foreground text-[14px] sm:text-[14.5px] font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>Explore Thesis</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Right Column: Minimalist Alphabet Wooden Blocks */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm lg:max-w-none">
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    {/* <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-[#ded9d5] bg-[#faf9f8] shadow-2xs"> */}
                    <Image
                      src="/assets/images/investors/investor_blocks_hero.png"
                      alt="Pentasent Alphabet Blocks Minimal Design"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 2: INVESTMENT THESIS ("Why Pentasent Wins")
             ────────────────────────────────────────────────────── */}
          {activeTab === 'thesis' && (
            <div className="space-y-12">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                  <span>INVESTMENT THESIS</span>
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                  Why Pentasent Wins in Connected Healthcare
                </h2>
                <p className="mt-3 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-3xl">
                  Healthcare has thousands of point solutions, but no connected operating graph. Pentasent links people, organizations, evidence tools, research, and communities into one self-reinforcing network.
                </p>
              </div>

              {/* 3 Executive Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-7 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                  <span className="text-xs font-mono font-bold text-primary">01 / MARKET TIMING</span>
                  <h3 className="mt-2.5 text-xl font-bold text-foreground">
                    Infrastructure Scale
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                    India’s digital health market is expanding from $17.8B to $107B by 2033 (25.12% CAGR). With 86.96 Cr+ ABHA accounts, healthcare is now digitally addressable at ecosystem scale.
                  </p>
                </div>

                <div className="p-7 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                  <span className="text-xs font-mono font-bold text-primary">02 / NETWORK MOAT</span>
                  <h3 className="mt-2.5 text-xl font-bold text-foreground">
                    Connected Health Graph
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                    Single-purpose health apps suffer high churn. Pentasent links 8 entities into a compounding graph where each verified doctor, hospital, and tool makes the entire network more valuable.
                  </p>
                </div>

                <div className="p-7 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                  <span className="text-xs font-mono font-bold text-primary">03 / PRE-SEED ROUND</span>
                  <h3 className="mt-2.5 text-xl font-bold text-foreground">
                    Disciplined €750k Plan
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                    Raising €750k for 24 months of runway with ~10–12% target dilution. Capital is tied to proof points: density, retention loops, and first recurring organizational revenue.
                  </p>
                </div>
              </div>

              {/* Featured Pitch Deck Banner */}
              <div className="p-8 sm:p-10 rounded-xl bg-[#faf9f8] border border-[#ded9d5] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xs">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-semibold mb-3">
                    <span>Official 17-Slide Presentation</span>
                  </div>
                  <h3 className="text-2xl sm:text-[26px] font-bold text-foreground">
                    Pentasent Pre-Seed Investor Pitch Deck (October 2026)
                  </h3>
                  <p className="mt-2 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                    Explore our thesis, unit economics, go-to-market loops, and 24-month roadmap milestones. Available as an interactive web presentation, PDF, or PowerPoint.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    href="/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026"
                    className="h-11 sm:h-12 px-6 rounded-md bg-primary text-white text-[14px] sm:text-[14.5px] font-semibold hover:bg-primary-hover transition-all shadow-2xs inline-flex items-center justify-center gap-2"
                  >
                    <span>Open Interactive Deck</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 sm:h-12 px-5 rounded-md border border-[#ded9d5] bg-white hover:bg-[#faf9f8] hover:border-primary text-foreground text-[14px] sm:text-[14.5px] font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>View PDF</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                  <a
                    href="/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pptx"
                    download
                    className="h-11 sm:h-12 px-5 rounded-md border border-[#ded9d5] bg-white hover:bg-[#faf9f8] hover:border-primary text-foreground text-[14px] sm:text-[14.5px] font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>Download PPTX</span>
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 3: FOUNDERS' LETTER (Proper Letter in Center)
             ────────────────────────────────────────────────────── */}
          {activeTab === 'founders-letter' && (
            <div className="w-full flex justify-center py-4 sm:py-8">
              <article className="w-full max-w-3xl bg-white border border-[#ded9d5] rounded-xl p-8 sm:p-14 lg:p-16 shadow-2xs">
                {/* Formal Letterhead */}
                <header className="border-b border-[#ded9d5] pb-8 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-lg bg-[#faf9f8] p-2 flex items-center justify-center border border-[#ded9d5]">
                        <Image
                          src="/assets/images/logos/penta-icon-gradient.svg"
                          alt="Pentasent"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-bold tracking-tight text-foreground">
                          Pentasent Inc.
                        </div>
                        <div className="text-[12px] font-medium text-muted-foreground tracking-wide uppercase">
                          Founder&apos;s Office
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-[13px] text-muted-foreground font-medium">
                      <div>London (HQ), UK</div>
                      <div>October 2026</div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                      <span>ANNUAL FOUNDERS&apos; LETTER</span>
                    </div>
                    <h2 className="text-[26px] sm:text-[34px] font-bold tracking-tight text-foreground leading-[1.2]">
                      Why We Built Pentasent: The Case for a Healthcare Operating Layer
                    </h2>
                  </div>
                </header>

                {/* Formal Salutation */}
                <div className="text-[16px] sm:text-[17px] font-semibold text-foreground mb-6">
                  Dear Patients, Clinicians, Shareholders, and Partners,
                </div>

                {/* Letter Body */}
                <div className="space-y-8 text-[16px] sm:text-[17px] leading-[1.8] text-muted-foreground font-normal">
                  {FOUNDERS_LETTER_DATA.fullLetter.map((chap, cIdx) => (
                    <section key={cIdx} className="space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight pt-2">
                        {chap.heading}
                      </h3>
                      {chap.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-muted-foreground">
                          {p}
                        </p>
                      ))}
                    </section>
                  ))}
                </div>

                {/* Formal Sign-off & Real Signature Block */}
                <footer className="mt-12 pt-8 border-t border-[#ded9d5]">
                  <p className="text-[16px] text-muted-foreground mb-4">
                    Sincerely and with shared conviction,
                  </p>

                  {/* Real Handwritten Signature Image */}
                  <div className="my-2">
                    <Image
                      src="/assets/signatures/ankit_sign_black.png"
                      alt="Ankit Kumar Signature"
                      width={220}
                      height={75}
                      className="h-14 sm:h-16 w-auto object-contain select-none"
                    />
                  </div>

                  <div className="mt-2">
                    <div className="text-[16px] font-bold text-foreground">
                      Ankit Kumar
                    </div>
                    <div className="text-[14px] text-muted-foreground font-medium">
                      Founder & Chief Executive Officer
                    </div>
                    <div className="text-[13px] text-muted-foreground/80 mt-0.5">
                      Pentasent Inc. • ankit@pentasent.com
                    </div>
                  </div>
                </footer>
              </article>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 4: OPPORTUNITY & MARKET
             ────────────────────────────────────────────────────── */}
          {activeTab === 'opportunity' && (
            <div className="space-y-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                  <span>{MARKET_OPPORTUNITY_DATA.eyebrow}</span>
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                  {MARKET_OPPORTUNITY_DATA.title}
                </h2>
                <p className="mt-3.5 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {MARKET_OPPORTUNITY_DATA.description}
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MARKET_OPPORTUNITY_DATA.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-6 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] transition-all shadow-2xs">
                    <span className="text-xs font-mono font-bold text-primary">
                      0{idx + 1}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Official Market Stats */}
              <div className="pt-10 border-t border-[#ded9d5]">
                <h3 className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-foreground mb-6">
                  Macro Growth & ABDM National Health Registry Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MARKET_OPPORTUNITY_DATA.stats.map((stat, idx) => (
                    <div key={idx} className="p-6 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                      <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-[15px] sm:text-[16px] font-bold text-foreground">
                        {stat.label}
                      </div>
                      <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-muted-foreground leading-normal">
                        {stat.subtext}
                      </p>
                      {stat.citation && (
                        <span className="mt-2.5 block text-[12px] text-muted-foreground/80 italic">
                          {stat.citation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Healthcare & Digital Health Macro Stats */}
              <div className="pt-10 border-t border-[#ded9d5]">
                <h3 className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-foreground mb-6">
                  Global Healthcare Macroeconomics & Connected Health Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MARKET_OPPORTUNITY_DATA.globalStats.map((stat, idx) => (
                    <div key={idx} className="p-6 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                      <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-[15px] sm:text-[16px] font-bold text-foreground">
                        {stat.label}
                      </div>
                      <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-muted-foreground leading-normal">
                        {stat.subtext}
                      </p>
                      {stat.citation && (
                        <span className="mt-2.5 block text-[12px] text-muted-foreground/80 italic">
                          {stat.citation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 5: PRODUCTS
             ────────────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div className="space-y-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                  <span>{INVESTOR_PRODUCTS_DATA.eyebrow}</span>
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                  {INVESTOR_PRODUCTS_DATA.title}
                </h2>
                <p className="mt-3.5 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {INVESTOR_PRODUCTS_DATA.description}
                </p>
              </div>

              {/* 4 Entry Point Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {INVESTOR_PRODUCTS_DATA.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-7 sm:p-8 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] flex flex-col justify-between transition-all shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-primary">
                          {prod.number}
                        </span>
                        <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#ded9d5] text-muted-foreground">
                          {prod.category}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl sm:text-2xl font-bold text-foreground">
                        {prod.title}
                      </h3>
                      <p className="mt-2.5 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                        {prod.description}
                      </p>

                      <ul className="mt-5 space-y-2.5">
                        {prod.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-[14px] sm:text-[14.5px] text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/90">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {prod.link && (
                      <div className="mt-6 pt-4 border-t border-[#ded9d5]">
                        <Link
                          href={prod.link.href}
                          className="text-[14px] sm:text-[14.5px] font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1.5"
                        >
                          <span>{prod.link.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 8 Graph Entities Strip */}
              <div className="p-7 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                <h4 className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-5">
                  8 Interconnected Entities in the Pentasent Health Graph
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 text-center">
                  {[
                    { name: 'People', desc: 'Profiles & Care' },
                    { name: 'Organizations', desc: 'Hospitals & Clinics' },
                    { name: 'Products', desc: 'Evidence Tools' },
                    { name: 'Communities', desc: 'Peer & Specialist' },
                    { name: 'Events', desc: 'CME & Conferences' },
                    { name: 'Jobs', desc: 'Clinical Careers' },
                    { name: 'Research', desc: 'Papers & Evidence' },
                    { name: 'News', desc: 'Industry Signals' },
                  ].map((ent, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-[#faf9f8] border border-[#ded9d5]/70 hover:border-primary transition-all">
                      <div className="text-[13.5px] font-bold text-foreground">{ent.name}</div>
                      <div className="mt-1 text-[11.5px] text-muted-foreground">{ent.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 6: PRE-SEED ROUND
             ────────────────────────────────────────────────────── */}
          {activeTab === 'pre-seed' && (
            <div className="space-y-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                  <span>{PRE_SEED_FUNDRAISE_DATA.eyebrow}</span>
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                  {PRE_SEED_FUNDRAISE_DATA.title}
                </h2>
                <p className="mt-3.5 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {PRE_SEED_FUNDRAISE_DATA.description}
                </p>
              </div>

              {/* Terms Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-7 rounded-xl bg-[#faf9f8] border border-[#ded9d5] shadow-2xs">
                <div>
                  <div className="text-[12px] font-semibold text-muted-foreground uppercase">Target Raise</div>
                  <div className="mt-1 text-3xl font-extrabold text-primary">{PRE_SEED_FUNDRAISE_DATA.targetRaise}</div>
                  <div className="text-[13px] text-muted-foreground mt-1">Pre-Seed Round</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-muted-foreground uppercase">Target Dilution</div>
                  <div className="mt-1 text-3xl font-extrabold text-foreground">{PRE_SEED_FUNDRAISE_DATA.targetDilution}</div>
                  <div className="text-[13px] text-muted-foreground mt-1">Founder Aligned</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-muted-foreground uppercase">Runway</div>
                  <div className="mt-1 text-3xl font-extrabold text-foreground">{PRE_SEED_FUNDRAISE_DATA.runway}</div>
                  <div className="text-[13px] text-muted-foreground mt-1">Disciplined Plan</div>
                </div>
              </div>

              {/* Capital Allocation & Milestones */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Use of Proceeds */}
                <div className="p-7 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                  <h4 className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-foreground mb-5">
                    Capital Allocation (% of €750k)
                  </h4>
                  <div className="space-y-4">
                    {PRE_SEED_FUNDRAISE_DATA.allocation.map((item, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex justify-between text-[14px] font-semibold text-foreground mb-1.5">
                          <span>{item.label}</span>
                          <span className="text-primary font-bold">{item.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#ded9d5]/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="mt-1.5 text-[12.5px] text-muted-foreground">{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 24-Month Roadmap */}
                <div className="p-7 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                  <h4 className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-foreground mb-5">
                    24-Month Execution Horizons
                  </h4>
                  <div className="space-y-5">
                    {PRE_SEED_FUNDRAISE_DATA.milestones.map((ms, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-4 py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono font-bold text-primary">{ms.period}</span>
                          <span className="text-[14px] font-bold text-foreground">• {ms.title}</span>
                        </div>
                        <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-muted-foreground leading-relaxed">{ms.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Pitch Deck Access Card */}
              <div className="p-7 sm:p-9 rounded-xl bg-[#faf9f8] border border-[#ded9d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    Access Complete 17-Slide Presentation
                  </h3>
                  <p className="text-[15px] text-muted-foreground mt-1.5">
                    Includes detailed market citations, graph taxonomy, and unit economics.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026"
                    className="h-11 px-5 rounded-md bg-primary text-white text-[14px] sm:text-[14.5px] font-semibold hover:bg-primary-hover transition-all shadow-2xs inline-flex items-center gap-2"
                  >
                    <span>Open Deck</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={PRE_SEED_FUNDRAISE_DATA.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-4 rounded-md border border-[#ded9d5] text-[14px] sm:text-[14.5px] font-semibold text-foreground hover:border-primary hover:text-primary bg-white transition-all shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <span>View PDF</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 7: GOVERNANCE
             ────────────────────────────────────────────────────── */}
          {activeTab === 'governance' && (
            <div className="space-y-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                  <span>{GOVERNANCE_DATA.eyebrow}</span>
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                  {GOVERNANCE_DATA.title}
                </h2>
                <p className="mt-3.5 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {GOVERNANCE_DATA.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Director Profile */}
                <div className="lg:col-span-5 p-7 rounded-xl bg-[#faf9f8] border border-[#ded9d5] shadow-2xs">
                  <span className="text-[12px] font-bold text-primary uppercase tracking-wider">
                    Executive Director
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-foreground">
                    {GOVERNANCE_DATA.boardMembers[0].name}
                  </h3>
                  <p className="text-[14px] text-muted-foreground font-medium mt-1">
                    {GOVERNANCE_DATA.boardMembers[0].role}
                  </p>
                  <div className="mt-3.5 text-[12px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white border border-[#ded9d5] inline-block text-primary">
                    {GOVERNANCE_DATA.boardMembers[0].credentials}
                  </div>
                  <p className="mt-4 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                    {GOVERNANCE_DATA.boardMembers[0].bio}
                  </p>
                  <div className="mt-5 pt-4 border-t border-[#ded9d5] text-[13.5px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Focus: </span>
                    {GOVERNANCE_DATA.boardMembers[0].focus}
                  </div>
                </div>

                {/* Committees */}
                <div className="lg:col-span-7 space-y-5">
                  {GOVERNANCE_DATA.committees.map((com, idx) => (
                    <div key={idx} className="p-6 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                        <h4 className="text-xl font-bold text-foreground">{com.title}</h4>
                      </div>
                      <p className="mt-2.5 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                        {com.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 8: ANNUAL MEETING
             ────────────────────────────────────────────────────── */}
          {activeTab === 'annual-meeting' && (
            <div className="space-y-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                  <span>{ANNUAL_MEETING_DATA.eyebrow}</span>
                </div>
                <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                  {ANNUAL_MEETING_DATA.title}
                </h2>
                <p className="mt-3.5 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {ANNUAL_MEETING_DATA.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Event Schedule */}
                <div className="lg:col-span-7 space-y-5">
                  {ANNUAL_MEETING_DATA.events.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-xl bg-white border border-[#ded9d5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-mono font-bold text-primary">
                            {evt.date}
                          </span>
                          <span className="text-[11.5px] px-2.5 py-0.5 rounded-full bg-[#faf9f8] border border-[#ded9d5] text-muted-foreground font-medium">
                            {evt.type}
                          </span>
                        </div>
                        <h4 className="mt-2 text-xl font-bold text-foreground">
                          {evt.title}
                        </h4>
                        <p className="mt-1.5 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                          {evt.description}
                        </p>
                      </div>
                      <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                        {evt.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Diligence Materials */}
                <div className="lg:col-span-5 p-7 rounded-xl bg-[#faf9f8] border border-[#ded9d5] shadow-2xs">
                  <h4 className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-foreground mb-5">
                    Shareholder Materials & Diligence
                  </h4>
                  <div className="space-y-3.5">
                    {ANNUAL_MEETING_DATA.materials.map((mat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-white border border-[#ded9d5] flex items-center justify-between gap-3 shadow-2xs hover:border-primary transition-all"
                      >
                        <div>
                          <div className="text-[15px] font-bold text-foreground">{mat.name}</div>
                          <div className="text-[12px] text-muted-foreground mt-0.5">{mat.format}</div>
                        </div>
                        <a
                          href={mat.path}
                          target={mat.path.startsWith('mailto') ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className="text-[13px] text-primary hover:text-primary-hover font-semibold p-2 rounded-md hover:bg-[#faf9f8] transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────
              TAB 9: NEWS & MILESTONES
             ────────────────────────────────────────────────────── */}
          {activeTab === 'news' && (
            <div className="space-y-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3">
                    <span>NEWS & RELEASES</span>
                  </div>
                  <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
                    Recent Company Milestones
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-[14px] font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Explore Pentasent blog</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INVESTOR_NEWS_DATA.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-7 rounded-xl bg-[#faf9f8] hover:bg-white hover:border-primary border border-[#ded9d5] flex flex-col justify-between transition-all shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[13px] text-muted-foreground mb-3">
                        <span className="font-mono font-medium">{item.date}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#ded9d5] text-[11px] font-medium">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-[15px] sm:text-[15.5px] text-muted-foreground leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {item.href && (
                      <div className="mt-6 pt-4 border-t border-[#ded9d5]">
                        <Link
                          href={item.href}
                          className="text-[13.5px] font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1.5"
                        >
                          <span>{item.linkText || 'Read more'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
