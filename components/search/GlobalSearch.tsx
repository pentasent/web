'use client';

import { QUICK_SUGGESTIONS, SEARCH_FILTERS } from '@/data/navbar';
import { GlobalSearchProps, SearchFilter } from '@/types/nav';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';

export type { GlobalSearchProps, SearchFilter };
export { QUICK_SUGGESTIONS, SEARCH_FILTERS };

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const activeFilter = SEARCH_FILTERS.find((f) => f.id === selectedFilter) ?? SEARCH_FILTERS[0];

  // Auto-focus input when search drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock outside webpage scroll when drawer is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const executeSearch = (targetQuery = query, targetFilter = selectedFilter) => {
    const trimmed = targetQuery.trim();
    onClose();

    let targetPath = '/people';

    switch (targetFilter) {
      case 'doctors':
      case 'people':
        targetPath = '/people';
        break;
      case 'products':
        targetPath = '/products';
        break;
      case 'tools': {
        const lower = trimmed.toLowerCase();
        if (lower.includes('bmr')) {
          targetPath = '/tools/bmr-calculator';
        } else if (lower.includes('calorie')) {
          targetPath = '/tools/calorie-calculator';
        } else if (lower.includes('measurement') || lower.includes('body')) {
          targetPath = '/tools/health-measurement-calculator';
        } else if (lower.includes('bmi')) {
          targetPath = '/tools/bmi-calculator';
        } else {
          targetPath = '/tools';
        }
        router.push(targetPath);
        return;
      }
      case 'blogs':
      case 'news':
        targetPath = '/blog';
        break;
      case 'communities':
        targetPath = '/communities';
        break;
      case 'events':
        targetPath = '/events';
        break;
      case 'jobs':
        targetPath = '/jobs';
        break;
      // case 'research':
      //   targetPath = '/research';
      //   break;
      case 'about':
        router.push('/company/about');
        return;
      case 'all':
      default: {
        const lower = trimmed.toLowerCase();
        if (
          lower.includes('doctor') ||
          lower.includes('physician') ||
          lower.includes('surgeon') ||
          lower.includes('specialist')
        ) {
          targetPath = '/people';
        } else if (
          lower.includes('job') ||
          lower.includes('career') ||
          lower.includes('vacancy') ||
          lower.includes('hiring')
        ) {
          targetPath = '/jobs';
        } else if (
          lower.includes('tool') ||
          lower.includes('calculator') ||
          lower.includes('bmi') ||
          lower.includes('bmr')
        ) {
          if (lower.includes('bmr')) targetPath = '/tools/bmr-calculator';
          else if (lower.includes('calorie')) targetPath = '/tools/calorie-calculator';
          else if (lower.includes('measurement')) targetPath = '/tools/health-measurement-calculator';
          else targetPath = '/tools/bmi-calculator';
          router.push(targetPath);
          return;
        } else if (lower.includes('product') || lower.includes('device') || lower.includes('software')) {
          targetPath = '/products';
        } else if (lower.includes('communit') || lower.includes('group')) {
          targetPath = '/communities';
        } else if (lower.includes('event') || lower.includes('webinar') || lower.includes('summit')) {
          targetPath = '/events';
        } else if (lower.includes('news') || lower.includes('blog') || lower.includes('article') || lower.includes('story')) {
          targetPath = '/blog';
        } else if (
          lower.includes('about') ||
          lower.includes('pentasent') ||
          lower.includes('company') ||
          lower.includes('founder') ||
          lower.includes('ceo')
        ) {
          router.push('/company/about');
          return;
        } else if (lower.includes('research') || lower.includes('trial') || lower.includes('study')) {
          targetPath = '/research';
        } else {
          targetPath = '/people';
        }
        break;
      }
    }

    if (trimmed) {
      router.push(`${targetPath}?q=${encodeURIComponent(trimmed)}`);
    } else {
      if (targetFilter === 'doctors') {
        router.push('/people?q=Doctor');
      } else {
        router.push(targetPath);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleSuggestionClick = (suggestion: typeof QUICK_SUGGESTIONS[number]) => {
    onClose();
    if (suggestion.href) {
      router.push(suggestion.href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay Fade (matching sidebar modal) */}
          <motion.button
            type="button"
            aria-label="Close search dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-60 cursor-default bg-[#190019]"
          />

          {/* Sidebar Drawer Animated From Right */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="fixed right-0 top-0 z-70 flex h-full sm:h-[95%] sm:top-[2.5%] w-full max-w-full sm:max-w-125 flex-col overflow-hidden sm:rounded-l-[24px] rounded-none bg-white text-[#171317] shadow-[-20px_0_70px_rgba(27,0,25,0.18)] border-l border-[#ebe4dc]"
            aria-label="Global search"
          >
            {/* Header: Logo, Badge & Close Button (Fixed Top) */}
            <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4 sm:px-8 sm:pt-7 border-b border-[#f0eae5] bg-white">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/images/logos/penta-text-burgundy-dark.svg"
                  alt="Pentasent"
                  width={115}
                  height={40}
                  className="w-24 sm:w-28 h-auto"
                />
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-[#6b185f]">
                  Global Search
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[11px] text-[#787076] font-medium bg-[#f5f1ed] px-2.5 py-1 rounded-md">
                  ESC
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#3f0038] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <X size={22} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Scrollable Middle Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Search Form */}
              <form onSubmit={handleSubmit}>
                <div className="relative flex items-center w-full h-13 sm:h-14 rounded-2xl bg-[#faf8f6] border border-[#ded7d0] px-4 transition-all duration-200 focus-within:border-[#4a0139] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4a0139]/12">
                  <Search size={20} className="text-[#6b185f] shrink-0" strokeWidth={2} />

                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={activeFilter.placeholder}
                    className="min-w-0 flex-1 px-3 text-[14px] sm:text-[15px] text-[#1c171a] bg-transparent border-0 outline-none placeholder:text-[#7f777c]"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear query"
                      className="p-1.5 rounded-full text-[#776f74] hover:bg-black/5 hover:text-[#1c171a] transition-colors mr-1.5 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}

                  <button
                    type="submit"
                    className="shrink-0 flex items-center gap-1.5 h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-[#4a0139] text-white text-[13px] font-bold transition-all duration-200 hover:bg-[#38012b] shadow-xs cursor-pointer active:scale-97"
                  >
                    <span>Search</span>
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </form>

              {/* Filter By Category */}
              <div className="mt-6">
                <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.16em] text-[#71686e] mb-3">
                  Filter by category:
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {SEARCH_FILTERS.map((filter) => {
                    const isSelected = selectedFilter === filter.id;
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[12.5px] font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#4a0139] text-white shadow-xs'
                            : 'bg-[#f5f1ed] text-[#4a4247] hover:bg-[#ebe4dc] hover:text-[#1c171a]'
                        }`}
                      >
                        {Icon && <Icon size={13} strokeWidth={isSelected ? 2.2 : 1.8} />}
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mt-7 pt-5 border-t border-[#f0eae5]">
                <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.16em] text-[#71686e] mb-3">
                  Popular searches:
                </p>

                <div className="flex items-center gap-2 flex-wrap text-xs sm:text-[13px]">
                  {QUICK_SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#faf8f6] border border-[#e5dfd8] text-[#554c52] hover:border-[#4a0139] hover:text-[#4a0139] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky / Fixed Bottom Footer */}
            <div className="shrink-0 border-t border-[#f0eae5] bg-[#faf8f6] px-6 py-4 sm:px-8 sm:py-4.5 flex items-center justify-between text-xs text-[#8e858a]">
              <span>Press Enter to search</span>
              <span className="font-medium text-[#4a0139]">Pentasent Ecosystem</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
