import React from 'react';
import ResearchHero from '@/components/pages/careers/research/ResearchHero';
import ResearchOverviewSection from '@/components/pages/careers/research/ResearchOverviewSection';
import ResearchProcessSection from '@/components/pages/careers/research/ResearchProcessSection';
import ResearchApplyCtaSection from '@/components/pages/careers/research/ResearchApplyCtaSection';
import ResearchWorkLifeSection from '@/components/pages/careers/research/ResearchWorkLifeSection';
import ResearchQuoteSection from '@/components/pages/careers/research/ResearchQuoteSection';
import ResearchFaqSection from '@/components/pages/careers/research/ResearchFaqSection';
import ResearchBottomCtaSection from '@/components/pages/careers/research/ResearchBottomCtaSection';
import LatestNewsSection from '@/components/pages/about/LatestNewsSection';

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-white w-full overflow-x-hidden">
      <ResearchHero />
      <ResearchOverviewSection />
      <ResearchProcessSection />
      <ResearchApplyCtaSection />
      <ResearchWorkLifeSection />
      <ResearchQuoteSection />
      <LatestNewsSection />
      <ResearchFaqSection />
      <ResearchBottomCtaSection />
    </main>
  );
}
