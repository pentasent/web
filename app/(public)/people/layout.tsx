import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Leaders, Clinicians & Medical Innovators',
  description:
    'Connect with distinguished physicians, medical specialists, clinical researchers, and healthcare pioneers leading care transformation on Pentasent.',
  generator: 'pentasent.com/people',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent People',
    'Healthcare Leaders',
    'Physicians Directory',
    'Medical Specialists',
    'Clinical Researchers',
    'Healthcare Innovators',
    'Doctors Directory',
    'Surgeons Network',
    'Digital Health Founders',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Leaders | Pentasent',
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
    title: 'Healthcare Leaders, Clinicians & Medical Innovators | Pentasent',
    description:
      'Connect with distinguished physicians, medical specialists, clinical researchers, and healthcare pioneers leading care transformation on Pentasent.',
    url: 'https://pentasent.com/people',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/assets/images/banners/people.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare People & Leaders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Leaders, Clinicians & Medical Innovators | Pentasent',
    description:
      'Connect with distinguished physicians, medical specialists, clinical researchers, and healthcare pioneers leading care transformation on Pentasent.',
    images: ['https://pentasent.com/assets/images/banners/people.png'],
  },
};

export default function PeopleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
