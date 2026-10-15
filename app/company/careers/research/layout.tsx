import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Discover Pentasent’s research and insights on mental health, wellness, and community-driven care. Explore our latest studies and initiatives.",
  generator: 'pentasent.com/company/careers/research',
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
    title: 'Research',
  },
  icons: {
    icon: '/color_icon.png',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Research",
    description: "Discover Pentasent’s research and insights on mental health, wellness, and community-driven care. Explore our latest studies and initiatives.",
    url: "https://pentasent.com/company/careers/research",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/research_banner.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Research"
      }
    ]
  }

};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
