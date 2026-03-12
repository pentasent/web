import React, { useState } from 'react';
import { UserJournal } from '@/types/database';
import { format } from 'date-fns';
import { X, Edit2, Trash2, Calendar, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface JournalDetailPanelProps {
    journal: UserJournal;
    onClose: () => void;
    onEdit: () => void;
}

export function JournalDetailPanel({ journal, onClose, onEdit }: JournalDetailPanelProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const date = new Date(journal.created_at);
    const formattedDate = format(date, 'MMMM do, yyyy');
    const formattedTime = format(date, 'h:mm a');

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this journal entry?')) return;
        
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('user_journals')
                .update({ is_active: false })
                .eq('id', journal.id)
                .eq('user_id', user?.id!);

            if (error) throw error;

            toast({
                title: "Journal Deleted",
                description: "Your journal entry has been removed.",
            });

            queryClient.invalidateQueries({ queryKey: ['journals', user?.id] });
            onClose();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to delete journal",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-warm-100">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-warm-300">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-warm-200 rounded-full transition-colors xl:hidden"
                    >
                        <X className="w-5 h-5 text-warm-500" />
                    </button>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-warm-700 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                        <span className="text-xs text-warm-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formattedTime}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-warm-200 rounded-full transition-colors group"
                        title="Edit Journal"
                    >
                        <Edit2 className="w-5 h-5 text-warm-400 group-hover:text-[#3d2f4d]" />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                        title="Delete Journal"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5 text-warm-400 group-hover:text-red-500" />
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-warm-200 rounded-full transition-colors hidden xl:flex"
                    >
                        <X className="w-5 h-5 text-warm-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex justify-between items-start gap-4">
                        <h1 className="text-3xl font-bold text-warm-700 leading-tight">
                            {journal.title || 'Untitled Entry'}
                        </h1>
                        {journal.mood_emoji && (
                            <div className="text-4xl bg-warm-200 p-3 rounded-2xl border border-warm-300">
                                {journal.mood_emoji}
                            </div>
                        )}
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-warm-700 whitespace-pre-wrap">
                        {journal.content}
                    </div>
                    
                    {journal.updated_at && journal.updated_at !== journal.created_at && (
                        <div className="text-sm text-warm-400 italic pt-8 border-t border-warm-300">
                            Edited {format(new Date(journal.updated_at), 'MMM d, yyyy h:mm a')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
