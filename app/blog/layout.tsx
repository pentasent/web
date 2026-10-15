import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Pentasent Blog",
  description: "Stay updated with the latest news, insights, and stories from Pentasent. Explore how we’re shaping the future of healthcare and wellbeing.",
  generator: 'pentasent.com/blog',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent', 'paentasent', 'wellbeing', 'healthcare', 'mental health', 'communitiy', 'wellbeing community', 'mental health commnity'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/blog'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pentasent Blog',
  },
  icons: {
    icon: '/color_icon.png',
  },
  alternates: {
    canonical: '/blog/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Pentasent Blog",
    description: "Stay updated with the latest news, insights, and stories from Pentasent. Explore how we’re shaping the future of healthcare and wellbeing.",
    url: "https://pentasent.com/blog",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/blog.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Blog"
      }
    ]
  }

};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
