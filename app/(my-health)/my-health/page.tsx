'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import MetricCard from '@/components/my-health/MetricCard';
import RecentHealthActivity from '@/components/my-health/RecentHealthActivity';
import LogMeasurementModal from '@/components/my-health/forms/LogMeasurementModal';
import LogMoodModal from '@/components/my-health/forms/LogMoodModal';
import { fetchHealthOverview } from '@/lib/api/my-health';
import { HealthOverviewData } from '@/types/my-health';
import {
  MY_HEALTH_HERO_COPY,
  TRACKED_METRICS_LIST,
  MOOD_OPTIONS,
} from '@/data/my-health';
import { HealthOverviewShimmer } from '@/shimmer/my-health';
import { Smile, PhoneCall, Plus, ArrowRight } from 'lucide-react';

const fallbackOverview: HealthOverviewData = {
  profileSummary: {
    hasProfile: false,
    heightValue: null,
    heightUnit: 'cm',
    currentWeightValue: null,
    currentWeightUnit: 'kg',
    bloodGroup: null,
    healthNotes: null,
    allergiesCount: 0,
    emergencyContactsCount: 0,
    primaryEmergencyContact: null,
  },
  healthSnapshot: {
    bloodPressure: null,
    heartRate: null,
    bloodGlucose: null,
    weight: null,
    sleep: null,
    steps: null,
    water: null,
    oxygenSaturation: null,
    bodyTemperature: null,
  },
  wellbeing: {
    todayMood: null,
    recentMoods: [],
  },
  recentActivity: [],
};

export default function MyHealthOverviewPage() {
  const [data, setData] = useState<HealthOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('blood_pressure');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  const refreshOverview = () => {
    fetchHealthOverview()
      .then((res) => setData(res))
      .catch(() => setData(fallbackOverview));
  };

  useEffect(() => {
    let ignore = false;
    fetchHealthOverview()
      .then((res) => {
        if (!ignore) setData(res);
      })
      .catch(() => {
        if (!ignore) setData(fallbackOverview);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenLog = (metricKey?: string) => {
    if (metricKey) {
      setSelectedMetricKey(metricKey);
    }
    setIsLogModalOpen(true);
  };

  const copy = MY_HEALTH_HERO_COPY.overview;

  // Primary 6 metrics for snapshot grid
  const primaryMetricKeys = [
    'blood_pressure',
    'heart_rate',
    'blood_glucose',
    'weight',
    'sleep',
    'steps',
  ];

  const primaryConfigs = TRACKED_METRICS_LIST.filter((m) =>
    primaryMetricKeys.includes(m.key)
  );

  const getSnapshotForMetric = (key: string) => {
    if (!data?.healthSnapshot) return null;
    switch (key) {
      case 'blood_pressure':
        return data.healthSnapshot.bloodPressure
          ? {
              value: data.healthSnapshot.bloodPressure.systolic,
              secondaryValue: data.healthSnapshot.bloodPressure.diastolic,
              unit: data.healthSnapshot.bloodPressure.unit,
              measuredAt: data.healthSnapshot.bloodPressure.measuredAt,
              context: data.healthSnapshot.bloodPressure.context,
            }
          : null;
      case 'heart_rate':
        return data.healthSnapshot.heartRate
          ? {
              value: data.healthSnapshot.heartRate.bpm,
              unit: data.healthSnapshot.heartRate.unit,
              measuredAt: data.healthSnapshot.heartRate.measuredAt,
              context: data.healthSnapshot.heartRate.context,
            }
          : null;
      case 'blood_glucose':
        return data.healthSnapshot.bloodGlucose
          ? {
              value: data.healthSnapshot.bloodGlucose.value,
              unit: data.healthSnapshot.bloodGlucose.unit,
              measuredAt: data.healthSnapshot.bloodGlucose.measuredAt,
              context: data.healthSnapshot.bloodGlucose.context,
            }
          : null;
      case 'weight':
        return data.healthSnapshot.weight
          ? {
              value: data.healthSnapshot.weight.value,
              unit: data.healthSnapshot.weight.unit,
              measuredAt: data.healthSnapshot.weight.measuredAt,
            }
          : null;
      case 'sleep':
        return data.healthSnapshot.sleep
          ? {
              value: data.healthSnapshot.sleep.durationMinutes,
              unit: data.healthSnapshot.sleep.unit,
              measuredAt: data.healthSnapshot.sleep.measuredAt,
              context: data.healthSnapshot.sleep.context,
            }
          : null;
      case 'steps':
        return data.healthSnapshot.steps
          ? {
              value: data.healthSnapshot.steps.steps,
              unit: data.healthSnapshot.steps.unit,
              measuredAt: data.healthSnapshot.steps.measuredAt,
            }
          : null;
      default:
        return null;
    }
  };

  const todayMoodConfig = data?.wellbeing?.todayMood
    ? MOOD_OPTIONS.find((m) => m.value === data.wellbeing.todayMood?.mood)
    : null;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
        onOpenQuickLog={() => handleOpenLog()}
        onOpenMoodModal={() => setIsMoodModalOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12">
        {isLoading ? (
          <HealthOverviewShimmer />
        ) : (
          <>
            {/* Quick Baseline Bar */}
            <div className="bg-white/90 backdrop-blur-xs border border-[#e8e2dc] rounded-lg p-4 sm:p-5 mb-9 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-7 text-[13.5px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-muted-foreground text-[12.5px]">Blood Group:</span>
                  <span className="font-bold text-foreground bg-[#faf7f4] border border-[#e8e2dc] px-2 py-0.5 rounded-md text-[13px]">
                    {data?.profileSummary.bloodGroup || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary/50 shrink-0" />
                  <span className="text-muted-foreground text-[12.5px]">Height:</span>
                  <span className="font-bold text-foreground">
                    {data?.profileSummary.heightValue
                      ? `${data.profileSummary.heightValue} ${data.profileSummary.heightUnit}`
                      : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-muted-foreground text-[12.5px]">Weight Baseline:</span>
                  <span className="font-bold text-foreground">
                    {data?.profileSummary.currentWeightValue
                      ? `${data.profileSummary.currentWeightValue} ${data.profileSummary.currentWeightUnit}`
                      : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-muted-foreground text-[12.5px]">Known Allergies:</span>
                  <span className="font-bold text-foreground">
                    {data?.profileSummary.allergiesCount || 0}
                  </span>
                </div>
              </div>

              <Link
                href="/my-health/profile"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/5 hover:bg-primary hover:text-white text-primary text-[12.5px] font-bold border border-primary/10 transition-all cursor-pointer group"
              >
                <span>Edit Baseline</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Section 1: Health Snapshot (Vitals & Body) */}
            <section className="mb-11">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground tracking-tight">
                    Health Snapshot
                  </h2>
                  <p className="text-[13.5px] text-muted-foreground mt-0.5">
                    Current physiological metrics and latest recorded vital signs
                  </p>
                </div>

                <Link
                  href="/my-health/tracking"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-bold text-primary hover:text-primary-hover hover:bg-primary/5 transition-all group"
                >
                  <span>View All 12 Metrics</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {primaryConfigs.map((config) => (
                  <MetricCard
                    key={config.key}
                    config={config}
                    latestValue={getSnapshotForMetric(config.key)}
                    onLogClick={handleOpenLog}
                  />
                ))}
              </div>
            </section>

            {/* Section 2: Today's Wellbeing & Emergency Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-11">
              {/* Today's Wellbeing Card */}
              <div className="lg:col-span-2 bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-600 flex items-center justify-center shrink-0">
                        <Smile size={20} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-bold text-foreground tracking-tight">
                          Today&apos;s Wellbeing & Reflection
                        </h3>
                        <p className="text-[12.5px] text-muted-foreground">
                          Daily emotional balance, energy score, and reflections
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMoodModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-[12.5px] font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>{data?.wellbeing?.todayMood ? 'Update' : 'Check-in'}</span>
                    </button>
                  </div>

                  {data?.wellbeing?.todayMood ? (
                    <div className="bg-[#faf7f4] rounded-lg p-5 border border-[#ede7e1] space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl filter drop-shadow-xs">
                            {todayMoodConfig?.emoji || '🙂'}
                          </span>
                          <div>
                            <span className="text-[16.5px] font-bold text-foreground capitalize tracking-tight">
                              {data.wellbeing.todayMood.mood.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[12px] text-muted-foreground block">
                              Recorded today
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-[13px]">
                          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#e8e2dc]">
                            <span className="text-muted-foreground text-[10.5px] block font-semibold uppercase tracking-wider">Energy</span>
                            <span className="font-bold text-foreground">{data.wellbeing.todayMood.energyLevel}/5</span>
                          </div>
                          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#e8e2dc]">
                            <span className="text-muted-foreground text-[10.5px] block font-semibold uppercase tracking-wider">Stress</span>
                            <span className="font-bold text-foreground">{data.wellbeing.todayMood.stressLevel}/5</span>
                          </div>
                          {data.wellbeing.todayMood.sleepQuality && (
                            <div className="bg-white px-3 py-1.5 rounded-lg border border-[#e8e2dc]">
                              <span className="text-muted-foreground text-[10.5px] block font-semibold uppercase tracking-wider">Sleep</span>
                              <span className="font-bold text-foreground capitalize">
                                {data.wellbeing.todayMood.sleepQuality.replace(/_/g, ' ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {data.wellbeing.todayMood.emotions &&
                        data.wellbeing.todayMood.emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {data.wellbeing.todayMood.emotions.map((em) => (
                              <span
                                key={em}
                                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white border border-primary/15 text-primary"
                              >
                                {em}
                              </span>
                            ))}
                          </div>
                        )}

                      {data.wellbeing.todayMood.whatWentWell && (
                        <p className="text-[13px] text-primary-text italic border-l-2 border-primary/40 pl-3 py-0.5 mt-2">
                          &ldquo;{data.wellbeing.todayMood.whatWentWell}&rdquo;
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-7 px-4 text-center flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-3">
                        <Smile size={24} />
                      </div>
                      <p className="text-[15.5px] font-bold text-foreground">
                        No check-in recorded for today yet
                      </p>
                      <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                        Take 30 seconds to log how you feel, your energy, and any positive moment.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsMoodModalOpen(true)}
                        className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white text-[12.5px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
                      >
                        <span>Record Daily Check-in</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-[#f3eee9] flex items-center justify-between text-[12.5px]">
                  <span className="text-muted-foreground">
                    Wellbeing trends: {data?.wellbeing?.recentMoods?.length || 0} entries this week
                  </span>
                  <Link
                    href="/my-health/mood"
                    className="font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 group/cal"
                  >
                    <span>Mood Calendar</span>
                    <ArrowRight size={13} className="transition-transform group-hover/cal:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* Emergency Safety Card */}
              <div className="bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center shrink-0">
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-foreground tracking-tight">
                        Emergency Contact
                      </h3>
                      <p className="text-[12px] text-muted-foreground">
                        Urgent clinical point of contact
                      </p>
                    </div>
                  </div>

                  {data?.profileSummary?.primaryEmergencyContact ? (
                    <div className="bg-[#faf7f4] rounded-lg p-4.5 border border-[#ede7e1] space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[15px] font-bold text-foreground">
                          {data.profileSummary.primaryEmergencyContact.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                          Primary
                        </span>
                      </div>
                      <p className="text-[12.5px] text-muted-foreground font-medium">
                        {data.profileSummary.primaryEmergencyContact.relationship}
                      </p>
                      <a
                        href={`tel:${data.profileSummary.primaryEmergencyContact.phone}`}
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-white border border-[#e4ded7] text-[13.5px] font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        <PhoneCall size={13} />
                        <span>{data.profileSummary.primaryEmergencyContact.phone}</span>
                      </a>
                    </div>
                  ) : (
                    <div className="py-7 px-4 text-center flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mb-3">
                        <PhoneCall size={20} />
                      </div>
                      <p className="text-[14.5px] font-bold text-foreground">
                        No emergency contact designated
                      </p>
                      <p className="text-[12.5px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                        Add an urgent contact for medical emergencies.
                      </p>
                      <Link
                        href="/my-health/emergency"
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[12.5px] font-bold hover:bg-primary-hover transition-colors"
                      >
                        <Plus size={13} />
                        <span>Add Contact</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-[#f3eee9] flex items-center justify-between text-[12.5px]">
                  <span className="text-muted-foreground">
                    Total Contacts: {data?.profileSummary?.emergencyContactsCount || 0}
                  </span>
                  <Link
                    href="/my-health/emergency"
                    className="font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 group/em"
                  >
                    <span>Manage Contacts</span>
                    <ArrowRight size={13} className="transition-transform group-hover/em:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Section 3: Recent Health Activity Stream */}
            <section className="mb-12">
              <RecentHealthActivity activities={data?.recentActivity || []} />
            </section>
          </>
        )}
      </div>

      {/* Modals */}
      <LogMeasurementModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        preselectedMetricKey={selectedMetricKey}
        onSaved={refreshOverview}
      />

      <LogMoodModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        onSaved={refreshOverview}
      />
    </main>
  );
}
