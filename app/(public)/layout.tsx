import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Pentasent',
    template: '%s | Pentasent',
  },
  description:
    'Pentasent is a connected healthcare operating system—creating the digital infrastructure for health management, patient care, and community well-being.',
  generator: 'pentasent.com',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent', 'Pentasent Communities', 'Pentasent Event', 'Pentasent Jobs', 'Pentasent Healthcare Jobs', 'Pentasent Healthcare Founder', 'Healthcare Founders', 'Healthcare Events', 'Healthcare Communities', 'Healthcare Products', 'Healthcare Organisations', 'healthcare Research', 'Pentasent Research', 'Connect', 'Healthcare', 'Digital Health', 'Pentasent Community', 'Pentasent Jobs', 'Pentasent Healthcare', 'Pentasent Community', 'Pentasent Event', 'Pentasent Research', 'Pentasent Products', 'Pentasent Organisations', 'Pentasent Careers', 'Pentasent'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/'),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: 'Pentasent',
    description:
      'Pentasent is a connected healthcare operating system—creating the digital infrastructure for health management, patient care, and community well-being.',
    url: 'https://pentasent.com/',
    type: 'website',
    images: [
      {
        url: "https://pentasent.com/banners/home.png",
        width: 1200,
        height: 630,
        alt: "Pentasent"
      }
    ]
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-foreground">
      <Navbar />
      <main className="flex-1 w-full min-h-[calc(100vh-80px)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
