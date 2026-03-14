'use client';

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { UserJournal } from '@/types/database';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, BookOpen, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { JournalCard } from '@/components/journal/JournalCard';
import { JournalDetailPanel } from '@/components/journal/JournalDetailPanel';
import { JournalEditPanel } from '@/components/journal/JournalEditPanel';
import { GlobalLayout } from '@/components/layout/global-layout';
import { JournalListShimmer } from '@/components/shimmer/JournalCardShimmer';

interface JournalSection {
    title: string;
    data: UserJournal[];
}

export default function JournalPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [selectedJournal, setSelectedJournal] = useState<UserJournal | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const { data: journalsData, isLoading: loadingJournals } = useQuery({
        queryKey: ['journals', user?.id],
        enabled: !authLoading && !!user,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_journals')
                .select('*')
                .eq('user_id', user!.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as UserJournal[];
        },
    });

    const journals = useMemo(() => journalsData || [], [journalsData]);

    const sections = useMemo(() => {
        const grouped = journals.reduce((acc: Record<string, UserJournal[]>, journal) => {
            const date = new Date(journal.created_at);
            const title = format(date, 'MMMM yyyy');
            if (!acc[title]) acc[title] = [];
            acc[title].push(journal);
            return acc;
        }, {});

        return Object.keys(grouped).map(title => ({
            title,
            data: grouped[title],
        }));
    }, [journals]);

    const handleOpenDetail = (journal: UserJournal) => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedJournal(journal);
    };

    const handleCreateNew = () => {
        setSelectedJournal(null);
        setIsEditing(false);
        setIsCreating(true);
    };

    const handleEdit = () => {
        setIsCreating(false);
        setIsEditing(true);
    };

    const handleCloseRightPanel = () => {
        setSelectedJournal(null);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleSaved = (savedJournal: UserJournal) => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedJournal(savedJournal);
    };

    if (authLoading) {
        return (
          <GlobalLayout />
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20 bg-warm-50">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12 gap-8 items-start max-w-[1400px] mx-auto lg:px-8">
                
                {/* LEFT LIST */}
                <div className="max-w-[700px] mx-auto xl:mx-0 w-full flex flex-col mt-24 xl:mt-8 relative">
                    
                    {/* Header */}
                    <div className="px-4 md:px-0 mb-8 w-full flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-warm-700 mb-1">Journal</h2>
                            <p className="text-warm-500">Capture your thoughts and feelings</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="bg-[#3d2f4d] text-white p-3 rounded-full hover:bg-[#2a2035] transition-all shadow-md hover:shadow-lg flex items-center gap-2 px-6"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold hidden sm:inline">New Entry</span>
                        </button>
                    </div>

                    {loadingJournals && journals.length === 0 ? (
                        <JournalListShimmer />
                    ) : (
                        <div className="space-y-10 px-4 md:px-0">
                            {sections.length > 0 ? (
                                sections.map((section) => (
                                    <section key={section.title}>
                                        <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider mb-4 border-b border-warm-300 pb-2">
                                            {section.title}
                                        </h3>
                                        <div className="space-y-3">
                                            {section.data.map((journal) => (
                                                <JournalCard
                                                    key={journal.id}
                                                    journal={journal}
                                                    onPress={handleOpenDetail}
                                                    isActive={selectedJournal?.id === journal.id && !isCreating}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-warm-100 rounded-3xl border border-warm-300 shadow-sm mt-8">
                                    <div className="w-16 h-16 bg-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-warm-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-warm-700 mb-2">No Entries Yet</h3>
                                    <p className="text-warm-500 mb-6 max-w-sm mx-auto">
                                        Start your journaling journey today. Write down your thoughts, track your mood, and reflect on your days.
                                    </p>
                                    <button
                                        onClick={handleCreateNew}
                                        className="bg-[#3d2f4d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a2035] transition-colors inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Write First Entry
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR (Desktop Overlay) */}
                <div className="lg:relative lg:h-full hidden lg:block mt-8">
                    <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] w-full">
                        <AnimatePresence mode="wait">
                            {(selectedJournal && !isEditing) && (
                                <motion.div
                                    key={`detail-${selectedJournal.id}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-[calc(100vh-8rem)] w-full shadow-2xl rounded-2xl overflow-hidden border border-warm-300 bg-warm-100"
                                >
                                    <JournalDetailPanel
                                        journal={selectedJournal}
                                        onClose={handleCloseRightPanel}
                                        onEdit={handleEdit}
                                    />
                                </motion.div>
                            )}
                            {(isEditing || isCreating) && (
                                <motion.div
                                    key="editor"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-[calc(100vh-8rem)] w-full shadow-2xl rounded-2xl overflow-hidden border border-warm-300 bg-warm-100"
                                >
                                    <JournalEditPanel
                                        journal={isEditing ? selectedJournal : null}
                                        onClose={handleCloseRightPanel}
                                        onSaved={handleSaved}
                                    />
                                </motion.div>
                            )}
                            {(!selectedJournal && !isEditing && !isCreating) && (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full border-2 border-dashed border-warm-300 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <BookOpen className="w-12 h-12 text-warm-400 mb-4" />
                                    <h3 className="text-warm-700 font-semibold mb-2">Select an Entry</h3>
                                    <p className="text-warm-500 text-sm max-w-[250px]">
                                        Click a journal entry from the list to view its details, or create a new one.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

             {/* FULLSCREEN OVERLAY (Mobile Detail/Editor) */}
             <AnimatePresence>
                {(selectedJournal || isEditing || isCreating) && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                        className="fixed inset-0 z-50 xl:hidden bg-warm-100"
                    >
                        {(selectedJournal && !isEditing) && (
                            <JournalDetailPanel
                                journal={selectedJournal}
                                onClose={handleCloseRightPanel}
                                onEdit={handleEdit}
                            />
                        )}
                        {(isEditing || isCreating) && (
                            <JournalEditPanel
                                journal={isEditing ? selectedJournal : null}
                                onClose={handleCloseRightPanel}
                                onSaved={handleSaved}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
