'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { PublicEventDTO } from '@/types/events';
import { apiClient } from '@/lib/api';
import EventCard from '@/components/events/EventCard';

interface CommunityEventsProps {
  communityId: string;
  communityName: string;
}

export default function CommunityEvents({
  communityId,
  communityName,
}: CommunityEventsProps) {
  const [events, setEvents] = useState<PublicEventDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient<PublicEventDTO[]>(`/communities/${communityId}/events`);
        if (isMounted && res.success && res.data) {
          setEvents(res.data);
        }
      } catch (err) {
        console.warn('Error fetching community events:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [communityId]);

  return (
    <div className="space-y-4">
      {/* Events Header Card */}
      <div className="rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b185f]">
            Circle Calendar
          </span>
          <span className="text-[#c5bbb2]">·</span>
          <span className="text-[11.5px] font-semibold text-primary">
            Academic Gatherings
          </span>
        </div>
        <h2 className="mt-1 text-[18px] sm:text-[22px] font-bold text-foreground">
          Events Linked to {communityName}
        </h2>
        <p className="mt-1 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text leading-relaxed">
          Accredited symposia, grand rounds, and virtual journal clubs hosted directly for or affiliated with members of this circle.
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white divide-y divide-[#ded5cd] overflow-hidden">
          {[1, 2].map((idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#faf8f6] animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-[#faf8f6] animate-shimmer" />
                <div className="h-3.5 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
                <div className="h-3 w-1/3 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        /* Populated Events List (Same EventCard as /events page) */
        <div className="rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white divide-y divide-[#ded5cd] overflow-hidden p-4">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              basePath="/events"
              index={index}
            />
          ))}
        </div>
      ) : (
        /* Empty State Card: No events linked to this community */
        <div className="py-12 sm:py-16 text-center rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white p-6 sm:p-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Calendar size={22} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles size={12} />
            <span>Circle Symposia</span>
          </div>
          <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground">
            No Events Scheduled for This Circle Yet
          </h3>
          <p className="mt-2 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text max-w-md mx-auto leading-relaxed">
            There are currently no upcoming grand rounds or peer conferences linked directly to <strong>{communityName}</strong>.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span>Explore All Healthcare Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
