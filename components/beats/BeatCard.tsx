import React, { useState } from 'react';
import Image from 'next/image';
import { Play, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Beat } from '@/types/database';

interface BeatCardProps {
    beat: Beat;
    onPlay: (beat: Beat) => void;
    isPlaying?: boolean;
}

export const BeatCard: React.FC<BeatCardProps> = ({ beat, onPlay, isPlaying }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <button
            onClick={() => {
                if (!isPlaying) onPlay(beat);
            }}
            disabled={isPlaying}
            className={`w-full text-left bg-white border ${isPlaying ? 'border-[#3c2a34] bg-orange-50/10' : 'border-gray-100'} rounded-2xl p-4 flex items-center gap-4 hover:border-[#F0E8E4] hover:shadow-md transition-all group relative`}
        >
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                {beat.banner_url ? (
                    <Image
                        src={beat.banner_url}
                        alt={beat.title || 'Beat'}
                        fill
                        className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200" />
                )}

                {/* Overlays */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm">
                            <Play className="w-4 h-4 text-[#3d2f4d] ml-0.5" fill="currentColor" />
                        </div>
                    </div>
                )}
                {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-end gap-[2px] h-4">
                            <motion.div className="w-[3px] bg-white rounded-full" animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                            <motion.div className="w-[3px] bg-white rounded-full" animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                            <motion.div className="w-[3px] bg-white rounded-full" animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                        </div>
                    </div>
                )}

                {(beat.duration_seconds ?? 0) > 0 && (
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white">
                        {formatDuration(beat.duration_seconds)}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">{beat.title}</h3>
                </div>

                {beat.short_description && (
                    <p className="text-sm text-gray-500 truncate mb-1.5 leading-snug">
                        {beat.short_description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                    {beat.beat_tags?.name ? (
                        <div className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-medium rounded-full">
                            {beat.beat_tags.name}
                        </div>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-1.5 text-gray-400">
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatNumber(beat.play_count || 0)} plays</span>
                    </div>
                </div>
            </div>
        </button>
    );
};
