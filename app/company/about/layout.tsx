import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "About",
  description: "Contact Pentasent support for colleboration, feedback, and support. Pentasent is a community for mental health and wellbeing.",
  generator: 'pentasent.com/company/about',
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
    title: 'About',
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
    title: "About",
    description: "Contact Pentasent support for colleboration, feedback, and support. Pentasent is a community for mental health and wellbeing.",
    url: "https://pentasent.com/company/about",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/banners/about.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent About"
      }
    ]
  }

};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
