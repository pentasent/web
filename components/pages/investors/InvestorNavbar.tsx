'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, FileText, Mail, ChevronDown } from 'lucide-react';
import { useInvestorNav } from './InvestorNavContext';
import { INVESTOR_TABS, InvestorTabId } from './InvestorNavTabs';
import Image from 'next/image';

export default function InvestorNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDeckPage = pathname.includes('Pentasent_Investor_Pitch_Deck_PreSeed_2026');
  const isInvestorsMain = pathname === '/company/investors' || pathname === '/company/investors/';

  const { activeTab, setActiveTab, isTabsOpen, toggleTabs, closeTabs } = useInvestorNav();

  const handleTabClick = (tabId: InvestorTabId) => {
    if (isInvestorsMain) {
      setActiveTab(tabId);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (tabId === 'overview') {
        setActiveTab('overview');
        router.push('/company/investors');
      } else {
        router.push(`/company/investors?tab=${tabId}`);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeTabs();
    if (isInvestorsMain) {
      handleTabClick('overview');
    } else {
      setActiveTab('overview');
      router.push('/company/investors');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#ded9d5] transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Left Brand Mark - Alphabet Inspired Clean Branding */}
          <div className="flex items-center gap-3">
            <Link
              href="/company/investors"
              onClick={handleLogoClick}
              className="group flex flex-col items-start leading-none select-none cursor-pointer"
            >
              {/* <span className="text-2xl sm:text-[25px] font-bold tracking-tight text-primary hover:text-primary-hover transition-colors">
                Pentasent
              </span> */}
              <Image
                src="/assets/images/logos/penta-text-burgundy-dark.svg"
                alt="Pentasent"
                width={135}
                height={100}
                className="w-28 xs:w-32 sm:w-33.75 h-auto"
                priority
              />
              <span className="mt-1 text-[11.5px] sm:text-[12px] font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                Investor Relations
              </span>
            </Link>
          </div>

          {/* Right Minimal Actions - Uncluttered, Pure & Elegant */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* The "More Investors" Toggle Button with slide-down indicator */}
            <button
              type="button"
              onClick={toggleTabs}
              aria-expanded={isTabsOpen}
              aria-label="Toggle More Investors Menu"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] sm:text-[13.5px] font-semibold tracking-wide transition-all cursor-pointer select-none ${
                isTabsOpen
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-[#faf9f8] text-foreground border border-[#ded9d5] hover:border-primary hover:text-primary hover:bg-white'
              }`}
            >
              <span>Investors</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isTabsOpen ? 'rotate-180 text-white' : 'text-primary'
                }`}
              />
            </button>

            {/* Pitch Deck Quick Link - Hidden on small screen (< sm), visible on sm and above */}
            <Link
              href="/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-md text-[13px] sm:text-[13.5px] font-semibold tracking-wide transition-all ${
                isDeckPage
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-border-2/30 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pitch Deck</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-chart-3 text-secondary text-[10px] font-bold">
                Pre-Seed
              </span>
            </Link>

            {/* Contact Action */}
            <a
              href="mailto:investors@pentasent.com?subject=Investor%20Relations%20Inquiry"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#ded9d5] text-[13px] sm:text-[13.5px] font-medium text-foreground hover:border-primary hover:text-primary hover:bg-[#faf9f8] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Contact</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SLIDE-DOWN TABS DRAWER
          Smooth slide-down / slide-up animation for tabs
         ────────────────────────────────────────────────────────── */}
      <div
        className={`w-full border-t border-[#ded9d5] bg-white transition-all duration-300 ease-in-out overflow-hidden ${
          isTabsOpen ? 'max-h-24 opacity-100 py-2.5 shadow-2xs' : 'max-h-0 opacity-0 py-0 border-t-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-0.5"
            aria-label="Investor Relations Sections"
          >
            {INVESTOR_TABS.map((tab) => {
              const isActive = isInvestorsMain && activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[#faf9f8]'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-primary/70'} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-chart-3 text-secondary'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Direct Pitch Deck link in drawer on mobile */}
            <Link
              href="/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026"
              className={`sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold whitespace-nowrap transition-all ${
                isDeckPage
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              <FileText size={14} />
              <span>Pitch Deck</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-chart-3 text-secondary text-[10px] font-bold">
                Pre-Seed
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
