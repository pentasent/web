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
        // Redirection logic for fully onboarded users
        if (user && user.is_onboarded) {
            const isAuthPage = pathname === '/signin' || pathname === '/signup';
            // Also if they try to access /beta-release but they are admin, move them to feed
            const isAdminOnBeta = user.role === 'admin' && pathname === '/beta-release';

            if (isAuthPage || isAdminOnBeta) {
                router.push(user.role === 'admin' ? '/app/feed' : '/beta-release');
            }
        }

        // Guard /app routes: must be logged in AND must be admin
        if (!loading && pathname.startsWith('/app')) {
            if (!user) {
                router.push('/signin');
            } else if (!user.is_onboarded) {
                // Stay here, popups will show
            } else if (user.role !== 'admin') {
                toast({
                    title: "Access restricted",
                    description: "Feed is currently only for admins.",
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

    // 2. Profile Setup
    // User needs profile if: not verified OR name is still the email prefix
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
