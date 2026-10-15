'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Globe,
  Sparkles,
  Users,
  CheckCircle2,
  Building2,
  DollarSign,
} from 'lucide-react';
import { PublicEventDTO } from '@/types/events';

interface EventCardProps {
  event: PublicEventDTO;
  basePath?: string;
  index?: number;
  actions?: React.ReactNode;
  isOwner?: boolean;
}

export default function EventCard({
  event,
  basePath = '/events',
  index = 0,
  actions,
  isOwner = false,
}: EventCardProps) {
  const targetHref = `${basePath}/${event.slug}`;

  // Format date cleanly
  const formattedDate = (() => {
    if (!event.nextSessionStart) return 'Date TBA';
    try {
      const d = new Date(event.nextSessionStart);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Date TBA';
    }
  })();

  const formattedTime = (() => {
    if (!event.nextSessionStart) return '';
    try {
      const d = new Date(event.nextSessionStart);
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  })();

  const pricingBadge = (() => {
    if (event.pricingType === 'free') {
      return { label: 'Free Event', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    const amount = event.priceAmount !== null ? `$${event.priceAmount}` : 'Paid';
    return { label: `${amount} ${event.currency || 'USD'}`, class: 'text-slate-700 bg-slate-50 border-slate-200' };
  })();

  const formatBadge = (() => {
    switch (event.format) {
      case 'online':
        return { label: 'Virtual', icon: Globe };
      case 'in_person':
        return { label: 'In-Person', icon: MapPin };
      case 'hybrid':
        return { label: 'Hybrid', icon: Globe };
      default:
        return { label: event.format, icon: Globe };
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group"
    >
      <div className="flex flex-col w-full">
        <div className="pt-6 sm:pt-7 pb-2.5 transition-colors cursor-pointer w-full flex items-start gap-4 sm:gap-5">
          {/* Banner / Monogram Thumbnail */}
          <Link href={targetHref} className="shrink-0 mt-0.5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#faf9f8] border-2 border-[#e8e4e1] flex items-center justify-center transition-transform group-hover:scale-102">
              {event.bannerUrl ? (
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#f4ddf0] to-[#e4c4dc] text-primary p-2 text-center">
                  <Calendar size={20} className="mb-0.5 text-primary" />
                  <span className="font-bold text-[10px] uppercase tracking-wider line-clamp-1">
                    {event.eventType}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Details Body */}
          <div className="flex-1 min-w-0">
            <Link href={targetHref} className="block">
              {/* Header Badges Row */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[12.5px]">
                <span className="font-bold uppercase tracking-[0.16em] text-primary">
                  {event.eventType.replace(/_/g, ' ')}
                </span>

                {event.isFeatured && (
                  <>
                    <span className="text-[#ded9d5]">·</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Sparkles size={11} className="text-amber-600 fill-amber-500" />
                      Featured
                    </span>
                  </>
                )}

                <span className="text-[#ded9d5]">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <formatBadge.icon size={12} className="text-muted-foreground" />
                  {formatBadge.label}
                </span>

                <span className="text-[#ded9d5]">·</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${pricingBadge.class}`}
                >
                  {pricingBadge.label}
                </span>

                {event.community && (
                  <>
                    <span className="text-[#ded9d5]">·</span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      <Users size={12} />
                      {event.community.name}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <div className="mt-1">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  {event.title}
                </h2>
              </div>

              {/* Short Description */}
              {event.shortDescription && (
                <p className="mt-1 text-[14px] sm:text-[15px] leading-[1.65] text-primary-text line-clamp-2 max-w-3xl">
                  {event.shortDescription}
                </p>
              )}

              {/* Meta row: Date, Venue, Organizers, Registration count */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] sm:text-[13px] text-primary-text">
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <Calendar size={13} className="text-primary" />
                  <span>{formattedDate}</span>
                  {formattedTime && <span className="text-muted-foreground">at {formattedTime}</span>}
                </span>

                {event.venueSummary ? (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin size={13} className="text-muted-foreground shrink-0" />
                    <span className="truncate max-w-xs">{event.venueSummary}</span>
                  </span>
                ) : event.format === 'online' ? (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Globe size={13} className="text-muted-foreground" />
                    <span>Virtual Broadcast</span>
                  </span>
                ) : null}

                {event.organizerSummary && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Building2 size={13} className="text-muted-foreground" />
                    <span>{event.organizerSummary.displayName}</span>
                  </span>
                )}

                {event.registrationCount > 0 && (
                  <span className="text-muted-foreground">
                    {event.registrationCount} registered
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Action / Status Pill */}
          {(event.isRegistered || isOwner) && (
            <div className="shrink-0 self-center">
              {event.isRegistered ? (
                <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                  <CheckCircle2 size={18} className="text-emerald-600 mb-0.5" />
                  <span className="text-[11.5px] font-bold">Registered</span>
                </div>
              ) : isOwner ? (
                <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-center">
                  <span className="text-[11.5px] font-bold">Your Event</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {actions && (
          <div className="w-full pt-3 pb-5 border-t border-[#f0ece9]/90">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
