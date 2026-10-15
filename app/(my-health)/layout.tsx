import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import MyHealthNavTabs from '@/components/my-health/MyHealthNavTabs';
import MyHealthAuthGuard from '@/components/my-health/MyHealthAuthGuard';

export const metadata: Metadata = {
  title: "My Health | Pentasent",
  description: "Manage your profile, appointments, messages, and community interactions. Your personalized dashboard for health and wellbeing.",
  metadataBase: new URL('https://pentasent.com/my-health'),
  alternates: {
    canonical: '/my-health/',
  },
  openGraph: {
    title: 'My Health | Pentasent',
    description: 'Manage your profile, appointments, messages, and community interactions. Your personalized dashboard for health and wellbeing.',
    url: 'https://pentasent.com/my-health',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/banners/home.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent',
      },
    ],
  },
};

export default function MyHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyHealthAuthGuard>
      <div className="min-h-screen flex flex-col bg-[#faf7f4] text-foreground">
        <Navbar />
        <MyHealthNavTabs />
        <div className="flex-1 w-full bg-[#faf7f4]">
          {children}
        </div>
        <Footer />
      </div>
    </MyHealthAuthGuard>
  );
}
