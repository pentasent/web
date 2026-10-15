'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, Loader2, Sparkles, Building2, User } from 'lucide-react';
import { EventRegistrationDTO, RegisterEventInput } from '@/types/events';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';

interface EventRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onSuccess: (registration: EventRegistrationDTO) => void;
}

export default function EventRegisterModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSuccess,
}: EventRegisterModalProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(() => user?.displayName || user?.name || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [organizationName, setOrganizationName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scrolling while modal is open
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      notify.error('Please enter your full name and valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: RegisterEventInput = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        organizationName: organizationName.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        phone: phone.trim() || undefined,
      };

      const res = await apiClient<EventRegistrationDTO>(`/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        notify.success('You are registered! Confirmation and calendar access sent.');
        onSuccess(res.data);
        onClose();
      } else {
        notify.error(res.error?.message || 'Failed to complete registration.');
      }
    } catch (err: any) {
      notify.error(err.message || 'An unexpected error occurred during registration.');
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

      {/* Modal Window Container */}
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden">
        {/* Header (Fixed shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#faf0f8] text-primary flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground leading-snug">
                Register for Event
              </h3>
              <p className="text-[12.5px] text-primary-text line-clamp-1">
                {eventTitle}
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
        <form id="event-register-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Smith"
                className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.smith@hospital.org"
              className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Organization / Clinic
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Johns Hopkins"
                className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Clinical Title / Role
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Attending Cardiologist"
                className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full h-11 px-3.5 text-[14px] text-foreground bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
            />
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
            form="event-register-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13.5px] font-semibold transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>Confirm Registration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
