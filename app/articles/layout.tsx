import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Articles",
  description: "Read articles on mental health and wellbeing. Pentasent is a community for mental health and wellbeing.",
  generator: 'pentasent.com/articles',
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
    title: 'Articles',
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
    title: "Articles",
    description: "Read articles on mental health and wellbeing. Pentasent is a community for mental health and wellbeing.",
    url: "https://pentasent.com/articles",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/social/articles_banner.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Articles"
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
