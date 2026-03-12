import React from 'react';
import { UserJournal } from '@/types/database';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface JournalCardProps {
    journal: UserJournal;
    onPress: (journal: UserJournal) => void;
    isActive?: boolean;
}

export function JournalCard({ journal, onPress, isActive = false }: JournalCardProps) {
    const date = new Date(journal.created_at);
    const day = format(date, 'dd');
    const weekday = format(date, 'EEE');

    return (
        <motion.div
            whileHover={{ scale: 0.995 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPress(journal)}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex items-center gap-4 ${
                isActive 
                    ? 'bg-warm-100 border-[#3d2f4d] shadow-md ring-1 ring-[#3d2f4d]' 
                    : 'bg-warm-100 border-warm-300 hover:border-warm-300 hover:shadow-sm'
            }`}
        >
            <div className="flex flex-col items-center justify-center bg-warm-200 rounded-xl min-w-[60px] h-[60px] border border-warm-300 p-2">
                <span className="text-xl font-bold text-warm-700">{day}</span>
                <span className="text-xs font-semibold text-warm-500 uppercase tracking-wide">{weekday}</span>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-warm-700 truncate">
                        {journal.title || 'Untitled Entry'}
                    </h3>
                    {journal.mood_emoji && (
                        <span className="text-sm">{journal.mood_emoji}</span>
                    )}
                </div>
                <p className="text-sm text-warm-500 line-clamp-2">
                    {journal.content}
                </p>
            </div>
            <div className="ml-2 text-warm-400">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
        </motion.div>
    );
}
