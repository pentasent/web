'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Activity,
  Smile,
  PhoneCall,
  ShieldAlert,
  UserCheck,
  Calendar,
  ClipboardList,
  FileText,
  Pill,
  Lock,
  CreditCard,
} from 'lucide-react';
import { MY_HEALTH_NAV_TABS } from '@/data/my-health';
import { MyHealthNavTab } from '@/types/my-health';

export default function MyHealthNavTabs() {
  const pathname = usePathname();

  const getTabIcon = (icon: MyHealthNavTab['icon']) => {
    switch (icon) {
      case 'layout-dashboard':
        return <LayoutDashboard size={15} className="shrink-0" />;
      case 'user':
        return <User size={15} className="shrink-0" />;
      case 'activity':
        return <Activity size={15} className="shrink-0" />;
      case 'smile':
        return <Smile size={15} className="shrink-0" />;
      case 'phone-call':
        return <PhoneCall size={15} className="shrink-0" />;
      case 'shield-alert':
        return <ShieldAlert size={15} className="shrink-0" />;
      case 'user-check':
        return <UserCheck size={15} className="shrink-0" />;
      case 'calendar':
        return <Calendar size={15} className="shrink-0" />;
      case 'clipboard-list':
        return <ClipboardList size={15} className="shrink-0" />;
      case 'file-text':
        return <FileText size={15} className="shrink-0" />;
      case 'pill':
        return <Pill size={15} className="shrink-0" />;
      case 'lock':
        return <Lock size={15} className="shrink-0" />;
      case 'credit-card':
        return <CreditCard size={15} className="shrink-0" />;
      default:
        return <Activity size={15} className="shrink-0" />;
    }
  };

  return (
    <div className="sticky top-0 z-20 w-full mt-16 border-b border-[#e8e2dc] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar"
          aria-label="My Health Navigation"
        >
          {MY_HEALTH_NAV_TABS.map((tab) => {
            const isActive =
              tab.href === '/my-health'
                ? pathname === '/my-health'
                : pathname === tab.href || pathname.startsWith(tab.href + '/');

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-primary-text hover:text-foreground hover:bg-[#faf7f4]'
                }`}
              >
                {getTabIcon(tab.icon)}
                <span>{tab.title}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
