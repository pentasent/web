'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Clock,
  Database,
  Mail,
  MessageSquareHeart,
  ShieldCheck,
} from 'lucide-react';
import { DELETE_ACCOUNT_NAV_SECTIONS } from '@/data/delete-account';

export default function DeleteAccountNavTabs() {
  const [activeId, setActiveId] = useState<string>(DELETE_ACCOUNT_NAV_SECTIONS[0].id);

  useEffect(() => {
    const sections = DELETE_ACCOUNT_NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0.05,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const getTabIcon = (id: string) => {
    switch (id) {
      case 'overview':
        return <AlertCircle className="h-4 w-4" />;
      case 'ecosystem-services':
        return <Building2 className="h-4 w-4" />;
      case 'how-to-request':
        return <Mail className="h-4 w-4" />;
      case 'data-deleted':
        return <Database className="h-4 w-4" />;
      case 'timelines-retention':
        return <Clock className="h-4 w-4" />;
      case 'exit-feedback':
        return <MessageSquareHeart className="h-4 w-4" />;
      case 'privacy-questions':
      default:
        return <ShieldCheck className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-b border-border-2/40 sticky top-0 z-20 backdrop-blur-md bg-white/95">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar"
          aria-label="Account Deletion Sections"
        >
          {DELETE_ACCOUNT_NAV_SECTIONS.map((tab) => {
            const isActive = activeId === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={() => setActiveId(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-destructive text-white shadow-xs'
                    : 'text-primary-text hover:text-foreground hover:bg-border-background/60 border border-transparent'
                }`}
              >
                {getTabIcon(tab.id)}
                <span>{tab.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

