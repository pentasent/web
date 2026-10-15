'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Save, AlertCircle } from 'lucide-react';
import { AllergyRecord, AllergySeverity } from '@/types/my-health';
import { ALLERGY_SEVERITY_OPTIONS } from '@/data/my-health';
import { createAllergy, updateAllergy } from '@/lib/api/my-health';

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  allergyToEdit?: AllergyRecord | null;
  onSaved?: () => void;
}

const fieldBase =
  'w-full min-w-0 h-[46px] px-3.5 text-[14px] text-[#1e1c1b] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

export default function AllergyModal({
  isOpen,
  onClose,
  allergyToEdit,
  onSaved,
}: AllergyModalProps) {
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
    <AllergyModalContent
      key={allergyToEdit?.id || 'new-allergy'}
      allergyToEdit={allergyToEdit}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function AllergyModalContent({
  onClose,
  allergyToEdit,
  onSaved,
}: {
  onClose: () => void;
  allergyToEdit?: AllergyRecord | null;
  onSaved?: () => void;
}) {
  const [allergen, setAllergen] = useState(allergyToEdit?.allergen || '');
  const [reaction, setReaction] = useState(allergyToEdit?.reaction || '');
  const [severity, setSeverity] = useState<AllergySeverity>(
    allergyToEdit?.severity || 'moderate'
  );
  const [note, setNote] = useState(allergyToEdit?.note || '');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!allergen.trim()) {
        throw new Error('Please specify the allergen name');
      }

      if (allergyToEdit) {
        await updateAllergy(allergyToEdit.id, {
          allergen: allergen.trim(),
          reaction: reaction.trim() || null,
          severity,
          note: note.trim() || null,
        });
      } else {
        await createAllergy({
          allergen: allergen.trim(),
          reaction: reaction.trim() || null,
          severity,
          note: note.trim() || null,
        });
      }

      onSaved?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save allergy record';
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
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-foreground leading-snug">
                  {allergyToEdit ? 'Edit Allergy Record' : 'Add Known Allergy'}
                </h3>
                <p className="text-[12.5px] text-muted-foreground">
                  Clinical allergy & adverse reaction documentation
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
          <form id="allergy-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-[13.5px] flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Allergen */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Allergen / Substance Name
              </label>
              <input
                type="text"
                required
                value={allergen}
                onChange={(e) => setAllergen(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Latex, Shellfish"
                className={fieldBase}
              />
            </div>

            {/* Reaction */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Observed Reaction (Optional)
              </label>
              <input
                type="text"
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                placeholder="e.g. Urticaria / hives, lip swelling, breathing difficulty"
                className={fieldBase}
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Reaction Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AllergySeverity)}
                className="w-full h-[46px] px-3.5 text-[14px] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none cursor-pointer focus:border-primary focus:bg-white"
              >
                {ALLERGY_SEVERITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Additional Clinical Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. First observed in 2017 during dental procedure."
                className="w-full p-3 text-[13.5px] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none focus:border-primary focus:bg-white"
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
              form="allergy-form"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{isLoading ? 'Saving...' : allergyToEdit ? 'Update Allergy' : 'Save Allergy'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
