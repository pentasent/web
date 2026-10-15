import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description: "Transparent, ecosystem-aligned pricing for healthcare organizations, clinics, hospitals, digital health innovators, and personal health tools on Pentasent.",
  generator: 'pentasent.com/pricing',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent pricing', 'healthcare pricing', 'clinic pricing', 'hospital directory plan', 'healthtech launch pricing', 'wellbeing ecosystem'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com/pricing'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pricing & Plans',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/pricing',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Pentasent Pricing & Plans",
    description: "Transparent, ecosystem-aligned pricing for healthcare organizations, clinics, hospitals, digital health innovators, and personal health tools on Pentasent.",
    url: "https://pentasent.com/pricing",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/banners/home.png",
        width: 1200,
        height: 630,
        alt: "Pentasent Pricing"
      }
    ]
  }
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
