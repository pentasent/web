'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  MailCheck,
  MailX,
  Search,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  Loader2,
  Calendar,
  Globe,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FaqSection from '@/components/ui/FaqSection';
import { NEWSLETTER_FAQS } from '@/data/newsletter-faq';
import { notify } from '@/components/ui/toast';
import {
  getNewsletterStatus,
  subscribeNewsletter,
  optOutNewsletter,
  NewsletterStatusData,
} from '@/lib/api/newsletter';

interface ManageNewsletterClientContentProps {
  initialEmail?: string;
  initialStatusData?: NewsletterStatusData | null;
  initialErrorMessage?: string | null;
}

export default function ManageNewsletterClientContent({
  initialEmail = '',
  initialStatusData = null,
  initialErrorMessage = null,
}: ManageNewsletterClientContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlEmail = (searchParams.get('email') || '').trim();
  const activeEmailParam = urlEmail || initialEmail;

  // Track the email whose status is currently loaded in state to prevent infinite loops and duplicate calls
  const [loadedEmail, setLoadedEmail] = useState<string | null>(
    initialStatusData || initialErrorMessage ? (initialEmail || '').trim().toLowerCase() : null
  );

  const [prevActiveEmail, setPrevActiveEmail] = useState(activeEmailParam);
  const [inputEmail, setInputEmail] = useState(activeEmailParam);
  const [statusData, setStatusData] = useState<NewsletterStatusData | null>(initialStatusData);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (initialStatusData || initialErrorMessage) return false;
    return Boolean(activeEmailParam);
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showOptOutConfirm, setShowOptOutConfirm] = useState(false);
  const [optOutReason, setOptOutReason] = useState('Receiving too many communications');

  // Synchronize state during render when URL query param changes (per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  if (prevActiveEmail !== activeEmailParam) {
    setPrevActiveEmail(activeEmailParam);
    setInputEmail(activeEmailParam);
    if (!activeEmailParam) {
      setLoadedEmail(null);
      setStatusData(null);
      setErrorMessage(null);
      setIsLoading(false);
    }
  }

  // Fetch status whenever activeEmailParam changes and has not yet been fetched
  useEffect(() => {
    const cleanParam = activeEmailParam.trim().toLowerCase();

    // Guard: If query param is empty or this email has already been fetched/SSR'd, do NOT fetch again!
    if (!cleanParam || loadedEmail === cleanParam) {
      return;
    }

    let isMounted = true;

    const fetchStatus = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getNewsletterStatus(cleanParam);
        if (!isMounted) return;

        setStatusData(data);
        setLoadedEmail(cleanParam);
        if (!data.exists) {
          notify.info(
            'Email Not Subscribed Yet',
            'No active subscription found for this address. You can subscribe with one click below!'
          );
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to look up subscription status.';
        setErrorMessage(msg);
        setLoadedEmail(cleanParam);
        notify.error('Lookup Failed', msg);
        setStatusData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [activeEmailParam, loadedEmail]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputEmail.trim();
    if (!clean || !clean.includes('@')) {
      notify.error('Please enter a valid email address.');
      return;
    }

    setShowOptOutConfirm(false);

    // If user submits the email that is currently loaded and statusData exists, don't trigger unnecessary re-query
    if (clean.toLowerCase() === (loadedEmail || '').toLowerCase() && statusData) {
      return;
    }

    // If it's already the active URL param (e.g. retrying after error), force refetch by resetting loadedEmail
    if (clean.toLowerCase() === activeEmailParam.toLowerCase()) {
      setLoadedEmail(null);
      return;
    }

    router.push(`/newsletter/manage?email=${encodeURIComponent(clean)}`);
  };

  const handleClear = () => {
    setInputEmail('');
    setLoadedEmail(null);
    setStatusData(null);
    setErrorMessage(null);
    setShowOptOutConfirm(false);
    router.push('/newsletter/manage');
  };

  // Opt-out / Unsubscribe handler
  const handleOptOut = async () => {
    if (!statusData?.email) return;

    setIsActionLoading(true);
    try {
      await optOutNewsletter(statusData.email, optOutReason);
      notify.success(
        'Unsubscribed Successfully',
        'Your email has been opted out of future newsletter updates.'
      );
      setStatusData((prev) =>
        prev
          ? {
              ...prev,
              status: 'unsubscribed',
              unsubscribedAt: new Date().toISOString(),
            }
          : null
      );
      setShowOptOutConfirm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to opt out. Please try again.';
      notify.error('Opt-out Failed', msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Subscribe / Re-subscribe handler
  const handleSubscribe = async () => {
    const targetEmail = (statusData?.email || activeEmailParam || inputEmail).trim();
    if (!targetEmail) return;

    setIsActionLoading(true);
    try {
      await subscribeNewsletter({
        email: targetEmail,
        sourcePlatform: 'web',
        sourcePage: '/newsletter/manage',
        consentSource: 'manage_page_action',
      });

      notify.success(
        'Subscribed Successfully!',
        'Your email preference is active and you are subscribed to Pentasent updates.'
      );

      setLoadedEmail(targetEmail.toLowerCase());
      setStatusData({
        exists: true,
        status: 'subscribed',
        email: targetEmail,
        subscribedAt: new Date().toISOString(),
        unsubscribedAt: null,
        consentSource: 'manage_page_action',
        sourcePlatform: 'web',
      });
      setShowOptOutConfirm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Subscription failed. Please try again.';
      notify.error('Subscription Failed', msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDisplayDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex flex-col justify-between">
        <div>
          {/* Top Subtle Verification Banner (matching /company/employees/certificates) */}
          <div className="w-full bg-[#f4efe9] border-b border-[#e5e0dc] py-3 px-4 text-center">
            <p className="text-[13px] sm:text-[14px] font-medium text-[#2f0036] max-w-5xl mx-auto flex items-center justify-center gap-2">
              <MailCheck size={16} className="text-[#4a0139]" />
              <span>Official Pentasent Subscriber Center • Privacy-First Healthcare Newsletter Preferences</span>
            </p>
          </div>

          {/* Main Verification Container */}
          <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Title & Introduction */}
              <div className="text-center mb-10 sm:mb-12">
       
                <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold text-foreground tracking-tight leading-[1.1]">
                  Manage Newsletter Subscription
                </h1>
                <p className="mt-3.5 sm:mt-4 text-[16px] sm:text-[18px] text-primary-text leading-relaxed max-w-2xl mx-auto">
                  Look up your registered email address to check subscription status, update delivery options, or opt out of{' '}
                  <Link
                    href="/company/about"
                    className="font-semibold text-foreground underline decoration-[#ffa91f] underline-offset-4 hover:text-primary"
                  >
                    Pentasent Healthcare Intelligence
                  </Link>
                  .
                </p>
              </div>

              {/* Primary Search Controls (Exact Tracker Style) */}
              <div className="max-w-3xl mx-auto mb-8">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="Enter registered email address (e.g. name@example.com)..."
                      className="w-full h-13 px-4 pl-11 text-[15px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-lg outline-none transition-all duration-200 placeholder:text-primary-text/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                    />
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-text"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !inputEmail.trim()}
                    className="h-13 px-8 rounded-lg bg-[#ffa91f] text-[#171318] text-[15px] font-bold hover:bg-[#ff9e0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <span>Find Subscription</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {inputEmail && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="inline-flex items-center gap-1 text-[13px] text-primary hover:underline cursor-pointer font-medium"
                    >
                      <RotateCcw size={12} />
                      <span>Clear search</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Error Feedback */}
              {errorMessage && (
                <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[14px]">
                    <p className="font-semibold">{errorMessage}</p>
                    <p className="text-rose-700 mt-0.5 text-[13px]">
                      Please check the email format and try again.
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State Spinner */}
              {isLoading && (
                <div className="max-w-3xl mx-auto mb-10 p-12 text-center bg-[#faf9f8] border border-[#e8e4e1] rounded-2xl">
                  <Loader2 size={32} className="animate-spin text-[#4a0139] mx-auto mb-3" />
                  <p className="text-[15px] font-semibold text-foreground">
                    Verifying Subscription in Primary Registry...
                  </p>
                  <p className="text-[13px] text-primary-text mt-1 font-mono">
                    {activeEmailParam}
                  </p>
                </div>
              )}

              {/* STATUS CARDS WHEN SEARCHED */}
              {!isLoading && statusData && (
                <div className="max-w-3xl mx-auto mb-12">
                  {/* CASE 1: ACTIVE SUBSCRIBER */}
                  {statusData.exists && statusData.status === 'subscribed' && (
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#faf9f8] border border-[#ded9d5] shadow-xs space-y-6">
                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e4e1]">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={13} />
                              <span>Active & Subscribed</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Verified Delivery
                            </span>
                          </div>
                          <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground mt-2 break-all">
                            {statusData.email}
                          </h2>
                        </div>
                        <div className="text-left sm:text-right text-xs text-muted-foreground space-y-1">
                          <p className="flex sm:justify-end items-center gap-1">
                            <Calendar size={13} />
                            <span>Subscribed {formatDisplayDate(statusData.subscribedAt)}</span>
                          </p>
                          <p className="flex sm:justify-end items-center gap-1">
                            <Globe size={13} />
                            <span>Platform: {statusData.sourcePlatform || 'web'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Content Editions List */}
                      <div>
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-[#4a0139] mb-3">
                          Active Intelligence Editions
                        </h3>
                        <div className="space-y-2.5">
                          <div className="p-3.5 rounded-xl bg-white border border-[#e8e4e1] flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                Pentasent Health Pulse (Weekly)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Curated breakthrough research, clinical studies, and healthtech trends.
                              </p>
                            </div>
                            <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                              <Check size={14} />
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-[#e8e4e1] flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                Ecosystem Announcements & Events
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Virtual roundtables, product spotlights, and network updates.
                              </p>
                            </div>
                            <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                              <Check size={14} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Opt-out controls */}
                      <div className="pt-4 border-t border-[#e8e4e1]">
                        {!showOptOutConfirm ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                Want to pause or stop receiving emails?
                              </p>
                              <p className="text-xs text-muted-foreground">
                                You can opt out with one click. Your choice takes effect immediately.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowOptOutConfirm(true)}
                              className="px-4 py-2.5 rounded-lg border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                            >
                              Opt Out / Unsubscribe
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-3">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                              <div className="text-xs text-rose-900">
                                <p className="font-bold text-sm">Confirm Unsubscribe</p>
                                <p className="mt-0.5">
                                  Are you sure you want to stop receiving Pentasent newsletters at{' '}
                                  <span className="font-semibold">{statusData.email}</span>?
                                </p>
                              </div>
                            </div>

                            <div className="pt-1">
                              <label className="block text-[11px] font-semibold text-rose-800 uppercase tracking-wider mb-1">
                                Optional Reason:
                              </label>
                              <select
                                value={optOutReason}
                                onChange={(e) => setOptOutReason(e.target.value)}
                                className="w-full text-xs p-2 rounded bg-white border border-rose-300 text-rose-900 outline-none"
                              >
                                <option value="Receiving too many communications">
                                  Receiving too many communications
                                </option>
                                <option value="Content no longer relevant">
                                  Content is no longer relevant to me
                                </option>
                                <option value="Subscribed by mistake">
                                  Subscribed by mistake
                                </option>
                                <option value="Other">Other preference</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={handleOptOut}
                                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                              >
                                {isActionLoading ? (
                                  <>
                                    <Loader2 size={13} className="animate-spin" />
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <MailX size={13} />
                                    <span>Confirm Opt-Out</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => setShowOptOutConfirm(false)}
                                className="px-3.5 py-2 rounded-lg bg-white border border-rose-200 text-rose-800 text-xs font-medium hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                Keep Subscription
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CASE 2: UNSUBSCRIBED */}
                  {statusData.exists && statusData.status === 'unsubscribed' && (
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#faf9f8] border border-[#ded9d5] shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e8e4e1]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              <MailX size={13} />
                              <span>Currently Opted Out</span>
                            </span>
                          </div>
                          <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground mt-2 break-all">
                            {statusData.email}
                          </h2>
                        </div>
                        <div className="text-left sm:text-right text-xs text-muted-foreground">
                          <p>Opted out {formatDisplayDate(statusData.unsubscribedAt)}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#e8e4e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Miss our healthcare intelligence briefs?
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            You can restore your subscription at any time with one click.
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={handleSubscribe}
                          className="px-6 py-2.5 rounded-lg bg-[#ffa91f] text-[#171318] text-xs font-bold hover:bg-[#ff9e0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 shadow-2xs"
                        >
                          {isActionLoading ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Resubscribing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              <span>Resubscribe Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 3: NOT FOUND / NOT SUBSCRIBED */}
                  {!statusData.exists && (
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#faf9f8] border border-[#ded9d5] shadow-xs space-y-6">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            No Active Subscription
                          </span>
                          <h2 className="text-[20px] font-bold text-foreground mt-1 break-all">
                            {activeEmailParam}
                          </h2>
                          <p className="text-[14px] text-primary-text mt-1">
                            This email address is not currently on any Pentasent newsletter mailing list.
                          </p>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-white border border-[#e8e4e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Subscribe {activeEmailParam} to stay informed?
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Get weekly healthcare technology digests, clinical studies, and event invitations.
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={handleSubscribe}
                          className="px-6 py-3 rounded-lg bg-[#ffa91f] text-[#171318] text-xs font-bold hover:bg-[#ff9e0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 shadow-2xs"
                        >
                          {isActionLoading ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Subscribing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              <span>Subscribe Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 4: SUPPRESSED */}
                  {statusData.exists && statusData.status === 'suppressed' && (
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#faf9f8] border border-[#ded9d5] shadow-xs space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          <Lock size={13} />
                          <span>Delivery Suppressed</span>
                        </span>
                      </div>
                      <h2 className="text-[20px] font-bold text-foreground break-all">
                        {statusData.email}
                      </h2>
                      <p className="text-sm text-primary-text leading-relaxed">
                        Automated newsletter delivery to this email address has been suspended in accordance with email provider suppression policies (e.g. repeated hard bounces or spam complaints).
                      </p>
                      <div className="pt-2">
                        <Link
                          href="/company/contact"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#ded9d5] text-xs font-bold text-foreground hover:bg-[#f4efe9] transition-colors"
                        >
                          <span>Contact Support to Reactivate</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </section>

          {/* FAQ Accordion Section */}
          <FaqSection
            title="FAQs"
            subtitle="Quick answers to common questions about managing your subscription preferences, privacy safeguards, and email delivery."
            items={NEWSLETTER_FAQS}
          />
        </div>

        <Footer showDemo={false} />
      </main>
    </>
  );
}
