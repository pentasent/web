import CareersHero from '@/components/pages/careers/CareersHero';
import FeaturedTeamsSection from '@/components/pages/careers/FeaturedTeamsSection';
import CareersStatsSection from '@/components/pages/careers/CareersStatsSection';
import BuildAwesomeThingsSection from '@/components/pages/careers/BuildAwesomeThingsSection';
import CareersJourneySection from '@/components/pages/careers/CareersJourneySection';
import MeetTheTeamSection from '@/components/pages/careers/MeetTheTeamSection';
import CareersWorkLifeSection from '@/components/pages/careers/CareersWorkLifeSection';
import CareersSupportCards from '@/components/pages/careers/CareersSupportCards';
import CareersScamAdvisorySection from '@/components/pages/careers/CareersScamAdvisorySection';
import CareersBottomCtaSection from '@/components/pages/careers/CareersBottomCtaSection';
import LatestNewsSection from '@/components/pages/about/LatestNewsSection';

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <CareersHero />
      <FeaturedTeamsSection />
      <CareersStatsSection />
      <BuildAwesomeThingsSection />
      <CareersJourneySection />
      <MeetTheTeamSection />
      <CareersWorkLifeSection />
      <CareersSupportCards />
      <LatestNewsSection />
      <CareersScamAdvisorySection />
      <CareersBottomCtaSection />
    </main>
  );
}
