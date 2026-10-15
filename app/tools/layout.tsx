import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Health Tools & Calculators | Pentasent',
    template: '%s | Pentasent Tools',
  },
  description:
    'Evidence-based health calculators and clinical measurement converters. Assess BMI, BMR, daily energy expenditure, and convert healthcare units with Pentasent.',
  generator: 'pentasent.com/tools',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'BMI calculator',
    'BMR calculator',
    'Calorie calculator',
    'TDEE calculator',
    'Health measurement converter',
    'Blood glucose converter',
    'Blood pressure converter',
    'Pentasent health tools',
    'Wellness calculators',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/tools'),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/tools/',
    languages: {
      'en-US': '/en-US'
    },
  },
  icons: {
    icon: '/color_icon.png',
  },
  openGraph: {
    title: 'Health Tools & Calculators | Pentasent',
    description:
      'Evidence-based health calculators and clinical measurement converters for personal wellness and clinical literacy on Pentasent.',
    url: 'https://pentasent.com/tools',
    type: 'website',
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/home.png",
        width: 1200,
        height: 630,
        alt: "Pentasent Tools"
      }
    ]
  },
};

export default function ToolsLayout({
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
