import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Support Status | Pentasent',
  description: 'Track the status of your support requests.',
};

export default function SupportStatusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
