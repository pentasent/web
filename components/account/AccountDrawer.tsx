'use client';

import { PENTASENT_OFFERINGS } from '@/data/navbar';
import { getFallbackAvatar } from '@/data/account';
import { AccountDrawerProps, getAccountFlagLabel } from '@/types/nav';
import { useAuth } from '@/context/auth-context';
import { AccountCardShimmer } from '@/shimmer/account';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Crown,
  LogOut,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccountDrawer({
  isOpen,
  onClose,
  currentUser = null,
}: AccountDrawerProps) {
  const { user: authUser, status, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoading = status === 'loading';
  const isLoggedIn = Boolean(currentUser) || isAuthenticated;

  // Resolve active user: explicit prop takes precedence, otherwise authUser
  const activeUser = currentUser || authUser;

  const displayName =
    currentUser?.name ||
    (authUser?.prefix ? `${authUser.prefix} ` : '') +
      (authUser?.displayName || authUser?.name || authUser?.email?.split('@')[0] || 'User');

  const avatarSrc =
    currentUser?.avatar ||
    authUser?.avatarUrl ||
    authUser?.avatar ||
    getFallbackAvatar(authUser?.gender);

  const userEmail = currentUser?.email || authUser?.email || '';

  const headline =
    authUser?.headline ||
    (currentUser
      ? getAccountFlagLabel(currentUser.accountFlag)
      : authUser?.isVerified
      ? 'Verified Member'
      : 'Individual');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

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

  // Format blurred email: first few chars visible, domain/rest blurred
  const renderBlurredEmail = (email: string) => {
    if (!email) return null;
    const atIndex = email.indexOf('@');
    if (atIndex <= 3) {
      const visible = email.slice(0, 2);
      const hidden = email.slice(2);
      return (
        <span className="inline-flex items-center">
          <span className="font-mono text-[#3f353c]">{visible}</span>
          <span className="select-none blur-xs opacity-75 font-mono text-[#776f75]">{hidden}</span>
        </span>
      );
    }
    const visible = email.slice(0, 4);
    const hidden = email.slice(4);
    return (
      <span className="inline-flex items-center">
        <span className="font-mono text-[#3f353c]">{visible}</span>
        <span className="select-none blur-xs opacity-75 font-mono text-[#776f75]">{hidden}</span>
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay (matching main menu sidebar fade) */}
          <motion.button
            type="button"
            aria-label="Close account drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-60 cursor-default bg-[#190019]"
          />

          {/* Slide-out Sidebar Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="fixed right-0 top-0 z-70 flex h-full sm:h-[95%] sm:top-[2.5%] w-full max-w-full sm:max-w-115 flex-col overflow-hidden sm:rounded-l-[24px] rounded-none bg-[#fdfcfa] text-[#171317] shadow-[-20px_0_70px_rgba(27,0,25,0.18)] border-l border-[#ebe4dc]"
            aria-label="Pentasent account"
          >
            {/* Header: Title & Close Button (Fixed Top) */}
            <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4 sm:px-8 sm:pt-7 border-b border-[#f0eae5] bg-[#fdfcfa]">
              <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#171317]">
                Pentasent account
              </h2>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#3f0038] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X size={24} strokeWidth={1.8} />
              </button>
            </div>

            {/* Scrollable Middle Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Brand Logo Emblem */}
              <div className="flex justify-center pt-2 pb-5">
                <div className="flex h-16 w-16 items-center justify-center">
                  <Image
                    src="/assets/images/logos/penta-icon-gradient.svg"
                    alt="Pentasent"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Main Headline */}
              <h3 className="text-center text-[22px] sm:text-[24px] font-bold text-[#171317] tracking-tight">
                {isLoading
                  ? 'Pentasent account'
                  : isLoggedIn
                  ? 'Your Pentasent account'
                  : 'Log in to your Pentasent account'}
              </h3>

              {/* Four Offerings Section */}
              <div className="mt-7 pb-4">
                <p className="text-[13px] sm:text-[14px] font-semibold text-[#665e64] mb-4">
                  With a Pentasent account, you get
                </p>

                <div className="space-y-4">
                  {PENTASENT_OFFERINGS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-start gap-3.5">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5eeea] text-[#4a0139]">
                          <Icon size={17} strokeWidth={2.1} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#1c171a] tracking-tight">
                            {item.title}
                          </p>
                          <p className="text-[12.5px] sm:text-[13px] text-[#6b6267] leading-relaxed mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky / Fixed Bottom Footer (Always Visible) */}
            <div className="shrink-0 border-t border-[#f0eae5] bg-[#fdfcfa] px-6 py-4 sm:px-8 sm:py-5 shadow-[0_-4px_24px_rgba(27,0,25,0.04)]">
              {isLoading ? (
                /* ================= LOADING: SHIMMER USER CARD ================= */
                <AccountCardShimmer />
              ) : isLoggedIn && activeUser ? (
                /* ================= LOGGED IN: REAL USER CARD ================= */
                <div className="rounded-xl border border-[#e8dfd8] bg-white p-4 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    {/* Avatar */}
                    <div className="relative h-12 w-12 shrink-0 rounded-full border-2 border-[#4a0139]/20 overflow-hidden bg-[#faf8f6]">
                      <Image
                        src={avatarSrc}
                        alt={displayName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info & Tags */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-[15px] font-bold text-[#1c171a] truncate">
                          {displayName}
                        </h4>
                        {/* Tags: VIP, Premium, and Verified */}
                        {currentUser?.tags ? (
                          currentUser.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded-md ${
                                tag === 'VIP'
                                  ? 'bg-[#fcedd7] text-[#8a4b08] border border-[#f3d4a8]'
                                  : 'bg-[#4a0139] text-white shadow-2xs'
                              }`}
                            >
                              {tag === 'VIP' && <Crown size={9} className="mr-0.5 text-[#b4620b]" />}
                              {tag}
                            </span>
                          ))
                        ) : (
                          <>
                            {authUser?.isVip && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded-md bg-[#fcedd7] text-[#8a4b08] border border-[#f3d4a8]">
                                <Crown size={9} className="mr-0.5 text-[#b4620b]" />
                                VIP
                              </span>
                            )}
                            {authUser?.isPremium && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded-md bg-[#4a0139] text-white shadow-2xs">
                                <Sparkles size={9} className="mr-0.5 text-[#ffa91f]" />
                                Premium
                              </span>
                            )}
                            {authUser?.isVerified && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Verified
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Account Flag / Headline */}
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#f5eeea] text-[#4a0139] border border-[#e8ded6]">
                          <ShieldCheck size={11} strokeWidth={2.2} />
                          <span className="truncate max-w-[200px]">{headline}</span>
                        </span>
                      </div>

                      {/* Blurred Email */}
                      {userEmail && (
                        <div className="mt-1.5 text-xs text-[#71686e]">
                          <span className="mr-1 text-[11px] font-medium text-[#8f858c]">Email:</span>
                          {renderBlurredEmail(userEmail)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Account Links */}
                  <div className="mt-3 pt-2.5 border-t border-[#f3eee9] grid grid-cols-2 gap-1.5 text-xs">
                    <Link
                      href="/account/profile"
                      onClick={onClose}
                      className="px-2.5 py-1.5 rounded-md bg-[#faf8f6] hover:bg-[#f3ede8] text-[#171317] font-semibold text-center transition-colors"
                    >
                      Public Profile
                    </Link>
                    <Link
                      href="/my-health"
                      onClick={onClose}
                      className="px-2.5 py-1.5 rounded-md bg-[#4a0139]/10 hover:bg-[#4a0139]/15 text-[#4a0139] font-bold text-center transition-colors"
                    >
                      My Health
                    </Link>
                  </div>

                  {/* Card Bottom: Status & Sign Out */}
                  <div className="mt-2.5 pt-2 border-t border-[#f3eee9] flex items-center justify-between">
                    <span className="text-[11px] text-[#8e858a]">
                      Account Active
                    </span>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8b1c43] hover:text-[#5e0c2a] cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <LogOut size={12} />
                      <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= LOGGED OUT: PRIMARY BUTTON ================= */
                <Link
                  href="/auth"
                  onClick={onClose}
                  className="flex h-12 w-full items-center justify-center rounded-md bg-[#4a0139] text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#38012b] shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  Sign up or log in to Pentasent account
                </Link>
              )}

              {/* Bottom Link: Learn / Know more about Pentasent */}
              <div className="mt-3 text-center">
                <Link
                  href="/help"
                  onClick={onClose}
                  className="text-[13px] sm:text-[13.5px] font-semibold text-[#4a0139] hover:underline"
                >
                  Know more about Pentasent
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
