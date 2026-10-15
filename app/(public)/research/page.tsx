'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Microscope, ArrowRight, FileText } from 'lucide-react';
import { RESEARCH_HERO_DATA, RESEARCH_PROCESS_DATA } from '@/data/research';

export default function ResearchPage() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-white py-10 sm:py-16 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-2 sm:mb-3">
            Pentasent Research
          </p>
          <h1 className="text-[32px] sm:text-[44px] font-bold text-[#171317] tracking-tight leading-tight">
            Healthcare Research & Clinical Breakthroughs
          </h1>
          <p className="mt-3 text-[15px] sm:text-[17px] text-[#554d52] leading-relaxed">
            {RESEARCH_HERO_DATA.subtitle}
          </p>
        </div>

        {/* Process & Steps */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESEARCH_PROCESS_DATA.steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-[#ebe4dc] bg-white p-6 sm:p-7 shadow-xs"
            >
              <div className="h-10 w-10 rounded-xl bg-[#f5eeea] text-[#4a0139] flex items-center justify-center font-bold mb-4">
                0{idx + 1}
              </div>
              <p className="text-[14.5px] text-[#332a30] leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Publications Callout */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#4a0139] to-[#300025] text-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight">
              Looking for clinical trial publications & open science?
            </h2>
            <p className="mt-2 text-sm text-white/80 max-w-xl">
              Access peer-reviewed papers, clinical preprint indexing, and cross-institutional genomics research.
            </p>
          </div>
          <Link
            href="/company/careers/research"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#4a0139] hover:bg-[#fbf7f4] transition-colors shrink-0"
          >
            <span>Explore Full Program</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
