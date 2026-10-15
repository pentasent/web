'use client';

import React, { useState, useEffect } from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import LogMoodModal from '@/components/my-health/forms/LogMoodModal';
import { fetchMoodEntries, archiveMoodEntry } from '@/lib/api/my-health';
import { MoodEntry } from '@/types/my-health';
import { MY_HEALTH_HERO_COPY, MOOD_OPTIONS } from '@/data/my-health';
import { MoodShimmer } from '@/shimmer/my-health';
import { Smile, Plus, Trash2, Zap, AlertTriangle } from 'lucide-react';

export default function MoodPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copy = MY_HEALTH_HERO_COPY.mood;

  const refreshMoodEntries = () => {
    fetchMoodEntries({ limit: 40 })
      .then((list) => setEntries(list))
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetchMoodEntries({ limit: 40 })
      .then((list) => {
        if (!ignore) setEntries(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this mood entry?')) return;
    try {
      await archiveMoodEntry(id);
      refreshMoodEntries();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to archive');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find((e) => e.recordedDate === todayStr);

  const getMoodEmoji = (moodStr: string) => {
    const found = MOOD_OPTIONS.find((m) => m.value === moodStr);
    return found?.emoji || '🙂';
  };

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
        onOpenMoodModal={() => setIsModalOpen(true)}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 md:px-8">
        {isLoading ? (
          <MoodShimmer />
        ) : (
          <>
            {/* Today's Check-in Hero Box */}
            <div className="bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-8 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0">
                    <Smile size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-foreground tracking-tight">
                      Today&apos;s Wellbeing Status
                    </h2>
                    <p className="text-[12.5px] text-muted-foreground">
                      Daily subjective check-in & mindful pulse
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{todayEntry ? 'Update Today&apos;s Check-in' : 'Record Check-in'}</span>
                </button>
              </div>

              {todayEntry ? (
                <div className="bg-[#faf7f4] border border-[#e8e2dc]/70 rounded-lg p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <span className="text-4xl">{getMoodEmoji(todayEntry.mood)}</span>
                      <div>
                        <h3 className="text-[20px] font-extrabold text-foreground capitalize tracking-tight">
                          {todayEntry.mood.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-[12.5px] text-muted-foreground">
                          Recorded on {todayEntry.recordedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-[13px]">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e8e2dc]">
                        <Zap size={14} className="text-primary" />
                        <span className="text-muted-foreground">Energy:</span>
                        <span className="font-bold text-foreground">{todayEntry.energyLevel}/5</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e8e2dc]">
                        <AlertTriangle size={14} className="text-amber-700" />
                        <span className="text-muted-foreground">Stress:</span>
                        <span className="font-bold text-foreground">{todayEntry.stressLevel}/5</span>
                      </div>
                      {todayEntry.sleepQuality && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e8e2dc]">
                          <span className="text-muted-foreground">Sleep:</span>
                          <span className="font-bold text-foreground capitalize">
                            {todayEntry.sleepQuality.replace(/_/g, ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {todayEntry.emotions && todayEntry.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {todayEntry.emotions.map((em) => (
                        <span
                          key={em}
                          className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white border border-[#e8e2dc] text-primary"
                        >
                          {em}
                        </span>
                      ))}
                    </div>
                  )}

                  {todayEntry.whatWentWell && (
                    <div className="pt-2 border-t border-[#e8e2dc]/60">
                      <span className="text-[12px] font-bold uppercase text-muted-foreground block mb-0.5">
                        What went well
                      </span>
                      <p className="text-[14px] text-foreground">
                        {todayEntry.whatWentWell}
                      </p>
                    </div>
                  )}

                  {todayEntry.whatDidNotGoWell && (
                    <div className="pt-2 border-t border-[#e8e2dc]/60">
                      <span className="text-[12px] font-bold uppercase text-muted-foreground block mb-0.5">
                        Challenges / Friction
                      </span>
                      <p className="text-[14px] text-foreground">
                        {todayEntry.whatDidNotGoWell}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#faf7f4] border border-dashed border-[#e8e2dc] rounded-lg p-8 text-center">
                  <span className="text-3xl block mb-2">☀️</span>
                  <p className="text-[15px] font-bold text-foreground">
                    How is your day unfolding?
                  </p>
                  <p className="text-[13.5px] text-muted-foreground max-w-md mx-auto mt-1">
                    Record your daily subjective mood, physical energy, and mindful reflections.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    <span>Record Check-in</span>
                  </button>
                </div>
              )}
            </div>

            {/* History Stream */}
            <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f3eee9] flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-foreground tracking-tight">
                    Past Check-ins
                  </h3>
                  <p className="text-[12px] text-muted-foreground">
                    Historical record of emotional well-being
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#faf7f4] border border-[#e8e2dc] text-muted-foreground">
                  {entries.length} entries
                </span>
              </div>

              {entries.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-[13.5px]">
                  No past check-ins recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-[#f3eee9]">
                  {entries.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-[#faf7f4]/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl mt-0.5">{getMoodEmoji(item.mood)}</span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[16px] font-bold text-foreground capitalize">
                              {item.mood.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[12.5px] text-muted-foreground">
                              • {item.recordedDate}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-muted-foreground">
                            <span>Energy: <strong className="text-foreground">{item.energyLevel}/5</strong></span>
                            <span>•</span>
                            <span>Stress: <strong className="text-foreground">{item.stressLevel}/5</strong></span>
                            {item.sleepQuality && (
                              <>
                                <span>•</span>
                                <span className="capitalize">
                                  Sleep: <strong className="text-foreground">{item.sleepQuality.replace(/_/g, ' ')}</strong>
                                </span>
                              </>
                            )}
                          </div>

                          {item.emotions && item.emotions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.emotions.map((em) => (
                                <span
                                  key={em}
                                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#faf7f4] border border-[#e8e2dc] text-primary shadow-2xs"
                                >
                                  {em}
                                </span>
                              ))}
                            </div>
                          )}

                          {item.whatWentWell && (
                            <p className="text-[13px] text-foreground italic pt-1">
                              &ldquo;{item.whatWentWell}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleArchive(item.id)}
                        className="p-2 text-muted-foreground hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-start cursor-pointer"
                        title="Archive check-in"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <LogMoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={refreshMoodEntries}
      />
    </main>
  );
}
