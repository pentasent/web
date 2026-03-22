'use client';

import React, { useEffect } from 'react';
import OtpPopup from './OtpPopup';
import ProfilePopup from './ProfilePopup';
import CommunityOnboardingPopup from './CommunityOnboardingPopup';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AuthGuard() {
    const { user, loading, unverifiedEmail, initialAuthHint } = useAuth();
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const isAuthPage = pathname === '/signin' || pathname === '/signup' || pathname === '/reset-password';

        // 1. FAST REDIRECT: Use initialAuthHint to pivot away from auth pages immediately
        if (isAuthPage && initialAuthHint && !user && loading) {
            router.replace('/app/feed');
            return;
        }

        // 2. CONFIRMED REDIRECT: Logic for authenticated users
        if (user) {
            if (pathname === '/signin' || pathname === '/signup') {
                router.push('/app/feed');
            }
        }

        // Guard /app routes: must be logged in AND must be admin
        if (!loading && pathname.startsWith('/app')) {
            if (!user) {
                router.push('/signin');
            } else if (!user.is_onboarded) {
                // Stay here, popups will show
            } 
            // else if (user.role !== 'admin') {
            //     toast({
            //         title: "Access restricted",
            //         description: "Feed is currently only for admins.",
            //         variant: "destructive",
            //     });
            //     router.replace('/beta-release');
            // }
        }
    }, [user, loading, pathname, router, toast, initialAuthHint]);

    // Do not guard during initial loading to prevent flashes
    if (loading) return null;

    // 1. Unverified Email (OTP)
    if (unverifiedEmail) {
        return <OtpPopup />;
    }

    // If there's no auth user at all, don't show profile/community popups
    if (!user) return null;

    // If on reset-password, don't show popups, let the page handle the "New Password" form
    if (pathname === '/reset-password') return null;

    // 2. Profile Setup
    const needsProfile = !user.is_verified || user.name === user.email?.split('@')[0];

    if (needsProfile) {
        return <ProfilePopup />;
    }

    // 3. Community Onboarding
    if (!user.is_onboarded) {
        return <CommunityOnboardingPopup />;
    }

    return null;
}
