'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, LogOut, Trash2, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export interface AccountHeroProps {
  badge?: string;
  title: string;
  description: string;
}

export default function AccountHero({
  badge = 'Pentasent Account',
  title,
  description,
}: AccountHeroProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Lock background scroll when delete modal is open
  useEffect(() => {
    if (isDeleteModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDeleteModalOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/auth/login');
    } catch {
      router.push('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="w-full bg-border-background border-b border-[#ded9d5]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top row: Badge and Account Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12px] sm:text-[13px] font-semibold text-primary tracking-wide">
                  <Sparkles size={14} className="text-[#ffa91f]" />
                  <span>{badge}</span>
                </div>

                {user?.isVerified && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    <ShieldCheck size={12} />
                    <span>Verified Account</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Logout & Delete Account Option */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#ded9d5] bg-white text-[12.5px] sm:text-[13px] font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-[#faf9f8] transition-all cursor-pointer"
                  title="Sign out of Pentasent"
                >
                  <LogOut size={13} className="text-primary" />
                  <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#ded9d5] bg-white text-[12.5px] sm:text-[13px] font-semibold text-primary-text hover:text-red-700 hover:border-red-300 hover:bg-red-50/40 transition-all cursor-pointer"
                  title="Delete account settings"
                >
                  <Trash2 size={13} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            <h1 className="text-[28px] xs:text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.15]">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] sm:text-[16.5px] leading-relaxed text-primary-text">
              {description}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Delete Account Modal Dialog */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
            >
              {/* Header (Fixed shrink-0) */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-foreground">
                      Delete Pentasent Account
                    </h3>
                    <p className="text-[12.5px] text-muted-foreground">
                      Identity & ecosystem governance
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="space-y-3 text-[14px] leading-relaxed text-primary-text bg-[#faf9f8] border border-[#ded9d5] rounded-lg p-4">
                  <p>
                    <strong>Account Deletion Notice:</strong> Direct self-deletion is scheduled for activation in the upcoming release.
                  </p>
                  <p className="text-[13.5px] text-primary-text/80 leading-relaxed">
                    In accordance with medical data governance and research integrity, deleting a Pentasent account requires automated decoupling of institutional affiliations, product listings, and clinical citations across secondary modules.
                  </p>
                </div>
              </div>

              {/* Footer (Fixed shrink-0 with colored background #faf8f6) */}
              <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 opacity-60 cursor-not-allowed"
                >
                  Delete Account (Pending Release)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
