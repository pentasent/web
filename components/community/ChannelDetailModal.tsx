'use client';

import React from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog';
import { 
    Users, 
    FileText, 
    Globe, 
    Lock, 
    Hash, 
    Calendar,
    CheckCircle2,
    Loader2,
    LogOut,
    UserPlus,
    X,
    Info
} from 'lucide-react';
import { ExtendedChannel } from './CommunityDetailPanel';

interface ChannelDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    channel: ExtendedChannel | null;
    isModerator: boolean;
    onJoin: (channelId: string) => Promise<void>;
    onLeave: (channelId: string) => Promise<void>;
    loading: boolean;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
    isOpen,
    onClose,
    channel,
    isModerator,
    onJoin,
    onLeave,
    loading
}) => {
    if (!channel) return null;

    const creationDate = new Date(channel.created_at).toLocaleDateString(undefined, { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full h-[100dvh] [&>button]:hidden sm:h-auto sm:max-w-[480px] p-0 bg-warm-50 border-none sm:rounded-2xl rounded-none overflow-hidden shadow-2xl flex flex-col">
                {/* Custom Header with Close Button */}
                <div className="relative pt-12 pb-6 px-6 sm:px-8 bg-white border-b border-warm-200">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-warm-700/90 bg-warm-300/50 hover:bg-warm-300 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-warm-100 flex items-center justify-center border border-warm-200 shrink-0 shadow-sm">
                            {channel.is_private ? (
                                <Lock className="w-6 h-6 text-[#3d2f4d]" />
                            ) : (
                                <Hash className="w-6 h-6 text-[#3d2f4d]" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-warm-700 truncate lowercase tracking-tight">
                                    {channel.name}
                                </h2>
                                {channel.isJoined && (
                                    <CheckCircle2 className="w-4 h-4 text-[#3d2f4d]/60" />
                                )}
                            </div>
                            <p className="text-xs font-semibold text-warm-400 uppercase tracking-widest mt-0.5">
                                {channel.is_private ? 'Private Channel' : 'Public Discovery'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:px-8 space-y-8 pb-10">
                    {/* Description Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-warm-400" />
                            <h3 className="text-xs font-bold text-warm-400 uppercase tracking-widest">About</h3>
                        </div>
                        <p className="text-warm-600 text-sm sm:text-base leading-relaxed">
                            {channel.description || "The heart of our community discussions. Join us to share and grow together."}
                        </p>
                    </section>

                    {/* Quick Stats Integrated */}
                    <div className="grid grid-cols-2 gap-px bg-warm-200 border border-warm-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-white p-5">
                            <div className="flex items-center gap-2 text-warm-400 mb-1">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Members</span>
                            </div>
                            <span className="text-lg font-bold text-warm-700">{channel.followers_count.toLocaleString()}</span>
                        </div>
                        <div className="bg-white p-5">
                            <div className="flex items-center gap-2 text-warm-400 mb-1">
                                <FileText className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Posts</span>
                            </div>
                            <span className="text-lg font-bold text-warm-700">{channel.postsCount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Meta Info List */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between py-3 border-b border-warm-200">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-warm-400" />
                                <span className="text-sm font-medium text-warm-500">Created on</span>
                            </div>
                            <span className="text-sm font-semibold text-warm-700">{creationDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-warm-400" />
                                <span className="text-sm font-medium text-warm-500">Access Type</span>
                            </div>
                            <span className="text-sm font-semibold text-warm-700">{channel.is_private ? 'Members Only' : 'Everyone'}</span>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4">
                        {channel.is_default ? (
                            <div className="w-full py-4 text-center rounded-xl bg-warm-100 text-warm-400 text-xs font-bold border border-warm-200 uppercase tracking-widest">
                                Required Channel
                            </div>
                        ) : isModerator && channel.isJoined ? (
                            <div className="w-full py-4 text-center rounded-xl bg-warm-100 text-warm-400 text-xs font-bold border border-warm-200 uppercase tracking-widest">
                                Admin Access
                            </div>
                        ) : channel.is_private && !channel.isJoined ? (
                            <div className="w-full py-4 text-center rounded-xl bg-warm-100 text-warm-400 text-xs font-bold border border-warm-200 uppercase tracking-widest">
                                Request Access
                            </div>
                        ) : (
                            <button
                                onClick={() => channel.isJoined ? onLeave(channel.id) : onJoin(channel.id)}
                                disabled={loading}
                                className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                                    channel.isJoined 
                                    ? 'bg-white text-red-500 hover:bg-red-50 border border-warm-200' 
                                    : 'bg-[#3d2f4d] text-white hover:bg-[#2a2035] shadow-sm'
                                } disabled:opacity-50 text-sm`}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : channel.isJoined ? (
                                    <>
                                        <LogOut className="w-4 h-4" />
                                        <span>Leave Channel</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Join Channel</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </DialogContent>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #EAE1D9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #A39C97;
                }
            `}</style>
        </Dialog>
    );
};
