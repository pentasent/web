import type { Metadata } from 'next';
import LegalHero from '@/components/pages/legal/LegalHero';
import LegalNavTabs from '@/components/pages/legal/LegalNavTabs';
import LegalContent from '@/components/pages/legal/LegalContent';
import { TERMS_OF_SERVICE_DATA } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Terms of Service | Pentasent',
  description:
    'Terms and conditions, community guidelines, professional verification rules, and critical medical disclaimers governing the Pentasent healthcare ecosystem.',
  alternates: {
    canonical: '/legal/terms',
  },
  openGraph: {
    title: 'Terms of Service | Pentasent',
    description:
      'The foundational terms, user guidelines, and medical disclaimers that govern your use of the Pentasent healthcare ecosystem.',
    url: 'https://pentasent.com/legal/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <LegalHero hero={TERMS_OF_SERVICE_DATA.hero} iconType="scale" />
      <LegalNavTabs />
      <LegalContent data={TERMS_OF_SERVICE_DATA} />
    </main>
  );
}
