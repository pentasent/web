'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, RotateCcw, RotateCw, ChevronDown, Repeat, Heart, Info, X } from 'lucide-react';
import { Beat } from '@/types/database';

interface BeatDetailPanelProps {
    beat: Beat;
    onClose: () => void;
}

export const BeatDetailPanel: React.FC<BeatDetailPanelProps> = ({ beat, onClose }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Reset state when beat changes
        setIsPlaying(false);
        setProgress(0);
        setIsLoaded(false);
        setDuration(beat.duration_seconds || 0);

        if (audioRef.current && beat.audio_url) {
            const audio = audioRef.current;
            audio.pause();
            audio.src = beat.audio_url;
            audio.load();

            return () => {
                audio.pause(); // Cleanup on unmount or change
            };
        }
    }, [beat]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            // Ensure duration is accurate if database is missing it
            if (!duration && audioRef.current.duration) {
                setDuration(audioRef.current.duration);
            }
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setProgress(value);
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
        }
    };

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
        }
    };

    const toggleLoop = () => {
        setIsLooping(!isLooping);
        if (audioRef.current) {
            audioRef.current.loop = !isLooping;
        }
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-[#FFFBF7] rounded-2xl overflow-hidden relative">
            <audio
                ref={audioRef}
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => {
                    setIsLoaded(true);
                    setDuration(e.currentTarget.duration);
                }}
                onEnded={() => !isLooping && setIsPlaying(false)}
            />

            {/* Background Blur Image */}
            <div className="absolute inset-0 z-0">
                {beat.banner_url && (
                    <Image
                        src={beat.banner_url}
                        alt="Background"
                        fill
                        className="object-cover opacity-30 blur-3xl pointer-events-none"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFBF7]/80 to-[#FFFBF7]" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors md:hidden"
                    >
                        <ChevronDown className="w-6 h-6 text-gray-800" />
                    </button>
                    <div className="hidden md:block w-10" /> {/* Spacer */}

                    <span className="font-semibold text-gray-800 tracking-wide">Now Playing</span>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors hidden md:block" // Desktop close
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="md:hidden w-10" /> {/* Mobile Spacer */}
                </div>

                {/* Cover Art */}
                <div className="w-full aspect-square relative rounded-3xl overflow-hidden shadow-xl mb-10 mx-auto max-w-sm">
                    {beat.banner_url ? (
                        <Image
                            src={beat.banner_url}
                            alt={beat.title || 'Cover'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>

                {/* Track Info */}
                <div className="flex items-start justify-between mb-8 max-w-sm mx-auto w-full">
                    <div className="flex-1 pr-4 min-w-0">
                        <h2 className="text-2xl font-bold text-gray-900 truncate mb-1">{beat.title}</h2>
                        <p className="text-[#3d2f4d]/80 font-medium truncate">
                            {beat.beat_tags?.name || 'Unknown Genre'}
                        </p>
                    </div>
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors shrink-0">
                        <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-10 max-w-sm mx-auto w-full">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3d2f4d]"
                    />
                    <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
                        <span className="tabular-nums">{formatTime(progress)}</span>
                        <span className="tabular-nums">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between max-w-xs mx-auto w-full mt-auto">
                    <button onClick={toggleLoop} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <Repeat className={`w-5 h-5 ${isLooping ? 'text-[#3d2f4d]' : 'text-gray-400'}`} />
                    </button>

                    <button onClick={skipBackward} className="p-3 hover:bg-black/5 rounded-full transition-colors">
                        <RotateCcw className="w-6 h-6 text-gray-800" />
                    </button>

                    <button
                        onClick={togglePlayPause}
                        disabled={!isLoaded}
                        className="w-16 h-16 rounded-full bg-[#3d2f4d] flex items-center justify-center shadow-lg hover:scale-105 transition-all text-white disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {!isLoaded ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="w-7 h-7" fill="currentColor" />
                        ) : (
                            <Play className="w-7 h-7 ml-1" fill="currentColor" />
                        )}
                    </button>

                    <button onClick={skipForward} className="p-3 hover:bg-black/5 rounded-full transition-colors">
                        <RotateCw className="w-6 h-6 text-gray-800" />
                    </button>

                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <Info className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};
