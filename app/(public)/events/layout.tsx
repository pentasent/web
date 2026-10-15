import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Events, Medical Summits & Conferences',
  description:
    'Discover upcoming global medical conferences, healthcare leadership summits, clinical webinars, and healthtech networking events on Pentasent.',
  generator: 'pentasent.com/events',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Events',
    'Healthcare Events',
    'Medical Conferences',
    'Clinical Summits',
    'Healthcare Webinars',
    'HealthTech Conferences',
    'Medical Seminars',
    'Global Health Events',
    'Continuing Medical Education',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Events | Pentasent',
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
    title: 'Healthcare Events, Medical Summits & Conferences | Pentasent',
    description:
      'Discover upcoming global medical conferences, healthcare leadership summits, clinical webinars, and healthtech networking events on Pentasent.',
    url: 'https://pentasent.com/events',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/banners/events.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Events, Medical Summits & Conferences | Pentasent',
    description:
      'Discover upcoming global medical conferences, healthcare leadership summits, clinical webinars, and healthtech networking events on Pentasent.',
    images: ['https://pentasent.com/banners/events.png'],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
