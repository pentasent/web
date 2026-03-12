'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Calendar, Edit3, Settings, Shield, Bell, ChevronRight, MapPin, Grid, Users, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/format';

export default function ProfilePage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [postCount, setPostCount] = useState<number | null>(null);
    const [communityCount, setCommunityCount] = useState<number | null>(null);
    const [journalCount, setJournalCount] = useState<number | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/signin');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                // Fetch Post Count
                const { count: pCount, error: pError } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                if (!pError && pCount !== null) {
                    setPostCount(pCount);
                }

                // Fetch Community Count
                const { count: cCount, error: cError } = await supabase
                    .from('community_followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                if (!cError && cCount !== null) {
                    setCommunityCount(cCount);
                }

                // Fetch Journal Count
                const { count: jCount, error: jError } = await supabase
                    .from('user_journals')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                if (!jError && jCount !== null) {
                    setJournalCount(jCount);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                toast({
                    title: "Error",
                    description: "Failed to load profile statistics.",
                    variant: "destructive",
                });
            } finally {
                setLoadingStats(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, toast]);

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/signin');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to logout. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (authLoading || (!user && loadingStats)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-warm-700" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20 bg-warm-50/50">
            <div className="max-w-[800px] mx-auto w-full flex flex-col mt-24 xl:mt-12 px-4 md:px-0">
                {/* Banner Section */}
                <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-[#F8F2EE] via-warm-200 to-[#EADED7] rounded-[2.5rem] overflow-hidden mb-20 shadow-sm border border-warm-200/50">
                    <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[url('/images/penta_logo.svg')] bg-center bg-no-repeat bg-contain scale-150 grayscale" />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 bg-white/50 backdrop-blur-md hover:bg-white/80 rounded-full"
                        onClick={() => router.push('/app/profile/edit')}
                    >
                        <Edit3 className="h-5 w-5 text-warm-800" />
                    </Button>
                </div>

                {/* Profile Header (Avatar overlap) */}
                <div className="relative px-6 sm:px-12 -top-32">
                    <div className="absolute left-6 sm:left-12 border-[6px] border-[#F8F2EE] rounded-[3rem] bg-white shadow-2xl overflow-hidden shadow-warm-900/5 ring-1 ring-warm-200/20">
                        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 rounded-none">
                            <AvatarImage src={user.avatar_url || "https://api.pentasent.com/storage/v1/object/public/avatars/placeholders/icon.png"} alt={user.name || "User"} className="object-cover" />
                            <AvatarFallback className="text-5xl bg-warm-100 text-warm-800 font-serif">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="mt-16">
                        <div className="flex flex-col sm:pl-56 sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-warm-900 font-serif tracking-tight mb-2">{user.name || "User"}</h1>
                                <div className="flex items-center gap-4 text-warm-500">
                                    {user.country && (
                                        <div className="flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase">
                                            <MapPin className="h-4 w-4 text-warm-400" />
                                            <span>{user.country}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* <Button 
                                onClick={() => router.push('/app/profile/edit')}
                                className="bg-[#3d2f4d] hover:bg-[#2a2035] text-white rounded-2xl px-8 h-12 shadow-lg shadow-warm-900/10 transition-all active:scale-95"
                            >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button> */}
                        </div>
                        {user.bio && (
                            <p className="text-warm-600 leading-relaxed max-w-2xl mt-20 text-base font-medium opacity-90">{user.bio}</p>
                        )}
                    </div>
                </div>

                {/* User Info Stats Section */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-warm-200/60 mb-8 -mt-20">
                    <h2 className="text-xl font-bold text-warm-800 mb-8 font-serif tracking-tight">User Analytics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex items-center justify-between py-4 border-b border-warm-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-warm-50/80 flex items-center justify-center text-warm-500 border border-warm-100">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-warm-400 uppercase tracking-widest">Email</span>
                                    <span className="font-semibold text-warm-700 text-sm">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-warm-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-warm-50/80 flex items-center justify-center text-warm-500 border border-warm-100">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-warm-400 uppercase tracking-widest">Member Since</span>
                                    <span className="font-bold text-[#3D253B] text-sm">
                                        {new Date(user.created_at || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-warm-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-warm-50/80 flex items-center justify-center text-warm-500 border border-warm-100">
                                    <Grid className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-warm-400 uppercase tracking-widest">Total Posts</span>
                                    <span className="font-bold text-[#3D253B] text-lg">
                                        {postCount === null ? <span className="h-4 w-8 bg-warm-100 animate-pulse rounded block"></span> : formatNumber(postCount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-warm-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-warm-50/80 flex items-center justify-center text-warm-500 border border-warm-100">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-warm-400 uppercase tracking-widest">Communities</span>
                                    <span className="font-bold text-[#3D253B] text-lg">
                                        {communityCount === null ? <span className="h-4 w-8 bg-warm-100 animate-pulse rounded block"></span> : formatNumber(communityCount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-warm-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-warm-50/80 flex items-center justify-center text-warm-500 border border-warm-100">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-warm-400 uppercase tracking-widest">Journal Entries</span>
                                    <span className="font-bold text-[#3D253B] text-lg">
                                        {journalCount === null ? <span className="h-4 w-8 bg-warm-100 animate-pulse rounded block"></span> : formatNumber(journalCount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings & Links Section */}
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-warm-200 mb-8">
                    <button
                        onClick={() => router.push('/app/contact')}
                        className="w-full flex items-center justify-between p-4 hover:bg-warm-50 rounded-2xl transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#fceeea] text-[#e05e46] flex items-center justify-center">
                                <Mail className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-warm-900 text-sm">Contact Us</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-warm-400 group-hover:text-warm-700 transition-colors" />
                    </button>

                    <button
                        onClick={() => router.push('/app/settings/notifications')}
                        className="w-full flex items-center justify-between p-4 hover:bg-warm-50 rounded-2xl transition-colors group mt-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Bell className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-warm-900 text-sm">Notification Settings</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-warm-400 group-hover:text-warm-700 transition-colors" />
                    </button>
                    
                    <button
                        onClick={() => router.push('/app/settings')}
                        className="w-full flex items-center justify-between p-4 hover:bg-warm-50 rounded-2xl transition-colors group mt-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
                                <Settings className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-warm-900 text-sm">Settings</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-warm-400 group-hover:text-warm-700 transition-colors" />
                    </button>
                </div>

                {/* Logout Button */}
                <div className="px-2">
                    <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="w-full py-8 rounded-[1.5rem] border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold bg-white shadow-sm transition-all active:scale-[0.99]"
                    >
                        Sign Out from Pentasent
                    </Button>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-12 mb-8">
                    <p className="text-warm-400 text-xs mb-1">App Version 1.0.0</p>
                    <p className="text-warm-500 text-xs mb-2">Developed by Pentasent Inc.</p>
                    <p className="text-warm-600 font-medium text-xs font-serif">Take Back Control of Your Mind and Senses</p>
                </div>
            </div>
        </div>
    );
}
