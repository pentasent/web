import type { Metadata } from "next";
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import AccountNavTabs from '@/components/account/AccountNavTabs';
import AccountAuthGuard from '@/components/account/AccountAuthGuard';

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your profile, appointments, messages, and community interactions. Your personalized dashboard for health and wellbeing.",
  metadataBase: new URL('https://pentasent.com/account'),
  alternates: {
    canonical: '/account',
  },
  openGraph: {
    title: 'Account',
    description: 'Manage your profile, appointments, messages, and community interactions. Your personalized dashboard for health and wellbeing.',
    url: 'https://pentasent.com/account',
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

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountAuthGuard>
      <div className="min-h-screen flex flex-col bg-white text-foreground">
        <Navbar />
        <AccountNavTabs />
        <div className="flex-1 w-full">
          {children}
        </div>
        <Footer />
      </div>
    </AccountAuthGuard>
  );
}
