'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Community } from '@/types/database';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, LayoutGrid, Users, Compass, Book } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { CommunityCard, ExtendedCommunity } from '@/components/community/CommunityCard';
import { CommunityDetailPanel } from '@/components/community/CommunityDetailPanel';
import { GlobalLayout } from '@/components/layout/global-layout';
import { CommunityListShimmer } from '@/components/shimmer/CommunityCardShimmer';

export default function CommunityPage() {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const communityIdFromUrl = searchParams.get('id');

    const [selectedCommunity, setSelectedCommunity] = useState<ExtendedCommunity | null>(null);

    // Fetch Global Data (Communities)
    const { data: communitiesData, isLoading: loadingCommunities } = useQuery({
        queryKey: ['communities', user?.id],
        enabled: !authLoading && !!user,
        queryFn: async () => {
            let followedIds = new Set<string>();

            if (user) {
                const { data: memberData } = await supabase.from('community_followers').select('community_id').eq('user_id', user.id);
                if (memberData && memberData.length > 0) {
                    followedIds = new Set(memberData.map(m => m.community_id));
                }
            }

            const { data: commData, error } = await supabase.from('communities').select('*').eq('is_active', true);

            if (error) throw error;

            // Fetch post counts for all communities
            const communitiesWithDetails = await Promise.all((commData || []).map(async (c) => {
                const { count: postsCount } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('community_id', c.id);

                return {
                    ...c,
                    members_count: c.followers_count || 0,
                    posts_count: postsCount || 0,
                    is_joined: user ? followedIds.has(c.id) : false
                } as ExtendedCommunity;
            }));

            return communitiesWithDetails;
        },
        staleTime: 1000 * 60 * 10,
        placeholderData: keepPreviousData
    });

    const communities = React.useMemo(() => communitiesData || [], [communitiesData]);
    const loading = loadingCommunities;

    // Derived states
    const joinedCommunities = React.useMemo(() => communities.filter(c => c.is_joined), [communities]);
    const otherCommunities = React.useMemo(() => communities.filter(c => !c.is_joined), [communities]);

    useEffect(() => {
        if (!communityIdFromUrl) return;

        let isMounted = true;

        const loadSharedCommunity = async () => {
             const found = communities.find(c => c.id === communityIdFromUrl);
             if (found) {
                 setSelectedCommunity(found);
                 return;
             }
        };

        if (communities.length > 0) {
            loadSharedCommunity();
        }

        return () => { isMounted = false; };
    }, [communityIdFromUrl, communities]);


    const openCommunityDetails = (community: ExtendedCommunity) => {
        if (selectedCommunity?.id === community.id) return;
        setSelectedCommunity(community);
        router.replace(`/app/community?id=${community.id}`, { scroll: false });
    };

    const handleCommunityUpdate = (updatedInfo: Partial<Community> & { members_count?: number }) => {
        queryClient.setQueryData(['communities', user?.id], (old: ExtendedCommunity[] | undefined) => {
            if (!old) return old;
            return old.map(c => {
                if (c.id === updatedInfo.id) {
                    const isNowJoined = updatedInfo.members_count !== undefined 
                        ? updatedInfo.members_count > c.members_count 
                        : c.is_joined;
                        
                    return { 
                        ...c, 
                        ...updatedInfo, 
                        is_joined: isNowJoined,
                        followers_count: updatedInfo.followers_count ?? c.followers_count
                    };
                }
                return c;
            })
        });

        if (selectedCommunity && selectedCommunity.id === updatedInfo.id) {
            setSelectedCommunity(prev => {
                if(!prev) return null;
                const isNowJoined = updatedInfo.members_count !== undefined 
                        ? updatedInfo.members_count > prev.members_count 
                        : prev.is_joined;
                return {
                    ...prev,
                    ...updatedInfo,
                     is_joined: isNowJoined,
                     followers_count: updatedInfo.followers_count ?? prev.followers_count
                }
            });
        }
    };

    if (authLoading) {
        return (
          <GlobalLayout />
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12 gap-8 items-start max-w-[1400px] mx-auto lg:px-8">

                 {/* LEFT LIST */}
                 <div className="max-w-[700px] mx-auto xl:mx-0 w-full flex flex-col mt-24 xl:mt-8">
                    
                    {/* Header */}
                    <div className="px-4 md:px-0 mb-8 w-full flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-warm-700 mb-1">Communities</h2>
                            <p className="text-warm-500">Find your tribe and grow together</p>
                        </div>
                    </div>

                    {loading && communities.length === 0 && !communityIdFromUrl ? (
                         <div className="px-4 md:px-0">
                            <CommunityListShimmer />
                        </div>
                    ) : (
                        <div className="space-y-10 px-4 md:px-0">
                            {/* Joined Communities */}
                            {joinedCommunities.length > 0 && (
                                <section>
                                     <div className="flex items-center gap-2 mb-4">
                                        <Users className="w-5 h-5 text-warm-700" />
                                        <h3 className="text-lg font-bold text-warm-700">Your Communities</h3>
                                     </div>
                                     <div className="space-y-4">
                                         {joinedCommunities.map((community) => (
                                             <CommunityCard
                                                 key={community.id}
                                                 community={community}
                                                 onPress={openCommunityDetails}
                                                 isActive={selectedCommunity?.id === community.id}
                                             />
                                         ))}
                                     </div>
                                </section>
                            )}

                             {/* Other Communities */}
                             {otherCommunities.length > 0 && (
                                <section>
                                     <div className="flex items-center gap-2 mb-4">
                                        <Compass className="w-5 h-5 text-warm-700" />
                                        <h3 className="text-lg font-bold text-warm-700">Explore More Communities</h3>
                                     </div>
                                     <div className="space-y-4">
                                         {otherCommunities.map((community) => (
                                             <CommunityCard
                                                 key={community.id}
                                                 community={community}
                                                 onPress={openCommunityDetails}
                                                 isActive={selectedCommunity?.id === community.id}
                                             />
                                         ))}
                                     </div>
                                </section>
                            )}

                             {communities.length === 0 && (
                                <div className="text-center py-20 bg-white/50 rounded-2xl border border-warm-300 border-dashed">
                                    <p className="text-warm-500 font-medium">No communities available.</p>
                                </div>
                            )}

                        </div>
                    )}
                 </div>

                 {/* RIGHT SIDEBAR (Desktop Post Detail Overlay) */}
                 <div className="lg:relative lg:h-full hidden lg:block mt-8">
                    <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] w-full">
                        <AnimatePresence mode="wait">
                            {selectedCommunity ? (
                                <motion.div
                                    key={selectedCommunity.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-[calc(100vh-8rem)] w-full shadow-2xl rounded-2xl bg-warm-100 border border-warm-300 overflow-hidden"
                                >
                                    <CommunityDetailPanel
                                        communityId={selectedCommunity.id}
                                        onClose={() => {
                                            setSelectedCommunity(null);
                                            router.replace('/app/community', { scroll: false });
                                        }}
                                        onCommunityUpdate={handleCommunityUpdate}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full border-2 border-dashed border-warm-300 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <Book className="w-12 h-12 text-warm-400 mb-4" />
                                    <h3 className="text-warm-700 font-semibold mb-2">Select a Community</h3>
                                    <p className="text-warm-500 text-sm">Click any community from the list to view its details, members, and active channels.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

             {/* FULLSCREEN OVERLAY (Mobile Post Detail) */}
             <AnimatePresence>
                {selectedCommunity && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                        className="fixed inset-0 z-50 xl:hidden bg-warm-100"
                    >
                        <CommunityDetailPanel
                            communityId={selectedCommunity.id}
                            onClose={() => {
                                setSelectedCommunity(null);
                                router.replace('/app/community', { scroll: false });
                            }}
                            onCommunityUpdate={handleCommunityUpdate}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
