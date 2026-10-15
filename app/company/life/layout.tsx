import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Pentasent Life",
  description: "Life at Pentasent is anything but boring. It’s a fast-paced environment where big ideas take shape, teams collaborate across time zones, and passion meets purpose. From hackathons to health check-ups, we’re committed to growing together.",
  generator: 'pentasent.com/company/life',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent', 'paentasent', 'wellbeing', 'healthcare', 'mental health', 'communitiy', 'wellbeing community', 'mental health commnity'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/company/'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pentasent Life',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/company/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Pentasent Life",
    description: "Life at Pentasent is anything but boring. It’s a fast-paced environment where big ideas take shape, teams collaborate across time zones, and passion meets purpose. From hackathons to health check-ups, we’re committed to growing together.",
    url: "https://pentasent.com/company/life",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/banners/life.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Life"
      }
    ]
  }

};

export default function LifeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
