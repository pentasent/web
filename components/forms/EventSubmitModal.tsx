'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Calendar,
  MapPin,
  Globe,
  DollarSign,
  Building2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  PublicEventDTO,
  EventDetailDTO,
  EventType,
  EventFormat,
  EventPricingType,
  CreateEventInput,
  UpdateEventInput,
} from '@/types/events';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';

interface EventSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (event: EventDetailDTO) => void;
  editingEvent?: PublicEventDTO | EventDetailDTO | null;
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'symposium', label: 'Symposium' },
  { value: 'summit', label: 'Summit' },
  { value: 'conference', label: 'Conference' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'journal_club', label: 'Journal Club' },
  { value: 'panel', label: 'Panel Discussion' },
  { value: 'meetup', label: 'Clinical Meetup' },
  { value: 'other', label: 'Other Event' },
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
];

export default function EventSubmitModal({
  isOpen,
  onClose,
  onSuccess,
  editingEvent,
}: EventSubmitModalProps) {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <EventSubmitModalContent
      onClose={onClose}
      onSuccess={onSuccess}
      editingEvent={editingEvent}
    />
  );
}

interface ContentProps {
  onClose: () => void;
  onSuccess: (event: EventDetailDTO) => void;
  editingEvent?: PublicEventDTO | EventDetailDTO | null;
}

function EventSubmitModalContent({ onClose, onSuccess, editingEvent }: ContentProps) {
  const isEditing = Boolean(editingEvent);

  // Form states
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [shortDescription, setShortDescription] = useState(editingEvent?.shortDescription || '');
  const [description, setDescription] = useState(
    ('description' in (editingEvent || {}) ? (editingEvent as EventDetailDTO).description : '') ||
    editingEvent?.shortDescription ||
    ''
  );
  const [eventType, setEventType] = useState<EventType>(editingEvent?.eventType || 'symposium');
  const [format, setFormat] = useState<EventFormat>(editingEvent?.format || 'online');
  const [pricingType, setPricingType] = useState<EventPricingType>(editingEvent?.pricingType || 'free');
  const [priceAmount, setPriceAmount] = useState<string>(
    editingEvent?.priceAmount !== null && editingEvent?.priceAmount !== undefined
      ? String(editingEvent.priceAmount)
      : ''
  );
  const [currency, setCurrency] = useState(editingEvent?.currency || 'USD');
  const [bannerUrl, setBannerUrl] = useState(editingEvent?.bannerUrl || '');
  const [timezone, setTimezone] = useState(editingEvent?.timezone || 'America/New_York');
  const [registrationType, setRegistrationType] = useState(editingEvent?.registrationType || 'platform');
  const [externalRegistrationUrl, setExternalRegistrationUrl] = useState(
    editingEvent?.externalRegistrationUrl || ''
  );
  const [capacity, setCapacity] = useState<string>(
    editingEvent?.capacity ? String(editingEvent.capacity) : ''
  );

  // Session date & time
  const [startAt, setStartAt] = useState(() => {
    if (editingEvent?.nextSessionStart) {
      return new Date(editingEvent.nextSessionStart).toISOString().slice(0, 16);
    }
    const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return defaultDate.toISOString().slice(0, 16);
  });

  const [endAt, setEndAt] = useState(() => {
    if (editingEvent?.nextSessionEnd) {
      return new Date(editingEvent.nextSessionEnd).toISOString().slice(0, 16);
    }
    const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000);
    return defaultDate.toISOString().slice(0, 16);
  });

  // Venue details (if in-person or hybrid)
  const [venueName, setVenueName] = useState('');
  const [venueCity, setVenueCity] = useState('');
  const [venueCountry, setVenueCountry] = useState('United States');

  // Virtual details (if online or hybrid)
  const [virtualPlatform, setVirtualPlatform] = useState('Zoom');
  const [virtualMeetingUrl, setVirtualMeetingUrl] = useState('');

  // Tags
  const [tagsInput, setTagsInput] = useState(editingEvent?.tags?.join(', ') || '');

  // FAQs
  const initialFaqs =
    editingEvent && 'faqs' in editingEvent && Array.isArray((editingEvent as EventDetailDTO).faqs)
      ? (editingEvent as EventDetailDTO).faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))
      : [];
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(initialFaqs);

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      notify.error('Title and full description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const parsedPrice = pricingType === 'paid' && priceAmount ? parseFloat(priceAmount) : undefined;
      const parsedCapacity = capacity ? parseInt(capacity, 10) : undefined;

      const sessions = [
        {
          title: `${title.trim()} - Main Session`,
          sessionType: 'keynote',
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          locationType: format,
        },
      ];

      const venues =
        format === 'in_person' || format === 'hybrid'
          ? [
              {
                venueName: venueName.trim() || 'Main Conference Auditorium',
                city: venueCity.trim() || undefined,
                country: venueCountry.trim() || undefined,
              },
            ]
          : undefined;

      const onlineAccess =
        format === 'online' || format === 'hybrid'
          ? {
              platform: virtualPlatform,
              meetingUrl: virtualMeetingUrl.trim() || undefined,
            }
          : undefined;

      const parsedFaqs = faqs
        .filter((f) => f.question.trim() && f.answer.trim())
        .map((f, idx) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
          sortOrder: idx,
        }));

      const payload: CreateEventInput = {
        title: title.trim(),
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim(),
        eventType,
        format,
        pricingType,
        priceAmount: parsedPrice,
        currency,
        bannerUrl: bannerUrl.trim() || undefined,
        timezone,
        registrationType,
        externalRegistrationUrl:
          registrationType === 'external' && externalRegistrationUrl.trim()
            ? externalRegistrationUrl.trim()
            : undefined,
        capacity: parsedCapacity,
        sessions,
        venues,
        onlineAccess,
        tags: parsedTags,
        faqs: parsedFaqs,
      };

      if (isEditing && editingEvent) {
        const updatePayload: UpdateEventInput = {
          ...payload,
          faqs: parsedFaqs,
        };
        const res = await apiClient<EventDetailDTO>(`/events/${editingEvent.id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatePayload),
        });
        if (res.success && res.data) {
          notify.success('Event updated successfully!');
          onSuccess(res.data);
          onClose();
        } else {
          notify.error(res.error?.message || 'Failed to update event.');
        }
      } else {
        const res = await apiClient<EventDetailDTO>('/events', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          notify.success('Event published successfully!');
          onSuccess(res.data);
          onClose();
        } else {
          notify.error(res.error?.message || 'Failed to create event.');
        }
      }
    } catch (err: any) {
      notify.error(err.message || 'Error occurred while saving event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Window Container - Strict Max Height with Header/Body/Footer separation */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden">
        {/* Header (Fixed shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#faf0f8] text-primary flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground leading-snug">
                {isEditing ? 'Edit Clinical Event' : 'Host Healthcare Event'}
              </h3>
              <p className="text-[12.5px] text-primary-text">
                {isEditing ? 'Update event schedule and streaming details' : 'Publish a new conference, grand rounds, or symposium'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-primary-text hover:text-foreground hover:bg-[#f6f2ee] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Scrollable Body */}
        <form id="event-submit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Global Cardiovascular Longevity Summit 2026"
              className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Short Summary (One-liner)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary appearing in directory cards..."
              className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive agenda overview, learning objectives, targeted medical specialties..."
              className="w-full p-3 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-y"
            />
          </div>

          {/* Type, Format & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full h-11 px-3 text-[13.5px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as EventFormat)}
                className="w-full h-11 px-3 text-[13.5px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              >
                <option value="online">Virtual / Online</option>
                <option value="in_person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-11 px-3 text-[13.5px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Start Date &amp; Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full h-11 px-3 text-[13.5px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                End Date &amp; Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full h-11 px-3 text-[13.5px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Pricing Model */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Pricing
              </label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value as EventPricingType)}
                className="w-full h-11 px-3 text-[13.5px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              >
                <option value="free">Free / Complimentary</option>
                <option value="paid">Paid Admission</option>
              </select>
            </div>

            {pricingType === 'paid' && (
              <>
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Price Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(e.target.value)}
                    placeholder="99"
                    className="w-full h-11 px-3 text-[14px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    className="w-full h-11 px-3 text-[14px] bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Format Conditional Fields */}
          {(format === 'in_person' || format === 'hybrid') && (
            <div className="p-4 rounded-xl bg-[#faf9f8] border border-[#e8e4e1] space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-foreground">
                In-Person Venue Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Venue Name (e.g. Metro Science Center)"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full h-10 px-3 text-[13.5px] bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="City (e.g. New York)"
                  value={venueCity}
                  onChange={(e) => setVenueCity(e.target.value)}
                  className="w-full h-10 px-3 text-[13.5px] bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={venueCountry}
                  onChange={(e) => setVenueCountry(e.target.value)}
                  className="w-full h-10 px-3 text-[13.5px] bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none"
                />
              </div>
            </div>
          )}

          {(format === 'online' || format === 'hybrid') && (
            <div className="p-4 rounded-xl bg-[#faf9f8] border border-[#e8e4e1] space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-foreground">
                Virtual Broadcast / Meeting URL
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={virtualPlatform}
                  onChange={(e) => setVirtualPlatform(e.target.value)}
                  className="w-full h-10 px-3 text-[13.5px] bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none"
                >
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="YouTube Live">YouTube Live</option>
                  <option value="Webex">Cisco Webex</option>
                  <option value="Other">Other Platform</option>
                </select>
                <input
                  type="url"
                  placeholder="Meeting / Stream URL (https://...)"
                  value={virtualMeetingUrl}
                  onChange={(e) => setVirtualMeetingUrl(e.target.value)}
                  className="w-full h-10 px-3 text-[13.5px] bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none"
                />
              </div>
              <p className="text-[12px] text-muted-foreground">
                Note: Meeting URLs are automatically hidden from unverified visitors and displayed to confirmed registrants.
              </p>
            </div>
          )}

          {/* Banner URL & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Banner Image URL
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Capacity / Max Seats (Optional)
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 500"
                className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Medical Specialties &amp; Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Cardiology, AI Diagnostics, Precision Medicine"
              className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary outline-none"
            />
          </div>

          {/* Frequently Asked Questions (FAQs) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground">
                  Frequently Asked Questions (FAQs)
                </label>
                <p className="text-[12px] text-muted-foreground">
                  Add answers to common attendee inquiries about attendance, CME credits, certificates, or prerequisites.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded9d5] hover:border-primary hover:bg-white text-primary text-[12.5px] font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add FAQ</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[#ded9d5] bg-[#faf9f8] text-center text-[13px] text-muted-foreground">
                No FAQs added yet. Click &quot;Add FAQ&quot; to add questions and answers for attendees.
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#ded9d5] bg-[#faf9f8] space-y-2.5 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-primary">
                        FAQ #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="p-1 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove FAQ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                        placeholder="Question (e.g. Will session recordings be available?)"
                        className="w-full h-10 px-3 text-[13.5px] text-foreground bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                        placeholder="Answer (e.g. Yes, all registered participants will receive lifetime access to high-definition recordings within 48 hours.)"
                        className="w-full p-2.5 text-[13.5px] text-foreground bg-white border border-[#ded9d5] rounded-lg focus:border-primary outline-none resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </form>

        {/* Footer (Fixed shrink-0) */}
        <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf8f6] text-[13.5px] font-semibold text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="event-submit-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13.5px] font-semibold transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving Event...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>{isEditing ? 'Save Changes' : 'Publish Event'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
