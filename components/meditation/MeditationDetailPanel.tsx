'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Clock, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meditation } from '@/types/database';

interface MeditationDetailPanelProps {
    meditation: Meditation;
    onClose: () => void;
    onPlayEvent: () => void;
}

const BREATH_DURATION = 4000; // 4 seconds

const TIMERS = [
    { label: '10m', value: 10 * 60 },
    { label: '30m', value: 30 * 60 },
    { label: '1h', value: 60 * 60 },
];

export const MeditationDetailPanel: React.FC<MeditationDetailPanelProps> = ({ meditation, onClose, onPlayEvent }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [breathText, setBreathText] = useState("Paused");

    // Timer State
    const [timerValue, setTimerValue] = useState<number>(TIMERS[0].value);
    const [timeLeft, setTimeLeft] = useState<number>(TIMERS[0].value);

    // Stop playback if timer hits 0
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    const handleTimerSelect = (val: number) => {
        setTimerValue(val);
        setTimeLeft(val);
    };

    // Breath text loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            setBreathText("Inhale");
            interval = setInterval(() => {
                setBreathText(prev => prev === "Inhale" ? "Exhale" : "Inhale");
            }, BREATH_DURATION);
        } else {
            setBreathText("Paused");
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Audio setup
    useEffect(() => {
        setIsPlaying(false);
        setIsLoaded(false);
        setBreathText("Paused");
        setTimeLeft(timerValue);

        if (audioRef.current && meditation.audio_url) {
            const audio = audioRef.current;
            audio.pause();
            audio.src = meditation.audio_url;
            audio.loop = true;
            audio.load();

            return () => {
                audio.pause();
            };
        }
    }, [meditation, timerValue]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        if (audioRef.current && isLoaded) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isLoaded]);

    const togglePlayPause = () => {
        if (!isPlaying) {
            onPlayEvent();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-[#1A1A24] lg:rounded-2xl overflow-hidden relative text-white">
            <audio
                ref={audioRef}
                onLoadedMetadata={() => setIsLoaded(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0">
                {meditation.banner_url ? (
                    <Image
                        src={meditation.banner_url}
                        alt="Background"
                        fill
                        className="object-cover opacity-30"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1A1A24]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#101018]" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden"
                    >
                        <ChevronDown className="w-6 h-6 text-white" />
                    </button>
                    <div className="hidden md:block w-10" />

                    <span className="font-semibold text-white/90 tracking-wide">Meditation</span>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block" // Desktop close
                    >
                        <X className="w-5 h-5 text-white/70" />
                    </button>
                    <div className="md:hidden w-10" />
                </div>
                
                <div className="text-center mb-10">
                    <h2 className="text-xl font-bold text-white truncate px-4">{meditation.title}</h2>
                </div>

                {/* Center Animation */}
                <div className="flex-1 flex justify-center items-center relative min-h-[250px] my-4">
                    <div className="relative flex justify-center items-center w-full h-full">
                        {/* Outer Circle */}
                        <motion.div
                            className="absolute rounded-full border border-white/20 bg-white/5"
                            style={{ width: 280, height: 280 }}
                            animate={{
                                scale: isPlaying ? [1, 1.2, 1] : 1,
                                opacity: isPlaying ? [0.6, 0.3, 0.6] : 0.4,
                            }}
                            transition={isPlaying ? {
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            } : {
                                duration: 0.5,
                            }}
                        />
                        {/* Middle Circle */}
                        <motion.div
                            className="absolute rounded-full border border-white/20 bg-white/10"
                            style={{ width: 220, height: 220 }}
                            animate={{
                                scale: isPlaying ? [1, 1.4, 1] : 1,
                                opacity: isPlaying ? [0.8, 0.4, 0.8] : 0.6,
                            }}
                            transition={isPlaying ? {
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            } : {
                                duration: 0.5,
                            }}
                        />
                        {/* Inner Circle */}
                        <motion.div
                            className="absolute rounded-full bg-white/20 backdrop-blur-sm flex justify-center items-center"
                            style={{ width: 160, height: 160 }}
                            animate={{
                                scale: isPlaying ? [1, 1.3, 1] : 1,
                                opacity: isPlaying ? [1, 0.8, 1] : 0.8,
                            }}
                            transition={isPlaying ? {
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            } : {
                                duration: 0.5,
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={breathText}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-white text-xl font-light uppercase tracking-widest"
                                >
                                    {breathText}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-auto pt-6">
                    {/* Timer Selection & Display */}
                    <div className="flex items-center justify-between max-w-sm mx-auto w-full mb-8 px-2">
                        <div className="flex items-center gap-2">
                            <Clock className={`w-5 h-5 ${isPlaying ? 'text-indigo-400' : 'text-white/60'}`} />
                            <span className={`text-2xl font-light tabular-nums ${isPlaying ? 'text-indigo-400' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {TIMERS.map(t => (
                                <button
                                    key={t.label}
                                    onClick={() => handleTimerSelect(t.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                                        timerValue === t.value 
                                        ? 'bg-warm-100 text-black border-white' 
                                        : 'bg-transparent text-white/70 border-white/30 hover:border-white/60'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Play Controls Row */}
                    <div className="flex items-center justify-center gap-10 max-w-xs mx-auto w-full">
                        <button 
                            onClick={() => setIsMuted(!isMuted)} 
                            className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        >
                            {isMuted ? (
                                <VolumeX className="w-6 h-6 text-white/70" />
                            ) : (
                                <Volume2 className="w-6 h-6 text-white/90" />
                            )}
                        </button>

                        <button
                            onClick={togglePlayPause}
                            disabled={!isLoaded}
                            className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all text-black disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {!isLoaded ? (
                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-7 h-7" fill="currentColor" />
                            ) : (
                                <Play className="w-7 h-7 ml-1" fill="currentColor" />
                            )}
                        </button>

                        {/* Placeholder for balance */}
                        <div className="w-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};
