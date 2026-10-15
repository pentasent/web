import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Careers - Open Roles",
  description: "Explore open roles at Pentasent and join our mission to create a world where everyone feels seen, heard, and valued. Discover opportunities to make a difference in mental health and community-driven care.",
  generator: 'pentasent.com/company/careers/open-roles',
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
    title: 'Careers - Open Roles',
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
    title: "Careers - Open Roles",
    description: "Explore open roles at Pentasent and join our mission to create a world where everyone feels seen, heard, and valued. Discover opportunities to make a difference in mental health and community-driven care.",
    url: "https://pentasent.com/company/careers/open-roles",
    type: "website",
    images: [
      {
        url: "https://pentasent.com/assets/images/banners/open_roles.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Pentasent Careers - Open Roles"
      }
    ]
  }

};

export default function OpenRolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
