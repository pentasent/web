'use client';

import React, { useState, useEffect } from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import MetricCard from '@/components/my-health/MetricCard';
import LogMeasurementModal from '@/components/my-health/forms/LogMeasurementModal';
import {
  MY_HEALTH_HERO_COPY,
  TRACKED_METRICS_LIST,
} from '@/data/my-health';
import { fetchMeasurements } from '@/lib/api/my-health';
import { HealthMeasurement } from '@/types/my-health';
import { MetricGridShimmer } from '@/shimmer/my-health';

type CategoryFilter = 'all' | 'vitals' | 'body' | 'activity' | 'nutrition' | 'sleep';

export default function HealthTrackingPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [measurementsMap, setMeasurementsMap] = useState<Record<string, HealthMeasurement>>({});
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('blood_pressure');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const copy = MY_HEALTH_HERO_COPY.tracking;

  const refreshMeasurements = () => {
    fetchMeasurements({ limit: 100 })
      .then((res) => {
        const map: Record<string, HealthMeasurement> = {};
        for (const m of res.items) {
          if (!map[m.metricKey]) {
            map[m.metricKey] = m;
          }
        }
        setMeasurementsMap(map);
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetchMeasurements({ limit: 100 })
      .then((res) => {
        if (!ignore) {
          const map: Record<string, HealthMeasurement> = {};
          for (const m of res.items) {
            if (!map[m.metricKey]) {
              map[m.metricKey] = m;
            }
          }
          setMeasurementsMap(map);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenLog = (metricKey: string) => {
    setSelectedMetricKey(metricKey);
    setIsLogModalOpen(true);
  };

  const filteredMetrics = TRACKED_METRICS_LIST.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'All Metrics (12)', value: 'all' },
    { label: 'Cardiovascular & Vitals', value: 'vitals' },
    { label: 'Body Composition', value: 'body' },
    { label: 'Daily Activity', value: 'activity' },
    { label: 'Nutrition & Water', value: 'nutrition' },
    { label: 'Sleep & Rest', value: 'sleep' },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
        onOpenQuickLog={() => handleOpenLog('blood_pressure')}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12">
        {/* Category Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted-foreground border border-[#e8e2dc] hover:text-foreground hover:bg-[#faf7f4]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Metric Cards Grid */}
        {isLoading ? (
          <MetricGridShimmer count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMetrics.map((config) => {
              const latest = measurementsMap[config.key];
              const latestVal = latest
                ? {
                    value: latest.numericValue,
                    secondaryValue: latest.secondaryNumericValue,
                    unit: latest.unit,
                    measuredAt: latest.measuredAt,
                    context: latest.context,
                  }
                : null;

              return (
                <MetricCard
                  key={config.key}
                  config={config}
                  latestValue={latestVal}
                  onLogClick={handleOpenLog}
                />
              );
            })}
          </div>
        )}
      </div>

      <LogMeasurementModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        preselectedMetricKey={selectedMetricKey}
        onSaved={refreshMeasurements}
      />
    </main>
  );
}
