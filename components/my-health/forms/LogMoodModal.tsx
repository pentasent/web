'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, Save, AlertCircle } from 'lucide-react';
import {
  MOOD_OPTIONS,
  EMOTION_CHIPS,
  SLEEP_QUALITY_OPTIONS,
} from '@/data/my-health';
import { MoodType, SleepQuality } from '@/types/my-health';
import { logMoodEntry } from '@/lib/api/my-health';

interface LogMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const fieldBase =
  'w-full min-w-0 h-[46px] px-3.5 text-[14px] text-[#1e1c1b] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

const textareaBase =
  'w-full min-w-0 p-3.5 text-[13.5px] text-[#1e1c1b] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 leading-relaxed';

export default function LogMoodModal({
  isOpen,
  onClose,
  onSaved,
}: LogMoodModalProps) {
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
    <LogMoodModalContent
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function LogMoodModalContent({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [selectedMood, setSelectedMood] = useState<MoodType>('good');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | ''>('good');
  const [feelingText, setFeelingText] = useState<string>('');
  const [whatWentWell, setWhatWentWell] = useState<string>('');
  const [whatDidNotGoWell, setWhatDidNotGoWell] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleEmotion = (chip: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(chip) ? prev.filter((e) => e !== chip) : [...prev, chip]
    );
  };

  const activeMoodConfig =
    MOOD_OPTIONS.find((m) => m.value === selectedMood) || MOOD_OPTIONS[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const todayDateStr = new Date().toISOString().split('T')[0];

      await logMoodEntry({
        mood: selectedMood,
        moodScore: activeMoodConfig.score,
        emotions: selectedEmotions,
        energyLevel,
        stressLevel,
        sleepQuality: sleepQuality ? sleepQuality : null,
        feelingText: feelingText.trim() || null,
        whatWentWell: whatWentWell.trim() || null,
        whatDidNotGoWell: whatDidNotGoWell.trim() || null,
        recordedDate: todayDateStr,
      });

      onSaved?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record mood entry';
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
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#e8e2dc] shadow-2xl z-10 overflow-hidden"
        >
          {/* Header (Fixed shrink-0) */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center">
                <Smile size={18} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-foreground leading-snug">
                  Daily Wellbeing Check-in
                </h3>
                <p className="text-[12.5px] text-muted-foreground">
                  Record your subjective mood, energy, and reflections
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
          <form id="mood-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-[13.5px] flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mood selector buttons */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-2">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((opt) => {
                  const isSelected = selectedMood === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedMood(opt.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-[#e8e2dc] bg-[#faf7f4]/60 hover:bg-white text-foreground'
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-[11px] capitalize">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy and Stress 1-5 sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-foreground mb-1.5">
                  <span>Physical Energy</span>
                  <span className="text-primary font-extrabold">{energyLevel}/5</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergyLevel(lvl)}
                      className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg border cursor-pointer transition-all ${
                        energyLevel === lvl
                          ? 'bg-primary text-white border-primary'
                          : 'bg-[#faf7f4] text-foreground border-[#e8e2dc] hover:bg-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-foreground mb-1.5">
                  <span>Stress Level</span>
                  <span className="text-amber-700 font-extrabold">{stressLevel}/5</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStressLevel(lvl)}
                      className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg border cursor-pointer transition-all ${
                        stressLevel === lvl
                          ? 'bg-amber-700 text-white border-amber-700'
                          : 'bg-[#faf7f4] text-foreground border-[#e8e2dc] hover:bg-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Emotion Chips */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-2">
                What emotions are present? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EMOTION_CHIPS.map((chip) => {
                  const isSelected = selectedEmotions.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleEmotion(chip)}
                      className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-white border-primary'
                          : 'bg-[#faf7f4] text-foreground border-[#e8e2dc] hover:border-primary/50'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">
                Sleep Quality Last Night
              </label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value as SleepQuality)}
                className="w-full h-[46px] px-3.5 text-[14px] bg-[#faf7f4] border border-[#e8e2dc] rounded-lg outline-none cursor-pointer focus:border-primary focus:bg-white"
              >
                <option value="">Select sleep quality (optional)</option>
                {SLEEP_QUALITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reflections (Optional) */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[12.5px] font-bold text-foreground mb-1">
                  What went well today? (Optional)
                </label>
                <input
                  type="text"
                  value={whatWentWell}
                  onChange={(e) => setWhatWentWell(e.target.value)}
                  placeholder="e.g. Completed research sprint; enjoyed lunch with family."
                  className={fieldBase}
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-foreground mb-1">
                  What did not go well or caused friction? (Optional)
                </label>
                <input
                  type="text"
                  value={whatDidNotGoWell}
                  onChange={(e) => setWhatDidNotGoWell(e.target.value)}
                  placeholder="e.g. Afternoon fatigue; missed workout."
                  className={fieldBase}
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-foreground mb-1">
                  Daily Thought / Reflection (Optional)
                </label>
                <textarea
                  rows={2}
                  value={feelingText}
                  onChange={(e) => setFeelingText(e.target.value)}
                  placeholder="Anything else you'd like to remember about today..."
                  className={textareaBase}
                />
              </div>
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
              form="mood-form"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{isLoading ? 'Saving...' : 'Save Check-in'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
