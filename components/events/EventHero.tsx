'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Globe,
  Share2,
  Check,
  CheckCircle2,
  Sparkles,
  Building2,
  ExternalLink,
  Users,
  Edit3,
  Trash2,
  Clock,
  Video,
} from 'lucide-react';
import { EventDetailDTO } from '@/types/events';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';
import EventRegisterModal from '@/components/events/EventRegisterModal';
import PaidEventModal from '@/components/events/PaidEventModal';

interface EventHeroProps {
  event: EventDetailDTO;
  onEventUpdated?: (updated: EventDetailDTO) => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onRegisterSuccess?: () => void;
}

export default function EventHero({
  event,
  onEventUpdated,
  onEditClick,
  onDeleteClick,
  onRegisterSuccess,
}: EventHeroProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);

  const isOwner = Boolean(
    event.isOwner || (user && event.organizers.some((o) => o.email === user.email))
  );

  const formattedDate = (() => {
    if (!event.nextSessionStart) return 'Date TBA';
    try {
      const d = new Date(event.nextSessionStart);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
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
      return `${d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })} (${event.timezone})`;
    } catch {
      return '';
    }
  })();

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        notify.success('Event link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      notify.info('Copy link manually from URL bar.');
    }
  };

  const handleRegisterClick = () => {
    if (event.pricingType === 'paid') {
      setIsPaidModalOpen(true);
      return;
    }
    if (event.registrationType === 'external' && event.externalRegistrationUrl) {
      window.open(event.externalRegistrationUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setIsRegisterModalOpen(true);
  };

  const pricingBadge = (() => {
    if (event.pricingType === 'free') {
      return { label: 'Free Admission', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    const amount = event.priceAmount !== null ? `$${event.priceAmount}` : 'Paid';
    return { label: `${amount} ${event.currency || 'USD'}`, class: 'text-slate-700 bg-slate-50 border-slate-200' };
  })();

  return (
    <div className="w-full">
      {/* Banner Media Hero Header */}
      {event.bannerUrl && (
        <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden border border-[#ded5cd] mb-6 sm:mb-8">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Calendar size={16} className="text-[#ffd3f0]" />
              <span>{formattedDate}</span>
              {formattedTime && <span>· {formattedTime}</span>}
            </div>
            {event.venueSummary && (
              <div className="flex items-center gap-1.5 text-[13px] text-white/90">
                <MapPin size={15} />
                <span>{event.venueSummary}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[12.5px] mb-2.5">
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
            <span className="inline-flex items-center gap-1 font-semibold text-foreground capitalize">
              {event.format === 'online' ? (
                <Globe size={13} className="text-muted-foreground" />
              ) : (
                <MapPin size={13} className="text-muted-foreground" />
              )}
              {event.format.replace(/_/g, ' ')}
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
                <Link
                  href={`/communities/${event.community.slug}`}
                  className="inline-flex items-center gap-1 text-[11.5px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <Users size={12} />
                  <span>{event.community.name}</span>
                </Link>
              </>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-[26px] xs:text-[30px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.15]">
            {event.title}
          </h1>

          {/* Short description */}
          {event.shortDescription && (
            <p className="mt-3 text-[15px] sm:text-[17px] leading-[1.65] text-primary-text max-w-3xl">
              {event.shortDescription}
            </p>
          )}

          {/* Quick Details Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-primary-text">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Clock size={15} className="text-primary shrink-0" />
              <span>{formattedDate}</span>
              {formattedTime && <span className="text-muted-foreground">· {formattedTime}</span>}
            </span>

            {event.organizers[0] && (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Building2 size={15} className="text-muted-foreground shrink-0" />
                <span>Hosted by <strong>{event.organizers[0].displayName}</strong></span>
              </span>
            )}

            {event.registrationCount > 0 && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Users size={14} />
                <span>{event.registrationCount} attendee{event.registrationCount === 1 ? '' : 's'} registered</span>
              </span>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="shrink-0 flex flex-wrap md:flex-col items-stretch gap-2.5 sm:gap-3 w-full md:w-auto">
          {event.isRegistered ? (
            <div className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px] font-bold text-center shadow-2xs">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>You are Registered</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRegisterClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-[14px] font-bold transition-all shadow-xs cursor-pointer"
            >
              <Calendar size={16} />
              <span>
                {event.pricingType === 'paid'
                  ? 'Reserve Seat / Tickets'
                  : event.registrationType === 'external'
                  ? 'Register on Website'
                  : 'Register for Free'}
              </span>
              {event.registrationType === 'external' && <ExternalLink size={14} />}
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#faf9f8] hover:bg-white text-foreground border border-[#ded9d5] text-[13px] font-medium transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>

            {isOwner && onEditClick && (
              <button
                type="button"
                onClick={onEditClick}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[13px] font-semibold transition-colors cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modals */}
      {isRegisterModalOpen && (
        <EventRegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          eventId={event.id}
          eventTitle={event.title}
          onSuccess={() => {
            if (onRegisterSuccess) onRegisterSuccess();
          }}
        />
      )}

      {isPaidModalOpen && (
        <PaidEventModal
          isOpen={isPaidModalOpen}
          onClose={() => setIsPaidModalOpen(false)}
          eventTitle={event.title}
          priceAmount={event.priceAmount}
          currency={event.currency}
        />
      )}
    </div>
  );
}
