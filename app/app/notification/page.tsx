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
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { Notification } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotification();
    const [isUpdating, setIsUpdating] = useState(false);

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

    return (
        <div className="max-w-4xl mx-auto pb-20 mt-20 xl:mt-6 lg:mt-4 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {/* <Link href="/app/feed" className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ArrowLeft size={20} className="text-gray-600" />
                    </Link> */}
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
            <div className="bg-white rounded-3xl shadow-sm border border-warm-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-[#3d2f4d] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications yet</h3>
                        <p className="text-gray-400">We&apos;ll notify you when something important happens.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-warm-200">
                        <AnimatePresence initial={false}>
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
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
