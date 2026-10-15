import type { Metadata } from 'next';
import LegalHero from '@/components/pages/legal/LegalHero';
import LegalNavTabs from '@/components/pages/legal/LegalNavTabs';
import LegalContent from '@/components/pages/legal/LegalContent';
import { PRIVACY_POLICY_DATA } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy | Pentasent',
  description:
    'Learn how Pentasent protects and encrypts sensitive health information, respects strict user consent, and guarantees zero health ad-monetization.',
  alternates: {
    canonical: '/legal/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Pentasent',
    description:
      'Pentasent health privacy principles, encryption standards, and consent-first data protection policies.',
    url: 'https://pentasent.com/legal/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <LegalHero hero={PRIVACY_POLICY_DATA.hero} iconType="shield" />
      <LegalNavTabs />
      <LegalContent data={PRIVACY_POLICY_DATA} />
    </main>
  );
}
