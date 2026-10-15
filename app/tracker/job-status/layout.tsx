import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Job Status | Pentasent',
  description: 'Track the status of your jobs applied at Pentasent.',
};

export default function JobStatusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
