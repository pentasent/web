import PressHero from '@/components/pages/press/PressHero';
import SubmitPressSection from '@/components/pages/press/SubmitPressSection';
import PressSupportCards from '@/components/pages/press/PressSupportCards';
import LatestNewsSection from '@/components/pages/about/LatestNewsSection';
import FindPentasentSocial from '@/components/pages/press/FindPentasentSocial';

export default function PressPage() {
  return (
    <main className="min-h-screen bg-white w-full overflow-x-hidden">
      <PressHero />
      <SubmitPressSection />
      <PressSupportCards />
      <LatestNewsSection />
      <FindPentasentSocial />
    </main>
  );
}
