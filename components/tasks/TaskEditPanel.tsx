import React, { useState, useEffect } from 'react';
import { UserTask } from '@/types/database';
import { X, Loader2, Save, Flag, Tag as TagIcon, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const AVAILABLE_TAGS = ['Work', 'Personal', 'Health', 'Diet', 'Learning', 'Shopping', 'Home', 'Finance'];

interface TaskEditPanelProps {
    task?: UserTask | null; // null/undefined for new
    onClose: () => void;
    onSaved: (savedTask: UserTask) => void;
}

export function TaskEditPanel({ task, onClose, onSaved }: TaskEditPanelProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
    const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);
    
    // We use datetime-local format string representation for simplicity in web
    const initialDate = task?.due_date ? new Date(task.due_date) : new Date();
    // Format to YYYY-MM-DDThh:mm for input[type=datetime-local]
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = new Date(initialDate.getTime() - tzoffset).toISOString().slice(0, 16);
    const [dueDateString, setDueDateString] = useState<string>(task ? (task.due_date ? localISOTime : '') : localISOTime);

    // Initial Creation Subtasks (Only used during Create)
    interface SubtaskInput { title: string; description: string; }
    const [subtasks, setSubtasks] = useState<SubtaskInput[]>([]);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newSubtaskDesc, setNewSubtaskDesc] = useState('');
    const [showSubtaskInput, setShowSubtaskInput] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setSelectedTags(task.tags || []);
            
            if (task.due_date) {
                const d = new Date(task.due_date);
                const isoTime = new Date(d.getTime() - tzoffset).toISOString().slice(0, 16);
                setDueDateString(isoTime);
            } else {
                setDueDateString('');
            }
        }
    }, [task, tzoffset]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            if (selectedTags.length >= 3) {
                toast({ title: 'Tag limit reached', description: 'You can select up to 3 tags.' });
                return;
            }
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const handleAddSubtaskDraft = () => {
        if (!newSubtaskTitle.trim()) {
            toast({ variant: 'destructive', title: 'Subtask title required' });
            return;
        }
        setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), description: newSubtaskDesc.trim() }]);
        setNewSubtaskTitle('');
        setNewSubtaskDesc('');
        setShowSubtaskInput(false);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Task title is required.' });
            return;
        }

        setIsSaving(true);
        try {
            const parsedDueDate = dueDateString ? new Date(dueDateString).toISOString() : null;

            const taskData = {
                user_id: user?.id,
                title: title.trim(),
                description: description.trim() || null,
                priority,
                tags: selectedTags,
                due_date: parsedDueDate,
                is_active: true,
                updated_at: new Date().toISOString(),
                // If creating new:
                ...(task ? {} : { is_completed: false, sort_order: 0 })
            };

            let data: UserTask | null = null;
            let error;

            if (task) {
                // Update
                const res = await supabase.from('user_tasks').update(taskData).eq('id', task.id).select().single();
                data = res.data;
                error = res.error;
            } else {
                // Insert Main Task
                const res = await supabase.from('user_tasks').insert(taskData).select().single();
                data = res.data;
                error = res.error;

                // Insert Subtasks if any
                if (data && subtasks.length > 0) {
                    const parentId = data.id; // Type narrowing
                    const subtaskPayloads = subtasks.map((st) => ({
                        user_id: user?.id,
                        parent_task_id: parentId,
                        title: st.title,
                        description: st.description || null,
                        is_completed: false,
                        is_active: true,
                        priority: taskData.priority
                    }));
                    await supabase.from('user_tasks').insert(subtaskPayloads);
                }
            }

            if (error) throw error;

            toast({ title: task ? "Task Updated" : "Task Created" });
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
            if (data) onSaved(data as UserTask);
            
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message || "Failed to save task" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-warm-100">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-warm-300 bg-warm-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 hover:bg-warm-200 rounded-full transition-colors" title="Cancel">
                        <X className="w-5 h-5 text-warm-500" />
                    </button>
                    <h2 className="text-lg font-bold text-warm-700">{task ? 'Edit Task' : 'New Task'}</h2>
                </div>
                
                <button
                    onClick={handleSave}
                    disabled={isSaving || !title.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3d2f4d] text-white rounded-lg hover:bg-[#2a2035] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span className="font-semibold text-sm">Save</span>
                </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    
                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            maxLength={50}
                            className="w-full text-3xl font-bold text-warm-700 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent px-0 pb-2 border-b-2 border-transparent focus:border-warm-300 transition-colors"
                            autoFocus
                        />
                        <div className="text-right text-xs text-warm-400 font-medium mt-1">{title.length}/50</div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Priority */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-warm-400 uppercase tracking-wider block">Priority</label>
                            <div className="flex gap-2">
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl border transition-all ${
                                            priority === p
                                                ? p === 'high' ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
                                                : p === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 shadow-sm' 
                                                : 'bg-green-50 border-green-500 text-green-700 shadow-sm'
                                                : 'bg-warm-100 border-warm-300 text-warm-500 hover:bg-warm-200'
                                        }`}
                                    >
                                        <Flag className={`w-3.5 h-3.5 ${priority === p ? 'currentColor' : 'text-warm-400'}`} />
                                        <span className={`text-sm font-semibold capitalize ${priority === p ? '' : 'text-warm-500'}`}>{p}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-warm-400 uppercase tracking-wider flex justify-between items-center">
                                Due Date & Time
                                {dueDateString && <button onClick={() => setDueDateString('')} className="text-red-400 hover:text-red-600">Clear</button>}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-4 w-4 text-warm-400" />
                                </div>
                                <input
                                    type="datetime-local"
                                    value={dueDateString}
                                    onChange={(e) => setDueDateString(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-warm-300 rounded-xl leading-5 bg-warm-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3d2f4d] focus:border-[#3d2f4d] sm:text-sm transition-colors text-warm-700 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-warm-400 uppercase tracking-wider block">Tags (Max 3)</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all ${
                                            isSelected 
                                                ? 'bg-[#3d2f4d]/5 border-[#3d2f4d] text-warm-700 shadow-sm' 
                                                : 'bg-warm-100 border-warm-300 text-warm-500 hover:border-gray-300'
                                        }`}
                                    >
                                        <TagIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-warm-700' : 'text-warm-400'}`} />
                                        <span className="text-sm font-semibold">{tag}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-warm-400 uppercase tracking-wider block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details about this task..."
                            className="w-full text-base text-warm-700 placeholder-gray-400 border border-warm-300 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#3d2f4d] focus:border-[#3d2f4d] resize-y min-h-[120px] transition-colors leading-relaxed"
                        />
                    </div>

                    {/* Draft Subtasks - Only shown when CREATING new task */}
                    {!task && (
                        <div className="space-y-3 pt-4 border-t border-warm-300">
                             <label className="text-xs font-bold text-warm-400 uppercase tracking-wider block">Initial Subtasks</label>
                             
                             {subtasks.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {subtasks.map((st, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-warm-300 bg-warm-200">
                                            <div>
                                                <p className="font-semibold text-sm text-warm-700">{st.title}</p>
                                                {st.description && <p className="text-xs text-warm-500 mt-0.5">{st.description}</p>}
                                            </div>
                                            <button onClick={() => setSubtasks(s => s.filter((_, idx) => idx !== i))} className="p-1.5 text-warm-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             )}

                             {showSubtaskInput ? (
                                <div className="p-4 rounded-xl border border-[#3d2f4d]/30 bg-[#3d2f4d]/5 shadow-sm">
                                    <input
                                        type="text"
                                        value={newSubtaskTitle}
                                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                        placeholder="Subtask Title"
                                        className="w-full text-sm font-semibold text-warm-700 placeholder-gray-400 border-none outline-none focus:ring-0 px-0 mb-2 bg-transparent"
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        value={newSubtaskDesc}
                                        onChange={(e) => setNewSubtaskDesc(e.target.value)}
                                        placeholder="Description (optional)"
                                        className="w-full text-xs text-warm-500 placeholder-gray-400 border-none outline-none focus:ring-0 px-0 mb-4 bg-transparent"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => setShowSubtaskInput(false)} className="text-xs font-semibold text-warm-500 hover:text-gray-700">Cancel</button>
                                        <button onClick={handleAddSubtaskDraft} disabled={!newSubtaskTitle.trim()} className="text-xs font-bold text-white bg-[#3d2f4d] hover:bg-[#2a2035] px-4 py-1.5 rounded-lg disabled:opacity-50">Add</button>
                                    </div>
                                </div>
                             ) : (
                                <button onClick={() => setShowSubtaskInput(true)} className="flex items-center gap-2 w-full p-4 rounded-xl border-2 border-dashed border-warm-300 text-warm-500 hover:text-warm-700 hover:border-[#3d2f4d]/30 hover:bg-warm-200 transition-all justify-center group">
                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-semibold">Add Subtask</span>
                                </button>
                             )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
