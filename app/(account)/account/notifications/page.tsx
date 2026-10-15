'use client';

import React, { useState } from 'react';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { Bell, CheckCheck, Sparkles, MessageSquare, Calendar, ShieldCheck } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'community' | 'product' | 'event' | 'security';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'community',
    title: 'Dr. Sarah Jenkins replied in Cardiovascular Wellness',
    message: 'Regarding your inquiry about continuous ambulatory blood pressure monitoring metrics...',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'product',
    title: 'New Product Launched: AI EchoScribe v2',
    message: 'Automated cardiology echocardiogram reporting tool is now available on Pentasent Products.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'event',
    title: 'Upcoming Webinar: Global MedTech Innovation Summit 2026',
    message: 'Your registered session begins tomorrow at 10:00 AM IST. Check access details.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'security',
    title: 'New Login Verified via Email OTP',
    message: 'A successful login was authenticated from your current web browser session.',
    time: '3 days ago',
    read: true,
  },
];

export default function NotificationsPage() {
  const copy = ACCOUNT_HERO_COPY.notifications;

  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'unread') return !item.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'community':
        return <MessageSquare size={16} className="text-primary" />;
      case 'product':
        return <Sparkles size={16} className="text-amber-600" />;
      case 'event':
        return <Calendar size={16} className="text-blue-600" />;
      case 'security':
        return <ShieldCheck size={16} className="text-emerald-600" />;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between pb-5 border-b border-[#ded9d5] flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground">Notifications Feed</h2>
                  <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                    Stay updated with replies, product updates, and ecosystem activity.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3.5 py-1.5 rounded-md text-[12.5px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-primary-text hover:text-foreground hover:bg-[#faf9f8]'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`px-3.5 py-1.5 rounded-md text-[12.5px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    filter === 'unread'
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-primary-text hover:text-foreground hover:bg-[#faf9f8]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12.5px] font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 divide-y divide-[#ded9d5]">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-[14.5px] text-primary-text">
                  No notifications in this filter.
                </div>
              ) : (
                filteredItems.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markItemAsRead(n.id)}
                    className={`py-4 px-3 flex items-start gap-4 transition-colors cursor-pointer rounded-lg ${
                      !n.read ? 'bg-[#faf9f8]' : 'hover:bg-[#faf9f8]/60'
                    }`}
                  >
                    <div className="mt-1 h-8 w-8 rounded-lg bg-[#f4efe9] flex items-center justify-center shrink-0">
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-[14.5px] sm:text-[15px] tracking-tight ${!n.read ? 'font-bold text-foreground' : 'font-semibold text-primary-text'}`}>
                          {n.title}
                        </p>
                        <span className="text-[12px] text-muted-foreground shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[14px] sm:text-[14.5px] text-primary-text mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
