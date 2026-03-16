'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Heart,
    MessageCircle,
    MessageSquare,
    Users,
    AlertTriangle,
    CheckCircle,
    Info,
    CheckCheck,
    Calendar
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalLayout } from '@/components/layout/global-layout';

export default function NotificationPage() {
    const { user, loading: authLoading } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotification();
    const [isUpdating, setIsUpdating] = React.useState(false);

    
    const getIcon = (type: string, category: string) => {
        const size = 20;
        switch (type) {
            case 'post_like':
                return <div className="p-2 bg-pink-50 rounded-full"><Heart size={size} className="text-[#E8B4B8] fill-[#E8B4B8]" /></div>;
            case 'post_comment':
            case 'comment_reply':
                return <div className="p-2 bg-[#A8D5BA]/10 rounded-full"><MessageCircle size={size} className="text-[#8BC4A0]" /></div>;
            case 'chat_message':
                return <div className="p-2 bg-[#3d2f4d]/5 rounded-full"><MessageSquare size={size} className="text-[#3d2f4d]" /></div>;
            case 'community_follow':
                return <div className="p-2 bg-orange-50 rounded-full"><Users size={size} className="text-[#D49499]" /></div>;
            case 'account_warning':
                return <div className="p-2 bg-amber-50 rounded-full"><AlertTriangle size={size} className="text-amber-500" /></div>;
            case 'system_announcement':
                return <div className="p-2 bg-[#3d2f4d]/10 rounded-full"><Bell size={size} className="text-[#3d2f4d]" /></div>;
            default:
                switch (category) {
                    case 'success': return <div className="p-2 bg-[#A8D5BA]/10 rounded-full"><CheckCircle size={size} className="text-[#A8D5BA]" /></div>;
                    case 'warning': return <div className="p-2 bg-amber-50 rounded-full"><AlertTriangle size={size} className="text-amber-500" /></div>;
                    case 'error': return <div className="p-2 bg-red-50 rounded-full"><AlertTriangle size={size} className="text-red-500" /></div>;
                    default: return <div className="p-2 bg-gray-50 rounded-full"><Info size={size} className="text-gray-400" /></div>;
                }
        }
    };

    const handleMarkAllRead = async () => {
        if (isUpdating || unreadCount === 0) return;
        setIsUpdating(true);
        await markAllAsRead();
        setIsUpdating(false);
    };

        if (authLoading) {
            return (
              <GlobalLayout />
            );
        }
    
        if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto pb-20 mt-20 xl:mt-6 lg:mt-4 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-gray-900">Updates</h1>
                  </div>
                  <p className="text-gray-500">Stay updated with your community actions</p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3d2f4d] text-white rounded-full text-sm font-medium hover:bg-[#2d1f3d] transition-all disabled:opacity-50"
                    >
                        <CheckCheck size={16} />
                        {isUpdating ? 'Updating...' : 'Mark all as read'}
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
                {loading || notifications === null ? (
                    <div className="divide-y divide-warm-100">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="p-6 flex gap-4 animate-pulse">
                                <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-2xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="h-4 bg-gray-200 rounded-full w-1/3" />
                                        <div className="h-3 bg-gray-100 rounded-full w-16" />
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                                    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                                    <div className="h-3 bg-gray-100 rounded-full w-24 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-warm-100 shadow-sm">
                            <Bell size={32} className="text-warm-300" />
                        </div>
                        <h3 className="text-lg font-bold text-warm-700 mb-1">No updates yet</h3>
                        <p className="text-warm-400 text-sm">We&apos;ll notify you when something important happens.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-warm-200">
                        <AnimatePresence initial={false}>
                            {notifications.map((notification) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    key = {notification.id}
                                    className={`p-5 flex gap-4 transition-colors cursor-pointer hover:bg-warm-50/50 ${!notification.is_seen ? 'bg-[#3d2f4d]/[0.02]' : ''}`}
                                    onClick={() => !notification.is_seen && markAsRead(notification.id)}
                                >
                                    <div className="shrink-0">{getIcon(notification.notification_type, notification.category)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-0.5">
                                            <h4 className={`text-sm font-semibold truncate ${!notification.is_seen ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </h4>
                                            {!notification.is_seen && (
                                                <div className="w-2 h-2 rounded-full bg-[#3d2f4d] mt-1.5 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                            <Calendar size={12} />
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
