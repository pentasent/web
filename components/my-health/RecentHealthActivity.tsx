'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Smile, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import { RecentHealthActivityItem } from '@/types/my-health';

interface RecentHealthActivityProps {
  activities: RecentHealthActivityItem[];
}

export default function RecentHealthActivity({
  activities,
}: RecentHealthActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#f3eee9] bg-gradient-to-r from-[#fbf9f6] to-white flex items-center justify-between">
          <h3 className="text-[16.5px] font-bold text-foreground tracking-tight">
            Recent Health Activity
          </h3>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-0.5 rounded-full bg-[#f6f2ec] border border-[#e8e1d8]">
            0 entries
          </span>
        </div>
        <div className="p-8 sm:p-12 text-center">
          <div className="h-12 w-12 mx-auto rounded-lg bg-primary/5 border border-primary/15 flex items-center justify-center text-primary mb-3.5">
            <Clock size={20} />
          </div>
          <h4 className="text-[16px] font-bold text-foreground">
            No Health History Logged Yet
          </h4>
          <p className="text-[13.5px] text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
            Your longitudinal health journey starts here. Add your first vital measurement or daily mood check-in.
          </p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: RecentHealthActivityItem['type']) => {
    switch (type) {
      case 'measurement':
        return {
          icon: <Activity size={16} className="text-primary" />,
          container: 'bg-primary/5 border-primary/15',
        };
      case 'mood':
        return {
          icon: <Smile size={16} className="text-amber-600" />,
          container: 'bg-amber-50 border-amber-200/70',
        };
      case 'allergy':
        return {
          icon: <ShieldAlert size={16} className="text-rose-600" />,
          container: 'bg-rose-50 border-rose-200/70',
        };
      default:
        return {
          icon: <Activity size={16} className="text-primary" />,
          container: 'bg-primary/5 border-primary/15',
        };
    }
  };

  const formatActivityTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-[#e8e2dc] rounded-lg overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#f3eee9] bg-gradient-to-r from-[#fbf9f6] to-white flex items-center justify-between">
        <h3 className="text-[16.5px] font-bold text-foreground tracking-tight">
          Recent Health Activity
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-0.5 rounded-full bg-[#f6f2ec] border border-[#e8e1d8]">
          Latest {activities.length} entries
        </span>
      </div>

      <div className="divide-y divide-[#f3eee9]">
        {activities.map((item) => {
          const iconMeta = getActivityIcon(item.type);
          return (
            <div
              key={item.id}
              className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-[#faf8f5] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${iconMeta.container}`}>
                  {iconMeta.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-[12.5px] text-muted-foreground truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[12px] text-muted-foreground whitespace-nowrap">
                  {formatActivityTime(item.timestamp)}
                </span>

                {item.metricKey && (
                  <Link
                    href={`/my-health/tracking/${item.metricKey}`}
                    className="text-primary hover:text-primary-hover p-1.5 rounded-lg hover:bg-primary/5 transition-all"
                    title="View Metric History"
                  >
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
