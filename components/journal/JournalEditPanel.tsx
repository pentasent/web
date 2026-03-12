import React, { useState, useEffect } from 'react';
import { UserJournal } from '@/types/database';
import { X, Loader2, Save, Smile } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const MOODS = ['😀', '🥰', '😌', '😐', '😔', '😢', '😠'];

interface JournalEditPanelProps {
    journal?: UserJournal | null; // null/undefined for new
    onClose: () => void;
    onSaved: (savedJournal: UserJournal) => void;
}

export function JournalEditPanel({ journal, onClose, onSaved }: JournalEditPanelProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(journal?.title || '');
    const [content, setContent] = useState(journal?.content || '');
    const [moodEmoji, setMoodEmoji] = useState(journal?.mood_emoji || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTitle(journal?.title || '');
        setContent(journal?.content || '');
        setMoodEmoji(journal?.mood_emoji || '');
    }, [journal]);

    const handleSave = async () => {
        if (!content.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Journal content cannot be empty.',
            });
            return;
        }

        setIsSaving(true);
        try {
            const journalData = {
                user_id: user?.id,
                title: title.trim(),
                content: content.trim(),
                mood_emoji: moodEmoji,
                is_active: true,
                updated_at: new Date().toISOString()
            };

            let data, error;

            if (journal) {
                // Update
                const res = await supabase
                    .from('user_journals')
                    .update(journalData)
                    .eq('id', journal.id)
                    .select()
                    .single();
                data = res.data;
                error = res.error;
            } else {
                // Insert
                const res = await supabase
                    .from('user_journals')
                    .insert(journalData)
                    .select()
                    .single();
                data = res.data;
                error = res.error;
            }

            if (error) throw error;

            toast({
                title: journal ? "Journal Updated" : "Journal Created",
                description: "Your journal entry has been saved successfully.",
            });

            queryClient.invalidateQueries({ queryKey: ['journals', user?.id] });
            if (data) onSaved(data as UserJournal);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save journal",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-warm-100">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-warm-300 bg-warm-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-warm-200 rounded-full transition-colors"
                        title="Cancel"
                    >
                        <X className="w-5 h-5 text-warm-500" />
                    </button>
                    <h2 className="text-lg font-bold text-warm-700">
                        {journal ? 'Edit Entry' : 'New Entry'}
                    </h2>
                </div>
                
                <button
                    onClick={handleSave}
                    disabled={isSaving || !content.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3d2f4d] text-white rounded-lg hover:bg-[#2a2035] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span className="font-semibold text-sm">Save</span>
                </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Journal Title (Optional)"
                            className="w-full text-3xl font-bold text-warm-700 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent px-0 pb-4 border-b border-transparent focus:border-warm-300 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-warm-500 flex items-center gap-2">
                            <Smile className="w-4 h-4" /> How are you feeling?
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {MOODS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setMoodEmoji(emoji === moodEmoji ? '' : emoji)}
                                    className={`text-2xl w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                                        emoji === moodEmoji 
                                            ? 'bg-blue-50 border-blue-200 border-2 scale-110 shadow-sm' 
                                            : 'bg-warm-200 border border-transparent hover:bg-warm-200 hover:scale-105'
                                    }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-h-[400px]">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts here..."
                            className="w-full h-full min-h-[400px] text-lg text-warm-700 placeholder-gray-400 border-none outline-none focus:ring-0 bg-transparent resize-none leading-relaxed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
