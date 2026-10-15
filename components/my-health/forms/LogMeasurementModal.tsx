'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Save, AlertCircle } from 'lucide-react';
import { TRACKED_METRICS_LIST, TrackedMetricConfig } from '@/data/my-health';
import { createMeasurement } from '@/lib/api/my-health';

interface LogMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMetricKey?: string;
  onSaved?: () => void;
}

const fieldBase =
  'w-full min-w-0 h-[46px] px-3.5 text-[14px] text-[#1e1c1b] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

const selectWrapper =
  'relative w-full h-[46px] rounded-lg border border-[#e8e2dc] bg-[#faf7f4] focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden';

const selectElement =
  'w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none appearance-none cursor-pointer';

export default function LogMeasurementModal({
  isOpen,
  onClose,
  preselectedMetricKey,
  onSaved,
}: LogMeasurementModalProps) {
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
    <LogMeasurementModalContent
      key={preselectedMetricKey || 'default-metric'}
      preselectedMetricKey={preselectedMetricKey}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function LogMeasurementModalContent({
  onClose,
  preselectedMetricKey,
  onSaved,
}: {
  onClose: () => void;
  preselectedMetricKey?: string;
  onSaved?: () => void;
}) {
  const [selectedKey, setSelectedKey] = useState<string>(
    preselectedMetricKey || 'blood_pressure'
  );

  const activeConfig: TrackedMetricConfig =
    TRACKED_METRICS_LIST.find((m) => m.key === selectedKey) ||
    TRACKED_METRICS_LIST[0];

  const [numericValue, setNumericValue] = useState<string>('');
  const [secondaryValue, setSecondaryValue] = useState<string>('');
  const [unit, setUnit] = useState<string>(activeConfig.primaryUnit);
  const [context, setContext] = useState<string>('');
  const [recordedDate, setRecordedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKeyChange = (newKey: string) => {
    setSelectedKey(newKey);
    const cfg = TRACKED_METRICS_LIST.find((m) => m.key === newKey) || TRACKED_METRICS_LIST[0];
    setUnit(cfg.primaryUnit);
    setContext(cfg.contexts?.[0] || '');
    setNumericValue('');
    setSecondaryValue('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const numVal = numericValue ? parseFloat(numericValue) : null;
      const secVal = secondaryValue ? parseFloat(secondaryValue) : null;

      if (numVal === null) {
        throw new Error('Please enter a valid numeric value');
      }

      if (activeConfig.isComposite && secVal === null) {
        throw new Error('Please enter both systolic and diastolic values');
      }

      await createMeasurement({
        metricKey: selectedKey,
        numericValue: numVal,
        secondaryNumericValue: secVal,
        unit,
        context: context || null,
        recordedDate,
        note: note.trim() || null,
        source: 'manual',
      });

      onSaved?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save measurement';
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
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-foreground leading-snug">
                  Log Health Reading
                </h3>
                <p className="text-[12.5px] text-muted-foreground">
                  Record structured vital or body measurement
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
          <form id="measurement-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-[13.5px] flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Metric Selector */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Metric
              </label>
              <div className={selectWrapper}>
                <select
                  value={selectedKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  className={selectElement}
                >
                  {TRACKED_METRICS_LIST.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.name} ({m.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inputs based on composite vs regular */}
            {activeConfig.isComposite ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">
                    Systolic
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={numericValue}
                    onChange={(e) => setNumericValue(e.target.value)}
                    placeholder="e.g. 120"
                    className={fieldBase}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">
                    Diastolic
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={secondaryValue}
                    onChange={(e) => setSecondaryValue(e.target.value)}
                    placeholder="e.g. 80"
                    className={fieldBase}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[13px] font-bold text-foreground">
                    Value
                  </label>
                  <span className="text-[12px] text-muted-foreground font-semibold">
                    Unit: {unit}
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  required
                  value={numericValue}
                  onChange={(e) => setNumericValue(e.target.value)}
                  placeholder={`Enter value in ${unit}`}
                  className={fieldBase}
                />
              </div>
            )}

            {/* Unit Selector if multiple allowed */}
            {activeConfig.allowedUnits && activeConfig.allowedUnits.length > 1 && (
              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">
                  Unit
                </label>
                <div className={selectWrapper}>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className={selectElement}
                  >
                    {activeConfig.allowedUnits.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Context Selector */}
            {activeConfig.contexts && activeConfig.contexts.length > 0 && (
              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">
                  Context / State
                </label>
                <div className={selectWrapper}>
                  <select
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className={selectElement}
                  >
                    <option value="">Default context</option>
                    {activeConfig.contexts.map((ctx) => (
                      <option key={ctx} value={ctx}>
                        {ctx.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Date Recorded */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={recordedDate}
                onChange={(e) => setRecordedDate(e.target.value)}
                className={fieldBase}
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Taken 10 mins post-workout; rested state."
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
              form="measurement-form"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{isLoading ? 'Recording...' : 'Record Reading'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
