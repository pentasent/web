import type { Metadata } from 'next';
import DeleteAccountHero from '@/components/pages/help/delete-account/DeleteAccountHero';
import DeleteAccountNavTabs from '@/components/pages/help/delete-account/DeleteAccountNavTabs';
import DeleteAccountContent from '@/components/pages/help/delete-account/DeleteAccountContent';

export const metadata: Metadata = {
  title: 'Delete Account & Data Removal | Pentasent Help',
  description:
    'Learn how to permanently delete your Pentasent account, check active products, communities, or hospital organizations, review 24-hour and 7-day deletion timelines, and submit a verified request.',
  alternates: {
    canonical: '/help/delete-account',
  },
  openGraph: {
    title: 'Delete Account & Data Removal | Pentasent Help',
    description:
      'Step-by-step instructions to check managed services, understand data removal timelines, and permanently close your Pentasent account.',
    url: 'https://pentasent.com/help/delete-account',
    type: 'website',
  },
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white">
      <DeleteAccountHero />
      <DeleteAccountNavTabs />
      <DeleteAccountContent />
    </main>
  );
}

