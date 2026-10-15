import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Research, Clinical Trials & Scientific Papers',
  description:
    'Explore biomedical discoveries, clinical trial registries, open-science publications, and evidence-based medical research on Pentasent.',
  generator: 'pentasent.com/research',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Research',
    'Healthcare Research',
    'Clinical Trials',
    'Medical Research',
    'Biomedical Science',
    'Clinical Studies',
    'Medical Publications',
    'Open Science Healthcare',
    'Genomics Research',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Research | Pentasent',
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
    title: 'Healthcare Research, Clinical Trials & Scientific Papers | Pentasent',
    description:
      'Explore biomedical discoveries, clinical trial registries, open-science publications, and evidence-based medical research on Pentasent.',
    url: 'https://pentasent.com/research',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/assets/images/banners/home.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare Research',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Research, Clinical Trials & Scientific Papers | Pentasent',
    description:
      'Explore biomedical discoveries, clinical trial registries, open-science publications, and evidence-based medical research on Pentasent.',
    images: ['https://pentasent.com/assets/images/banners/home.png'],
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
