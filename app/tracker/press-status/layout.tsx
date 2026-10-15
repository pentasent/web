import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Press Status | Pentasent',
  description: 'Track the status of your press releases.',
};

export default function PressStatusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
