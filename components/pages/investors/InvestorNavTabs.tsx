'use client';

import { INVESTOR_TABS } from '@/data/investors';
import type {
  InvestorTabId,
  InvestorTabItem,
  InvestorNavTabsProps,
} from '@/types/investors';

export { INVESTOR_TABS };
export type { InvestorTabId, InvestorTabItem, InvestorNavTabsProps };

export default function InvestorNavTabs({ activeTab, onTabChange }: InvestorNavTabsProps) {
  return (
    <div className="sticky top-16 sm:top-18 z-30 w-full border-b border-[#ded9d5] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar"
          aria-label="Investor Relations Sections"
        >
          {INVESTOR_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[14px] sm:text-[14.5px] font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-[#faf9f8]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-primary/70'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-chart-3 text-secondary'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {tab.badge}
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
