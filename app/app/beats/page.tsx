'use client';

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Beat, BeatTag } from '@/types/database';
import { BeatTagList } from '@/components/beats/BeatTagList';
import { BeatCard } from '@/components/beats/BeatCard';
import { BeatDetailPanel } from '@/components/beats/BeatDetailPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';

type SortOption = 'views' | 'duration';

export default function BeatsPage() {
    const queryClient = useQueryClient();

    // Filters
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('views');

    // Player State
    const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);

    const { data: beatsData, isLoading: loading } = useQuery({
        queryKey: ['beats'],
        queryFn: async () => {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 10000));

            const [tagsData, beatsDataResult] = await Promise.all([
                Promise.race([
                    supabase.from('beat_tags').select('*').eq('is_active', true).order('name'),
                    timeoutPromise
                ]),
                Promise.race([
                    supabase.from('beats').select('*, beat_tags(*)').eq('is_active', true),
                    timeoutPromise
                ])
            ]) as any[];

            if (tagsData.error) throw tagsData.error;
            if (beatsDataResult.error) throw beatsDataResult.error;

            return {
                tags: tagsData.data as BeatTag[] || [],
                beats: beatsDataResult.data as Beat[] || []
            };
        },
        refetchInterval: 60000,
        staleTime: 1000 * 60 * 10, // 10 minutes
        placeholderData: keepPreviousData
    });

    const tags = useMemo(() => beatsData?.tags || [], [beatsData?.tags]);
    const beats = useMemo(() => beatsData?.beats || [], [beatsData?.beats]);

    const filteredBeats = useMemo(() => {
        let result = [...beats];

        // Filter by Tag
        if (selectedTag) {
            result = result.filter(b => b.tag_id === selectedTag);
        }

        // Sort
        if (sortBy === 'views') {
            result.sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
        } else if (sortBy === 'duration') {
            result.sort((a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0));
        }

        return result;
    }, [beats, selectedTag, sortBy]);

    const incrementPlayCount = async (beatId: string, currentCount: number) => {
        // Optimistic UI Update
        queryClient.setQueryData(['beats'], (old: { tags: BeatTag[], beats: Beat[] } | undefined) => {
            if (!old) return old;
            return {
                ...old,
                beats: old.beats.map(b => b.id === beatId ? { ...b, play_count: currentCount + 1 } : b)
            };
        });

        try {
            const { error } = await supabase
                .from('beats')
                .update({ play_count: currentCount + 1 })
                .eq('id', beatId);

            if (error) {
                console.error("Failed to update play_count in database");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePlayBeat = (beat: Beat) => {
        const currentCount = beat.play_count || 0;
        incrementPlayCount(beat.id, currentCount);
        setSelectedBeat({ ...beat, play_count: currentCount + 1 });
    };

    return (
        <div className="">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-20 gap-8 items-start max-w-7xl mx-auto lg:px-16">
                {/* LEFT FEED */}
                <div className="max-w-[640px] mx-auto lg:mx-0 w-full flex flex-col mt-20 xl:mt-6 lg:mt-4">
                    <div className="px-4 md:px-0">
                        <h1 className="xl:text-4xl text-3xl font-bold text-warm-700 mb-2 tracking-tight">Explore Beats</h1>
                        <p className="text-warm-500">Find your perfect rhythm</p>
                    </div>

                    <div className="py-6 px-4 md:px-0 sticky xl:top-0 lg:top-0 top-[70px] z-30 bg-warm-50">
                        <BeatTagList
                            tags={tags}
                            selectedTag={selectedTag}
                            onSelect={setSelectedTag}
                        />
                    </div>

                    {loading && beats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 md:px-0">
                            <Loader2 className="w-8 h-8 animate-spin text-warm-400 mb-4" />
                            <p className="text-warm-500 font-medium">Loading tracks...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 px-4 md:px-0 pb-32 lg:pb-10">
                            {filteredBeats.length === 0 ? (
                                <div className="text-center py-20 bg-white/50 rounded-2xl border border-warm-300 border-dashed">
                                    <p className="text-warm-500 font-medium">No beats found matching this filter.</p>
                                </div>
                            ) : (
                                filteredBeats.map((beat) => (
                                    <BeatCard
                                        key={beat.id}
                                        beat={beat}
                                        onPlay={handlePlayBeat}
                                        isPlaying={selectedBeat?.id === beat.id}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR / MOBILE OVERLAY */}
                <div className="lg:relative lg:h-full lg:mt-8">
                    <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] w-full">
                        <AnimatePresence mode="wait">
                            {selectedBeat ? (
                                <motion.div
                                    key={selectedBeat.id}
                                    initial={{ opacity: 0, y: "100%" }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: "100%" }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                    className="fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto lg:h-[calc(100vh-8rem)] shadow-2xl lg:rounded-2xl bg-warm-50 lg:border lg:border-gray-100"
                                >
                                    <BeatDetailPanel
                                        beat={selectedBeat}
                                        onClose={() => setSelectedBeat(null)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hidden lg:flex h-full border-2 border-dashed border-warm-300 rounded-3xl flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <div className="w-16 h-16 rounded-full bg-warm-200 flex items-center justify-center mb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warm-400">
                                            <path d="M9 18V5l12-2v13"></path>
                                            <circle cx="6" cy="18" r="3"></circle>
                                            <circle cx="18" cy="16" r="3"></circle>
                                        </svg>
                                    </div>
                                    <h3 className="text-warm-700 font-semibold mb-2">No Beat Playing</h3>
                                    <p className="text-warm-500 text-sm">Select a beat from the list to start listening</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
