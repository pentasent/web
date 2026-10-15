'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileText, Cookie } from 'lucide-react';
import { LEGAL_NAV_TABS } from '@/data/legal';

export default function LegalNavTabs() {
  const pathname = usePathname();

  const getTabIcon = (href: string) => {
    if (href.includes('privacy')) return <Shield className="h-4 w-4" />;
    if (href.includes('terms')) return <FileText className="h-4 w-4" />;
    return <Cookie className="h-4 w-4" />;
  };

  return (
    <div className="border-b border-border-2/40 sticky top-0 z-20 backdrop-blur-md bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 no-scrollbar" aria-label="Legal Sections">
          {LEGAL_NAV_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-primary-text hover:text-foreground hover:bg-border-background/60 border border-transparent'
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
