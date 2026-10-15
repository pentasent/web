"use client";

import { menuItems, DRAWER_FEATURED_ITEM, DRAWER_MENU_SECTIONS } from '@/data/navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Fingerprint, Heart, HeartPulse, MessageCircle, Search, X } from 'lucide-react';
import GlobalSearch from '@/components/search/GlobalSearch';
import AccountDrawer from '@/components/account/AccountDrawer';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';

import {
  type RouteNavConfig,
  type RouteNavConfigs,
  type RouteNavRule,
  DEFAULT_FALLBACK_CONFIG,
  ROUTE_NAV_CONFIGS,
  findMatchingRouteConfig,
  getLineStrokeClass,
  resolveNavStyles,
} from '@/lib/navbar';
import { NavbarProps, SiteNavProps } from '@/types/nav';

export type { RouteNavConfig, RouteNavConfigs, RouteNavRule };
export { DEFAULT_FALLBACK_CONFIG, ROUTE_NAV_CONFIGS, findMatchingRouteConfig };

export function SiteNav({
  dark = false,
  logoColor,
  lineColor,
  inkColor,
  bgColor = '',
  className = '',
  onOpenMenu,
  onOpenSearch,
  onOpenAccount,
}: SiteNavProps) {
  const isDark = dark;
  const activeLogo = logoColor ?? (isDark ? 'dark' : 'white');
  const activeInk = inkColor ?? (activeLogo === 'dark' || isDark ? 'text-[#3f0038]' : 'text-white');
  const activeLine = lineColor ?? (activeLogo === 'dark' || isDark ? 'bg-[#3f0038]' : 'bg-white');
  const lineStrokeClass = getLineStrokeClass(activeLine);

  return (
    <nav className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 xs:px-6 py-3 sm:px-8 md:px-10 lg:px-12 ${activeInk} ${bgColor} ${className}`}>
      <Link href="/" aria-label="Pentasent home" className="transition-opacity hover:opacity-75">
        <Image
          src={activeLogo === 'dark' ? '/assets/images/logos/penta-text-burgundy-dark.svg' : '/assets/images/logos/penta-text-white.svg'}
          alt="Pentasent"
          width={135}
          height={100}
          className="w-28 xs:w-32 sm:w-33.75 h-auto"
          priority
        />
      </Link>
      <div className="flex items-center gap-1 sm:gap-2">
        {onOpenSearch && (
          <button
            type="button"
            aria-label="Open search"
            onClick={onOpenSearch}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer ${activeInk} ${
              activeInk.includes('text-white') ? 'hover:bg-white/15' : 'hover:bg-black/5'
            } active:scale-95`}
          >
            <Search size={21} strokeWidth={2} />
          </button>
        )}
        {onOpenAccount && (
          <button
            type="button"
            aria-label="Open account"
            onClick={onOpenAccount}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer ${activeInk} ${
              activeInk.includes('text-white') ? 'hover:bg-white/15' : 'hover:bg-black/5'
            } active:scale-95`}
          >
            <Fingerprint size={21} strokeWidth={2} className=' -rotate-45 ' />
            {/* <User size={21} strokeWidth={2} /> */}
          </button>
        )}
        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="group flex h-10 w-10 flex-col items-center justify-center gap-1.75 cursor-pointer"
        >
          <svg
            className="w-8 h-8 stroke-[1.5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line
              x1="4"
              y1="8"
              x2="20"
              y2="8"
              className={`h-0.5 w-10 origin-left transition-transform duration-300 group-hover:scale-x-85 ${activeLine} ${lineStrokeClass}`}
            />
            <line
              x1="8"
              y1="16"
              x2="20"
              y2="16"
              className={`h-0.5 w-10 origin-left transition-transform duration-300 group-hover:scale-x-85 ${activeLine} ${lineStrokeClass}`}
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default function Navbar({
  bgClassName,
  bgColor,
  dark,
  logoColor,
  lineColor,
  inkColor,
  position,
  className = '',
  routeConfigs,
  animateOnMount,
}: NavbarProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showWhiteNav, setShowWhiteNav] = useState(false);
  const pathname = usePathname();

  const { user, status, isAuthenticated } = useAuth();
  const isLoggedIn = status === 'authenticated' && Boolean(user) && isAuthenticated;

  const {
    resolvedBg,
    resolvedDark,
    resolvedLogoColor,
    resolvedLineColor,
    resolvedInkColor,
    resolvedPosition,
    shouldAnimate,
  } = resolveNavStyles({
    pathname,
    routeConfigs,
    bgClassName,
    bgColor,
    dark,
    logoColor,
    lineColor,
    inkColor,
    position,
    animateOnMount,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const heroHeight = window.innerHeight * 0.8;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      const pastHero = currentScrollY > heroHeight;

      if (pastHero && scrollingUp) {
        setShowWhiteNav(true);
      } else {
        setShowWhiteNav(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isSearchOpen || isAccountOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isSearchOpen, isAccountOpen]);

  return (
    <nav>
      {shouldAnimate ? (
        <motion.div
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`${resolvedPosition} inset-x-0 top-0 z-10 ${resolvedBg} ${className}`}
        >
          <SiteNav
            dark={resolvedDark}
            logoColor={resolvedLogoColor}
            lineColor={resolvedLineColor}
            inkColor={resolvedInkColor}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAccount={() => setIsAccountOpen(true)}
          />
        </motion.div>
      ) : (
        <div
          className={`${resolvedPosition} inset-x-0 top-0 z-10 ${resolvedBg} ${className}`}
        >
          <SiteNav
            dark={resolvedDark}
            logoColor={resolvedLogoColor}
            lineColor={resolvedLineColor}
            inkColor={resolvedInkColor}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAccount={() => setIsAccountOpen(true)}
          />
        </div>
      )}

      <AnimatePresence>
        {showWhiteNav && !isMenuOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-30 bg-white text-[#3f0038]"
          >
            <SiteNav
              dark
              onOpenMenu={() => setIsMenuOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AccountDrawer isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-60 cursor-default bg-[#190019]"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="fixed right-0 top-0 z-70 flex h-full sm:h-[95%] sm:top-[2.5%] w-full max-w-full sm:max-w-115 md:max-w-120 flex-col overflow-hidden sm:rounded-l-[24px] rounded-none bg-[#fdfcfa] text-[#171317] shadow-[-20px_0_70px_rgba(27,0,25,0.18)] border-l border-[#ebe4dc]"
              aria-label="Main menu"
            >
              {/* Header */}
              <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4 sm:px-8 sm:pt-7 border-b border-[#f0eae5] bg-[#fdfcfa]">
                <Image
                  src="/assets/images/logos/penta-text-burgundy-dark.svg"
                  alt="Pentasent"
                  width={135}
                  height={100}
                  className="w-28 sm:w-33.75 h-auto"
                />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#3f0038] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <X size={24} strokeWidth={1.8} />
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 space-y-6">
                {/* 1. Featured Option: My Health (Shown only when logged in with valid token) */}
                {isLoggedIn && (
                  <Link
                    href={DRAWER_FEATURED_ITEM.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#4a0139]/8 via-[#4a0139]/4 to-transparent border border-[#4a0139]/20 hover:border-primary hover:bg-[#4a0139]/10 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4a0139] text-white shadow-2xs">
                        <HeartPulse size={20} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-[#171317] tracking-tight">
                            {DRAWER_FEATURED_ITEM.label}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#4a0139] text-white">
                            {DRAWER_FEATURED_ITEM.badge}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#6b6267] truncate mt-0.5">
                          {DRAWER_FEATURED_ITEM.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#4a0139] shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                {/* 2. Structured Navigation Sections */}
                {DRAWER_MENU_SECTIONS.map((section, sIdx) => (
                  <div key={section.id} className={sIdx > 0 ? 'pt-5 border-t border-[#f0eae5]' : ''}>
                    <div className="flex items-center justify-between px-1 mb-2.5">
                      <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-[#7a7077]">
                        {section.title}
                      </h3>
                      <span className="text-[10.5px] font-semibold text-[#a59ca3]">
                        {section.items.length} {section.items.length === 1 ? 'link' : 'links'}
                      </span>
                    </div>

                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#faf6f3] transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] sm:text-[14.5px] font-semibold text-[#1c171a] group-hover:text-primary transition-colors">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-[11.5px] sm:text-[12px] text-[#786e75] truncate mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              size={16}
                              className="text-[#a59ca3] shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer Links */}
              <div className="shrink-0 flex items-center flex-wrap gap-4 sm:gap-6 border-t border-[#f0eae5] bg-[#fdfcfa] px-6 py-4 sm:px-8 sm:py-5">
                <Link
                  href="/company/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-[#4a0139] hover:underline"
                >
                  <MessageCircle size={16} strokeWidth={2} />
                  <span>Contact Support</span>
                </Link>
                <Link
                  href="/company/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-[#4a0139] hover:underline"
                >
                  <Heart size={16} strokeWidth={2} />
                  <span>About Us</span>
                </Link>
                <Link
                  href="/help"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-[#665e64] hover:text-[#4a0139]"
                >
                  <span>Help Center</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}