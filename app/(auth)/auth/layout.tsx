import React from 'react';
import type { Metadata } from 'next';
import AuthHeader from '@/components/auth/AuthHeader';
import Link from 'next/link';
import { AUTH_LAYOUT_CONFIG } from '@/data/auth';

export const metadata: Metadata = {
  title: "Log In or Sign Up | Pentasent",
  description: "Join the Pentasent healthcare ecosystem. Register as an individual, medical practitioner, healthcare organization, or research institution.",
  metadataBase: new URL('https://pentasent.com/auth'),
  alternates: {
    canonical: '/auth/',
  },
  openGraph: {
    title: 'Log In or Sign Up | Pentasent',
    description: 'Join the Pentasent healthcare ecosystem. Register as an individual, medical practitioner, healthcare organization, or research institution.',
    url: 'https://pentasent.com/auth',
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col font-sans selection:bg-primary/10 selection:text-primary">
      {/* Sleek top navigation header matching InvestorNavbar */}
      <AuthHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Clean minimal footer matching InvestorFooter */}
      <footer className="py-6 border-t border-[#ded9d5] text-[13px] sm:text-[13.5px] text-muted-foreground bg-[#faf9f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Pentasent Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[13px] sm:text-[13.5px]">
            {AUTH_LAYOUT_CONFIG.footerLinks.map((link, idx) => (
              <React.Fragment key={link.href}>
                {idx > 0 && <span>•</span>}
                <Link href={link.href} className="hover:text-primary hover:underline transition-colors font-medium">
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
