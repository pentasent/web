'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { FEATURED_ORGANIZATIONS } from '@/data/organizations';
import { OrganizationItem } from '@/types/organizations';
import { COMING_SOON_DATA } from '@/data/coming-soon';

export default function OrganizationsPage() {
  const [selectedType, setSelectedType] = useState<string>('All organization types');
  const [selectedLocation, setSelectedLocation] = useState<string>('All locations');
  const [selectedVerification, setSelectedVerification] = useState<string>('All organizations');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const organizationTypes = [
    'All organization types',
    'Tertiary Hospital',
    'Specialty Medical Clinic',
    'HealthTech Enterprise',
    'Research Institution',
  ];

  // Derive unique locations dynamically from data
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    FEATURED_ORGANIZATIONS.forEach((org) => {
      if (org.location) locSet.add(org.location);
    });
    return ['All locations', ...Array.from(locSet).sort()];
  }, []);

  const verificationOptions = ['All organizations', 'Verified only'];

  // Check if non-default filters are active
  const hasActiveAdvancedFilters =
    selectedType !== 'All organization types' ||
    selectedLocation !== 'All locations' ||
    selectedVerification !== 'All organizations';

  const isFiltered = searchQuery.trim() !== '' || hasActiveAdvancedFilters;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All organization types');
    setSelectedLocation('All locations');
    setSelectedVerification('All organizations');
  };

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return FEATURED_ORGANIZATIONS.filter((org: OrganizationItem) => {
      // Organization type filter
      if (selectedType !== 'All organization types') {
        const typeMap: Record<string, string> = {
          'Tertiary Hospital': 'hospital',
          'Specialty Medical Clinic': 'clinic',
          'HealthTech Enterprise': 'healthtech',
          'Research Institution': 'research_institution',
        };
        const mappedType = typeMap[selectedType];
        if (mappedType && org.type !== mappedType) return false;
      }

      // Location filter
      if (selectedLocation !== 'All locations') {
        if (!org.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Verification filter
      if (selectedVerification === 'Verified only' && !org.isVerified) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = org.name.toLowerCase().includes(q);
        const matchesDesc = org.description.toLowerCase().includes(q);
        const matchesLoc = org.location.toLowerCase().includes(q);
        const matchesType = org.typeLabel.toLowerCase().includes(q);
        const matchesSpecialties = org.specialties?.some((s) => s.toLowerCase().includes(q));

        if (!matchesName && !matchesDesc && !matchesLoc && !matchesType && !matchesSpecialties) {
          return false;
        }
      }

      return true;
    });
  }, [selectedType, selectedLocation, selectedVerification, searchQuery]);

  const { badge, hero, explore, mailbox, bottomBanner } = COMING_SOON_DATA;
  
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section - Matching /products and /people hero section */}
      <section className="relative max-w-full mx-auto isolate flex lg:max-h-[75vh] mx-h-full flex-col justify-between overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-16 sm:pt-36 sm:pb-30 md:pb-40 lg:pt-30 lg:pb-40">
        {/* Background Graphic Image */}
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <Image
            src="/assets/images/pages/organizations/org_bnner.png"
            alt="Pentasent Organizations Ecosystem Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          {/* Bottom Fade Gradient for smooth transition */}
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        {/* Main Hero Content (Fade + Blur + Scale Animation matching Products/People Hero) */}
        <motion.div
          initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
        >
          {/* Eyebrow */}
          <p className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            Healthcare Institutions &amp; Clinical Enterprise Directory
          </p>

          {/* Main Headline */}
          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Healthcare <span className="text-[#ffd3f0]">Organizations &amp; Clinics</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Explore accredited tertiary hospitals, specialized clinical institutes, healthtech
            enterprises, and global biomedical research organizations.
          </p>
        </motion.div>
      </section>

      {/* Hero Search & Filter Floating Card - Zero Shadow */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto my-10 sm:-mt-23 lg:-mt-23 md:-mt-23 w-full max-w-5xl px-4 xs:px-6 overflow-visible"
      >
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#ded9d5] text-foreground text-left shadow-none">
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Row 1: Search Input - Full Width */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="hero-org-search"
                className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
              >
                Search Organizations, Hospitals or Specialties
              </label>
              <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  id="hero-org-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Hospital, Cardiology, Aetheria, Boston, Genomics, Outpatient Clinic..."
                  className="w-full h-full pl-3.5 pr-10 text-[14px] sm:text-[14.5px] text-foreground placeholder:text-primary-text/70 bg-transparent border-0 outline-none"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
                />
              </div>
            </div>

            {/* Mobile-Only: Advanced Filter Toggle Button */}
            <div className="sm:hidden flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                aria-expanded={showMobileFilters}
              >
                <SlidersHorizontal size={15} className="text-primary" />
                <span>{showMobileFilters ? 'Hide Advanced Filters' : 'Advanced Filters'}</span>
                {hasActiveAdvancedFilters && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary">
                    Active
                  </span>
                )}
                <motion.span
                  animate={{ rotate: showMobileFilters ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex"
                >
                  <ChevronDown size={14} className="text-primary-text" />
                </motion.span>
              </button>

              {hasActiveAdvancedFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile-Only: Collapsible Filters */}
            <div className="sm:hidden">
              <AnimatePresence initial={false}>
                {showMobileFilters && (
                  <motion.div
                    key="mobile-org-filters"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-1 flex flex-col gap-3">
                      {/* Organization Type */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile-filter-org-type"
                          className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                        >
                          Organization Type
                        </label>
                        <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                          <select
                            id="mobile-filter-org-type"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                          >
                            {organizationTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile-filter-org-location"
                          className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                        >
                          Location / Region
                        </label>
                        <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                          <select
                            id="mobile-filter-org-location"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                          >
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                          />
                        </div>
                      </div>

                      {/* Verification */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile-filter-org-verification"
                          className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                        >
                          Verification Status
                        </label>
                        <div className="relative w-full h-11 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                          <select
                            id="mobile-filter-org-verification"
                            value={selectedVerification}
                            onChange={(e) => setSelectedVerification(e.target.value)}
                            className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                          >
                            {verificationOptions.map((v) => (
                              <option key={v} value={v}>
                                {v}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop & Tablet: 3 columns in one row */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 items-end">
              {/* Organization Type */}
              <div className="flex flex-col">
                <label
                  htmlFor="hero-filter-org-type"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Organization Type
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="hero-filter-org-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {organizationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col">
                <label
                  htmlFor="hero-filter-org-location"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Location / Region
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="hero-filter-org-location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Verification */}
              <div className="flex flex-col">
                <label
                  htmlFor="hero-filter-org-verification"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Verification Status
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="hero-filter-org-verification"
                    value={selectedVerification}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {verificationOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
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
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Clean White Background */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12 bg-white">
                  {/* Floating Mailbox Image */}
                    <motion.div
                      animate={{
                        y: [0, -12, 0],
                      }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="relative mx-auto z-10 w-full max-w-85 xs:max-w-[380px] sm:max-w-110 lg:max-w-120 drop-shadow-sm"
                    >
                      <Image
                        src={mailbox.src}
                        alt={mailbox.alt}
                        width={mailbox.width}
                        height={mailbox.height}
                        priority
                        className="w-full h-auto object-contain select-none pointer-events-none"
                      />
                    </motion.div>
      </div>
    </div>
  );
}
