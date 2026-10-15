'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';
import { PublicCommunityDTO } from '@/types/communities';

interface DeleteCommunityModalProps {
  isOpen: boolean;
  community: PublicCommunityDTO | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCommunityModal({
  isOpen,
  community,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCommunityModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !community) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
        >
          {/* Header (Fixed shrink-0) */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-[17px] font-bold text-foreground">
                Delete Community Circle
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="p-1.5 rounded-md text-primary-text hover:text-foreground hover:bg-[#f6f2ee] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <p className="text-[14px] text-primary-text leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-foreground">{community.name}</strong>?
            </p>

            <div className="p-3.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9] text-[12.5px] text-primary-text leading-relaxed">
              <strong className="text-foreground">Integrity Notice:</strong> All associated post categories, rules, and member roles will be unlinked. Historical discussion records will be archived to preserve ecosystem integrity.
            </div>
          </div>

          {/* Footer (Fixed shrink-0) */}
          <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf8f6] text-[13px] font-semibold text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[13px] font-bold transition-all cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={13} />
                  <span>Confirm Delete</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
