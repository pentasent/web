'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Loader2,
  Lock,
  Package,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import type { ProductCardDTO } from '@/types/products';
import type { PublicCommunityDTO } from '@/types/communities';
import type { PublicEventDTO } from '@/types/events';

interface AccountOfferingsCheckerProps {
  resolvedEmail: string;
  onEmailResolved: (email: string) => void;
}

const emailValidator = z.string().trim().email('Please enter a valid email address');

export default function AccountOfferingsChecker({
  resolvedEmail,
  onEmailResolved,
}: AccountOfferingsCheckerProps) {
  const { user, status: authStatus } = useAuth();
  const isLoggedIn = authStatus === 'authenticated' && Boolean(user);

  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const emailInput = emailOverride ?? (resolvedEmail || '');
  const [emailCheckState, setEmailCheckState] = useState<{
    status: 'idle' | 'loading' | 'found' | 'not_found' | 'error';
    message: string;
    checkedEmail?: string;
  }>({ status: 'idle', message: '' });

  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [ownedProducts, setOwnedProducts] = useState<ProductCardDTO[]>([]);
  const [createdCommunities, setCreatedCommunities] = useState<PublicCommunityDTO[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<PublicCommunityDTO[]>([]);
  const [hostedEvents, setHostedEvents] = useState<PublicEventDTO[]>([]);

  // Fetch authenticated user's managed offerings/assets
  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }

    let isMounted = true;
    const loadAssets = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setAssetsLoading(true);
      try {
        const [productsRes, communitiesRes, eventsRes] = await Promise.allSettled([
          apiClient<ProductCardDTO[]>('/products/mine'),
          apiClient<{ created: PublicCommunityDTO[]; joined: PublicCommunityDTO[] }>(
            '/communities/mine'
          ),
          apiClient<PublicEventDTO[]>('/events/mine'),
        ]);

        if (!isMounted) return;

        if (productsRes.status === 'fulfilled' && productsRes.value.success) {
          setOwnedProducts(productsRes.value.data || []);
        }
        if (communitiesRes.status === 'fulfilled' && communitiesRes.value.success) {
          setCreatedCommunities(communitiesRes.value.data?.created || []);
          setJoinedCommunities(communitiesRes.value.data?.joined || []);
        }
        if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
          setHostedEvents(eventsRes.value.data || []);
        }
      } catch {
        // Fallback gracefully if an optional resource fails
      } finally {
        if (isMounted) {
          setAssetsLoading(false);
          setAssetsLoaded(true);
        }
      }
    };

    void loadAssets();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user]);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailValidator.safeParse(emailInput);

    if (!parsed.success) {
      setEmailCheckState({
        status: 'error',
        message: parsed.error.issues[0]?.message || 'Please enter a valid email address.',
      });
      return;
    }

    const normalizedEmail = parsed.data.toLowerCase();
    onEmailResolved(normalizedEmail);

    // If matching the signed-in user, scroll focus to live summary
    if (isLoggedIn && user?.email?.toLowerCase() === normalizedEmail) {
      setEmailCheckState({
        status: 'found',
        checkedEmail: normalizedEmail,
        message:
          'You are currently signed in with this account. Review your active managed services in the dashboard summary below.',
      });
      return;
    }

    setEmailCheckState({ status: 'loading', message: '' });

    try {
      const res = await apiClient<{ exists: boolean }>('/auth/check-email', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (res.data?.exists) {
        setEmailCheckState({
          status: 'found',
          checkedEmail: normalizedEmail,
          message: `An active Pentasent account exists for ${normalizedEmail}. For privacy protection, sign in or visit your Account Portal to inspect, delete, or delegate managed products, communities, events, or hospital/organization profiles.`,
        });
      } else {
        setEmailCheckState({
          status: 'not_found',
          checkedEmail: normalizedEmail,
          message: `No active Pentasent account was found matching "${normalizedEmail}". Double-check the spelling or try another sign-in email.`,
        });
      }
    } catch (err: unknown) {
      setEmailCheckState({
        status: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Unable to verify this email right now. Please sign in to check your account directly.',
      });
    }
  };

  const totalOwnedBlockingItems =
    ownedProducts.length + createdCommunities.length + hostedEvents.length;

  return (
    <div className="mt-6 rounded-2xl border border-border-2/60 bg-border-background/50 p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border-2/50">
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-wider">
            <Search className="h-4 w-4" />
            <span>Check Your Managed Services & Offerings</span>
          </div>
          <h3 className="mt-1 text-[17px] sm:text-[18px] font-bold text-foreground tracking-tight">
            Inspect active products, communities, events & organizations
          </h3>
        </div>

        {!isLoggedIn && (
          <Link
            href="/auth/login?redirect=/help/delete-account"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary-hover transition-colors shrink-0 w-fit"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Sign in to view live items</span>
          </Link>
        )}
      </div>

      {/* Mode 1: Live Signed-In User Asset Breakdown */}
      {isLoggedIn && user && (
        <div className="mt-5 rounded-xl border border-border-2/70 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-2/40">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>
                Signed in as <span className="text-primary font-bold">{user.email}</span>
              </span>
            </div>

            {assetsLoading ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Checking active offerings...</span>
              </span>
            ) : assetsLoaded ? (
              totalOwnedBlockingItems > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[11.5px] font-bold text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{totalOwnedBlockingItems} managed item(s) require action</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11.5px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>No owned products, communities, or events found</span>
                </span>
              )
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Products */}
            <div className="rounded-xl border border-border-2/50 bg-[#faf9f8] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-foreground">
                    <Package className="h-4 w-4 text-primary" />
                    <span>Products Owned</span>
                  </span>
                  <span className="text-[12.5px] font-bold px-2 py-0.5 rounded-md bg-white border border-border-2/60 text-foreground">
                    {assetsLoading ? '—' : ownedProducts.length}
                  </span>
                </div>
                {ownedProducts.length > 0 ? (
                  <p className="mt-1.5 text-[12.5px] text-primary-text line-clamp-2">
                    {ownedProducts.map((p) => p.name).join(', ')}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                    No active product listings owned.
                  </p>
                )}
              </div>
              <Link
                href="/account/products"
                className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:underline"
              >
                <span>Manage in My Products</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Communities */}
            <div className="rounded-xl border border-border-2/50 bg-[#faf9f8] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Communities Owned</span>
                  </span>
                  <span className="text-[12.5px] font-bold px-2 py-0.5 rounded-md bg-white border border-border-2/60 text-foreground">
                    {assetsLoading ? '—' : createdCommunities.length}
                  </span>
                </div>
                {createdCommunities.length > 0 ? (
                  <p className="mt-1.5 text-[12.5px] text-primary-text line-clamp-2">
                    {createdCommunities.map((c) => c.name).join(', ')}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                    {joinedCommunities.length > 0
                      ? `0 owned (${joinedCommunities.length} joined as member).`
                      : 'No owned communities found.'}
                  </p>
                )}
              </div>
              <Link
                href="/account/communities"
                className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:underline"
              >
                <span>Manage in My Communities</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Events */}
            <div className="rounded-xl border border-border-2/50 bg-[#faf9f8] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Hosted Events</span>
                  </span>
                  <span className="text-[12.5px] font-bold px-2 py-0.5 rounded-md bg-white border border-border-2/60 text-foreground">
                    {assetsLoading ? '—' : hostedEvents.length}
                  </span>
                </div>
                {hostedEvents.length > 0 ? (
                  <p className="mt-1.5 text-[12.5px] text-primary-text line-clamp-2">
                    {hostedEvents.map((ev) => ev.title).join(', ')}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                    No hosted events active.
                  </p>
                )}
              </div>
              <Link
                href="/account/events"
                className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:underline"
              >
                <span>Manage in My Events</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Organizations / Hospitals */}
            <div className="rounded-xl border border-border-2/50 bg-[#faf9f8] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Hospitals & Organizations</span>
                  </span>
                  <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-md bg-white border border-border-2/60 text-primary-text">
                    Verify
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                  Confirm no clinic, hospital, or institutional workspace relies solely on your admin role.
                </p>
              </div>
              <Link
                href="/account/organizations"
                className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:underline"
              >
                <span>Check My Organizations</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {user.isPremium || user.isVip ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-[12.5px] text-amber-900">
              <strong>Active Membership Notice:</strong> Your account carries an active{' '}
              {user.isVip ? 'VIP' : 'Premium'} status. Please review your billing cycle and ensure
              external subscriptions are cancelled prior to deletion.
            </div>
          ) : null}
        </div>
      )}

      {/* Mode 2: Email Check Input */}
      <form onSubmit={handleCheckEmail} className="mt-5">
        <label
          htmlFor="delete-account-email-check"
          className="block text-[13.5px] font-semibold text-foreground mb-1.5"
        >
          Check by account email address
        </label>
        <p className="text-[13px] text-primary-text mb-3">
          Enter the email registered with your Pentasent account to verify account status and
          pre-fill your deletion request template below.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            id="delete-account-email-check"
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailOverride(e.target.value);
              if (emailCheckState.status !== 'idle') {
                setEmailCheckState({ status: 'idle', message: '' });
              }
            }}
            placeholder="you@example.com"
            className="flex-1 h-11 px-4 rounded-xl border border-border-2 bg-white text-[14.5px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
          <button
            type="submit"
            disabled={emailCheckState.status === 'loading'}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-white text-[13.5px] font-semibold hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 shrink-0"
          >
            {emailCheckState.status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Check Services</span>
              </>
            )}
          </button>
        </div>

        {/* Email Check Result Banner */}
        {emailCheckState.status !== 'idle' && emailCheckState.status !== 'loading' && (
          <div
            className={`mt-3.5 rounded-xl border p-4 text-[13.5px] leading-relaxed ${
              emailCheckState.status === 'found'
                ? 'border-primary/25 bg-white text-foreground'
                : emailCheckState.status === 'error'
                ? 'border-destructive/30 bg-[#fff8f8] text-destructive'
                : 'border-amber-200 bg-amber-50/60 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {emailCheckState.status === 'found' ? (
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium">{emailCheckState.message}</p>

                {emailCheckState.status === 'found' && !isLoggedIn && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/auth/login?redirect=/help/delete-account"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-semibold text-white hover:bg-primary-hover transition-colors"
                    >
                      <span>Sign in to inspect your account</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/account/profile"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border-2 bg-[#faf9f8] px-3.5 py-1.5 text-[12.5px] font-semibold text-foreground hover:bg-white transition-colors"
                    >
                      <span>Open Account Portal</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Direct Account Portal Shortcut Links */}
      <div className="mt-5 pt-4 border-t border-border-2/40 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
        <span className="font-medium text-primary-text">
          Quick Account Portal Links:
        </span>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/account/products"
            className="rounded-full border border-border-2/70 bg-white px-3 py-1 font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Products
          </Link>
          <Link
            href="/account/communities"
            className="rounded-full border border-border-2/70 bg-white px-3 py-1 font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Communities
          </Link>
          <Link
            href="/account/organizations"
            className="rounded-full border border-border-2/70 bg-white px-3 py-1 font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Hospitals & Clinics
          </Link>
          <Link
            href="/account/events"
            className="rounded-full border border-border-2/70 bg-white px-3 py-1 font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Events
          </Link>
          <Link
            href="/my-health"
            className="rounded-full border border-border-2/70 bg-white px-3 py-1 font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            My Health
          </Link>
        </div>
      </div>
    </div>
  );
}

