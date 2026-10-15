import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Help & Knowledge Center | Pentasent',
  description: 'Learn more about Pentasent, our healthcare ecosystem, and how our platform connects personal health, professionals, organizations, and innovation.',
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
