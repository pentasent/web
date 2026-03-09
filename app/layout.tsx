import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';

export const metadata: Metadata = {
  title: "Pentasent",
  description: "Build healthy habits and find your rhythm with personalized communities that understands your unique journey.",
  generator: 'pentasent.com',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent', 'paentasent', 'wellbeing', 'healthcare', 'mental health', 'communitiy', 'wellbeing community', 'mental health commnity'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pentasent',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Pentasent",
    description: "Build healthy habits and find your rhythm with personalized communities that understands your unique journey.",
    url: "https://pentasent.com",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/social/home_banner.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent"
      }
    ]
  }

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>
            <AuthGuard />
            <AnalyticsTracker />
            {children}
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
