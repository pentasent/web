import LifeHero from '@/components/pages/life/LifeHero';
import LifeHighlightsSection from '@/components/pages/life/LifeHighlightsSection';
import PentasentLeadershipSection from '@/components/pages/life/PentasentLeadershipSection';
import GrowthOnMapSection from '@/components/pages/life/GrowthOnMapSection';
import LifeCelebrationWall from '@/components/pages/life/LifeCelebrationWall';
import MissionWorkLifeSection from '@/components/pages/life/MissionWorkLifeSection';
import LifePrinciplesSection from '@/components/pages/life/LifePrinciplesSection';
import LifeBottomCtaSection from '@/components/pages/life/LifeBottomCtaSection';

export default function LifePage() {
  return (
    <main className="min-h-screen bg-white w-full overflow-x-hidden">
      <LifeHero />
      <LifeHighlightsSection />
      <PentasentLeadershipSection />
      <GrowthOnMapSection />
      <LifeCelebrationWall />
      <MissionWorkLifeSection />
      <LifePrinciplesSection />
      <LifeBottomCtaSection />
    </main>
  );
}
