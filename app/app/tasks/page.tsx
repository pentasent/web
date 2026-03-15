'use client';

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { UserTask } from '@/types/database';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, CheckSquare, Search, Filter, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay, endOfDay, parseISO } from 'date-fns';

import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { TaskEditPanel } from '@/components/tasks/TaskEditPanel';
import { GlobalLayout } from '@/components/layout/global-layout';
import { TaskListShimmer } from '@/components/shimmer/TaskCardShimmer';

type SortOption = 'latest' | 'oldest' | 'priority';
type FilterPriority = 'all' | 'high' | 'medium' | 'low';

export default function TasksPage() {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    const [selectedTask, setSelectedTask] = useState<UserTask | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
    const [showFilters, setShowFilters] = useState(false);

    const { data: tasksData, isLoading: loadingTasks } = useQuery({
        queryKey: ['tasks', user?.id, sortBy, filterPriority], // simplified deps for query key
        enabled: !authLoading && !!user,
        queryFn: async () => {
            const todayStart = startOfDay(new Date()).toISOString();
            const todayEnd = endOfDay(new Date()).toISOString();

            let query = supabase
                .from('user_tasks')
                .select('*')
                .eq('user_id', user!.id)
                .is('parent_task_id', null) // Main tasks only
                .eq('is_active', true)
                .gte('due_date', todayStart)
                .lte('due_date', todayEnd);

            if (filterPriority !== 'all') {
                query = query.eq('priority', filterPriority);
            }

            if (sortBy === 'latest') {
                query = query.order('created_at', { ascending: false });
            } else if (sortBy === 'oldest') {
                query = query.order('created_at', { ascending: true });
            } else if (sortBy === 'priority') {
                query = query.order('priority', { ascending: false }).order('created_at', { ascending: false });
            }
            
            // Secondary sort for completed items last is done client-side for smoother UI updates

            const { data, error } = await query;
            if (error) throw error;
            return data as UserTask[];
        },
        refetchOnWindowFocus: true
    });

    const tasks = useMemo(() => {
        let result = tasksData || [];
        
        // Client side text search to avoid excessive API calls
        if (searchQuery.trim()) {
             const lowerQuery = searchQuery.trim().toLowerCase();
             result = result.filter(t => t.title.toLowerCase().includes(lowerQuery));
        }

        // Sort completed items to bottom
        return result.sort((a, b) => {
            if (a.is_completed === b.is_completed) return 0;
            return a.is_completed ? 1 : -1;
        });
    }, [tasksData, searchQuery]);

    const handleOpenDetail = (task: UserTask) => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedTask(task);
    };

    const handleCreateNew = () => {
        setSelectedTask(null);
        setIsEditing(false);
        setIsCreating(true);
    };

    const handleEdit = () => {
        setIsCreating(false);
        setIsEditing(true);
    };

    const handleCloseRightPanel = () => {
        setSelectedTask(null);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleSaved = (savedTask: UserTask) => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedTask(savedTask);
    };

    const handleToggleTaskCompletion = async (task: UserTask): Promise<boolean> => {
        if (task.is_completed) return false; // Prevent un-completing via UI requirement

        try {
            // Optimistic update
            queryClient.setQueryData(['tasks', user?.id, sortBy, filterPriority], (old: UserTask[] | undefined) => {
                 if(!old) return old;
                 return old.map(t => t.id === task.id ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t);
            });
            
            // Update local selection if applicable
            if (selectedTask?.id === task.id) {
                setSelectedTask({ ...selectedTask, is_completed: true });
            }

            // DB Update Main Task
            const { error } = await supabase
                .from('user_tasks')
                .update({
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', task.id);

            if (error) throw error;

            // Mark subtasks complete
            await supabase
                .from('user_tasks')
                .update({
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('parent_task_id', task.id);

            return true;
        } catch (err) {
            console.error('Failed to complete task', err);
            // Revert optimism
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
            return false;
        }
    };

    if (authLoading) {
        return (
          <GlobalLayout />
        );
    }

    if (!user) return null;

    const pendingCount = tasks.filter(t => !t.is_completed).length;

    return (
        <div className="min-h-screen pb-20 bg-warm-50">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12 gap-8 items-start max-w-[1400px] mx-auto lg:px-8">
                
                {/* LEFT LIST */}
                <div className="max-w-[700px] mx-auto xl:mx-0 w-full flex flex-col mt-24 xl:mt-8 relative h-full">
                    
                    {/* Header */}
                    <div className="px-4 md:px-0 mb-8 w-full flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-warm-700 mb-1">{format(new Date(), 'EEEE, MMM d')}</h2>
                            <p className="text-warm-500">{pendingCount} items pending today</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="bg-[#3d2f4d] text-white p-3 rounded-full hover:bg-[#2a2035] transition-all shadow-md hover:shadow-lg flex items-center gap-2 px-6"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold hidden sm:inline">New Task</span>
                        </button>
                    </div>

                    {/* Filters & Search Toolbar */}
                    <div className="px-4 md:px-0 mb-6 space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0 flex items-center bg-warm-100 border border-warm-300 rounded-xl px-4 py-2 hover:border-gray-300 focus-within:border-[#3d2f4d] focus-within:ring-1 focus-within:ring-[#3d2f4d] transition-all">
                                <Search className="w-5 h-5 text-warm-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-warm-700 placeholder-gray-400 p-1"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="ml-2 text-warm-400 hover:text-warm-500 outline-none">
                                        <X className="w-4 h-4 shrink-0" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`w-12 h-12 min-w-12 min-h-12 flex items-center justify-center rounded-xl border transition-colors ${showFilters || filterPriority !== 'all' || sortBy !== 'latest' ? 'bg-[#3d2f4d] text-white border-[#3d2f4d]' : 'bg-warm-100 border-warm-300 text-warm-500 hover:bg-warm-200'}`}
                            >
                                <Filter className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Collapsible Filters Panel */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 bg-warm-100 border border-warm-300 rounded-xl shadow-sm space-y-4">
                                        {/* Sort */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-warm-400 uppercase tracking-wider w-14">Sort</span>
                                            <div className="flex gap-2 flex-wrap">
                                                {(['latest', 'oldest', 'priority'] as SortOption[]).map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setSortBy(opt)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${sortBy === opt ? 'bg-[#3d2f4d]/5 border-[#3d2f4d] text-warm-700' : 'bg-warm-100 border-warm-300 text-warm-500 hover:bg-warm-200'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Priority */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-warm-400 uppercase tracking-wider w-14">Priority</span>
                                            <div className="flex gap-2 flex-wrap">
                                                {(['all', 'high', 'medium', 'low'] as FilterPriority[]).map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setFilterPriority(p)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${filterPriority === p ? 'bg-[#3d2f4d]/5 border-[#3d2f4d] text-warm-700' : 'bg-warm-100 border-warm-300 text-warm-500 hover:bg-warm-200'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {loadingTasks && tasks.length === 0 ? (
                        <TaskListShimmer />
                    ) : (
                        <div className="space-y-3 px-4 md:px-0">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onPress={handleOpenDetail}
                                        onToggleCompletion={handleToggleTaskCompletion}
                                        isActive={selectedTask?.id === task.id && !isCreating}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-warm-100 rounded-3xl border border-warm-300 shadow-sm mt-4">
                                    <div className="w-16 h-16 bg-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckSquare className="w-8 h-8 text-warm-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-warm-700 mb-2">
                                        {searchQuery || filterPriority !== 'all' ? 'No matching tasks' : 'All caught up!'}
                                    </h3>
                                    <p className="text-warm-500 mb-6 max-w-sm mx-auto">
                                        {searchQuery || filterPriority !== 'all' 
                                            ? 'Try adjusting your filters or search query.' 
                                            : 'You have no active tasks scheduled for today. Take a break!'}
                                    </p>
                                    {(!searchQuery && filterPriority === 'all') && (
                                        <button
                                            onClick={handleCreateNew}
                                            className="bg-[#3d2f4d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a2035] transition-colors inline-flex items-center gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add New Task
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR (Desktop Overlay) */}
                <div className="lg:relative lg:h-full hidden lg:block mt-8">
                    <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] w-fulll">
                        <AnimatePresence mode="wait">
                            {(selectedTask && !isEditing) && (
                                <motion.div
                                    key={`detail-${selectedTask.id}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-[calc(100vh-8rem)] w-full shadow-2xl rounded-2xl bg-warm-100 border border-warm-300 overflow-hidden"
                                >
                                    <TaskDetailPanel
                                        task={selectedTask}
                                        onClose={handleCloseRightPanel}
                                        onEdit={handleEdit}
                                        onToggleParentCompletion={handleToggleTaskCompletion}
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
                                    className="h-[calc(100vh-8rem)] w-full shadow-2xl rounded-2xl bg-warm-100 border border-warm-300 overflow-hidden"
                                >
                                    <TaskEditPanel
                                        task={isEditing ? selectedTask : null}
                                        onClose={handleCloseRightPanel}
                                        onSaved={handleSaved}
                                    />
                                </motion.div>
                            )}
                            {(!selectedTask && !isEditing && !isCreating) && (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full border-2 border-dashed border-warm-300 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <CheckSquare className="w-12 h-12 text-warm-400 mb-4" />
                                    <h3 className="text-warm-700 font-semibold mb-2">Select a Task</h3>
                                    <p className="text-warm-500 text-sm max-w-[250px]">
                                        Click a task from the list to view its details, manage subtasks, or create a new one.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

             {/* FULLSCREEN OVERLAY (Mobile Detail/Editor) */}
             <AnimatePresence>
                {(selectedTask || isEditing || isCreating) && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                        className="fixed inset-0 z-50 xl:hidden bg-warm-100"
                    >
                        {(selectedTask && !isEditing) && (
                            <TaskDetailPanel
                                task={selectedTask}
                                onClose={handleCloseRightPanel}
                                onEdit={handleEdit}
                                onToggleParentCompletion={handleToggleTaskCompletion}
                            />
                        )}
                        {(isEditing || isCreating) && (
                            <TaskEditPanel
                                task={isEditing ? selectedTask : null}
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
