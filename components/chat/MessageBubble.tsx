import React, { useState } from 'react';
import { SmartImage } from '../ui/SmartImage';
import { format } from 'date-fns';
import { MessageWithUser } from '@/types/chat';
import { Reply, Check, ExternalLink, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageBubbleProps {
    message: MessageWithUser;
    isMe: boolean;
    onReply?: (message: MessageWithUser) => void;
    onEdit?: (message: MessageWithUser) => void;
    onDelete?: (message: MessageWithUser) => void;
    onScrollToMessage?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
    message, 
    isMe, 
    onReply, 
    onEdit,
    onDelete,
    onScrollToMessage 
}) => {
    const time = format(new Date(message.created_at), 'hh:mm a');

    // As requested, we prioritize the message content in the reply preview
    // and remove the flaky username to ensure a clean UI.
    const replyText = message.parent_message_text || message.parent_message?.message_text || '';

    // Helper to render text with clickable links
    const renderMessageText = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 underline break-all font-medium transition-colors ${
                            isMe ? 'text-white/90 hover:text-white' : 'text-[#3d2f4d] hover:text-[#3d2f4d]/70'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className={`flex w-full mb-4 px-4 sm:px-6 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 group`}>
                {!isMe && (
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-warm-200 shrink-0 mb-1 border border-warm-200">
                        {message.user?.avatar_url ? (
                            <SmartImage
                                src={message.user.avatar_url}
                                alt={message.user.name ?? 'User'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-warm-500 uppercase">
                                {message.user?.name?.substring(0, 1) || 'U'}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col">
                    {!isMe && (
                        <span className="text-[10px] font-bold text-warm-500 ml-1 mb-1 uppercase tracking-wider">
                            {message.user?.name || 'User'}
                        </span>
                    )}

                    <div 
                        className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                            isMe 
                            ? 'bg-[#3d2f4d] text-white rounded-br-none' 
                            : 'bg-warm-100/50 text-warm-700 border border-warm-200 rounded-bl-none'
                        }`}
                    >
                        {/* Reply Preview - Simplified to show just message text as requested */}
                        {message.parent_message_id && (replyText || message.parent_message) && (
                            <button
                                onClick={() => onScrollToMessage?.(message.parent_message_id!)}
                                className={`mb-2 p-2 py-4 rounded-lg text-left block w-full border-l-4 min-w-[200px] transition-all ${
                                    isMe 
                                    ? 'bg-white/10 border-white/35 hover:bg-white/20' 
                                    : 'bg-warm-200/50 border-[#3d2f4d]/30 hover:bg-warm-300/50'
                                }`}
                            >
                                <p className={`text-xs line-clamp-2 italic ${isMe ? 'text-white/70' : 'text-warm-500'}`}>
                                    {replyText}
                                </p>
                            </button>
                        )}

                        <div className="leading-relaxed break-words whitespace-pre-wrap">
                            {renderMessageText(message.message_text)}
                        </div>

                        <div className={`flex items-center gap-1 mt-1 justify-end opacity-60`}>
                            {message.is_edited && (
                                <span className="text-[9px] font-medium mr-1 italic">edited</span>
                            )}
                            <span className="text-[9px] font-medium uppercase">{time}</span>
                            {isMe && <Check className="w-3 h-3" />}
                        </div>

                        {/* Actions */}
                        <div className={`absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 ${
                            isMe ? '-left-12' : '-right-12'
                        }`}>
                            <button
                                onClick={() => onReply?.(message)}
                                className="p-1.5 rounded-full shadow-lg bg-warm-50 border border-warm-200 hover:scale-110 active:scale-95 z-10"
                                title="Reply"
                            >
                                <Reply className="w-3.5 h-3.5 text-[#3d2f4d]" />
                            </button>
                            
                            {isMe && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1.5 rounded-full shadow-lg bg-warm-50 border border-warm-200 hover:scale-110 active:scale-95 z-10">
                                            <MoreVertical className="w-3.5 h-3.5 text-warm-500" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent 
                                        align={isMe ? 'end' : 'start'} 
                                        className="bg-warm-50 border-warm-200"
                                        onCloseAutoFocus={(e) => e.preventDefault()}
                                    >
                                        <DropdownMenuItem 
                                            onClick={() => onEdit?.(message)}
                                            className="text-xs text-warm-700 focus:bg-warm-100 cursor-pointer"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => onDelete?.(message)}
                                            className="text-xs text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
