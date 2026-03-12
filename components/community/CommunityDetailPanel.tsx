import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Community, Channel } from '@/types/database';
import { Users, FileText, Globe, Lock, MapPin, Hash, UserPlus, LogOut, X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import { Loader2 } from 'lucide-react';

interface ExtendedChannel extends Channel {
    postsCount: number;
    isJoined: boolean;
}

interface CommunityDetailPanelProps {
    communityId: string;
    onClose: () => void;
    onCommunityUpdate?: (updatedInfo: Partial<Community> & { members_count?: number }) => void;
}

export const CommunityDetailPanel: React.FC<CommunityDetailPanelProps> = ({ communityId, onClose, onCommunityUpdate }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [community, setCommunity] = useState<(Community & {
        creator?: { id: string, name: string, avatar_url: string | null, country: string | null }
    }) | null>(null);

    const [channels, setChannels] = useState<ExtendedChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [memberSince, setMemberSince] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [moderators, setModerators] = useState<{ user: { id: string, name: string, avatar_url: string | null, country: string | null }, joined_at?: string, tag?: string }[]>([]);
    const [stats, setStats] = useState({ postsCount: 0 });
    const [channelActionLoading, setChannelActionLoading] = useState<string | null>(null);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    const fetchData = useCallback(async () => {
        if (!user || !communityId) return;
        try {
            setLoading(true);

            // Fetch Community Details
            const { data: communityData, error: communityError } = await supabase
                .from('communities')
                .select('*, creator:users!created_by(id, name, avatar_url, country)')
                .eq('id', communityId)
                .single();

            if (communityError) throw communityError;
            setCommunity(communityData as any);

            // Fetch Channels with Stats
            const { data: channelsData, error: channelsError } = await supabase
                .from('channels')
                .select('*')
                .eq('community_id', communityId)
                .eq('is_active', true)
                .order('is_default', { ascending: false });

            if (channelsError) throw channelsError;

            // Fetch My Channel Memberships
            const { data: myChannelFollows } = await supabase
                .from('channel_followers')
                .select('channel_id')
                .eq('user_id', user.id)
                .in('channel_id', channelsData.map(c => c.id));

            const followedChannelIds = new Set(myChannelFollows?.map(f => f.channel_id));

            // Fetch Post Counts (Parallel via Promise.all)
            const channelsWithStats = await Promise.all(channelsData.map(async (channel) => {
                const { count } = await supabase
                    .from('post_channels')
                    .select('*', { count: 'exact', head: true })
                    .eq('channel_id', channel.id);

                return {
                    ...channel,
                    postsCount: count || 0,
                    isJoined: followedChannelIds.has(channel.id)
                };
            }));

            setChannels(channelsWithStats);

            // Check Membership
            const { data: followData } = await supabase
                .from('community_followers')
                .select('user_id')
                .eq('community_id', communityId)
                .eq('user_id', user.id)
                .maybeSingle();

            if (followData) {
                setIsJoined(true);
                setMemberSince(new Date().toISOString());
            } else {
                setIsJoined(false);
                setMemberSince(null);
            }

            // Check Moderator Status
            const { data: modData } = await supabase
                .from('community_moderators')
                .select('user_id')
                .eq('community_id', communityId)
                .eq('user_id', user.id)
                .maybeSingle();

            setIsModerator(!!modData);

            // Fetch Moderators List
            const { data: modsList } = await supabase
                .from('community_moderators')
                .select(`
                    user:users(id, name, avatar_url, country), 
                    added_at,
                    tag
                `)
                .eq('community_id', communityId) as any;

            if (modsList) {
                const formattedMods = modsList.map((m: any) => ({
                    user: m.user,
                    joined_at: m.added_at,
                    tag: m.tag
                }));
                if (formattedMods.length > 0) {
                    setModerators(formattedMods);
                } else if (communityData.creator) {
                    setModerators([{
                        user: communityData.creator as any,
                        joined_at: communityData.created_at,
                    }]);
                } else {
                    setModerators([]);
                }
            } else if (communityData.creator) {
                setModerators([{
                    user: communityData.creator as any,
                    joined_at: communityData.created_at,
                }]);
            } else {
                setModerators([]);
            }

            // Fetch Stats (Posts Count)
            const { count: postsCount } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('community_id', communityId);

            setStats({ postsCount: postsCount || 0 });

        } catch (error) {
            console.error('Error fetching community details:', error);
            toast({
                title: 'Error',
                description: 'Failed to load community details.',
                variant: 'destructive'
            });
            onClose();
        } finally {
            setLoading(false);
        }
    }, [communityId, user, onClose, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleJoinLeave = async () => {
        if (!user || !community) return;
        setJoining(true);
        try {
            if (isJoined) {
                // Leave Community
                const { error: leaveError } = await supabase
                    .from('community_followers')
                    .delete()
                    .eq('community_id', community.id)
                    .eq('user_id', user.id);

                if (leaveError) throw leaveError;

                // Leave All Channels
                const channelIds = channels.map(c => c.id);
                if (channelIds.length > 0) {
                    await supabase
                        .from('channel_followers')
                        .delete()
                        .in('channel_id', channelIds)
                        .eq('user_id', user.id);
                }

                // Leave Community Chats
                const { data: communityChats } = await supabase
                    .from('community_chats')
                    .select('id')
                    .eq('community_id', community.id);

                if (communityChats && communityChats.length > 0) {
                    const chatIds = communityChats.map(c => c.id);
                    await supabase
                        .from('community_chat_members')
                        .delete()
                        .in('chat_id', chatIds)
                        .eq('user_id', user.id);

                    await supabase
                        .from('community_chat_read_status')
                        .delete()
                        .in('chat_id', chatIds)
                        .eq('user_id', user.id);
                }

                setIsJoined(false);
                setMemberSince(null);

                // Optimistic Update: Community Count
                const newFollowersCount = Math.max(0, (community.followers_count || 0) - 1);
                setCommunity(prev => prev ? { ...prev, followers_count: newFollowersCount } : null);
                
                // Optimistic Update: Channels Count
                setChannels(prev => prev.map(c => ({
                    ...c,
                    isJoined: false,
                    followers_count: c.isJoined ? Math.max(0, c.followers_count - 1) : c.followers_count
                })));

                if (onCommunityUpdate) onCommunityUpdate({ id: community.id, followers_count: newFollowersCount, members_count: newFollowersCount });

                toast({
                    title: 'Community Left',
                    description: `You have left ${community.name}.`
                });

            } else {
                // Join Community
                const { error: joinError } = await supabase
                    .from('community_followers')
                    .insert({
                        community_id: community.id,
                        user_id: user.id
                    });

                if (joinError) throw joinError;

                // Join All Active Channels (Default/Public)
                const validChannels = channels.filter(c => c.is_default || !c.is_private);
                const validChannelIds = new Set(validChannels.map(c => c.id));

                if (validChannels.length > 0) {
                    const channelInserts = validChannels.map(c => ({
                        channel_id: c.id,
                        user_id: user.id
                    }));

                    const { error: channelError } = await supabase
                        .from('channel_followers')
                        .insert(channelInserts);

                    if (channelError) console.error('Error joining channels:', channelError);
                }

                // Join Community Chats
                const { data: chatsToJoin } = await supabase
                    .from('community_chats')
                    .select('id')
                    .eq('community_id', community.id)
                    .eq('is_active', true);

                if (chatsToJoin && chatsToJoin.length > 0) {
                    const chatMemRows = chatsToJoin.map(c => ({
                        user_id: user.id,
                        chat_id: c.id,
                        is_active: true
                    }));
                    await supabase.from('community_chat_members').insert(chatMemRows);
                }

                setIsJoined(true);
                setMemberSince(new Date().toISOString());

                // Optimistic Update: Community Count
                const newFollowersCount = (community.followers_count || 0) + 1;
                setCommunity(prev => prev ? { ...prev, followers_count: newFollowersCount } : null);

                // Optimistic Update: Channels Count
                setChannels(prev => prev.map(c => {
                    const shouldJoin = validChannelIds.has(c.id);
                    return {
                        ...c,
                        isJoined: shouldJoin ? true : c.isJoined,
                        followers_count: (shouldJoin && !c.isJoined) ? c.followers_count + 1 : c.followers_count
                    };
                }));

                if (onCommunityUpdate) onCommunityUpdate({ id: community.id, followers_count: newFollowersCount, members_count: newFollowersCount });

                toast({
                    title: 'Community Joined',
                    description: `You have successfully joined ${community.name}!`,
                    variant: 'default'
                });
            }
        } catch (error) {
            console.error('Error joining/leaving community:', error);
            toast({
                title: 'Error',
                description: 'Failed to update membership.',
                variant: 'destructive'
            });
            fetchData();
        } finally {
            setJoining(false);
        }
    };

    const handleJoinChannel = async (channelId: string) => {
        if (!user) return;
        setChannelActionLoading(channelId);
        try {
            const { error } = await supabase.from('channel_followers').insert({
                channel_id: channelId,
                user_id: user.id
            });
            if (error) throw error;

            // Update Local State
            setChannels(prev => prev.map(c =>
                c.id === channelId
                    ? { ...c, isJoined: true, followers_count: c.followers_count + 1 }
                    : c
            ));
        } catch (error) {
            console.error("Error joining channel", error);
            toast({ title: "Error", description: "Failed to join channel.", variant: "destructive" });
        } finally {
            setChannelActionLoading(null);
        }
    };

    const handleLeaveChannel = async (channelId: string) => {
        if (!user) return;
        setChannelActionLoading(channelId);
        try {
            const { error } = await supabase.from('channel_followers')
                .delete()
                .eq('channel_id', channelId)
                .eq('user_id', user.id);

            if (error) throw error;

            // Update Local State
            setChannels(prev => prev.map(c =>
                c.id === channelId
                    ? { ...c, isJoined: false, followers_count: Math.max(0, c.followers_count - 1) }
                    : c
            ));
        } catch (error) {
            console.error("Error leaving channel", error);
            toast({ title: "Error", description: "Failed to leave channel.", variant: "destructive" });
        } finally {
            setChannelActionLoading(null);
        }
    };

    if (loading || !community) {
        return (
            <div className="flex flex-col h-full bg-warm-100 rounded-2xl overflow-hidden shadow-sm border border-warm-300 items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-warm-400 mb-4" />
                <p className="text-warm-500 font-medium">Loading Community Details...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-warm-100 lg:rounded-2xl overflow-hidden relative overflow-y-auto w-full custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>

            {/* Banner Area */}
            <div className="h-44 sm:h-52 relative w-full bg-indigo-50 shrink-0">
                {community.banner_url ? (
                    <Image
                        src={community.banner_url}
                        alt="Banner"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                )}
                
                {/* Header Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-start justify-between bg-gradient-to-b from-black/50 to-transparent z-10">
                    <button
                        onClick={onClose}
                        className="p-2 sm:p-2.5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors lg:hidden"
                    >
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                    <div className="hidden lg:block" />
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors hidden lg:block"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            <div className="px-4 sm:px-6 md:px-8 pt-0 pb-10 flex-1 relative bg-warm-100">
                {/* Logo & Join Button Block */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4 sm:gap-6 relative -top-12 sm:-top-16">
                        <div className="flex items-end gap-4 sm:gap-5 mb-3">
                            <div className="w-20 h-20 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden bg-warm-100 border-4 border-white shadow-md shrink-0">
                                {community.logo_url ? (
                                    <Image
                                        src={community.logo_url}
                                        alt={community.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-warm-200 text-warm-400 font-bold text-3xl sm:text-4xl uppercase">
                                        {community.name.substring(0, 1)}
                                    </div>
                                )}
                            </div>
                            
                            <div className="pb-1">
                                <h1 className="text-xl sm:text-2xl pt-16 font-bold text-warm-700 leading-tight">
                                    {community.name}
                                </h1>
                            </div>
                        </div>

                    {!isJoined && (
                        <button
                            onClick={community.visibility_type === 'private' ? () => toast({ title: 'Request Sent', description: 'Request sent to admin' }) : handleJoinLeave}
                            disabled={joining}
                            className="w-full sm:w-auto mt-4 sm:mt-0 px-6 sm:px-8 py-3 bg-[#3d2f4d] hover:bg-[#2b2136] text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-70 h-12"
                        >
                            {joining ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>{community.visibility_type === 'private' ? 'Request Admin' : 'Join Community'}</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Content Sections */}
                <div className="space-y-10 relative -top-8 sm:-top-12">
                    
                    {/* About */}
                    {community.description && (
                        <section>
                            <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider mb-3">About</h3>
                            <p className="text-warm-500 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {community.description}
                            </p>
                        </section>
                    )}

                    {/* General Info Grid */}
                    <section>
                        <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider mb-4">General Info</h3>
                        <div className="flex flex-col bg-warm-100 rounded-2xl px-5 border border-warm-300 divide-y divide-warm-300 shadow-sm">
                            <div className="flex items-center justify-between py-4">
                                <h4 className="text-xs sm:text-sm text-warm-500 font-medium flex items-center gap-2">
                                    <Users className="w-4 h-4 text-warm-400"/> Members
                                </h4>
                                <p className="font-semibold text-warm-700 text-sm sm:text-base">{formatNumber(community.followers_count)}</p>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <h4 className="text-xs sm:text-sm text-warm-500 font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-warm-400"/> Total Posts
                                </h4>
                                <p className="font-semibold text-warm-700 text-sm sm:text-base">{formatNumber(stats.postsCount)}</p>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <h4 className="text-xs sm:text-sm text-warm-500 font-medium flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-warm-400"/> Type
                                </h4>
                                <p className="font-semibold text-warm-700 text-sm sm:text-base capitalize">{community.visibility_type}</p>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <h4 className="text-xs sm:text-sm text-warm-500 font-medium">
                                    Created
                                </h4>
                                <p className="font-semibold text-warm-700 text-sm sm:text-base">
                                    {new Date(community.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Moderators */}
                    <section>
                        <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider mb-4">Community Admins</h3>
                        <div className="space-y-3">
                            {moderators.length > 0 ? (
                                moderators.map((mod, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-warm-100 border border-warm-300 rounded-xl shadow-sm hover:border-warm-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200 shrink-0">
                                                <Image src={mod.user.avatar_url || 'https://via.placeholder.com/40'} alt={mod.user.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-warm-700 text-sm">{mod.user.name}</span>
                                                    { (mod.tag || 'ADMIN') && (
                                                        <span className="bg-[#3d2f4d]/10 text-warm-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                            {mod.tag || 'ADMIN'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-xs text-warm-500">
                                                    {mod.user.country && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{mod.user.country}</span>}
                                                    {mod.user.country && mod.joined_at && <span className="text-warm-400">•</span>}
                                                    {mod.joined_at && <span>Since {new Date(mod.joined_at).getFullYear()}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-warm-500 text-sm italic">No administrators listed.</p>
                            )}
                        </div>
                    </section>

                    {/* Channels */}
                    <section>
                        <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider mb-4">Channels</h3>
                        <div className="space-y-3">
                            {channels.map((channel) => (
                                <div
                                    key={channel.id}
                                    className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all ${
                                        !isJoined ? 'bg-warm-200 border-warm-300 opacity-70' : 'bg-warm-100 border-warm-300 hover:border-[#3d2f4d]/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-4">
                                        <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center shrink-0">
                                            {channel.is_private ? <Lock className="w-4 h-4 text-warm-500" /> : <Hash className="w-4 h-4 text-warm-500" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-semibold text-warm-700 text-sm sm:text-base truncate">{channel.name}</span>
                                                {channel.is_default && (
                                                    <span className="bg-warm-200 text-warm-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Default</span>
                                                )}
                                                {channel.isJoined && (
                                                    <span className="bg-green-50 text-green-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Joined</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-warm-500 font-medium whitespace-nowrap">
                                                <span>{formatNumber(channel.followers_count)} members</span>
                                                <span className="text-warm-400">•</span>
                                                <span>{formatNumber(channel.postsCount)} posts</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Channel Join/Leave Actions */}
                                    {isJoined && !channel.is_default && (
                                        <button
                                            disabled={channelActionLoading === channel.id}
                                            onClick={() => channel.isJoined ? handleLeaveChannel(channel.id) : handleJoinChannel(channel.id)}
                                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 disabled:opacity-50 ${
                                                channel.isJoined 
                                                ? 'bg-warm-200 text-warm-600 hover:bg-warm-300 hover:text-warm-700 border border-warm-300 shadow-sm' 
                                                : 'bg-[#3d2f4d] text-white hover:bg-[#2a2035] shadow-sm hover:shadow-md'
                                            }`}
                                        >
                                            {channelActionLoading === channel.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : channel.isJoined ? (
                                                "Leave"
                                            ) : (
                                                "Join"
                                            )}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Community Rules */}
                    <section>
                        <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider mb-4">Community Rules</h3>
                        <div className="bg-warm-100 rounded-2xl p-5 sm:p-6 border border-warm-300 shadow-sm space-y-4">
                            {[
                                "Be respectful and kind to all members.",
                                "No hate speech or bullying.",
                                "No spam or self-promotion without permission.",
                                "Respect everyone's privacy.",
                                "Follow the community guidelines."
                            ].map((rule, idx) => (
                                <div key={idx} className="flex items-start gap-4 text-sm sm:text-base text-warm-600">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-warm-200 text-warm-500 text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                                    <p className="leading-relaxed pt-0.5">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Actions */}
                    {isJoined && (
                        <section className="pt-6 mb-8 border-t border-warm-300 flex flex-col items-center">
                            {!isModerator && (
                                <button
                                    onClick={handleJoinLeave}
                                    disabled={joining}
                                    className="flex items-center justify-center gap-2 w-full py-4 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {joining ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <LogOut className="w-5 h-5" />
                                            Leave Community
                                        </>
                                    )}
                                </button>
                            )}
                            {memberSince && (
                                <p className="text-warm-400 text-xs mt-4 flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    Active member since {new Date(memberSince).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </p>
                            )}
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
};
