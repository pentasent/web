'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';
import { trackEvent } from "@/lib/analytics/track";
import { identifyUser } from "@/lib/analytics/identify";
import { uploadImage } from "@/lib/image-upload";

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    unverifiedEmail: string | null;
    setUnverifiedEmail: (email: string | null) => void;
    otpType: 'signup' | 'recovery';
    setOtpType: (type: 'signup' | 'recovery') => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, metadata?: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateProfile: (updates: {
        name?: string;
        bio?: string;
        country?: string;
        avatar_file?: File;
        avatar_uri?: string;
        is_onboarded?: boolean;
        is_verified?: boolean;
        is_active?: boolean;
    }) => Promise<void>;
    isResetVerified: boolean;
    setIsResetVerified: (verified: boolean) => void;
    initialAuthHint: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; initialAuthHint?: boolean }> = ({ children, initialAuthHint = false }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // Always start true to sync with client-side supabase check
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
    const [otpType, setOtpType] = useState<'signup' | 'recovery'>('signup');
    const [isResetVerified, setIsResetVerified] = useState(false);

    const setAuthCookie = (isLoggedIn: boolean) => {
        if (typeof document !== 'undefined') {
            document.cookie = `pentasent_auth_hint=${isLoggedIn}; path=/; max-age=31536000; SameSite=Lax`;
        }
    };

    useEffect(() => {
        // 1. Initial Load
        const initializeAuth = async () => {
            try {
                const isRecovery = typeof window !== 'undefined' && 
                    (window.location.pathname === '/reset-password' || 
                     window.location.hash.includes('type=recovery') ||
                     window.location.hash.includes('access_token='));

                const { data: { user: authUser }, error } = await supabase.auth.getUser();

                if ((error || !authUser) && !isRecovery) {
                    await supabase.auth.signOut();
                    setAuthCookie(false);
                    setLoading(false);
                    return;
                }

                if (authUser) {
                    setAuthCookie(true);
                    await fetchAndSetUserData(authUser.id, authUser.email || '');
                } else {
                    setAuthCookie(false);
                    setLoading(false);
                }
            } catch (e) {
                console.error("Initial session fetch error:", e);
                setLoading(false);
            }
        };

        initializeAuth();

        // 2. Listen for Auth State Changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setAuthCookie(true);
                await fetchAndSetUserData(session.user.id, session.user.email || '');
                setUnverifiedEmail(null);
            } else if (event === 'SIGNED_OUT') {
                setAuthCookie(false);
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
            // Ensure the client session is fully synchronized before any DB calls
            await supabase.auth.getUser();

            let { data: publicUser, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) throw error;

            if (!publicUser) {
                // Case: User exists in auth but not in public DB
                // If we're on the /signup page, this is a new registration completion.
                // We create the record here as soon as the session is ready.
                if (typeof window !== 'undefined' && window.location.pathname === '/signup') {
                    const { data: insertedUser, error: insertError } = await supabase
                        .from('users')
                        .insert({
                            id: userId,
                            email: email,
                            name: email.split('@')[0], // Ensure required 'name' field is provided
                            is_verified: false,
                            is_onboarded: false,
                            role: 'user'
                        })
                        .select()
                        .maybeSingle();
                    
                    if (insertError) {
                        console.error("Error creating public user record:", insertError.message);
                    } else if (insertedUser) {
                        publicUser = insertedUser;
                        console.log("Successfully created public user record:", publicUser.id);
                    }
                }
            }

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
                    is_verified: publicUser.is_verified ?? false,
                    is_active: publicUser.is_active !== false,
                    is_onboarded: publicUser.is_onboarded ?? false,
                    created_at: publicUser.created_at,
                };
                setUser(userData);
                setIsAdmin(userData.role === 'admin');
            } else {
                // Fallback for missing user record
                const defaultUserData: User = {
                    id: userId,
                    email: email,
                    name: email.split('@')[0],
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

    const register = async (email: string, password: string, metadata?: any) => {
        try {
            // Stage 1: Absolute check in public.users (Source of Truth)
            const { data: publicUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (publicUser) {
                throw new Error("Account already exists with this email. Please sign in.");
            }

            // Stage 2: Attempt to clear stale unconfirmed record via RPC (Side-effect free)
            // This ensures if an unverified user exists, they are removed before the new signUp
            // so they receive only ONE email and can update their password.
            try {
                await supabase.rpc('delete_unconfirmed_user', { target_email: email });
            } catch (rpcErr) {
                // Ignore RPC failures (e.g. if function doesn't exist yet)
                console.error("RPC deletion attempt failed:", rpcErr);
            }

            // Stage 3: Perform fresh Signup (or re-signup after deletion)
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

            if (error) throw error;

            if (data?.user && !data.session) {
                // Verification required (Standard or Resent)
                setUnverifiedEmail(email);
                setOtpType('signup');
            }

            if (data?.user && data.session) {
                identifyUser(data.user.id, { email: data.user.email });
                trackEvent("user_signup");
            }
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // Pre-check existence in public.users
            const { data: publicUser } = await supabase
                .from('users')
                .select('id, is_verified, is_onboarded')
                .ilike('email', email)
                .maybeSingle();

            if (!publicUser) {
                // source of truth: if not in public table, account not found
                throw new Error("Account not found with this email.");
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;

        } catch (error: any) {
            if (error.message.includes('Email not confirmed')) {
                setUnverifiedEmail(email);
                await supabase.auth.resend({
                    type: 'signup',
                    email: email,
                    options: {
                        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
                    }
                });
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

    const updateProfile = async (updates: {
        name?: string;
        bio?: string;
        country?: string;
        avatar_uri?: string;
        avatar_file?: File;
        is_onboarded?: boolean;
        is_verified?: boolean;
        is_active?: boolean;
    }) => {
        if (!user) return;

        // 1. Optimistic UI update
        const optimisticUser = {
            ...user,
            ...updates,
            avatar_url: updates.avatar_uri || user.avatar_url, // Use local URI/Blob as preview
        };
        setUser(optimisticUser);

        // 2. Background Process
        (async () => {
            try {
                let finalAvatarUrl = user.avatar_url;

                // If a new file is provided, upload it
                if (updates.avatar_file) {
                    const fileExt = updates.avatar_file.name.split('.').pop() || 'jpg';
                    const fileName = `avatars/${user.id}_${Date.now()}.${fileExt}`;
                    const uploadResult = await uploadImage(updates.avatar_file, fileName);
                    if (uploadResult) {
                        finalAvatarUrl = fileName;
                    }
                }

                const { error } = await supabase
                    .from('users')
                    .update({
                        name: updates.name !== undefined ? updates.name : user.name,
                        bio: updates.bio !== undefined ? updates.bio : user.bio,
                        country: updates.country !== undefined ? updates.country : user.country,
                        avatar_url: finalAvatarUrl,
                        is_onboarded: updates.is_onboarded !== undefined ? updates.is_onboarded : user.is_onboarded,
                        is_verified: updates.is_verified !== undefined ? updates.is_verified : user.is_verified,
                        is_active: updates.is_active !== undefined ? updates.is_active : user.is_active
                    })
                    .eq('id', user.id);

                if (error) throw error;

                // Refresh to get final server state
                await refreshUser();
            } catch (error) {
                console.error('Background Profile Update Failed:', error);
                // On failure, revert optimistic update
                await refreshUser();
            }
        })();
    };

    return (
        <AuthContext.Provider value={{ 
            user, isAdmin, loading, unverifiedEmail, setUnverifiedEmail, 
            otpType, setOtpType, isResetVerified, setIsResetVerified,
            login, register, logout, refreshUser, updateProfile, initialAuthHint 
        }}>
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
