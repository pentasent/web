'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChatList } from '@/components/chat/ChatList';
import { ChatDetail } from '@/components/chat/ChatDetail';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalLayout } from '@/components/layout/global-layout';

export default function ChatsPage() {
    const { user, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [selectedChatId, setSelectedChatId] = useState<string | null>(searchParams.get('id'));

    useEffect(() => {
        const id = searchParams.get('id');
        setSelectedChatId(id);
    }, [searchParams]);

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        router.push(`${pathname}?id=${chatId}`, { scroll: false });
    };

    const handleBack = () => {
        setSelectedChatId(null);
        router.push(pathname, { scroll: false });
    };

    if (authLoading) {
        return (
            <GlobalLayout />
        );
    }
    
    if (!user) return null;

    return (
        <div className={`fixed inset-0 lg:left-[80px] bg-warm-50 flex overflow-hidden xl:border-l border-warm-300 ${selectedChatId ? 'z-[50] lg:z-0' : 'z-0'}`}>
            {/* Left Sidebar - Chat List */}
            <div className={`w-full lg:w-[380px] h-full shrink-0 ${selectedChatId ? 'hidden lg:block' : 'block'}`}>
                <ChatList 
                    onChatSelect={handleChatSelect} 
                    activeChatId={selectedChatId} 
                />
            </div>

            {/* Main Content - Chat Detail */}
            <div className={`flex-1 h-full relative ${!selectedChatId ? 'hidden lg:flex' : 'flex'} flex-col items-center justify-center`}>
                <AnimatePresence mode="wait">
                    {selectedChatId ? (
                        <motion.div
                            key={selectedChatId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full h-full"
                        >
                            <ChatDetail 
                                chatId={selectedChatId} 
                                onBack={handleBack}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center p-12"
                        >
                            <div className="w-20 h-20 rounded-[2.5rem] bg-warm-100 border border-warm-200 shadow-sm flex items-center justify-center mb-6">
                                <MessageSquare className="w-10 h-10 text-[#3d2f4d]/20" />
                            </div>
                            <h2 className="text-xl font-bold text-warm-700 mb-2">Select a conversation</h2>
                            <p className="text-warm-400 text-sm max-w-xs">
                                Choose a community from the list to start discussing and growing with others.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
