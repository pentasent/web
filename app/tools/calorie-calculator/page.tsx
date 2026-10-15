import type { Metadata } from 'next';
import ToolsHero from '@/components/pages/tools/ToolsHero';
import ToolsNavTabs from '@/components/pages/tools/ToolsNavTabs';
import CalorieCalculator from '@/components/pages/tools/CalorieCalculator';
import { TOOLS_PAGES_DATA } from '@/data/tools';
import type { ToolPageData } from '@/types/tools';

const pageData: ToolPageData = TOOLS_PAGES_DATA.calorie;

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
  alternates: {
    canonical: pageData.metadata.canonical,
  },
};

export default function CalorieCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <ToolsNavTabs />
      <ToolsHero
        badge={pageData.hero.badge}
        title={pageData.hero.title}
        description={pageData.hero.description}
      />
      <CalorieCalculator />
    </main>
  );
}
