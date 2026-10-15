import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Coming Soon | Pentasent',
  description:
    'Stay tuned. Something transformative is in development for the Pentasent healthcare ecosystem. Explore our active health calculators, research, and insights in the meantime.',
  generator: 'pentasent.com/coming-soon',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent coming soon',
    'healthcare platform',
    'health tech tools',
    'digital health ecosystem',
    'stay tuned',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coming Soon | Pentasent',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/coming-soon',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'Stay Tuned | Pentasent Coming Soon',
    description:
      'We are actively preparing new features and tools for the Pentasent healthcare ecosystem. Stay tuned for upcoming releases.',
    url: 'https://pentasent.com/coming-soon',
    type: 'website',
  },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
