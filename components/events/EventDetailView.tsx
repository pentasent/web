'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Video,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Building2,
  ExternalLink,
  PlusCircle,
  Edit3,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { EventDetailDTO } from '@/types/events';
import { apiClient } from '@/lib/api';
import { EventDetailShimmer } from '@/shimmer/tracker';
import EventHero from '@/components/events/EventHero';
import EventSubmitModal from '@/components/forms/EventSubmitModal';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';

interface EventDetailViewProps {
  slug: string;
  initialEvent?: EventDetailDTO | null;
}

export default function EventDetailView({ slug, initialEvent }: EventDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetailDTO | null>(initialEvent || null);
  const [isLoading, setIsLoading] = useState(!initialEvent);
  const [notFoundState, setNotFoundState] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await apiClient<EventDetailDTO>(`/events/slug/${slug}`);
      if (res.success && res.data) {
        setEvent(res.data);
      } else {
        if (!event) setNotFoundState(true);
      }
    } catch {
      if (!event) setNotFoundState(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!initialEvent) {
      void fetchEvent();
    }
    return () => {
      isMounted = false;
    };
  }, [slug, initialEvent]);

  if (isLoading && !event) {
    return <EventDetailShimmer />;
  }

  if (notFoundState || !event) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-[26px] font-bold text-foreground">Event Not Found</h2>
        <p className="text-[15px] text-primary-text max-w-md mx-auto">
          The event you are looking for may have concluded, been rescheduled, or does not exist.
        </p>
        <div className="pt-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[14px] font-bold transition-colors cursor-pointer"
          >
            <span>Explore Events Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = Boolean(
    event.isOwner || (user && event.organizers.some((o) => o.email === user.email))
  );

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await apiClient(`/events/${event.id}`, { method: 'DELETE' });
      if (res.success) {
        notify.success('Event deleted successfully.');
        router.push('/events');
      } else {
        notify.error('Failed to delete event.');
      }
    } catch {
      notify.error('An error occurred while deleting the event.');
    } finally {
      setIsDeleting(false);
    }
  };

  const descriptionParagraphs = (event.description || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className='mt-16'>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] sm:text-[14px] text-primary-text">
          <li>
            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">
              Home
            </Link>
          </li>
          <li className="flex items-center text-primary-text/40">
            <ChevronRight size={14} />
          </li>
          <li>
            <Link href="/events" className="hover:text-primary transition-colors cursor-pointer">
              Events
            </Link>
          </li>
          <li className="flex items-center text-primary-text/40">
            <ChevronRight size={14} />
          </li>
          <li className="font-semibold text-foreground truncate max-w-56 sm:max-w-xs">
            {event.title}
          </li>
        </ol>
      </nav>

      {/* Event Hero */}
      <EventHero
        event={event}
        onEditClick={() => setIsEditModalOpen(true)}
        onDeleteClick={handleDelete}
        onRegisterSuccess={() => {
          setEvent((prev) => (prev ? { ...prev, isRegistered: true, registrationCount: prev.registrationCount + 1 } : prev));
        }}
      />

      {/* Main Divider */}
      <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column (8 cols): Content flow */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* Section 1: Overview & About */}
          {descriptionParagraphs.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Overview &amp; Objectives
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                About this Event
              </h2>
              <div className="mt-4 space-y-3.5 text-[15px] sm:text-[16px] leading-[1.75] text-primary-text">
                {descriptionParagraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Online Access (Visible to attendees or public) */}
          {event.onlineAccess && (event.isRegistered || isOwner || event.pricingType === 'free') && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#faf9f8] border border-[#ded5cd]">
              <div className="flex items-center gap-2 mb-2">
                <Video size={18} className="text-primary" />
                <h3 className="text-[18px] font-bold text-foreground">
                  Virtual Broadcast Access
                </h3>
              </div>
              <p className="text-[14px] text-primary-text">
                Platform: <strong>{event.onlineAccess.platform}</strong>
              </p>
              {event.onlineAccess.meetingUrl && (
                <div className="mt-3">
                  <a
                    href={event.onlineAccess.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[13.5px] font-semibold hover:bg-primary-hover transition-colors shadow-2xs"
                  >
                    <span>Launch Virtual Broadcast Room</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
              {event.onlineAccess.accessInstructions && (
                <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">
                  {event.onlineAccess.accessInstructions}
                </p>
              )}
            </div>
          )}

          {/* Section 3: Agenda & Schedule */}
          {event.sessions && event.sessions.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Curated Schedule
              </span>
              <h2 className="mt-1.5 mb-5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Agenda &amp; Sessions
              </h2>
              <div className="space-y-4 divide-y divide-[#e8e4e1]">
                {event.sessions.map((sess, idx) => {
                  const startTime = new Date(sess.startAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                  const endTime = new Date(sess.endAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                  return (
                    <div key={sess.id} className={idx > 0 ? 'pt-4' : ''}>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-primary mb-1">
                        <Clock size={13} />
                        <span>
                          {startTime} – {endTime} ({sess.timezone || event.timezone})
                        </span>
                        <span className="text-[#ded9d5]">·</span>
                        <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-[11px] font-bold">
                          {sess.sessionType}
                        </span>
                      </div>
                      <h3 className="text-[18px] font-bold text-foreground">
                        {sess.title}
                      </h3>
                      {sess.description && (
                        <p className="mt-1.5 text-[14.5px] leading-relaxed text-primary-text">
                          {sess.description}
                        </p>
                      )}
                      {sess.venueName && (
                        <div className="mt-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <MapPin size={13} />
                          <span>{sess.venueName}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Keynote Speakers & Faculty */}
          {event.speakers && event.speakers.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Faculty &amp; Keynotes
              </span>
              <h2 className="mt-1.5 mb-5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Featured Speakers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-[#faf9f8] border border-[#ded9d5]"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-bold text-[16px] shrink-0 border border-[#e8e4e1]">
                      {spk.avatarUrl ? (
                        <Image
                          src={spk.avatarUrl}
                          alt={spk.displayName}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      ) : (
                        spk.displayName.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[15px] font-bold text-foreground truncate">
                          {spk.displayName}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                          {spk.speakerType}
                        </span>
                      </div>
                      {spk.title && (
                        <p className="text-[12.5px] font-medium text-primary-text truncate">
                          {spk.title}
                        </p>
                      )}
                      {spk.organizationName && (
                        <p className="text-[12px] text-muted-foreground truncate">
                          {spk.organizationName}
                        </p>
                      )}
                      {spk.bio && (
                        <p className="mt-1.5 text-[13px] text-primary-text leading-relaxed line-clamp-2">
                          {spk.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Organizers & Hosts */}
          {event.organizers && event.organizers.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Host Committee
              </span>
              <h2 className="mt-1.5 mb-4 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Organizing Institution
              </h2>
              <div className="flex flex-wrap gap-4">
                {event.organizers.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#faf9f8] border border-[#ded9d5]"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-bold text-[15px] shrink-0">
                      {org.avatarUrl ? (
                        <Image
                          src={org.avatarUrl}
                          alt={org.displayName}
                          fill
                          sizes="50px"
                          className="object-cover"
                        />
                      ) : (
                        org.displayName.charAt(0)
                      )}
                    </div>
                    <div>
                      <span className="block text-[14.5px] font-bold text-foreground">
                        {org.displayName}
                      </span>
                      <span className="block text-[12.5px] text-muted-foreground">
                        {org.roleTitle || 'Event Host'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Instructions & Preparation */}
          {event.instructions && event.instructions.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Attendee Preparation
              </span>
              <h2 className="mt-1.5 mb-4 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Participant Instructions
              </h2>
              <div className="space-y-3">
                {event.instructions.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-xl bg-[#faf9f8] border border-[#ded9d5]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={16} className="text-primary shrink-0" />
                      <h4 className="text-[15px] font-bold text-foreground">
                        {ins.title}
                      </h4>
                    </div>
                    <p className="text-[14px] text-primary-text leading-relaxed pl-6">
                      {ins.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 7: Resources & Downloads */}
          {event.resources && event.resources.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Materials &amp; Syllabus
              </span>
              <h2 className="mt-1.5 mb-4 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Downloads &amp; Program Syllabus
              </h2>
              <div className="space-y-2.5">
                {event.resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf9f8] border border-[#ded9d5]"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-primary shrink-0" />
                      <div>
                        <span className="block text-[14px] font-bold text-foreground">
                          {res.title}
                        </span>
                        {res.description && (
                          <span className="block text-[12px] text-muted-foreground">
                            {res.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded9d5] hover:bg-white text-primary text-[12.5px] font-semibold transition-colors"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Frequently Asked Questions (FAQs) */}
          {event.faqs && event.faqs.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Questions &amp; Answers
              </span>
              <h2 className="mt-1.5 mb-4 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {event.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 sm:p-5 rounded-xl bg-[#faf9f8] border border-[#ded9d5] transition-all hover:border-primary/40"
                  >
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-foreground flex items-start gap-2.5">
                      <HelpCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-primary-text pl-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-muted-foreground mr-1" />
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#faf9f8] border border-[#ded9d5] text-[12px] font-medium text-primary-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Sidebar */}
        <aside className="lg:col-span-4 border-t border-[#e8e4e1] pt-10 lg:border-0 lg:pt-0">
          <div className="sticky top-24 divide-y divide-[#e8e4e1]">
            {/* Overview Specs */}
            <div className="pb-8 space-y-5">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Event Logistics
                </span>
                <h3 className="mt-1 text-[20px] font-bold text-foreground">
                  Overview Specs
                </h3>
              </div>

              <div className="divide-y divide-[#f0ece9] text-[14px]">
                <div className="pb-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Event Type
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {event.eventType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="py-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Format
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {event.format.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="py-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Admission
                  </span>
                  <span className="font-semibold text-foreground">
                    {event.pricingType === 'free'
                      ? 'Free / Complimentary'
                      : `$${event.priceAmount} ${event.currency}`}
                  </span>
                </div>

                <div className="py-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Timezone
                  </span>
                  <span className="font-medium text-foreground">
                    {event.timezone}
                  </span>
                </div>

                {event.venueSummary && (
                  <div className="py-3">
                    <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Location
                    </span>
                    <span className="font-medium text-foreground">
                      {event.venueSummary}
                    </span>
                  </div>
                )}

                {event.capacity && (
                  <div className="py-3">
                    <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Capacity
                    </span>
                    <span className="font-medium text-foreground">
                      {event.capacity} seats maximum
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Community Callout */}
            {event.community && (
              <div className="py-8">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Linked Clinical Circle
                </span>
                <h4 className="mt-1 text-[17px] font-bold text-foreground">
                  {event.community.name}
                </h4>
                <p className="mt-2 text-[13.5px] leading-relaxed text-primary-text">
                  This event is accredited and organized in collaboration with this clinical peer group.
                </p>
                <div className="mt-3.5">
                  <Link
                    href={`/communities/${event.community.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    <span>View Community Circle</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}

            {/* Owner Management Controls */}
            {isOwner && (
              <div className="py-8 space-y-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Organizer Admin
                </span>
                <h4 className="text-[17px] font-bold text-foreground">
                  Manage This Event
                </h4>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf9f8] text-[13.5px] font-bold text-foreground transition-colors cursor-pointer"
                  >
                    <Edit3 size={15} />
                    <span>Edit Event Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[13.5px] font-bold text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete Event'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Host Your Own Event CTA */}
            <div className="py-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <ShieldCheck size={18} />
                <h4 className="text-[17px] font-bold text-foreground">
                  Clinical Quality Standard
                </h4>
              </div>
              <p className="text-[14px] leading-relaxed text-primary-text">
                Pentasent symposia and workshops are peer-moderated for clinical accuracy, evidence integrity, and educational CME standards.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Edit Modal */}
      <EventSubmitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingEvent={event}
        onSuccess={(updated) => {
          setEvent(updated);
        }}
      />
    </div>
  );
}
