import React, { useState, useEffect } from 'react';
import { UserTask } from '@/types/database';
import { format, parseISO } from 'date-fns';
import { X, Edit2, Trash2, Calendar, Clock, CheckCircle2, Circle, Flag, Plus, Tag as TagIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface TaskDetailPanelProps {
    task: UserTask;
    onClose: () => void;
    onEdit: () => void;
    onToggleParentCompletion: (task: UserTask) => Promise<boolean>;
}

export function TaskDetailPanel({ task, onClose, onEdit, onToggleParentCompletion }: TaskDetailPanelProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    const [subtasks, setSubtasks] = useState<UserTask[]>([]);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false);
    
    // Add Subtask State
    const [showSubtaskInput, setShowSubtaskInput] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newSubtaskDesc, setNewSubtaskDesc] = useState('');
    const [isSavingSubtask, setIsSavingSubtask] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    const isReadOnly = task.is_completed;

    useEffect(() => {
        if (!task.id) return;
        
        const fetchSubtasks = async () => {
            setLoadingSubtasks(true);
            try {
                const { data, error } = await supabase
                    .from('user_tasks')
                    .select('*')
                    .eq('parent_task_id', task.id)
                    .is('is_active', true)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                setSubtasks(data || []);
            } catch (err) {
                console.error('Failed to load subtasks', err);
            } finally {
                setLoadingSubtasks(false);
            }
        };

        fetchSubtasks();
    }, [task.id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('user_tasks')
                .update({ is_active: false })
                .eq('id', task.id)
                .eq('user_id', user?.id!);

            if (error) throw error;

            toast({ title: "Task Deleted" });
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
            onClose();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete task" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddSubtask = async () => {
        if (isReadOnly) return;
        if (!newSubtaskTitle.trim() || !user) {
            toast({ variant: 'destructive', title: 'Subtask title required' });
            return;
        }

        setIsSavingSubtask(true);
        try {
            const { data, error } = await supabase
                .from('user_tasks')
                .insert([{
                    user_id: user.id,
                    parent_task_id: task.id,
                    title: newSubtaskTitle.trim(),
                    description: newSubtaskDesc.trim() || null,
                    is_completed: false,
                    is_active: true,
                    priority: task.priority // Inherit parent priority temporarily if needed, though usually standard
                }])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setSubtasks(prev => [...prev, data as UserTask]);
                setNewSubtaskTitle('');
                setNewSubtaskDesc('');
                setShowSubtaskInput(false);
            }
        } catch (err) {
            toast({ variant: 'destructive', title: 'Failed to add subtask' });
        } finally {
            setIsSavingSubtask(false);
        }
    };

    const toggleSubtaskCompletion = async (subtask: UserTask) => {
        if (isReadOnly) return;

        try {
            const newStatus = !subtask.is_completed;
            const updates = {
                is_completed: newStatus,
                completed_at: newStatus ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
            };

            const updatedSubtasks = subtasks.map(t => t.id === subtask.id ? { ...t, ...updates } : t);
            setSubtasks(updatedSubtasks);

            const { error } = await supabase
                .from('user_tasks')
                .update(updates)
                .eq('id', subtask.id);

            if (error) throw error;

            if (newStatus && updatedSubtasks.every(st => st.is_completed)) {
                await onToggleParentCompletion(task);
            }
        } catch (err) {
            console.error('Update subtask failed', err);
        }
    };

    const handleDeleteSubtask = async (subtaskId: string) => {
        if (isReadOnly) return;
        if (!confirm('Delete subtask?')) return;
        
        try {
            const { error } = await supabase
                .from('user_tasks')
                .delete()
                .eq('id', subtaskId);

            if (error) throw error;
            setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
        } catch (err) {
             toast({ variant: 'destructive', title: 'Failed to delete' });
        }
    };

    const priorityColor = task.priority === 'high' ? 'text-red-500 bg-red-50 border-red-200' : task.priority === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-green-600 bg-green-50 border-green-200';

    return (
        <div className="h-full flex flex-col bg-warm-100">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-warm-300 sticky top-0 bg-warm-100 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 hover:bg-warm-200 rounded-full transition-colors xl:hidden">
                        <X className="w-5 h-5 text-warm-500" />
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => !isReadOnly && onToggleParentCompletion(task)}
                            disabled={isReadOnly}
                            className={`p-1 rounded-full transition-colors ${
                                isReadOnly ? 'cursor-default text-warm-700 opacity-50' : 'text-warm-400 hover:text-warm-700 hover:bg-warm-200'
                            }`}
                        >
                            {task.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                        <span className="text-sm font-semibold text-warm-700">Task Details</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {!isReadOnly && (
                        <button onClick={onEdit} className="p-2 hover:bg-warm-200 rounded-full transition-colors group" title="Edit Task">
                            <Edit2 className="w-5 h-5 text-warm-400 group-hover:text-[#3d2f4d]" />
                        </button>
                    )}
                    <button onClick={handleDelete} disabled={isDeleting} className="p-2 hover:bg-red-50 rounded-full transition-colors group" title="Delete Task">
                        {isDeleting ? <Loader2 className="w-5 h-5 text-red-500 animate-spin" /> : <Trash2 className="w-5 h-5 text-warm-400 group-hover:text-red-500" />}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-warm-200 rounded-full transition-colors hidden xl:flex">
                        <X className="w-5 h-5 text-warm-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto p-8 ${isReadOnly ? 'opacity-80' : ''}`}>
                <div className="max-w-2xl mx-auto space-y-8">
                    
                    {/* Title & Description */}
                    <div>
                        <h1 className={`text-3xl font-bold text-warm-700 leading-tight mb-4 ${isReadOnly ? 'line-through text-warm-400' : ''}`}>
                            {task.title}
                        </h1>
                        {task.description && (
                            <p className="text-lg text-warm-500 whitespace-pre-wrap leading-relaxed">
                                {task.description}
                            </p>
                        )}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="p-4 rounded-xl border border-warm-300 bg-gray-50/50 flex flex-col gap-1">
                            <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider">Priority</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Flag className={`w-4 h-4 ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                                <span className={`text-sm font-semibold capitalize ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-700' : 'text-green-700'}`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="p-4 rounded-xl border border-warm-300 bg-gray-50/50 flex flex-col gap-1">
                            <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider">Due Date</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-4 h-4 text-warm-500" />
                                <span className="text-sm font-medium text-warm-700">
                                    {task.due_date ? format(parseISO(task.due_date), 'MMM d, yyyy h:mm a') : 'No Date Set'}
                                </span>
                            </div>
                        </div>

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                            <div className="p-4 rounded-xl border border-warm-300 bg-gray-50/50 flex flex-col gap-2 col-span-2 mt-2">
                                <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider">Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {task.tags.map(tag => (
                                        <div key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-warm-100 border border-warm-300 rounded-lg shadow-sm">
                                            <TagIcon className="w-3.5 h-3.5 text-warm-400" />
                                            <span className="text-xs font-medium text-warm-500">{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subtasks Section */}
                    <div className="pt-6 border-t border-warm-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-warm-400 uppercase tracking-wider">Subtasks</h3>
                        </div>

                        {loadingSubtasks ? (
                            <div className="py-4 flex justify-center"><Loader2 className="w-6 h-6 text-warm-400 animate-spin" /></div>
                        ) : (
                            <div className="space-y-3">
                                {subtasks.map(st => (
                                    <div key={st.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${st.is_completed ? 'bg-warm-200 border-warm-300 opacity-60' : 'bg-warm-100 border-warm-300 shadow-sm'}`}>
                                        <button
                                            onClick={() => toggleSubtaskCompletion(st)}
                                            disabled={isReadOnly}
                                            className={`mt-0.5 shrink-0 ${isReadOnly ? 'cursor-default text-warm-700 opacity-50' : 'text-warm-400 hover:text-warm-700'}`}
                                        >
                                            {st.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm ${st.is_completed ? 'text-warm-400 line-through' : 'text-warm-700'}`}>{st.title}</p>
                                            {st.description && <p className={`mt-1 text-xs ${st.is_completed ? 'text-warm-400 line-through' : 'text-warm-500'}`}>{st.description}</p>}
                                        </div>
                                        {!isReadOnly && (
                                            <button onClick={() => handleDeleteSubtask(st.id)} className="p-1.5 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 hover:opacity-100 group-hover/card:opacity-100 transition-all ml-2" title="Remove subtask" style={{ opacity: 1 /* override for touch/demo */ }}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Add Subtask Inline Form */}
                                {!isReadOnly && showSubtaskInput && (
                                    <div className="p-4 rounded-xl border border-warm-300 bg-warm-100 shadow-sm mt-4">
                                        <input
                                            type="text"
                                            value={newSubtaskTitle}
                                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                            placeholder="Subtask Title"
                                            className="w-full text-sm font-semibold text-warm-700 placeholder-gray-400 border-none outline-none focus:ring-0 px-0 mb-2"
                                            autoFocus
                                        />
                                        <input
                                            type="text"
                                            value={newSubtaskDesc}
                                            onChange={(e) => setNewSubtaskDesc(e.target.value)}
                                            placeholder="Description (optional)"
                                            className="w-full text-xs text-warm-500 placeholder-gray-400 border-none outline-none focus:ring-0 px-0 mb-4"
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => setShowSubtaskInput(false)} className="text-xs font-semibold text-warm-500 hover:text-gray-700">Cancel</button>
                                            <button onClick={handleAddSubtask} disabled={isSavingSubtask || !newSubtaskTitle.trim()} className="text-xs font-bold text-warm-700 bg-warm-200 hover:bg-gray-200 px-4 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-2">
                                                {isSavingSubtask && <Loader2 className="w-3 h-3 animate-spin"/>} Add
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!isReadOnly && !showSubtaskInput && (
                                    <button onClick={() => setShowSubtaskInput(true)} className="flex items-center gap-2 w-full p-4 rounded-xl border-2 border-dashed border-warm-300 text-warm-500 hover:text-warm-700 hover:border-[#3d2f4d]/30 hover:bg-warm-200 transition-all justify-center mt-2 group">
                                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-semibold">Add Subtask</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
