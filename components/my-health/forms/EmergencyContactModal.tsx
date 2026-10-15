'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, Save, AlertCircle } from 'lucide-react';
import { EmergencyContactRecord } from '@/types/my-health';
import { createEmergencyContact, updateEmergencyContact } from '@/lib/api/my-health';

interface EmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: EmergencyContactRecord | null;
  onSaved?: () => void;
}

const fieldBase =
  'w-full min-w-0 h-[46px] px-3.5 text-[14px] text-[#1e1c1b] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

export default function EmergencyContactModal({
  isOpen,
  onClose,
  contactToEdit,
  onSaved,
}: EmergencyContactModalProps) {
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

  if (!isOpen) return null;

  return (
    <EmergencyContactModalContent
      key={contactToEdit?.id || 'new-contact'}
      contactToEdit={contactToEdit}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function EmergencyContactModalContent({
  onClose,
  contactToEdit,
  onSaved,
}: {
  onClose: () => void;
  contactToEdit?: EmergencyContactRecord | null;
  onSaved?: () => void;
}) {
  const [name, setName] = useState(contactToEdit?.name || '');
  const [relationship, setRelationship] = useState(contactToEdit?.relationship || '');
  const [phone, setPhone] = useState(contactToEdit?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(contactToEdit?.alternatePhone || '');
  const [isPrimary, setIsPrimary] = useState(contactToEdit?.isPrimary || false);
  const [notes, setNotes] = useState(contactToEdit?.notes || '');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!name.trim() || !relationship.trim() || !phone.trim()) {
        throw new Error('Please fill in name, relationship, and primary phone number');
      }

      if (contactToEdit) {
        await updateEmergencyContact(contactToEdit.id, {
          name: name.trim(),
          relationship: relationship.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone.trim() || null,
          isPrimary,
          notes: notes.trim() || null,
        });
      } else {
        await createEmergencyContact({
          name: name.trim(),
          relationship: relationship.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone.trim() || null,
          isPrimary,
          notes: notes.trim() || null,
        });
      }

      onSaved?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save emergency contact';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

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
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#e8e2dc] shadow-2xl z-10 overflow-hidden"
        >
          {/* Header (Fixed shrink-0) */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <PhoneCall size={18} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-foreground leading-snug">
                  {contactToEdit ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
                </h3>
                <p className="text-[12.5px] text-muted-foreground">
                  Safety network & urgent escalation point of contact
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf7f4] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form id="emergency-contact-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-[13.5px] flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className={fieldBase}
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Relationship
              </label>
              <input
                type="text"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Spouse, Parent, Sibling, Primary Care Physician"
                className={fieldBase}
              />
            </div>

            {/* Phone numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555-019-2834"
                  className={fieldBase}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">
                  Alternate Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="e.g. +1 555-019-9944"
                  className={fieldBase}
                />
              </div>
            </div>

            {/* Primary Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="isPrimaryContact"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-[#e8e2dc] text-primary focus:ring-primary/20 cursor-pointer shadow-none"
              >
              </input>
              <label
                htmlFor="isPrimaryContact"
                className="text-[13.5px] font-semibold text-foreground cursor-pointer"
              >
                Set as primary emergency contact
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Reachable daytime, keyholder"
                className={fieldBase}
              />
            </div>
          </form>

          {/* Footer (Fixed shrink-0 with colored background) */}
          <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#e8e2dc] bg-white hover:bg-[#faf8f6] text-[13px] font-semibold text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="emergency-contact-form"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{isLoading ? 'Saving...' : contactToEdit ? 'Update Contact' : 'Save Contact'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
