import AboutHero from '@/components/pages/about/AboutHero';
import LeadershipSection from '@/components/pages/about/LeadershipSection';
import WhereWeWorkSection from '@/components/pages/about/WhereWeWorkSection';
import JoinTeamSection from '@/components/pages/about/JoinTeamSection';
import LatestNewsSection from '@/components/pages/about/LatestNewsSection';
import MoreAboutPentasentSection from '@/components/pages/about/MoreAboutPentasentSection';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <LeadershipSection />
      <WhereWeWorkSection />
      <JoinTeamSection />
      <LatestNewsSection />
      <MoreAboutPentasentSection />
    </main>
  );
}
