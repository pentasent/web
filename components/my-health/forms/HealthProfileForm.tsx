'use client';

import React, { useState } from 'react';
import { HealthProfileData, BloodGroup } from '@/types/my-health';
import { BLOOD_GROUP_OPTIONS } from '@/data/my-health';
import { updateHealthProfile } from '@/lib/api/my-health';
import { Save, Check, AlertCircle, ChevronDown } from 'lucide-react';

interface HealthProfileFormProps {
  initialData: HealthProfileData;
  onSaved?: (updated: HealthProfileData) => void;
}

export default function HealthProfileForm({
  initialData,
  onSaved,
}: HealthProfileFormProps) {
  const [heightValue, setHeightValue] = useState<string>(
    initialData.heightValue ? String(initialData.heightValue) : ''
  );
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in' | 'ft'>(
    initialData.heightUnit || 'cm'
  );
  const [weightValue, setWeightValue] = useState<string>(
    initialData.currentWeightValue ? String(initialData.currentWeightValue) : ''
  );
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(
    initialData.currentWeightUnit || 'kg'
  );
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    initialData.bloodGroup || 'unknown'
  );
  const [healthNotes, setHealthNotes] = useState<string>(
    initialData.healthNotes || ''
  );

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const parsedHeight = heightValue ? parseFloat(heightValue) : null;
      const parsedWeight = weightValue ? parseFloat(weightValue) : null;

      const updated = await updateHealthProfile({
        heightValue: parsedHeight,
        heightUnit,
        currentWeightValue: parsedWeight,
        currentWeightUnit: weightUnit,
        bloodGroup: bloodGroup === 'unknown' ? null : bloodGroup,
        healthNotes: healthNotes.trim() || null,
      });

      setStatusMessage({
        type: 'success',
        text: 'Health profile baseline updated successfully.',
      });
      onSaved?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update health profile';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 text-[14px] ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
              : 'bg-red-50 text-red-800 border-red-200/80'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check size={18} className="shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Grid: Physical Height & Baseline Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 min-w-0">
        {/* Height */}
        <div className="min-w-0">
          <label className="block text-[12.5px] sm:text-[13px] font-bold text-foreground mb-1.5">
            Physical Height
          </label>
          <div className="flex items-center rounded-lg border border-[#e8e2dc] bg-[#faf7f4] focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all min-w-0 overflow-hidden">
            <input
              type="number"
              step="0.1"
              min="30"
              max="280"
              inputMode="decimal"
              value={heightValue}
              onChange={(e) => setHeightValue(e.target.value)}
              placeholder="e.g. 175"
              className="flex-1 min-w-0 h-[46px] px-3.5 text-[14px] sm:text-[14.5px] text-[#1e1c1b] bg-transparent border-0 outline-none placeholder:text-muted-foreground/60"
            />
            <div className="relative border-l border-[#e8e2dc] shrink-0 w-[85px] h-[46px] bg-[#f4eee8]">
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value as 'cm' | 'in' | 'ft')}
                className="w-full h-full pl-3 pr-7 text-[13px] font-semibold text-foreground bg-transparent border-0 outline-none appearance-none cursor-pointer"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Current measurement for BMI calculation
          </p>
        </div>

        {/* Weight */}
        <div className="min-w-0">
          <label className="block text-[12.5px] sm:text-[13px] font-bold text-foreground mb-1.5">
            Baseline Body Weight
          </label>
          <div className="flex items-center rounded-lg border border-[#e8e2dc] bg-[#faf7f4] focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all min-w-0 overflow-hidden">
            <input
              type="number"
              step="0.1"
              min="2"
              max="500"
              inputMode="decimal"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              placeholder="e.g. 72.5"
              className="flex-1 min-w-0 h-[46px] px-3.5 text-[14px] sm:text-[14.5px] text-[#1e1c1b] bg-transparent border-0 outline-none placeholder:text-muted-foreground/60"
            />
            <div className="relative border-l border-[#e8e2dc] shrink-0 w-[85px] h-[46px] bg-[#f4eee8]">
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
                className="w-full h-full pl-3 pr-7 text-[13px] font-semibold text-foreground bg-transparent border-0 outline-none appearance-none cursor-pointer"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Synchronizes with latest weight readings
          </p>
        </div>
      </div>

      {/* Blood Group */}
      <div className="min-w-0">
        <label className="block text-[12.5px] sm:text-[13px] font-bold text-foreground mb-1.5">
          Blood Group
        </label>
        <div className="relative w-full h-[46px] rounded-lg border border-[#e8e2dc] bg-[#faf7f4] focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
            className="w-full h-full pl-3.5 pr-8 text-[14px] text-foreground bg-transparent border-0 outline-none appearance-none cursor-pointer"
          >
            {BLOOD_GROUP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Critical for acute trauma and clinical emergency reference
        </p>
      </div>

      {/* Health Notes */}
      <div className="min-w-0">
        <label className="block text-[12.5px] sm:text-[13px] font-bold text-foreground mb-1.5">
          General Health Notes & Baseline Observations
        </label>
        <textarea
          rows={4}
          value={healthNotes}
          onChange={(e) => setHealthNotes(e.target.value)}
          placeholder="e.g. Routine marathon training; seasonal allergic rhinitis in spring; non-smoker."
          className="w-full min-w-0 min-h-[110px] p-3.5 text-[14px] sm:text-[14.5px] text-[#1e1c1b] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 leading-relaxed"
        />
        <p className="mt-1 text-[12px] text-muted-foreground">
          Private notes visible only to you. Never shared with public directories.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-[13.5px] font-bold hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save size={15} />
          <span>{isLoading ? 'Saving Baseline...' : 'Save Health Profile'}</span>
        </button>
      </div>
    </form>
  );
}
