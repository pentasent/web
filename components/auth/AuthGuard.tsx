'use client';

import React, { useEffect } from 'react';
import OtpPopup from './OtpPopup';
import ProfilePopup from './ProfilePopup';
import CommunityOnboardingPopup from './CommunityOnboardingPopup';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AuthGuard() {
    const { user, loading, unverifiedEmail } = useAuth();
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Redirect fully onboarded users away from public auth pages (but allow access to /)
        if (user && user.is_onboarded) {
            if (pathname === '/signin' || pathname === '/signup') {
                if (user.role === 'admin') {
                    router.push('/app/feed');
                } else {
                    router.push('/beta-release');
                }
            }
        }

        // Guard the protected app routes from unauthenticated users AND non-admins
        if (!loading && pathname.startsWith('/app')) {
            if (!user) {
                router.push('/signin');
            } else if (user.role !== 'admin') {
                toast({
                    title: "Access restricted",
                    description: "Admins only.",
                    variant: "destructive",
                });
                router.replace('/beta-release');
            }
        }
    }, [user, loading, pathname, router, toast]);

    // Do not guard during initial loading to prevent flashes
    if (loading) return null;

    // 1. Unverified Email (OTP)
    if (unverifiedEmail) {
        return <OtpPopup />;
    }

    // If there's no auth user at all, don't show profile/community popups
    if (!user) return null;

    // We protect the /app route (and maybe others), but we can also enforce this globally
    // Ensure we don't flash this on public routes like /, /about, /signin unless necessary
    // But since the React Native app forces it upon successful OTP, we should probably force it globally
    // OR force it only on protected routes. Let's force globally for logged-in users who haven't finished onboarding.

    // 2. Profile Setup
    if (!user.is_verified || user.name === user.email?.split('@')[0]) {
        // Simple heuristic: if name hasn't been changed from email prefix, or country/bio is missing.
        // The React Native app defines user.is_verified = false when they are a Draft User.
        return <ProfilePopup />;
    }

    // 3. Community Onboarding
    if (!user.is_onboarded) {
        return <CommunityOnboardingPopup />;
    }

    return null;
}
