import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import InvestorNavbar from '@/components/pages/investors/InvestorNavbar';
import InvestorFooter from '@/components/pages/investors/InvestorFooter';
import { InvestorNavProvider } from '@/components/pages/investors/InvestorNavContext';

export const metadata: Metadata = {
  title: {
    default: 'Investor Relations | Pentasent',
    template: '%s | Pentasent Investor Relations',
  },
  description:
    'Official investor relations portal for Pentasent. Explore our Pre-Seed €750k funding round, product architecture, market opportunity, founders’ letter, board governance, and pitch deck.',
  generator: 'pentasent.com/company/investors',
  applicationName: 'Pentasent Investor Relations',
  keywords: [
    'Pentasent Investors',
    'Pentasent Investor Relations',
    'Pre-Seed Funding',
    'Health Tech Investment',
    'Connected Healthcare Operating Layer',
    'Pentasent Pitch Deck',
    'Ankit Kumar Pentasent',
    'ABDM Digital Health Ecosystem',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/company/investors/'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Investor Relations',
  },
  icons: {
    icon: '/color_icon.png',
  },
  alternates: {
    canonical: '/company/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: 'Pentasent Investor Relations • Pre-Seed Round Open',
    description:
      'Building the operating layer for connected healthcare. Explore our Pre-Seed deck, market thesis, product graph, and governance.',
    url: 'https://pentasent.com/company/investors',
    type: 'website',
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/investors.png",
        width: 1200,
        height: 630,
        alt: "Pentasent Investor Relations"
      }
    ]
  },
};

export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <InvestorNavProvider>
        <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
          <InvestorNavbar />
          <div className="flex-1">{children}</div>
          <InvestorFooter />
        </div>
      </InvestorNavProvider>
    </Suspense>
  );
}
