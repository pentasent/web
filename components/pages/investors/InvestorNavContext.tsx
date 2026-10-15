'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { InvestorTabId } from '@/types/investors';

export const VALID_INVESTOR_TABS: InvestorTabId[] = [
  'overview',
  'thesis',
  'founders-letter',
  'opportunity',
  'products',
  'pre-seed',
  'governance',
  'annual-meeting',
  'news',
];

interface InvestorNavContextType {
  activeTab: InvestorTabId;
  setActiveTab: (tab: InvestorTabId) => void;
  isTabsOpen: boolean;
  setIsTabsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTabs: () => void;
  closeTabs: () => void;
}

const InvestorNavContext = createContext<InvestorNavContextType | undefined>(undefined);

export function InvestorNavProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as InvestorTabId | null;
  const initialTab: InvestorTabId =
    tabParam && VALID_INVESTOR_TABS.includes(tabParam) ? tabParam : 'overview';

  const [prevTabParam, setPrevTabParam] = useState<string | null>(tabParam);
  const [activeTab, setActiveTabState] = useState<InvestorTabId>(initialTab);
  const [isTabsOpen, setIsTabsOpen] = useState(false);

  // Sync state if URL search param changes externally (e.g. Link navigation, browser back/forward)
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    setActiveTabState(
      tabParam && VALID_INVESTOR_TABS.includes(tabParam) ? tabParam : 'overview'
    );
  }

  const setActiveTab = useCallback((tabId: InvestorTabId) => {
    setActiveTabState(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tabId === 'overview') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tabId);
      }
      url.hash = '';
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const toggleTabs = useCallback(() => {
    setIsTabsOpen((prev) => !prev);
  }, []);

  const closeTabs = useCallback(() => {
    setIsTabsOpen(false);
  }, []);

  // Subscribe to external popstate and hash change events
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tab') as InvestorTabId | null;
        if (t && VALID_INVESTOR_TABS.includes(t)) {
          setActiveTabState(t);
        } else {
          setActiveTabState('overview');
        }
      }
    };

    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.replace('#', '') as InvestorTabId;
        if (VALID_INVESTOR_TABS.includes(hash)) {
          setActiveTabState(hash);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  return (
    <InvestorNavContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isTabsOpen,
        setIsTabsOpen,
        toggleTabs,
        closeTabs,
      }}
    >
      {children}
    </InvestorNavContext.Provider>
  );
}

export function useInvestorNav() {
  const context = useContext(InvestorNavContext);
  if (!context) {
    throw new Error('useInvestorNav must be used within an InvestorNavProvider');
  }
  return context;
}
