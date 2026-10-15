'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HealthOverviewShimmer } from '@/shimmer/my-health';

/**
 * MyHealthAuthGuard
 * Protects all /my-health/* pages.
 * If user session is expired or unauthenticated, access is denied and
 * the user is automatically redirected to /auth/login with a redirect parameter.
 */
export default function MyHealthAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // When session expires or user is unauthenticated, redirect immediately
    if (status === 'unauthenticated' || (status !== 'loading' && !user)) {
      const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : '';
      router.replace(`/auth/login${redirectParam}`);
    }
  }, [status, user, router, pathname]);

  // While determining session or while redirecting, do not expose any health data or forms
  if (status === 'loading' || status === 'unauthenticated' || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f4] text-foreground">
        <Navbar />
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <HealthOverviewShimmer />
        </div>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
