'use client';

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Meditation } from '@/types/database';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationDetailPanel } from '@/components/meditation/MeditationDetailPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';

export default function MeditationPage() {
    const queryClient = useQueryClient();

    // Player State
    const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);

    const { data: meditationsData, isLoading: loading } = useQuery({
        queryKey: ['meditations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('meditation')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Meditation[] || [];
        },
        refetchInterval: 60000,
        staleTime: 1000 * 60 * 10,
        placeholderData: keepPreviousData
    });

    const meditations = useMemo(() => meditationsData || [], [meditationsData]);

    const incrementPlayCount = async (meditationId: string, currentCount: number) => {
        // Immediate optimistic UI update that STAYS
        queryClient.setQueryData(['meditations'], (old: Meditation[] | undefined) => {
            if (!old) return old;
            return old.map(m => m.id === meditationId ? { ...m, play_count: currentCount + 1 } : m);
        });

        try {
            // Attempt Database Save using rpc or direct update
            // We pass the new count explicitly to avoid relying on a fetch that might be cached
            const { error: updateError } = await supabase
                .from('meditation')
                .update({ play_count: currentCount + 1 })
                .eq('id', meditationId);

            if (updateError) {
                console.warn("Failed to update play_count in database:", updateError.message);
            }
        } catch (err) {
            console.error('Error increasing play count', err);
        }
    };

    const handlePlayMeditation = (meditation: Meditation) => {
        const currentCount = meditation.play_count || 0;
        
        // Optimistically set the selected meditation with the new count
        setSelectedMeditation({ ...meditation, play_count: currentCount + 1 });

        // Trigger database increment optimistically in the background
        incrementPlayCount(meditation.id, currentCount);
    };

    return (
        <div className="">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-20 gap-8 items-start max-w-7xl mx-auto lg:px-16">
                {/* LEFT FEED */}
                <div className="max-w-[640px] mx-auto lg:mx-0 w-full flex flex-col mt-20 xl:mt-6 lg:mt-4">
                    <div className="px-4 md:px-0 mb-6">
                        <h1 className="xl:text-4xl text-3xl font-bold text-warm-700 mb-2 tracking-tight">Meditation</h1>
                        <p className="text-warm-500">Find peace and mindfulness</p>
                    </div>

                    {loading && meditations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 md:px-0">
                            <Loader2 className="w-8 h-8 animate-spin text-warm-400 mb-4" />
                            <p className="text-warm-500 font-medium">Loading meditations...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 px-4 md:px-0 pb-32 lg:pb-10">
                            {meditations.length === 0 ? (
                                <div className="text-center py-20 bg-white/50 rounded-2xl border border-warm-300 border-dashed">
                                    <p className="text-warm-500 font-medium">No meditations found.</p>
                                </div>
                            ) : (
                                meditations.map((meditation) => (
                                    <MeditationCard
                                        key={meditation.id}
                                        meditation={meditation}
                                        onPlay={handlePlayMeditation}
                                        isPlaying={selectedMeditation?.id === meditation.id}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR / MOBILE OVERLAY */}
                <div className="lg:relative lg:h-full lg:mt-8">
                    <div className="lg:sticky lg:top-10 lg:h-[calc(100vh-4rem)] w-full overflow-hidden">
                        <AnimatePresence>
                            {selectedMeditation ? (
                                <motion.div
                                    key="player"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 40 }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                    className="fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto lg:h-[calc(100vh-4rem)] shadow-2xl lg:rounded-2xl bg-[#1A1A24] lg:border lg:border-white/10"
                                >
                                    <MeditationDetailPanel
                                        meditation={selectedMeditation}
                                        onClose={() => setSelectedMeditation(null)}
                                        onPlayEvent={() => handlePlayMeditation(selectedMeditation)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, transition: { duration: 0 } }}
                                    className="hidden lg:flex h-full border-2 border-dashed border-warm-300 rounded-3xl flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
                                            <path d="M12 16v-4"></path>
                                            <path d="M12 8h.01"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-warm-700 font-semibold mb-2">No Meditation Active</h3>
                                    <p className="text-warm-500 text-sm">Select a track from the list to begin your session</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
