'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquareHeart,
  Send,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';
import { DELETION_FEEDBACK_REASONS } from '@/data/delete-account';

interface DeleteAccountFeedbackFormProps {
  prefilledEmail?: string;
}

const feedbackSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address so we can record your feedback'),
  fullName: z.string().trim().max(120).optional(),
  selectedReason: z.string().min(1, 'Please select a reason or share your thoughts below'),
  comments: z.string().trim().max(2500).optional(),
  wantsSupportFollowUp: z.boolean(),
});

export default function DeleteAccountFeedbackForm({
  prefilledEmail = '',
}: DeleteAccountFeedbackFormProps) {
  const { user, isAuthenticated } = useAuth();

  const [selectedReason, setSelectedReason] = useState<string>('');
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const [fullNameOverride, setFullNameOverride] = useState<string | null>(null);
  const [comments, setComments] = useState<string>('');
  const [wantsSupportFollowUp, setWantsSupportFollowUp] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const defaultEmail = prefilledEmail || (isAuthenticated && user?.email ? user.email : '');
  const defaultFullName = isAuthenticated && user ? user.displayName || user.name || '' : '';

  const email = emailOverride ?? defaultEmail;
  const fullName = fullNameOverride ?? defaultFullName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveReason = selectedReason || (comments.trim().length > 0 ? 'Other reason' : '');

    const validation = feedbackSchema.safeParse({
      email,
      fullName,
      selectedReason: effectiveReason,
      comments,
      wantsSupportFollowUp,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Please complete the required fields.');
      return;
    }

    const derivedName =
      validation.data.fullName && validation.data.fullName.length >= 2
        ? validation.data.fullName
        : validation.data.email.split('@')[0].slice(0, 60) || 'Pentasent Member';

    const messageText = [
      `[Account Deletion Feedback]`,
      `Primary Reason: ${validation.data.selectedReason}`,
      `Support Follow-Up Requested: ${validation.data.wantsSupportFollowUp ? 'Yes' : 'No'}`,
      validation.data.comments ? `Details: ${validation.data.comments}` : 'No additional notes provided.',
    ].join('\n');

    setIsSubmitting(true);
    try {
      const res = await apiClient<{ ticketNumber: string; message: string; status: string }>(
        '/support/contact',
        {
          method: 'POST',
          body: JSON.stringify({
            fullName: derivedName,
            email: validation.data.email,
            inquiryType: 'Community Member / Personal Health Tools',
            message: messageText,
            source: 'pentasent_delete_account_feedback',
          }),
        }
      );

      if (res.success && res.data?.ticketNumber) {
        setSubmittedTicket(res.data.ticketNumber);
        notify.success(
          'Thank you for your feedback',
          `Reference ${res.data.ticketNumber} has been logged with our team.`
        );
        setComments('');
      } else {
        throw new Error(res.message || 'Unable to submit feedback.');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not submit feedback right now. You can also share thoughts via hello@pentasent.com.';
      setError(msg);
      notify.error('Submission failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedTicket) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground">
              Thank you for sharing your feedback
            </h3>
            <p className="mt-1.5 text-[14.5px] text-primary-text leading-relaxed">
              Your feedback has been recorded under reference{' '}
              <span className="font-mono font-bold text-primary">{submittedTicket}</span>. We truly
              appreciate you taking the time to help us make Pentasent better.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {wantsSupportFollowUp && (
                <Link
                  href={`/tracker/support-status?ticket=${encodeURIComponent(submittedTicket)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  <span>Track Support Response</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setSubmittedTicket(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-2 bg-white px-4 py-2 text-[13px] font-semibold text-foreground hover:bg-border-background/50 transition-colors cursor-pointer"
              >
                <span>Submit additional feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-border-2/60 bg-border-background/40 p-5 sm:p-7 space-y-5"
      noValidate
    >
      <div className="flex items-center gap-2.5 text-primary">
        <MessageSquareHeart className="h-5 w-5" />
        <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground tracking-tight">
          Hey Penta Soul: Tell us why you’re leaving
        </h3>
      </div>

      {/* Reason Chips */}
      <div>
        <p className="text-[13.5px] font-semibold text-foreground mb-2.5">
          What best describes your reason for considering deletion?
        </p>
        <div className="flex flex-wrap gap-2">
          {DELETION_FEEDBACK_REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <button
                key={reason}
                type="button"
                onClick={() => {
                  setSelectedReason(isSelected ? '' : reason);
                  if (error) setError(null);
                }}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-medium border transition-all cursor-pointer ${isSelected
                  ? 'bg-primary text-white border-primary shadow-2xs'
                  : 'bg-white text-primary-text border-border-2/70 hover:border-primary/50 hover:text-foreground'
                  }`}
              >
                {reason}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name & Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label
            htmlFor="feedback-email"
            className="block text-[12.5px] font-semibold text-foreground mb-1"
          >
            Account email <span className="text-destructive">*</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmailOverride(e.target.value);
              if (error) setError(null);
            }}
            placeholder="you@example.com"
            className="w-full h-11 px-3.5 rounded-xl border border-border-2 bg-white text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="feedback-name"
            className="block text-[12.5px] font-semibold text-foreground mb-1"
          >
            Your name
          </label>
          <input
            id="feedback-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullNameOverride(e.target.value)}
            placeholder="Full name"
            className="w-full h-11 px-3.5 rounded-xl border border-border-2 bg-white text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>
      </div>

      {/* Additional Comments */}
      <div>
        <label
          htmlFor="feedback-comments"
          className="block text-[12.5px] font-semibold text-foreground mb-1"
        >
          Additional details or suggestions
        </label>
        <textarea
          id="feedback-comments"
          rows={3}
          value={comments}
          onChange={(e) => {
            setComments(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Is there something specific you were looking for, or an improvement that would make Pentasent work better for you?"
          className="w-full p-3.5 rounded-xl border border-border-2 bg-white text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-y"
        />
      </div>

      {/* Support follow-up checkbox */}
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={wantsSupportFollowUp}
          onChange={(e) => setWantsSupportFollowUp(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border-2 text-primary focus:ring-primary cursor-pointer"
        />
        <span className="text-[13.5px] text-primary-text leading-snug">
          I would like a Pentasent support specialist to reach out and help resolve this issue before I delete my account.
        </span>
      </label>

      {error && (
        <p className="text-[13px] font-medium text-destructive">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-[12px] text-muted-foreground">
          Submitting feedback does not automatically delete your account.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

