'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';
import { trackEvent } from "@/lib/analytics/track";
import { identifyUser } from "@/lib/analytics/identify";

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    unverifiedEmail: string | null;
    setUnverifiedEmail: (email: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

    useEffect(() => {
        // 1. Initial Load
        const initializeAuth = async () => {
            try {
                const { data: { user: authUser }, error } = await supabase.auth.getUser();

                if (error || !authUser) {
                    await supabase.auth.signOut();
                    setLoading(false);
                    return;
                }

                await fetchAndSetUserData(authUser.id, authUser.email || '');
            } catch (e) {
                console.error("Initial session fetch error:", e);
                await supabase.auth.signOut();
                setLoading(false);
            }
        };

        initializeAuth();

        // 2. Listen for Auth State Changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                await fetchAndSetUserData(session.user.id, session.user.email || '');
                setUnverifiedEmail(null);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchAndSetUserData = async (userId: string, email: string) => {
        try {
            const { data: publicUser, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) throw error;
            if (publicUser) {
                const userData: User = {
                    id: publicUser.id,
                    email: publicUser.email,
                    name: publicUser.name,
                    avatar_url: publicUser.avatar_url,
                    country: publicUser.country,
                    phone: publicUser.phone,
                    bio: publicUser.bio,
                    role: publicUser.role || 'user',
                    followers_count: publicUser.followers_count || 0,
                    following_count: publicUser.following_count || 0,
                    profile_views_count: publicUser.profile_views_count || 0,
                    posts_count: publicUser.posts_count || 0,
                    is_verified: publicUser.is_verified || false,
                    is_active: publicUser.is_active !== false,
                    is_onboarded: publicUser.is_onboarded || false,
                    created_at: publicUser.created_at,
                };
                setUser(userData);
                setIsAdmin(userData.role === 'admin' || email === userData.email);
            } else {
                // User exists in auth but not in public DB => This is a new user who needs to complete profile
                // Do NOT sign out. Instead, provide a default User object.
                const defaultUserData: User = {
                    id: userId,
                    email: email,
                    name: email.split('@')[0], // Default name
                    role: 'user',
                    followers_count: 0,
                    following_count: 0,
                    profile_views_count: 0,
                    posts_count: 0,
                    is_verified: false,
                    is_active: true,
                    is_onboarded: false,
                    created_at: new Date().toISOString(),
                };
                setUser(defaultUserData);
                setIsAdmin(false);
            }
        } catch (e) {
            console.error("Error fetching public user data:", e);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data?.user && data.user.identities && data.user.identities.length === 0) {
                throw new Error("Account already exists. Please sign in.");
            }

            // If signup is successful but user is not automatically signed in (common if email confirmation is required)
            // Or if we just want to trigger the popup anyway
            if (data?.user && !data.session) {
                setUnverifiedEmail(email);
            }

            if (data?.user) {
                identifyUser(data.user.id, {
                    email: data.user.email
                });
                trackEvent("user_signup");
            }
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
        } catch (error: any) {
            if (error.message.includes('Email not confirmed')) {
                setUnverifiedEmail(email);
                // Automatically trigger a resend of the OTP
                const { error: resendError } = await supabase.auth.resend({
                    type: 'signup',
                    email: email,
                    options: {
                        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
                    }
                });
                if (resendError) {
                    const combinedError = new Error(error.message);
                    (combinedError as any).resendFailed = true;
                    (combinedError as any).resendMessage = resendError.message;
                    throw combinedError;
                }
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            throw error;
        }
    };

    const refreshUser = async () => {
        if (user) {
            await fetchAndSetUserData(user.id, user.email || '');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, unverifiedEmail, setUnverifiedEmail, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
