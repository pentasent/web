import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Careers - Phishing Scam",
  description: "Phishing scams are fraudulent attempts by scammers to obtain sensitive information such as usernames, passwords, and credit card details by impersonating as a trustworthy entity in electronic communication. Learn more about phishing scams.",
  generator: 'pentasent.com/company/careers/phishing-scam',
  applicationName: 'Pentasent',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pentasent', 'paentasent', 'wellbeing', 'healthcare', 'mental health', 'communitiy', 'wellbeing community', 'mental health commnity', 'phishing scam', 'phishing', 'scam'],
  authors: [{ name: 'Pentasent', url: 'https://pentasent.com' }],
  creator: 'Pentasent',
  publisher: 'Pentasent',
  metadataBase: new URL('https://pentasent.com'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Careers - Phishing Scam',
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
    title: "Careers - Phishing Scam",
    description: "Phishing scams are fraudulent attempts by scammers to obtain sensitive information such as usernames, passwords, and credit card details by impersonating as a trustworthy entity in electronic communication. Learn more about phishing scams.",
    url: "https://pentasent.com/company/careers/phishing-scam",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/phishing_scam.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Careers - Phishing Scam"
      }
    ]
  }

};

export default function PhishingScamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
