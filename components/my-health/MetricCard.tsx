'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Heart,
  Droplet,
  Scale,
  Moon,
  Footprints,
  Thermometer,
  Wind,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TrackedMetricConfig } from '@/data/my-health';

interface MetricCardProps {
  config: TrackedMetricConfig;
  latestValue?: {
    value: number | null;
    secondaryValue?: number | null;
    unit: string;
    measuredAt: string;
    context?: string | null;
  } | null;
  onLogClick: (metricKey: string) => void;
}

export default function MetricCard({
  config,
  latestValue,
  onLogClick,
}: MetricCardProps) {
  const getMetricIconDetails = (key: string) => {
    switch (key) {
      case 'blood_pressure':
        return {
          icon: <Heart size={18} className="text-rose-600" />,
          container: 'bg-rose-50/90 text-rose-600 border-rose-200/70',
        };
      case 'heart_rate':
        return {
          icon: <Activity size={18} className="text-red-500" />,
          container: 'bg-red-50/90 text-red-600 border-red-200/70',
        };
      case 'blood_glucose':
        return {
          icon: <Droplet size={18} className="text-purple-600" />,
          container: 'bg-purple-50/90 text-purple-700 border-purple-200/70',
        };
      case 'weight':
        return {
          icon: <Scale size={18} className="text-sky-600" />,
          container: 'bg-sky-50/90 text-sky-700 border-sky-200/70',
        };
      case 'sleep':
        return {
          icon: <Moon size={18} className="text-indigo-600" />,
          container: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/70',
        };
      case 'steps':
        return {
          icon: <Footprints size={18} className="text-emerald-600" />,
          container: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/70',
        };
      case 'water':
        return {
          icon: <Droplet size={18} className="text-cyan-600" />,
          container: 'bg-cyan-50/90 text-cyan-700 border-cyan-200/70',
        };
      case 'body_temperature':
        return {
          icon: <Thermometer size={18} className="text-amber-600" />,
          container: 'bg-amber-50/90 text-amber-700 border-amber-200/70',
        };
      case 'respiratory_rate':
      case 'oxygen_saturation':
        return {
          icon: <Wind size={18} className="text-teal-600" />,
          container: 'bg-teal-50/90 text-teal-700 border-teal-200/70',
        };
      default:
        return {
          icon: <Activity size={18} className="text-primary" />,
          container: 'bg-primary/5 text-primary border-primary/20',
        };
    }
  };

  const formatDisplayValue = () => {
    if (!latestValue || (latestValue.value === null && latestValue.secondaryValue === null)) {
      return null;
    }
    if (config.isComposite && latestValue.secondaryValue !== null) {
      return `${latestValue.value} / ${latestValue.secondaryValue}`;
    }
    return `${latestValue.value}`;
  };

  const displayVal = formatDisplayValue();
  const iconMeta = getMetricIconDetails(config.key);

  return (
    <div className="bg-white border border-[#e8e2dc] rounded-lg p-5 sm:p-6 hover:border-primary/40 transition-colors flex flex-col justify-between group">
      <div>
        {/* Header row: Icon & Category tag */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className={`h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${iconMeta.container}`}>
            {iconMeta.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1 rounded-full bg-[#f6f2ec] border border-[#e8e1d8]">
            {config.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
          {config.name}
        </h3>

        <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-1 leading-snug">
          {config.description}
        </p>

        {/* Metric Value Display */}
        <div className="mt-4 pt-3.5 border-t border-[#f3eee9]">
          {displayVal !== null ? (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] sm:text-[30px] font-extrabold tracking-tight text-foreground leading-none">
                  {displayVal}
                </span>
                <span className="text-[13px] font-semibold text-muted-foreground">
                  {latestValue?.unit || config.primaryUnit}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11.5px] text-muted-foreground">
                <span className="truncate mr-2">
                  {latestValue?.context && (
                    <span className="capitalize font-semibold text-foreground mr-1.5">
                      {latestValue.context.replace(/_/g, ' ')} •
                    </span>
                  )}
                  {latestValue?.measuredAt
                    ? new Date(latestValue.measuredAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recently'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full shrink-0">
                  <TrendingUp size={10.5} /> Recorded
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2.5 px-3 rounded-lg bg-[#faf8f5] border border-dashed border-[#e4ded7] flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground font-medium">
                No readings recorded yet
              </span>
              <button
                type="button"
                onClick={() => onLogClick(config.key)}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                + Add
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-[#f3eee9] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onLogClick(config.key)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-primary hover:text-white text-[12px] font-semibold text-foreground border border-[#e4ded7] hover:border-primary transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Log</span>
        </button>

        <Link
          href={`/my-health/tracking/${config.key}`}
          className="inline-flex items-center gap-1 text-[12.5px] font-bold text-primary hover:text-primary-hover transition-colors group/link"
        >
          <span>History</span>
          <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
