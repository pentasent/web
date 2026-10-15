'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileShimmer } from '@/shimmer/account';

/**
 * AccountAuthGuard
 * Protects all /account/* pages.
 * If user session is expired or unauthenticated, access is denied and
 * the user is automatically redirected to /auth/login with a redirect parameter.
 */
export default function AccountAuthGuard({
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

  // While determining session or while redirecting, do not expose any account contents or tabs
  if (status === 'loading' || status === 'unauthenticated' || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-foreground">
        <Navbar />
        <div className="flex-1 w-full flex flex-col justify-center items-center">
          <ProfileShimmer />
        </div>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
