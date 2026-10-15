import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Communities & Medical Circles',
  description:
    'Connect with clinicians, medical researchers, healthcare innovators, and patient care circles across specialized clinical disciplines on Pentasent.',
  generator: 'pentasent.com/communities',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Communities',
    'Healthcare Communities',
    'Medical Circles',
    'Clinician Networks',
    'Healthcare Innovation',
    'Clinical Collaboration',
    'HealthTech Circles',
    'Healthcare Forum',
    'Medical Specialists Network',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Communities | Pentasent',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'Healthcare Communities & Medical Circles | Pentasent',
    description:
      'Connect with clinicians, medical researchers, healthcare innovators, and patient care circles across specialized clinical disciplines on Pentasent.',
    url: 'https://pentasent.com/communities',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/banners/community.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare Communities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Communities & Medical Circles | Pentasent',
    description:
      'Connect with clinicians, medical researchers, healthcare innovators, and patient care circles across specialized clinical disciplines on Pentasent.',
    images: ['https://pentasent.com/banners/community.png'],
  },
};

export default function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
