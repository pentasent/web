'use client';

import React from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Package,
  Info,
} from 'lucide-react';
import { CommunityDetailDTO } from '@/types/communities';

interface CommunityNavbarProps {
  currentCommunity: CommunityDetailDTO;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwnerOrAdmin?: boolean;
  onOpenManageModal?: () => void;
}

export default function CommunityNavbar({
  currentCommunity,
  activeTab,
  onTabChange,
}: CommunityNavbarProps) {
  interface TabItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    tag?: string;
    hiddenOnLarge?: boolean;
  }

  const tabs: TabItem[] = [
    {
      id: 'discussions',
      label: 'Discussions',
      icon: MessageSquare,
      badge: currentCommunity.postCount > 0 ? String(currentCommunity.postCount) : undefined,
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      badge: String(currentCommunity.memberCount),
    },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'about', label: 'About', icon: Info, hiddenOnLarge: true },
  ];

  return (
    <div className="sticky top-0 z-20 w-full mt-16 border-b border-[#ded9d5] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar"
          aria-label="Community Navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  tab.hiddenOnLarge ? 'lg:hidden' : ''
                } ${
                  isActive
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-primary-text hover:text-foreground hover:bg-[#faf9f8]'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span>{tab.label}</span>
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
                {tab.tag && (
                  <span
                    className={`ml-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#faf0f8] text-[#842377]'
                    }`}
                  >
                    {tab.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
