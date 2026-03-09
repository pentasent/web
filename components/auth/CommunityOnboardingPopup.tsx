'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Check, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Community } from '@/types/database';
import { useRouter } from 'next/navigation';
import { trackEvent } from "@/lib/analytics/track";

export default function CommunityOnboardingPopup() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCommunities = async () => {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .eq('is_active', true)
                .eq('visibility_type', 'public')
                .order('followers_count', { ascending: false });

            if (data) setCommunities(data);
            setLoading(false);
        };
        fetchCommunities();
    }, []);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const handleJoin = async () => {
        if (selectedIds.length < 3) return;
        if (!user) return;
        setSaving(true);
        try {
            const defaultIds = communities.filter(c => c.is_default).map(c => c.id);
            const allJoinedIds = Array.from(new Set([...selectedIds, ...defaultIds]));

            // Bulk insert followers
            const followerRows = allJoinedIds.map(id => ({
                user_id: user.id,
                community_id: id,
            }));

            const { error: followError } = await supabase.from('community_followers').insert(followerRows);
            if (followError) throw followError;

            // Fetch all active, public channels for these communities
            const { data: channels } = await supabase
                .from('channels')
                .select('id, community_id')
                .in('community_id', allJoinedIds)
                .eq('is_active', true)
                .eq('is_private', false);

            if (channels && channels.length > 0) {
                const channelMemRows = channels.map(c => ({
                    user_id: user.id,
                    channel_id: c.id,
                }));
                const { error: channelError } = await supabase.from('channel_followers').upsert(channelMemRows, { onConflict: 'channel_id, user_id' });
                if (channelError) console.error("Channel error:", channelError);
            }

            // Fetch and join community default chats
            const { data: chats } = await supabase
                .from('community_chats')
                .select('id, community_id')
                .in('community_id', allJoinedIds)
                .eq('is_active', true);

            if (chats && chats.length > 0) {
                const chatMemRows = chats.map(c => ({
                    user_id: user.id,
                    chat_id: c.id,
                    is_active: true
                }));
                const { error: chatError } = await supabase.from('community_chat_members').insert(chatMemRows);
                if (chatError) console.error("Chat error:", chatError);
            }

            // Create Joined Community Notifications
            const notifications = [
                ...allJoinedIds.map(id => {
                    const comm = communities.find(c => c.id === id);
                    return {
                        user_id: user.id,
                        notification_type: 'community_follow',
                        category: 'info',
                        title: 'Community Joined',
                        message: `You successfully joined ${comm?.name || 'the community'}.`,
                        community_id: id,
                        is_seen: false,
                        is_active: true
                    }
                })
            ];

            const { error: notificationError } = await supabase.from('notifications').insert(notifications);
            if (notificationError) console.error("Notification error:", notificationError);

            // Mark user as onboarded
            const { error: updateError } = await supabase.from('users').update({ is_onboarded: true }).eq('id', user.id);
            if (updateError) throw updateError;

            // Successfully onboarded, refresh user context
            await refreshUser();

            // Track onboarding completion
            trackEvent("onboarding_completed");

            // Redirect based on role
            if (user.role === 'admin') {
                router.push('/app/feed');
            } else {
                router.push('/beta-release');
            }
        } catch (e: any) {
            console.error('Join error:', e);
            toast({
                title: "Error joining communities",
                description: e.message || 'Failed to join communities',
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const requirementMet = selectedIds.length >= 3;
    const items = communities.filter(c => !c.is_default);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 overflow-hidden pt-10 pb-10 no-scrollbar">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl h-full max-h-[90vh] flex flex-col relative bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden"
            >
                {/* Header */}
                <div className="px-8 pt-10 pb-6 text-center border-b border-gray-50 bg-white z-10">
                    <h2 className="text-3xl font-semibold text-[#3d2f4d] mb-2">Find Your Tribes</h2>
                    <p className="text-gray-500">
                        Follow at least 3 communities to customize your feed. <br />
                        <span className="font-medium text-[#3d2f4d]">({selectedIds.length}/3 selected)</span>
                    </p>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-32">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-10 h-10 animate-spin text-[#3d2f4d]" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleSelection(item.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${isSelected
                                            ? 'border-[#3d2f4d] bg-[#3d2f4d]/5 select-none'
                                            : 'border-gray-100 hover:border-gray-200 select-none'
                                            }`}
                                    >
                                        {/* Logo */}
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                            {item.logo_url && (
                                                <Image
                                                    src={item.logo_url}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {item.description || "A community on Pentasent."}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {item.followers_count} members
                                                </span>
                                            </div>
                                        </div>

                                        {/* Checkbox */}
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#3d2f4d] border-[#3d2f4d]' : 'border-gray-300'
                                            }`}>
                                            {isSelected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-white/80 border-t border-gray-100">
                    <button
                        onClick={handleJoin}
                        disabled={!requirementMet || saving}
                        className="w-full h-14 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            requirementMet ? `Join ${selectedIds.length} Communities` : `Pick ${3 - selectedIds.length} more`
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
