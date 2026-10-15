import type { Metadata } from 'next';
import LegalHero from '@/components/pages/legal/LegalHero';
import LegalNavTabs from '@/components/pages/legal/LegalNavTabs';
import LegalContent from '@/components/pages/legal/LegalContent';
import { COOKIE_POLICY_DATA } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy | Pentasent',
  description:
    'Learn how Pentasent handles session authentication, functional preference cookies, and our zero third-party health ad-tracking guarantee.',
  alternates: {
    canonical: '/legal/cookies',
  },
  openGraph: {
    title: 'Cookie Policy | Pentasent',
    description:
      'Pentasent transparency disclosure regarding session cookies, functional tokens, and zero ad-tracking.',
    url: 'https://pentasent.com/legal/cookies',
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <LegalHero hero={COOKIE_POLICY_DATA.hero} iconType="cookie" />
      <LegalNavTabs />
      <LegalContent data={COOKIE_POLICY_DATA} />
    </main>
  );
}
