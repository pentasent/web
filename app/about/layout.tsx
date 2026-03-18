import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About",
  description: "Pentasent was created with a simple idea, technology should support your mind, not compete for your attention.",
  generator: 'pentasent.com/about',
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
    title: 'Contact',
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
    title: "About",
    description: "Pentasent was created with a simple idea, technology should support your mind, not compete for your attention.",
    url: "https://pentasent.com/about",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/social/about_banner.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent About"
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
    <>{children}</>
  );
}
