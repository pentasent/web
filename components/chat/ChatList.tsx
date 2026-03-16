'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ChatItem } from '@/types/chat';
import { ChatListItem } from './ChatListItem';
import { MessageSquare, Users, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatListProps {
    onChatSelect: (chatId: string) => void;
    activeChatId?: string | null;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatSelect, activeChatId }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUserName = useCallback(async (userId: string) => {
        const { data } = await supabase.from('users').select('name').eq('id', userId).single();
        return data?.name || 'User';
    }, []);

    const fetchChats = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            
            const { data: memberData, error: memberError } = await supabase
                .from('community_chat_members')
                .select('chat_id')
                .eq('user_id', user.id)
                .eq('is_active', true);

            if (memberError) throw memberError;

            if (!memberData || memberData.length === 0) {
                setChats([]);
                return;
            }

            const chatIds = memberData.map(m => m.chat_id);

            const { data: chatData, error: chatError } = await supabase
                .from('community_chats')
                .select(`
                    *,
                    community:communities(*)
                `)
                .in('id', chatIds)
                .eq('is_active', true);

            if (chatError) throw chatError;

            const chatsWithDetails = await Promise.all(chatData.map(async (chat: any) => {
                const { data: msgData } = await supabase
                    .from('community_chat_messages')
                    .select('*, user:users(name)')
                    .eq('chat_id', chat.id)
                    .is('is_deleted', false)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                const { data: readStatus } = await supabase
                    .from('community_chat_read_status')
                    .select('last_read_at')
                    .eq('chat_id', chat.id)
                    .eq('user_id', user.id)
                    .maybeSingle();

                const lastReadTime = readStatus?.last_read_at;

                const { count } = await supabase
                    .from('community_chat_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('chat_id', chat.id)
                    .is('is_deleted', false)
                    .neq('user_id', user.id)
                    .gt('created_at', lastReadTime || '1970-01-01');

                const unreadCount = count || 0;

                return {
                    ...chat,
                    community: chat.community,
                    last_message: msgData ? {
                        message_text: msgData.message_text,
                        created_at: msgData.created_at,
                        user: msgData.user
                    } : null,
                    unread_count: unreadCount
                };
            }));

            setChats(chatsWithDetails.sort((a, b) => {
                const timeA = a.last_message ? new Date(a.last_message.created_at).getTime() : new Date(a.created_at).getTime();
                const timeB = b.last_message ? new Date(b.last_message.created_at).getTime() : new Date(b.created_at).getTime();
                return timeB - timeA;
            }));

        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        if (activeChatId) {
            setChats(prev => prev.map(chat => 
                chat.id === activeChatId ? { ...chat, unread_count: 0 } : chat
            ));
        }
    }, [activeChatId]);

    // Real-time updates
    useEffect(() => {
        if (!user) return;

        const subscription = supabase
            .channel('chat-list-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'community_chat_messages' },
                async (payload) => {
                    const event = payload.eventType;
                    const msg = (payload.new || payload.old) as any;
                    
                    setChats(current => {
                        const idx = current.findIndex(c => c.id === msg.chat_id);
                        if (idx === -1) return current;
                        
                        const updatedChats = [...current];
                        const targetChat = { ...updatedChats[idx] };
                        
                        if (event === 'INSERT' || event === 'UPDATE') {
                            if (msg.is_deleted) {
                                if (targetChat.last_message?.created_at === msg.created_at) {
                                    targetChat.last_message = {
                                        message_text: "Message deleted",
                                        created_at: msg.created_at,
                                        user: targetChat.last_message!.user
                                    };
                                }
                            } else {
                                const lastMsg: NonNullable<ChatItem['last_message']> = {
                                    message_text: msg.message_text || '',
                                    created_at: msg.created_at || new Date().toISOString(),
                                    user: targetChat.last_message?.user
                                };
                                targetChat.last_message = lastMsg;
                                
                                if (event === 'INSERT' && msg.user_id !== user.id && activeChatId !== msg.chat_id) {
                                    targetChat.unread_count = (targetChat.unread_count || 0) + 1;
                                }
                                
                                fetchUserName(msg.user_id).then(name => {
                                    setChats(prev => prev.map(c => 
                                        (c.id === msg.chat_id && c.last_message?.created_at === lastMsg.created_at)
                                        ? { ...c, last_message: { ...c.last_message!, user: { name } } }
                                        : c
                                    ));
                                });
                            }
                        }
                        
                        updatedChats[idx] = targetChat;
                        return updatedChats.sort((a, b) => {
                            const timeA = a.last_message ? new Date(a.last_message.created_at).getTime() : new Date(a.created_at).getTime();
                            const timeB = b.last_message ? new Date(b.last_message.created_at).getTime() : new Date(b.created_at).getTime();
                            return timeB - timeA;
                        });
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, activeChatId, fetchUserName]);

    const filteredChats = chats.filter(chat => 
        chat.community?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-warm-50 border-r border-warm-200">
                <div className="p-6 border-b border-warm-200 bg-warm-50/50">
                    <Skeleton className="h-8 w-32 mb-6" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 flex gap-4 items-center border-b border-warm-100">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-10" />
                                </div>
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full border-r border-warm-300">
            <div className="p-6 border-b border-warm-200 bg-warm-50/50 xl:mt-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-warm-700">Messages</h2>
                    <div className="w-8 h-8 rounded-full bg-[#3d2f4d]/10 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[#3d2f4d]" />
                    </div>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-warm-100/30 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2f4d]/20 transition-all placeholder:text-warm-400"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide snap-x snap-mandatory">
                {filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                        <ChatListItem
                            key={chat.id}
                            chat={chat}
                            isActive={activeChatId === chat.id}
                            onClick={onChatSelect}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-warm-100 flex items-center justify-center mb-4 border border-warm-200">
                            <Users className="w-8 h-8 text-warm-300" />
                        </div>
                        <h3 className="text-warm-700 font-bold mb-1">No chats found</h3>
                        <p className="text-warm-500 text-xs">Join a community to start engaging with others.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
