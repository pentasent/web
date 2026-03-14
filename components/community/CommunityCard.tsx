import React from 'react';
import Image from 'next/image';
import { Users, FileText, Globe, Lock, MapPin } from 'lucide-react';
import { Community } from '@/types/database';
import { SmartImage } from '../ui/SmartImage';

export type ExtendedCommunity = Community & {
    members_count: number;
    posts_count: number;
    is_joined: boolean;
};

interface CommunityCardProps {
    community: ExtendedCommunity;
    onPress: (community: ExtendedCommunity) => void;
    isActive?: boolean;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onPress, isActive }) => {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <button
            onClick={() => onPress(community)}
            className={`w-full text-left bg-warm-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border ${
                isActive ? 'border-[#3d2f4d] shadow-md ring-1 ring-[#3d2f4d]/20' : 'border-warm-300 hover:border-warm-300'
            }`}
        >
            <div className="h-32 sm:h-80 relative w-full bg-indigo-50">
                {community.banner_url ? (
                    <SmartImage
                        src={community.banner_url}
                        alt="Banner"
                        fill
                        className="object-cover"
                        fallbackIconSize={48}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-pink-500/20 to-purple-500/20" />
                )}

                {/* Badges Overlay */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {community.visibility_type === 'private' ? (
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                            <Lock className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] uppercase font-bold tracking-wider">Private</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-[#3d2f4d]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                            <Globe className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] uppercase font-bold tracking-wider">Public</span>
                        </div>
                    )}
                </div>

                {/* Logo Overlapping Banner */}
                <div className="absolute -bottom-6 left-4 sm:left-6 p-1 bg-warm-100 rounded-2xl shadow-sm">
                    <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-warm-200 border border-warm-300">
                        {community.logo_url ? (
                            <SmartImage
                                src={community.logo_url}
                                alt={community.name}
                                fill
                                className="object-cover"
                                fallbackIconSize={20}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-warm-200 text-warm-400 font-bold text-xl uppercase">
                                {community.name.substring(0, 1)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-10 px-4 sm:px-6 pb-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-warm-700 text-lg sm:text-xl truncate leading-tight">
                        {community.name}
                    </h3>
                </div>

                <p className="text-sm text-warm-500 line-clamp-2 leading-relaxed mb-4 min-h-[40px]">
                    {community.description || "No description available."}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-warm-500">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-warm-400" />
                        <span className="font-medium text-warm-500">{formatNumber(community.members_count)}</span> Members
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-warm-400" />
                        <span className="font-medium text-warm-500">{formatNumber(community.posts_count)}</span> Posts
                    </div>
                    
                    {community.country && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-warm-400" />
                                <span>{community.country}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
};
