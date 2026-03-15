'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types/database';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_seen).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        let channel: any;

        if (user) {
            fetchNotifications();

            // Real-time subscription
            channel = supabase
                .channel(`notifications_user_${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        console.log('Real-time notification update:', payload);
                        fetchNotifications();
                    }
                )
                .subscribe();
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
        }

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [user, fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_seen: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            const { error } = await supabase
                .from('notifications')
                .update({ is_seen: true })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking notification read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, is_seen: true })));
            setUnreadCount(0);

            const { error } = await supabase
                .from('notifications')
                .update({ is_seen: true })
                .eq('user_id', user.id)
                .eq('is_seen', false);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead,
                fetchNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
