'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, FileText, ArrowUpRight } from 'lucide-react';
import { useInvestorNav } from './InvestorNavContext';

export default function InvestorFooter() {
  const pathname = usePathname();
  const router = useRouter();
  const isInvestorsMain = pathname === '/company/investors' || pathname === '/company/investors/';
  const { setActiveTab } = useInvestorNav();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInvestorsMain) {
      setActiveTab('overview');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setActiveTab('overview');
      router.push('/company/investors');
    }
  };

  return (
    <footer className="w-full bg-white border-t border-[#ded9d5] pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Level 1: Structured Multi-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-[#ded9d5]">
          {/* Column 1: Brand & Thesis (Span 2 cols on desktop) */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <Link
              href="/company/investors"
              onClick={handleLogoClick}
              className="text-2xl sm:text-[26px] font-bold tracking-tight text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              Pentasent
            </Link>
            <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.65] text-muted-foreground max-w-md">
              Building the operating layer for connected healthcare. Uniting people, providers, organizations, evidence tools, research, and communities into one healthcare graph.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[14px] sm:text-[15px] font-medium text-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <a
                href="mailto:investors@pentasent.com"
                className="text-primary hover:text-primary-hover hover:underline"
              >
                investors@pentasent.com
              </a>
            </div>
          </div>

          {/* Column 2: Investment & Financing */}
          <div className="flex flex-col">
            <h3 className="text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] text-foreground">
              Investment
            </h3>
            <ul className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5">
              <li>
                <Link
                  href="/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <span>Pre-Seed Deck (2026)</span>
                  <FileText className="w-3.5 h-3.5 text-primary" />
                </Link>
              </li>
              <li>
                <a
                  href="/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <span>View Deck PDF</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pptx"
                  download
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Download PPTX
                </a>
              </li>
              <li>
                <a
                  href="mailto:investors@pentasent.com?subject=Diligence%20Room%20Access"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Diligence Room
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Governance */}
          <div className="flex flex-col">
            <h3 className="text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] text-foreground">
              Governance
            </h3>
            <ul className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5">
              <li>
                <Link
                  href="/company/investors?tab=thesis"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Investment Thesis
                </Link>
              </li>
              <li>
                <Link
                  href="/company/investors?tab=founders-letter"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Founders&apos; Letter
                </Link>
              </li>
              <li>
                <Link
                  href="/company/investors?tab=governance"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link
                  href="/company/investors?tab=annual-meeting"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Annual Meeting & Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/company/investors?tab=news"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Investor News
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Compliance */}
          <div className="flex flex-col">
            <h3 className="text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] text-foreground">
              Platform & Legal
            </h3>
            <ul className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5">
              <li>
                <Link
                  href="/tools"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Evidence Health Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/company/about"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  About Pentasent
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-[14.5px] sm:text-[15px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Cookie Disclosures
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Level 2: Copyright & Regulatory Notice */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between text-[13px] sm:text-[14px] text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Pentasent Inc. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Confidential Investor Briefing
          </p>
        </div>
      </div>
    </footer>
  );
}
