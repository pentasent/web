import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { Meditation } from '@/types/database';

interface MeditationCardProps {
    meditation: Meditation;
    onPlay: (meditation: Meditation) => void;
    isPlaying?: boolean;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({ meditation, onPlay, isPlaying }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <button
            onClick={() => {
                if (!isPlaying) onPlay(meditation);
            }}
            disabled={isPlaying}
            className={`w-full text-left bg-warm-100 border ${isPlaying ? 'border-[#3c2a34] bg-indigo-50/10' : 'border-warm-300'} rounded-2xl p-4 flex items-center gap-4 hover:border-[#F0E8E4] hover:shadow-sm transition-all group relative`}
        >
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-warm-200">
                {meditation.banner_url ? (
                    <Image
                        src={meditation.banner_url}
                        alt={meditation.title || 'Meditation'}
                        fill
                        className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-indigo-100/50 flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-indigo-300" />
                    </div>
                )}

                {/* Overlays */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm">
                            <Play className="w-4 h-4 text-warm-700 ml-0.5" fill="currentColor" />
                        </div>
                    </div>
                )}
                {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-end gap-[2px] h-4">
                            <motion.div className="w-[3px] bg-warm-100 rounded-full" animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                            <motion.div className="w-[3px] bg-warm-100 rounded-full" animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                            <motion.div className="w-[3px] bg-warm-100 rounded-full" animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-warm-700 truncate pr-2">{meditation.title}</h3>
                    <div className="flex items-center gap-1.5 text-warm-400">
                        <Headphones className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatNumber(meditation.play_count || 0)} plays</span>
                    </div>
                </div>

                {meditation.description && (
                    <p className="text-sm text-warm-500 line-clamp-2 my-1.5 leading-snug">
                        {meditation.description}
                    </p>
                )}

                {/* <div className="flex items-center justify-between mt-auto">
                    <div />
                    <div className="flex items-center gap-1.5 text-warm-400">
                        <Headphones className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatNumber(meditation.play_count || 0)} plays</span>
                    </div>
                </div> */}
            </div>
        </button>
    );
};
