'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MessageWithUser } from '@/types/chat';
import { CommunityChat } from '@/types/database';
import { MessageBubble } from './MessageBubble';
import { 
    Send, 
    X, 
    Reply, 
    MoreHorizontal, 
    ChevronLeft,
    Users,
    MessageSquare,
    Edit2,
    ChevronsRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SmartImage } from '../ui/SmartImage';
import { toast } from 'sonner';

interface ChatDetailProps {
    chatId: string;
    onBack?: () => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({ chatId, onBack }) => {
    const { user } = useAuth();
    const [chat, setChat] = useState<CommunityChat & { community?: any } | null>(null);
    const [messages, setMessages] = useState<MessageWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState<MessageWithUser | null>(null);
    const [editingMessage, setEditingMessage] = useState<MessageWithUser | null>(null);
    const [deletingMessage, setDeletingMessage] = useState<MessageWithUser | null>(null);
    const [memberCount, setMemberCount] = useState<number | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    const fetchChatInfo = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('community_chats')
                .select('*, community:communities(*)')
                .eq('id', chatId)
                .single();

            if (error) throw error;
            setChat(data);

            const { count } = await supabase
                .from('community_chat_members')
                .select('*', { count: 'exact', head: true })
                .eq('chat_id', chatId)
                .eq('is_active', true);
            
            setMemberCount(count || 0);
        } catch (error) {
            console.error('Error fetching chat info:', error);
        }
    }, [chatId]);

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('community_chat_messages')
                .select(`
                    *,
                    user:users(*),
                    parent_message:community_chat_messages!parent_message_id(
                        *,
                        user:users(*)
                    )
                `)
                .eq('chat_id', chatId)
                .is('is_deleted', false)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [chatId, scrollToBottom]);

    const updateReadStatus = useCallback(async () => {
        if (!user) return;
        try {
            const now = new Date().toISOString();
            const { data: existing } = await supabase
                .from('community_chat_read_status')
                .select('id')
                .eq('chat_id', chatId)
                .eq('user_id', user.id)
                .maybeSingle();

            if (existing) {
                await supabase
                    .from('community_chat_read_status')
                    .update({ last_read_at: now, updated_at: now })
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('community_chat_read_status')
                    .insert({ 
                        chat_id: chatId, 
                        user_id: user.id, 
                        last_read_at: now, 
                        updated_at: now 
                    });
            }
        } catch (error) {
            console.error('Error updating read status:', error);
        }
    }, [chatId, user]);

    useEffect(() => {
        if (!chatId) return;
        fetchChatInfo();
        fetchMessages();
        updateReadStatus();

        const channel = supabase
            .channel(`chat:${chatId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'community_chat_messages', filter: `chat_id=eq.${chatId}` },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newMsg = payload.new;
                        if (newMsg.user_id === user?.id) return;

                        const { data: userData } = await supabase.from('users').select('*').eq('id', newMsg.user_id).single();
                        let parentMsg = null;
                        if (newMsg.parent_message_id) {
                            const { data } = await supabase
                                .from('community_chat_messages')
                                .select('id, message_text, user:users(*)')
                                .eq('id', newMsg.parent_message_id)
                                .single();
                            parentMsg = data;
                        }


                        const messageWithUser: MessageWithUser = {
                            ...(newMsg as any),
                            user: userData,
                            parent_message: parentMsg,
                            parent_message_text: newMsg.parent_message_text
                        };

                        setMessages(prev => {
                            if (prev.some(m => m.id === messageWithUser.id)) return prev;
                            const newList = [...prev, messageWithUser];
                            return newList.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                        });
                        setTimeout(() => scrollToBottom(), 100);
                    } else if (payload.eventType === 'UPDATE') {
                        if (payload.new.is_deleted) {
                            setMessages(prev => prev.filter(m => m.id !== payload.new.id));
                        } else {
                            setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
                        }
                    } else if (payload.eventType === 'DELETE') {
                        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            updateReadStatus();
        };
    }, [chatId, fetchChatInfo, fetchMessages, updateReadStatus, user?.id, scrollToBottom]);

    useEffect(() => {
        if (replyingTo || editingMessage) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 150); // Increased delay to ensure component is ready
            return () => clearTimeout(timer);
        }
    }, [replyingTo, editingMessage]);

    const handleSend = async () => {
        if (!inputText.trim() || !user) return;

        if (editingMessage) {
            const originalText = editingMessage.message_text;
            const newText = inputText;
            
            setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, message_text: newText, is_edited: true } : m));
            setEditingMessage(null);
            setInputText('');
            if (inputRef.current) inputRef.current.style.height = '44px';

            try {
                const { error } = await supabase
                    .from('community_chat_messages')
                    .update({ 
                        message_text: newText, 
                        is_edited: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingMessage.id);

                if (error) throw error;
            } catch (error) {
                console.error('Error updating message:', error);
                setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, message_text: originalText, is_edited: m.is_edited } : m));
                toast.error('Failed to update message');
            }
            return;
        }

        const text = inputText;
        const parentId = replyingTo?.id || null;
        
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: MessageWithUser = {
            id: tempId as any,
            chat_id: chatId,
            user_id: user.id,
            message_text: text,
            parent_message_id: parentId,
            parent_message_text: replyingTo?.message_text || null,
            parent_message: replyingTo ? {
                ...replyingTo,
                user: { name: replyingTo.user?.name || 'User' } as any
            } : undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_edited: false,
            is_deleted: false,
            user: user as any,
            isSending: true
        };

        setMessages(prev => [...prev.filter(m => m.id !== tempId), optimisticMsg]);
        setInputText('');
        setReplyingTo(null);
        if (inputRef.current) inputRef.current.style.height = '44px';
        setTimeout(() => scrollToBottom(), 50);

        try {
            const { data, error } = await supabase
                .from('community_chat_messages')
                .insert({
                    chat_id: chatId,
                    user_id: user.id,
                    message_text: text,
                    parent_message_id: parentId,
                    parent_message_text: replyingTo?.message_text || null
                })
                .select('*')
                .single();

            if (error) throw error;

            setMessages(prev => prev.map(m => m.id === (tempId as any) ? { ...(data as any), user: user as any, parent_message: optimisticMsg.parent_message } : m));
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(m => m.id !== (tempId as any)));
        }
    };

    const handleDelete = (msg: MessageWithUser) => {
        setDeletingMessage(msg);
    };

    const confirmDelete = async () => {
        if (!deletingMessage) return;
        const msgId = deletingMessage.id;
        
        setMessages(prev => prev.filter(m => m.id !== msgId));
        setDeletingMessage(null);

        try {
            const { error } = await supabase
                .from('community_chat_messages')
                .update({ is_deleted: true })
                .eq('id', msgId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
            fetchMessages();
        }
    };

    const handleEditStart = (msg: MessageWithUser) => {
        setReplyingTo(null);
        setEditingMessage(msg);
        setInputText(msg.message_text);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.style.height = 'auto';
                inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        if (e.key === 'Escape') {
            setReplyingTo(null);
            setEditingMessage(null);
            setInputText('');
            if (inputRef.current) inputRef.current.style.height = '44px';
        }
    };

    const scrollToMessage = (messageId: string) => {
        const element = document.getElementById(`msg-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('animate-pulse-plum');
            setTimeout(() => element.classList.remove('animate-pulse-plum'), 2000);
        }
    };

    if (loading && !chat) {
        return (
            <div className="flex flex-col h-full bg-warm-50">
                <div className="h-16 border-b border-warm-200 bg-warm-50 flex items-center px-6 gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="flex-1 p-6 space-y-6">
                    <Skeleton className="h-12 w-2/3 rounded-2xl" />
                    <Skeleton className="h-12 w-1/2 rounded-2xl ml-auto" />
                    <Skeleton className="h-20 w-3/4 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-warm-50 overflow-hidden xl:mt-3">
            <div className="h-16 shrink-0 border-b border-warm-200 bg-warm-50 flex items-center justify-between px-4 sm:px-6 z-10">
                <div className="flex items-center gap-3">
                    {/* {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 hover:bg-warm-100 rounded-full transition-colors lg:hidden">
                            <ChevronLeft className="w-5 h-5 text-warm-500" />
                        </button>
                    )} */}
                    <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-sm border border-warm-200 bg-warm-100">
                        {chat?.community?.logo_url ? (
                            <SmartImage src={chat.community.logo_url} fill alt="Logo" className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-warm-400 font-bold">
                                {chat?.community?.name?.substring(0,1).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-warm-700 truncate tracking-tight">{chat?.community?.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-warm-400" />
                            <span className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">
                                {memberCount !== null ? `${memberCount.toLocaleString()} Members` : '...'}
                            </span>
                        </div>
                    </div>
                </div>
                {onBack && (
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors lg:hidden">
                        {/* <ChevronLeft className="w-5 h-5 text-warm-500" /> */}
                        <ChevronsRight className="w-5 h-5 text-warm-500" />
                    </button>
                )}
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto pt-6 pb-2 chat-scrollbar scroll-smooth"
            >
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} id={`msg-${msg.id}`}>
                            <MessageBubble
                                message={msg}
                                isMe={msg.user_id === user?.id}
                                onReply={setReplyingTo}
                                onEdit={handleEditStart}
                                onDelete={handleDelete}
                                onScrollToMessage={scrollToMessage}
                            />
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-50">
                        <div className="bg-warm-100 p-6 rounded-full mb-4 shadow-sm border border-warm-200">
                            <MessageSquare className="w-8 h-8 text-[#3d2f4d]" />
                        </div>
                        <p className="text-warm-500 font-medium">No messages yet.</p>
                        <p className="text-xs text-warm-400">Be the first to say hello!</p>
                    </div>
                )}
            </div>

            <div className="p-4 sm:p-6 bg-warm-50 border-t border-warm-200">
                {(replyingTo || editingMessage) && (
                    <div className="mb-3 px-4 py-2 bg-warm-100 border-l-4 border-[#3d2f4d] rounded-r-xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
                        <div className="min-w-0 flex items-center gap-2">
                            {editingMessage ? <Edit2 className="w-3 h-3 text-[#3d2f4d]" /> : <Reply className="w-3 h-3 text-[#3d2f4d]" />}
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-[#3d2f4d] uppercase truncate">
                                    {editingMessage ? 'Editing message' : `Replying to ${replyingTo?.user?.name}`}
                                </p>
                                <p className="text-xs text-warm-500 truncate italic">
                                    {editingMessage ? editingMessage.message_text : replyingTo?.message_text}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setReplyingTo(null); setEditingMessage(null); setInputText(''); if (inputRef.current) inputRef.current.style.height = '44px'; }} className="p-1 hover:bg-warm-200 rounded-full shrink-0">
                            <X className="w-4 h-4 text-warm-400" />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            e.target.style.height = 'auto';
                            const newHeight = Math.min(e.target.scrollHeight, 128); // max-h-32 (128px)
                            e.target.style.height = newHeight + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={editingMessage ? "Update your message..." : "Share your thoughts..."}
                        rows={1}
                        className="flex-1 bg-warm-100/50 border border-warm-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2f4d]/20 transition-all resize-none max-h-32 scrollbar-hide snap-x snap-mandatory overflow-hidden"
                        style={{ height: '44px' }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className={`h-11 w-11 shrink-0 transition-all rounded-xl shadow-lg flex items-center justify-center disabled:opacity-50 disabled:shadow-none ${
                            inputText.trim() ? 'bg-[#3d2f4d] text-white hover:scale-105 active:scale-95' : 'bg-warm-200 text-warm-400'
                        }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingMessage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3d2f4d]/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-warm-200 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-warm-700 mb-2">Delete Message?</h3>
                        <p className="text-sm text-warm-500 mb-6">This action cannot be undone. The message will be removed from this conversation.</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeletingMessage(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-warm-100 text-warm-600 font-bold text-sm hover:bg-warm-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .animate-pulse-plum {
                    animation: pulse-plum 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-plum {
                    0%, 100% { background-color: transparent; }
                    50% { background-color: rgba(61, 47, 77, 0.1); }
                }
            `}</style>
        </div>
    );
};
