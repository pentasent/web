import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/animation.css";
import "@/styles/scroll.css";
import "@/styles/shadow.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { GoogleFonts } from "@/fonts";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata: Metadata = {
  title: "Pentasent",
  description: "Discover healthcare professionals, wellness resources, and supportive communities. Build healthy habits, improve your wellbeing, and find your rhythm with Pentasent.",
  generator: 'pentasent.com',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent', 'healthcare', 'wellbeing', 'wellness', 'mental health', 'healthcare community', 'wellbeing community', 'mental health community', 'healthy habits', 'health and wellness resources', 'healthcare professionals', 'wellness communities'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pentasent',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pentasent',
    description: 'Discover healthcare professionals, wellness resources, and supportive communities. Build healthy habits, improve your wellbeing, and find your rhythm with Pentasent.',
    url: 'https://pentasent.com/',
    type: 'website',
    siteName: 'Pentasent',
    images: [
      {
        url: 'https://pentasent.com/banners/home.png',
        width: 1200,
        height: 630,
        alt: 'Pentasent — Healthcare, Wellness and Wellbeing Communities',
      },
    ],
  },
  other: {
    "al:android:package": "com.pentasent.app",
    "al:android:app_name": "Pentasent",
    "al:ios:bundle_id": "com.pentasent.app",
    "al:ios:app_name": "Pentasent",
    "twitter:app:name:iphone": "Pentasent",
    "twitter:app:id:iphone": "com.pentasent.app",
    "twitter:app:name:googleplay": "Pentasent",
    "twitter:app:id:googleplay": "com.pentasent.app",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import ChatBot from "@/components/bot/chat";
import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", `${GoogleFonts.red_hat_text.className}`)}
    >
      <body className="min-h-full w-full overflow-x-hidden antialiased bg-white text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
        <ChatBot />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
