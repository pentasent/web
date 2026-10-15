import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Legal & Compliance | Pentasent',
    template: '%s | Pentasent Legal',
  },
  description:
    'Legal agreements, health privacy policies, terms of service, and cookie disclosures for the Pentasent healthcare ecosystem.',
  generator: 'pentasent.com/legal',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Legal',
    'Privacy Policy',
    'Terms of Service',
    'Cookie Policy',
    'Healthcare Privacy',
    'Health Data Protection',
    'Medical Disclaimer',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/legal'),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/legal/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: 'Legal & Compliance | Pentasent',
    description:
      'Legal policies, health privacy guarantees, and terms of service for Pentasent.',
    url: 'https://pentasent.com/legal',
    type: 'website',
    images: [
      {
        url: "https://pentasent.com/banners/home.png",
        width: 1200,
        height: 630,
        alt: "Pentasent Legal"
      }
    ]
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
