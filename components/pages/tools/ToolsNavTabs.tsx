'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Flame, Apple, ArrowLeftRight } from 'lucide-react';
import { TOOLS_NAV_TABS } from '@/data/tools';

export default function ToolsNavTabs() {
  const pathname = usePathname();

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'scale':
        return <Scale size={16} className="shrink-0" />;
      case 'flame':
        return <Flame size={16} className="shrink-0" />;
      case 'apple':
        return <Apple size={16} className="shrink-0" />;
      case 'activity':
      default:
        return <ArrowLeftRight size={16} className="shrink-0" />;
    }
  };

  return (
    <div className="sticky top-0 z-20 w-full mt-16 border-b border-[#ded9d5] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar"
          aria-label="Health Tools Navigation"
        >
          {TOOLS_NAV_TABS.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-primary-text hover:text-foreground hover:bg-[#faf9f8]'
                }`}
              >
                {getToolIcon(tab.icon)}
                <span>{tab.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
