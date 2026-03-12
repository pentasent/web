import React from 'react';
import { UserTask } from '@/types/database';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

interface TaskCardProps {
    task: UserTask;
    onPress: (task: UserTask) => void;
    onToggleCompletion: (task: UserTask) => void;
    isActive?: boolean;
}

export function TaskCard({ task, onPress, onToggleCompletion, isActive = false }: TaskCardProps) {
    const isCompleted = task.is_completed;
    const priorityColor = task.priority === 'high' ? 'text-red-600 bg-red-50' : task.priority === 'medium' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50';

    return (
        <motion.div
            whileHover={{ scale: 0.995 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPress(task)}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex items-center gap-4 ${
                isActive 
                    ? 'bg-warm-100 border-[#3d2f4d] shadow-md ring-1 ring-[#3d2f4d]' 
                    : isCompleted 
                        ? 'bg-warm-200 border-warm-300 opacity-60' 
                        : 'bg-warm-100 border-warm-300 hover:border-warm-300 hover:shadow-sm'
            }`}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isCompleted) onToggleCompletion(task);
                }}
                disabled={isCompleted}
                className={`p-2 rounded-full transition-colors ${
                    isCompleted ? 'cursor-default text-warm-700 opacity-50' : 'text-warm-400 hover:text-warm-700 hover:bg-warm-200'
                }`}
            >
                {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                ) : (
                    <Circle className="w-6 h-6" />
                )}
            </button>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className={`text-base font-semibold leading-tight mb-1 truncate ${isCompleted ? 'text-warm-400 line-through' : 'text-warm-700'}`}>
                    {task.title}
                </h3>
                {task.description && (
                    <p className={`text-sm truncate mb-2 ${isCompleted ? 'text-warm-400 line-through' : 'text-warm-500'}`}>
                        {task.description}
                    </p>
                )}
                
                <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${priorityColor}`}>
                        {task.priority}
                    </span>
                    
                    {task.due_date && (
                        <span className="text-xs text-warm-400 font-medium">
                            {format(parseISO(task.due_date), 'p')}
                        </span>
                    )}

                    {task.tags && task.tags.length > 0 && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            {task.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-xs text-warm-400 font-medium">#{tag}</span>
                            ))}
                        </>
                    )}
                </div>
            </div>
            
            <div className="ml-2 text-warm-400">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
        </motion.div>
    );
}
