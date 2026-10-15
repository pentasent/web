import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Jobs, Clinical Roles & HealthTech Careers',
  description:
    'Explore verified healthcare job openings, clinical roles, hospital leadership positions, and medical technology careers across leading health institutions.',
  generator: 'pentasent.com/jobs',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Jobs',
    'Healthcare Jobs',
    'Medical Careers',
    'Clinical Roles',
    'Hospital Jobs',
    'HealthTech Careers',
    'Nursing Jobs',
    'Physician Openings',
    'Healthcare Employment',
    'Clinical Research Jobs',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Jobs | Pentasent',
  },
  icons: {
    icon: '/color_icon.png',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'Healthcare Jobs, Clinical Roles & HealthTech Careers | Pentasent',
    description:
      'Explore verified healthcare job openings, clinical roles, hospital leadership positions, and medical technology careers across leading health institutions.',
    url: 'https://pentasent.com/jobs',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/assets/images/banners/jobs.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare Jobs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Jobs, Clinical Roles & HealthTech Careers | Pentasent',
    description:
      'Explore verified healthcare job openings, clinical roles, hospital leadership positions, and medical technology careers across leading health institutions.',
    images: ['https://pentasent.com/assets/images/banners/jobs.png'],
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
