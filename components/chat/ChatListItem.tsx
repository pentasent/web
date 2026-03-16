'use client';

import React from 'react';
import { SmartImage } from '../ui/SmartImage';
import { formatDistanceToNow } from 'date-fns';
import { ChatItem } from '@/types/chat';

interface ChatListItemProps {
    chat: ChatItem;
    isActive: boolean;
    onClick: (chatId: string) => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onClick }) => {
    const lastMessageTime = chat.last_message 
        ? formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: true })
        : '';

    return (
        <button
            onClick={() => onClick(chat.id)}
            className={`w-full flex items-center gap-4 p-4 transition-all duration-200 border-b border-warm-200 last:border-0 ${
                isActive 
                ? 'bg-[#3d2f4d]/5 border-l-4 border-l-[#3d2f4d]' 
                : 'bg-transparent hover:bg-warm-100/50 border-l-4 border-l-transparent'
            }`}
        >
            <div className="w-12 h-12 relative rounded-2xl overflow-hidden shadow-sm border border-warm-200 bg-warm-200/30 shrink-0">
                {chat.community.logo_url ? (
                    <SmartImage
                        src={chat.community.logo_url}
                        alt={chat.community.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-500 font-bold bg-warm-100">
                        {chat.community.name.substring(0, 1)}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-warm-700 truncate text-sm tracking-tight">{chat.community.name}</h4>
                    <span className="text-[10px] text-warm-400 font-medium whitespace-nowrap ml-2 uppercase tracking-tighter">
                        {lastMessageTime}
                    </span>
                </div>
                
                <p className={`text-xs truncate ${isActive ? 'text-warm-600' : 'text-warm-500'}`}>
                    {chat.last_message ? (
                        <>
                            <span className="font-bold text-warm-400 mr-1">{chat.last_message.user?.name}:</span>
                            {chat.last_message.message_text}
                        </>
                    ) : (
                        <span className="italic text-warm-400">No messages yet</span>
                    )}
                </p>
            </div>

            {chat.unread_count && chat.unread_count > 0 ? (
                <div className="min-w-[20px] h-5 rounded-full bg-[#3d2f4d] flex items-center justify-center px-1.5 shadow-sm shrink-0">
                    <span className="text-white text-[10px] font-bold">
                        {chat.unread_count > 99 ? '99+' : chat.unread_count}
                    </span>
                </div>
            ) : null}
        </button>
    );
};
