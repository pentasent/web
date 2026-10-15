'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Newspaper, LifeBuoy } from 'lucide-react';
import { TRACKER_NAV_TABS } from '@/data/trackers';

export default function TrackerNavTabs() {
  const pathname = usePathname();

  const getTabIcon = (href: string) => {
    if (href.includes('job-status')) return <Briefcase className="h-4 w-4" />;
    if (href.includes('press-status')) return <Newspaper className="h-4 w-4" />;
    return <LifeBuoy className="h-4 w-4" />;
  };

  return (
<div className="sticky top-0 z-20 border-b border-[#e8e4e1] bg-white/95 backdrop-blur-md">
  <div className="mx-auto max-w-5xl">
    <nav
      className="flex justify-start space-x-2 overflow-x-auto no-scrollbar sm:space-x-4 lg:justify-center md:justify-center"
      aria-label="Tracker Sections"
    >
      {TRACKER_NAV_TABS.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href === '/tracker/support-status' &&
            pathname === '/tracker/support-tracker');

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-6 py-3 text-[13.5px] font-semibold transition-all sm:text-[14px] ${
              isActive
                ? 'bg-primary text-white'
                : 'text-primary-text hover:bg-[#faf9f8] hover:text-foreground'
            }`}
          >
            {getTabIcon(tab.href)}
            <span>{tab.title}</span>
          </Link>
        );
      })}
    </nav>
  </div>
</div>
  );
}
