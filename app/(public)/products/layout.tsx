import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Products, Medical Devices & HealthTech Solutions',
  description:
    'Discover curated medical devices, clinical software, digital health solutions, and diagnostics trusted by healthcare providers on Pentasent.',
  generator: 'pentasent.com/products',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Pentasent Products',
    'Healthcare Products',
    'Medical Devices',
    'HealthTech Solutions',
    'Clinical Software',
    'Digital Health Tools',
    'Diagnostic Devices',
    'Healthcare Innovations',
    'Medical Equipment Directory',
  ],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthcare Products | Pentasent',
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
    title: 'Healthcare Products, Medical Devices & HealthTech Solutions | Pentasent',
    description:
      'Discover curated medical devices, clinical software, digital health solutions, and diagnostics trusted by healthcare providers on Pentasent.',
    url: 'https://pentasent.com/products',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/assets/images/banners/products.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent Healthcare Products & Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Products, Medical Devices & HealthTech Solutions | Pentasent',
    description:
      'Discover curated medical devices, clinical software, digital health solutions, and diagnostics trusted by healthcare providers on Pentasent.',
    images: ['https://pentasent.com/assets/images/banners/products.png'],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
