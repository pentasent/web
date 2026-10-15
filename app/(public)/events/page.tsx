'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Calendar,
  PlusCircle,
  MapPin,
  Globe,
} from 'lucide-react';
import { PublicEventDTO, EventType, EventFormat, EventPricingType } from '@/types/events';
import { apiClient } from '@/lib/api';
import { EventsListShimmer } from '@/shimmer/tracker';
import EventCard from '@/components/events/EventCard';
import EventSubmitModal from '@/components/forms/EventSubmitModal';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState<string>('All event types');
  const [selectedFormat, setSelectedFormat] = useState<string>('All formats');
  const [selectedPricing, setSelectedPricing] = useState<string>('All admission');
  const [selectedSort, setSelectedSort] = useState<string>('upcoming');
  const [searchQuery, setSearchQuery] = useState<string>(qParam);

  const [prevQParam, setPrevQParam] = useState(qParam);
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setSearchQuery(qParam);
  }
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const [events, setEvents] = useState<PublicEventDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await apiClient<PublicEventDTO[]>('/events?limit=100&sort=upcoming');
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.warn('Unable to load events directory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      await fetchEvents();
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const eventTypes = [
    'All event types',
    'Symposium',
    'Summit',
    'Conference',
    'Webinar',
    'Workshop',
    'Journal Club',
    'Panel',
    'Meetup',
  ];

  const eventFormats = [
    'All formats',
    'Virtual / Online',
    'In-Person',
    'Hybrid',
  ];

  const pricingModels = [
    'All admission',
    'Free to attend',
    'Paid tickets',
  ];

  const sortOptions = [
    { label: 'Upcoming Soon', value: 'upcoming' },
    { label: 'Newest Listed', value: 'newest' },
    { label: 'Featured First', value: 'featured' },
  ];

  const hasActiveAdvancedFilters =
    selectedType !== 'All event types' ||
    selectedFormat !== 'All formats' ||
    selectedPricing !== 'All admission' ||
    selectedSort !== 'upcoming';

  const isFiltered = searchQuery.trim() !== '' || hasActiveAdvancedFilters;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All event types');
    setSelectedFormat('All formats');
    setSelectedPricing('All admission');
    setSelectedSort('upcoming');
  };

  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Type filter
        if (selectedType !== 'All event types') {
          const normalized = selectedType.toLowerCase().replace(/\s+/g, '_');
          if (evt.eventType.toLowerCase() !== normalized) {
            return false;
          }
        }

        // Format filter
        if (selectedFormat !== 'All formats') {
          if (selectedFormat === 'Virtual / Online' && evt.format !== 'online') return false;
          if (selectedFormat === 'In-Person' && evt.format !== 'in_person') return false;
          if (selectedFormat === 'Hybrid' && evt.format !== 'hybrid') return false;
        }

        // Pricing filter
        if (selectedPricing !== 'All admission') {
          if (selectedPricing === 'Free to attend' && evt.pricingType !== 'free') return false;
          if (selectedPricing === 'Paid tickets' && evt.pricingType !== 'paid') return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = evt.title.toLowerCase().includes(q);
          const matchesShortDesc = evt.shortDescription?.toLowerCase().includes(q) || false;
          const matchesVenue = evt.venueSummary?.toLowerCase().includes(q) || false;
          const matchesTags = evt.tags?.some((t) => t.toLowerCase().includes(q)) || false;
          const matchesOrg = evt.organizerSummary?.displayName?.toLowerCase().includes(q) || false;
          if (!matchesTitle && !matchesShortDesc && !matchesVenue && !matchesTags && !matchesOrg) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
        }
        if (selectedSort === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // default upcoming: earliest session start first
        const dateA = a.nextSessionStart ? new Date(a.nextSessionStart).getTime() : Infinity;
        const dateB = b.nextSessionStart ? new Date(b.nextSessionStart).getTime() : Infinity;
        return dateA - dateB;
      });
  }, [events, selectedType, selectedFormat, selectedPricing, selectedSort, searchQuery]);

  const handleHostClick = () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/events')}`);
      return;
    }
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HERO SECTION (Unboxed, matching Products Hero & Jobs Hero) */}
      <section className="relative w-full bg-[#180915] text-white pt-24 pb-36 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/pages/events/event_banner_sparks.png"
            alt="Pentasent Events Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center relative z-10"
        >
          <div className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            <span>Clinical Symposia &amp; Academic Gathering</span>
          </div>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Discover Healthcare <span className="text-[#ffd3f0]">Events</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Attend accredited medical conferences, cutting-edge translational healthtech summits, grand rounds, and clinical workshops.
          </p>
        </motion.div>
      </section>

      {/* FILTER SEARCH BAR (Sticky or floating over hero, matching Products page) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 overflow-visible z-20"
      >
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-muted text-foreground text-left">
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Search Input */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="event-filter-search"
                className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
              >
                Search Healthcare Events
              </label>
              <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  id="event-filter-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Cardiovascular Summit, AI Imaging, Oncology Masterclass, Boston..."
                  className="w-full h-full pl-3.5 pr-10 text-[14px] sm:text-[14.5px] text-foreground placeholder:text-primary-text/70 bg-transparent border-0 outline-none"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
                />
              </div>
            </div>

            {/* Desktop Filters: 3 columns */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 items-end">
              {/* Type */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-event-type"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Event Type
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-event-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Format */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-event-format"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Delivery Format
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-event-format"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {eventFormats.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-event-sort"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Sort By
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-event-sort"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={15} className="text-primary" />
                <span>{showMobileFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
                {hasActiveAdvancedFilters && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary">
                    Active
                  </span>
                )}
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="sm:hidden grid grid-cols-1 gap-3 pt-2 border-t border-[#ded9d5]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                    Event Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-[13.5px]"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                    Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-[13.5px]"
                  >
                    {eventFormats.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                    Sort
                  </label>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-[13.5px]"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* TWO-COLUMN MAIN CONTENT (Unboxed matching /products page) */}
      <section className="w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Main Events Directory List */}
          <div className="lg:col-span-8">
            {/* Header row: Count & active filter chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-[#e8e4e1]">
              <div className="flex items-center gap-2">
                <span className="text-[15px] sm:text-[16px] font-bold text-foreground">
                  {isLoading ? 'Loading events...' : `${filteredEvents.length} Clinical Events`}
                </span>
                {isFiltered && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#f4ddf0] text-primary">
                    Filtered
                  </span>
                )}
              </div>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            {/* List with Shimmer loading state */}
            {isLoading ? (
              <EventsListShimmer />
            ) : (
              <AnimatePresence mode="wait">
                {filteredEvents.length > 0 ? (
                  <motion.div
                    key="events-directory-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="divide-y divide-[#e8e4e1]"
                  >
                    {filteredEvents.map((evt, index) => (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        basePath="/events"
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  /* Empty State (Unboxed) */
                  <motion.div
                    key="events-empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-14 sm:py-20 text-center max-w-md mx-auto"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-4">
                      <Calendar size={26} />
                    </div>
                    <h3 className="text-[20px] font-bold text-foreground">
                      No matching events found
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-primary-text">
                      Try clearing search terms or selecting a different event format or type.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[13.5px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Reset all filters</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Clean, Unboxed with Dividers) */}
          <div className="lg:col-span-4 divide-y divide-[#e8e4e1]">
            {/* Host Event Callout */}
            <div className="pb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#f4ddf0] text-primary">
                  <Sparkles size={11} />
                  Academic &amp; Clinical Reach
                </span>
              </div>
              <h3 className="text-[19px] font-bold text-foreground">
                Hosting a Medical Symposium?
              </h3>
              <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-primary-text">
                Broadcast your conference, grand rounds, or clinical webinar directly to verified physicians, researchers, and biotech leaders on Pentasent.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleHostClick}
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-5 py-3 text-[14px] font-bold text-white transition-all cursor-pointer shadow-xs"
                >
                  <PlusCircle size={16} />
                  <span>Host a Healthcare Event</span>
                </button>
              </div>
            </div>

            {/* Event Formats Overview */}
            <div className="py-8">
              <h3 className="text-[17px] font-bold text-foreground mb-3">
                Event Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Virtual Webinars', 'Global Summits', 'In-Person Workshops', 'Grand Rounds', 'CME Symposia'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      if (fmt.includes('Virtual')) setSelectedFormat('Virtual / Online');
                      else if (fmt.includes('In-Person')) setSelectedFormat('In-Person');
                      else setSearchQuery(fmt.replace(/s$/, ''));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium border bg-[#faf9f8] hover:bg-white text-primary-text hover:text-foreground border-[#ded9d5] transition-colors cursor-pointer"
                  >
                    <span>{fmt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Quality Standard */}
            <div className="py-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <ShieldCheck size={18} />
                <h3 className="text-[17px] font-bold text-foreground">
                  Verified Academic Standard
                </h3>
              </div>
              <p className="text-[14px] sm:text-[15px] leading-relaxed text-primary-text">
                All events hosted on Pentasent are peer-reviewed for evidence integrity, faculty accreditation, and healthcare taxonomy alignment.
              </p>
              <div className="mt-3.5">
                <Link
                  href="/communities"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <span>Explore clinical communities</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Modal */}
      <EventSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={() => {
          void fetchEvents();
        }}
      />
    </div>
  );
}

function EventsFallback() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full bg-[#180915] text-white pt-24 pb-36 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/pages/events/event_banner_sparks.png"
            alt="Pentasent Events Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center relative z-10">
          <div className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            <span>Clinical Symposia &amp; Academic Gathering</span>
          </div>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Discover Healthcare <span className="text-[#ffd3f0]">Events</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Attend accredited medical conferences, cutting-edge translational healthtech summits, grand rounds, and clinical workshops.
          </p>
        </div>
      </section>

      {/* FILTER SKELETON */}
      <div className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 z-20">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-muted shadow-xs">
          <div className="h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* SHIMMER LIST */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 pb-24">
        <EventsListShimmer />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsFallback />}>
      <EventsContent />
    </Suspense>
  );
}
