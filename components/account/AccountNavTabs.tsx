'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Bell,
  Settings,
  Heart,
  Package,
  Users,
  Building2,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { ACCOUNT_NAV_TABS } from '@/data/account';
import { AccountNavTab } from '@/types/account';

export default function AccountNavTabs() {
  const pathname = usePathname();

  const getAccountIcon = (icon: AccountNavTab['icon']) => {
    switch (icon) {
      case 'user':
        return <User size={16} className="shrink-0" />;
      case 'settings':
        return <Settings size={16} className="shrink-0" />;
      case 'bell':
        return <Bell size={16} className="shrink-0" />;
      case 'heart':
        return <Heart size={16} className="shrink-0" />;
      case 'package':
        return <Package size={16} className="shrink-0" />;
      case 'users':
        return <Users size={16} className="shrink-0" />;
      case 'building':
        return <Building2 size={16} className="shrink-0" />;
      case 'briefcase':
        return <Briefcase size={16} className="shrink-0" />;
      case 'calendar':
        return <Calendar size={16} className="shrink-0" />;
      default:
        return <User size={16} className="shrink-0" />;
    }
  };

  return (
    <div className="sticky top-0 z-20 w-full mt-16 border-b border-[#ded9d5] bg-white/95 backdrop-blur-md"> 
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar"
          aria-label="Account Navigation"
        >
          {ACCOUNT_NAV_TABS.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-primary-text hover:text-foreground hover:bg-[#faf9f8]'
                }`}
              >
                {getAccountIcon(tab.icon)}
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
