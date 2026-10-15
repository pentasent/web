import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Pentasent support for colleboration, feedback, and support. Pentasent is a community for mental health and wellbeing.",
  generator: 'pentasent.com/company/contact',
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
    title: 'Contact',
  },
  icons: {
    icon: '/color_icon.png',
  },
  alternates: {
    canonical: '/company/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Contact",
    description: "Contact Pentasent support for colleboration, feedback, and support. Pentasent is a community for mental health and wellbeing.",
    url: "https://pentasent.com/company/contact",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/contact.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Contact"
      }
    ]
  }

};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
