'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
} from 'lucide-react';
import { fetchMetricTrends, fetchMeasurements, archiveMeasurement } from '@/lib/api/my-health';
import { MetricTrendData, TrendRange, HealthMeasurement } from '@/types/my-health';
import { TRACKED_METRICS_LIST } from '@/data/my-health';
import { MetricDetailShimmer } from '@/shimmer/my-health';
import LogMeasurementModal from '@/components/my-health/forms/LogMeasurementModal';

interface MetricDetailPageProps {
  params: Promise<{ metricKey: string }>;
}

export default function MetricDetailPage({ params }: MetricDetailPageProps) {
  const resolvedParams = use(params);
  const metricKey = resolvedParams.metricKey;

  const metricConfig =
    TRACKED_METRICS_LIST.find((m) => m.key === metricKey) || {
      key: metricKey,
      name: metricKey.replace(/_/g, ' '),
      category: 'vitals',
      primaryUnit: '',
      allowedUnits: [],
      description: '',
    };

  const [range, setRange] = useState<TrendRange>('30d');
  const [trends, setTrends] = useState<MetricTrendData | null>(null);
  const [measurements, setMeasurements] = useState<HealthMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const refreshData = () => {
    Promise.all([
      fetchMetricTrends(metricKey, range),
      fetchMeasurements({ metricKey, limit: 50 }),
    ])
      .then(([trendRes, measRes]) => {
        setTrends(trendRes);
        setMeasurements(measRes.items);
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetchMetricTrends(metricKey, range),
      fetchMeasurements({ metricKey, limit: 50 }),
    ])
      .then(([trendRes, measRes]) => {
        if (!ignore) {
          setTrends(trendRes);
          setMeasurements(measRes.items);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [metricKey, range]);

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this measurement entry?')) return;
    try {
      await archiveMeasurement(id);
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to archive');
    }
  };

  const ranges: { label: string; value: TrendRange }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      {/* Top Header Bar */}
      <div className="w-full bg-[#f6f2ee] border-b border-[#e8e2dc]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-10 lg:px-12">
          <Link
            href="/my-health/tracking"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Metrics</span>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-0.5 rounded-full bg-white border border-[#e8e2dc] shadow-2xs">
                  {metricConfig.category}
                </span>
                <span className="text-[12.5px] text-muted-foreground">
                  Unit: {metricConfig.primaryUnit}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {metricConfig.name}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Log Reading</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-10 lg:px-12">
        {/* Range Filter Buttons */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {ranges.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold transition-colors duration-200 cursor-pointer ${
                  range === r.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted-foreground border border-[#e8e2dc] hover:text-foreground hover:bg-[#faf7f4]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <span className="text-[12.5px] text-muted-foreground">
            {trends?.count || 0} readings in period
          </span>
        </div>

        {/* Stats Summary Cards & Table */}
        {isLoading ? (
          <MetricDetailShimmer />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {/* Latest */}
              <div className="p-5 rounded-lg border border-[#e8e2dc] bg-white">
                <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                  Latest Reading
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-foreground tracking-tight">
                    {trends?.latestValue?.value !== null && trends?.latestValue?.value !== undefined
                      ? trends.latestValue.secondaryValue !== null &&
                        trends.latestValue.secondaryValue !== undefined
                        ? `${trends.latestValue.value}/${trends.latestValue.secondaryValue}`
                        : trends.latestValue.value
                      : '—'}
                  </span>
                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {metricConfig.primaryUnit}
                  </span>
                </div>
                <span className="text-[11.5px] text-muted-foreground block mt-1">
                  {trends?.latestValue?.measuredAt
                    ? new Date(trends.latestValue.measuredAt).toLocaleDateString()
                    : 'No records'}
                </span>
              </div>

              {/* Average */}
              <div className="p-5 rounded-lg border border-[#e8e2dc] bg-white">
                <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                  Period Average
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-foreground tracking-tight">
                    {trends?.average ?? '—'}
                  </span>
                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {metricConfig.primaryUnit}
                  </span>
                </div>
                <span className="text-[11.5px] text-muted-foreground block mt-1">
                  Statistical mean
                </span>
              </div>

              {/* Min & Max */}
              <div className="p-5 rounded-lg border border-[#e8e2dc] bg-white">
                <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                  Range (Min / Max)
                </span>
                <div className="mt-1 flex items-baseline gap-1 text-2xl font-extrabold text-foreground tracking-tight">
                  <span>{trends?.min ?? '—'}</span>
                  <span className="text-muted-foreground text-sm font-normal">/</span>
                  <span>{trends?.max ?? '—'}</span>
                </div>
                <span className="text-[11.5px] text-muted-foreground block mt-1">
                  Observed extremes
                </span>
              </div>

              {/* Trend Direction */}
              <div className="p-5 rounded-lg border border-[#e8e2dc] bg-white">
                <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                  Trend Direction
                </span>
                <div className="mt-2 flex items-center">
                  {trends?.trendDirection === 'up' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[13px] font-bold">
                      <TrendingUp size={15} />
                      <span>Upward</span>
                    </span>
                  ) : trends?.trendDirection === 'down' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[13px] font-bold">
                      <TrendingDown size={15} />
                      <span>Downward</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf7f4] text-foreground border border-[#e8e2dc] text-[13px] font-bold">
                      <Minus size={15} />
                      <span>Steady</span>
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] text-muted-foreground block mt-2">
                  Factual direction
                </span>
              </div>
            </div>

            {/* Measurements Log Table */}
            <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f3eee9] flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-foreground tracking-tight">
                    Logged Readings
                  </h3>
                  <p className="text-[12px] text-muted-foreground">
                    Chronological audit log of tracked measurements
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#faf7f4] border border-[#e8e2dc] text-muted-foreground">
                  {measurements.length} total entries
                </span>
              </div>

              {measurements.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="text-3xl block mb-2">📋</span>
                  <p className="text-[14px] font-bold text-foreground">
                    No readings recorded for {metricConfig.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mt-1">
                    Add your first reading to start tracking your personal trends.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Log Reading</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13.5px]">
                    <thead className="bg-[#faf7f4] border-b border-[#f3eee9] text-[12px] font-bold uppercase text-muted-foreground tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Date & Time</th>
                        <th className="px-6 py-3.5">Value</th>
                        <th className="px-6 py-3.5">Context</th>
                        <th className="px-6 py-3.5">Notes</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3eee9]">
                      {measurements.map((m) => {
                        const valStr = m.secondaryNumericValue
                          ? `${m.numericValue} / ${m.secondaryNumericValue} ${m.unit}`
                          : `${m.numericValue ?? m.textValue ?? '—'} ${m.unit}`;

                        return (
                          <tr key={m.id} className="hover:bg-[#faf7f4]/60 transition-colors">
                            <td className="px-6 py-3.5 font-semibold text-foreground whitespace-nowrap">
                              {new Date(m.measuredAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="px-6 py-3.5 font-extrabold text-foreground">
                              {valStr}
                            </td>
                            <td className="px-6 py-3.5 text-muted-foreground capitalize">
                              {m.context?.replace(/_/g, ' ') || '—'}
                            </td>
                            <td className="px-6 py-3.5 text-muted-foreground max-w-xs truncate">
                              {m.note || '—'}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleArchive(m.id)}
                                className="p-2 text-muted-foreground hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Archive reading"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <LogMeasurementModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        preselectedMetricKey={metricKey}
        onSaved={refreshData}
      />
    </main>
  );
}
