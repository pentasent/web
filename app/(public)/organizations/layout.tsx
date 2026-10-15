import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Organizations, Hospitals & Clinical Directory',
  description:
    'Browse accredited hospitals, specialized clinics, medical institutions, and healthtech enterprises shaping modern patient care on Pentasent.',
  generator: 'pentasent.com/organizations',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Organizations',
    'Healthcare Organizations',
    'Hospitals Directory',
    'Medical Clinics',
    'Health Systems',
    'Clinical Institutions',
    'Specialty Medical Centers',
    'HealthTech Enterprises',
    'Biomedical Institutions',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Organizations | Pentasent',
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
    title: 'Healthcare Organizations, Hospitals & Clinical Directory | Pentasent',
    description:
      'Browse accredited hospitals, specialized clinics, medical institutions, and healthtech enterprises shaping modern patient care on Pentasent.',
    url: 'https://pentasent.com/organizations',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/banners/organizations.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare Organizations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Organizations, Hospitals & Clinical Directory | Pentasent',
    description:
      'Browse accredited hospitals, specialized clinics, medical institutions, and healthtech enterprises shaping modern patient care on Pentasent.',
    images: ['https://pentasent.com/banners/organizations.png'],
  },
};

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
