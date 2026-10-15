'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { PublicEventDTO, EventDetailDTO } from '@/types/events';
import EventCard from '@/components/events/EventCard';
import EventSubmitModal from '@/components/forms/EventSubmitModal';
import { AccountEventsListShimmer } from '@/shimmer/tracker';
import {
  Calendar,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import { notify } from '@/components/ui/toast';

export default function AccountEventsPage() {
  const { user, status } = useAuth();
  const copy = ACCOUNT_HERO_COPY.events;
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;

  const [activeSubTab, setActiveSubTab] = useState<'created' | 'registered'>('created');

  const [myEvents, setMyEvents] = useState<PublicEventDTO[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<PublicEventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PublicEventDTO | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<PublicEventDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lock background scroll when delete event modal is open
  useEffect(() => {
    if (deletingEvent) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [deletingEvent]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const [mineRes, regRes] = await Promise.all([
        apiClient<PublicEventDTO[]>('/events/mine'),
        apiClient<PublicEventDTO[]>('/events/registered'),
      ]);
      if (mineRes.success && mineRes.data) {
        setMyEvents(mineRes.data);
      } else {
        setMyEvents([]);
      }
      if (regRes.success && regRes.data) {
        setRegisteredEvents(regRes.data);
      } else {
        setRegisteredEvents([]);
      }
    } catch (err) {
      console.warn('Unable to load user events:', err);
      setMyEvents([]);
      setRegisteredEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (isLoggedIn) {
        await fetchEvents();
      } else if (!isAuthLoading) {
        setIsLoading(false);
      }
    };
    void init();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isAuthLoading]);

  // Handle optimistic delete
  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    const targetId = deletingEvent.id;
    setIsDeleting(true);

    const previousEvents = [...myEvents];
    setMyEvents((prev) => prev.filter((e) => e.id !== targetId));
    setDeletingEvent(null);

    try {
      const res = await apiClient<{ deleted: boolean }>(`/events/${targetId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        notify.success('Event deleted successfully.');
      } else {
        setMyEvents(previousEvents);
        notify.error('Failed to delete event.');
      }
    } catch {
      setMyEvents(previousEvents);
      notify.error('Failed to delete event.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel registration
  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }
    const previousReg = [...registeredEvents];
    setRegisteredEvents((prev) => prev.filter((e) => e.id !== eventId));

    try {
      const res = await apiClient(`/events/${eventId}/register`, { method: 'DELETE' });
      if (res.success) {
        notify.success('Registration cancelled successfully.');
      } else {
        setRegisteredEvents(previousReg);
        notify.error('Failed to cancel registration.');
      }
    } catch {
      setRegisteredEvents(previousReg);
      notify.error('Error occurred cancelling registration.');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Account Hero Header */}
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Top Control Bar: Subtabs + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#ded5cd]">
          {/* Sub-tabs: Created vs Registered */}
          <div className="inline-flex p-1 rounded-xl bg-[#faf9f8] border border-[#ded5cd]">
            <button
              type="button"
              onClick={() => setActiveSubTab('created')}
              className={`px-4 py-2 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer ${
                activeSubTab === 'created'
                  ? 'bg-white text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Created Events ({myEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('registered')}
              className={`px-4 py-2 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer ${
                activeSubTab === 'registered'
                  ? 'bg-white text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Registered Events ({registeredEvents.length})
            </button>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => {
              setEditingEvent(null);
              setIsSubmitModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Host New Event</span>
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <AccountEventsListShimmer />
        ) : activeSubTab === 'created' ? (
          myEvents.length > 0 ? (
            <div className="divide-y divide-[#e8e4e1] bg-white rounded-xl border border-[#ded5cd] p-4 sm:p-6">
              {myEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  basePath="/events"
                  index={index}
                  isOwner={true}
                  actions={
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                        <Clock size={13} />
                        <span>Created on {new Date(event.createdAt).toLocaleDateString()}</span>
                        <span className="text-[#ded9d5]">·</span>
                        <span>{event.registrationCount} attendee{event.registrationCount === 1 ? '' : 's'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/events/${event.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ded9d5] hover:bg-[#faf9f8] text-[12.5px] font-semibold text-foreground transition-colors cursor-pointer"
                        >
                          <ExternalLink size={13} />
                          <span>View Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEvent(event);
                            setIsSubmitModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[12.5px] font-semibold text-purple-800 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingEvent(event)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-[12.5px] font-semibold text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white p-6 sm:p-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Calendar size={22} />
              </div>
              <h3 className="text-[18px] font-bold text-foreground">
                No Events Created Yet
              </h3>
              <p className="mt-1.5 text-[14px] text-primary-text max-w-md mx-auto leading-relaxed">
                You haven&apos;t hosted any medical summits, virtual webinars, or workshops yet. Publish your first gathering to share knowledge with the Pentasent clinical network.
              </p>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setIsSubmitModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle size={16} />
                  <span>Host Your First Event</span>
                </button>
              </div>
            </div>
          )
        ) : registeredEvents.length > 0 ? (
          <div className="divide-y divide-[#e8e4e1] bg-white rounded-xl border border-[#ded5cd] p-4 sm:p-6">
            {registeredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={{ ...event, isRegistered: true }}
                basePath="/events"
                index={index}
                actions={
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-[12.5px] text-emerald-800">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span className="font-semibold">Confirmed Registration Pass</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${event.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-hover text-[12.5px] font-semibold transition-colors cursor-pointer"
                      >
                        <ExternalLink size={13} />
                        <span>View Event &amp; Link</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleCancelRegistration(event.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ded9d5] hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-[12.5px] font-medium text-muted-foreground transition-colors cursor-pointer"
                      >
                        <span>Cancel Pass</span>
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white p-6 sm:p-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Calendar size={22} />
            </div>
            <h3 className="text-[18px] font-bold text-foreground">
              No Registered Events
            </h3>
            <p className="mt-1.5 text-[14px] text-primary-text max-w-md mx-auto leading-relaxed">
              You are not currently enrolled in any upcoming healthcare events or virtual symposia.
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Browse Upcoming Events</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Submit / Edit Modal */}
      <EventSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
        onSuccess={() => {
          void fetchEvents();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setDeletingEvent(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Dialog Window */}
          <div className="relative w-full max-w-md flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden">
            {/* Header (Fixed shrink-0) */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
              <div className="flex items-center gap-2.5 text-red-600">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-[17px] font-bold text-foreground">
                  Delete Event
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                disabled={isDeleting}
                className="p-1.5 rounded-md text-primary-text hover:text-foreground hover:bg-[#f6f2ee] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-[14px] text-primary-text leading-relaxed">
                Are you sure you want to delete <strong className="text-foreground">{deletingEvent.title}</strong>? All registered attendee tickets, schedule sessions, and broadcast access links will be permanently deleted.
              </p>
            </div>

            {/* Footer (Fixed shrink-0) */}
            <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf8f6] text-[13px] font-semibold text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Event</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
