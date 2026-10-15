'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users,
  Lock,
  Globe,
  CheckCircle2,
  Calendar,
  Package,
  Share2,
  Edit3,
  Sparkles,
  Clock,
  Check,
  CreditCard,
  LogOut,
} from 'lucide-react';
import {
  CommunityDetailDTO,
  PublicCommunityDTO,
  CommunityMemberDTO,
} from '@/types/communities';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';
import { CommunityDetailShimmer } from '@/shimmer/tracker/CommunityTrackerShimmer';
import CommunityNavbar from '@/components/communities/CommunityNavbar';
import CommunityFeed from '@/components/communities/CommunityFeed';
import CommunityMembers from '@/components/communities/CommunityMembers';
import CommunityRules from '@/components/communities/CommunityRules';
import CommunityResources from '@/components/communities/CommunityResources';
import CommunityProducts from '@/components/communities/CommunityProducts';
import CommunityEvents from '@/components/communities/CommunityEvents';
import CommunitySidebarCards from '@/components/communities/CommunitySidebarCards';
import PaidCommunityModal from '@/components/communities/PaidCommunityModal';
import CreateCommunityModal from '@/components/communities/CreateCommunityModal';
import {
  setCachedCommunities,
  setCachedCommunityDetail,
} from '@/lib/cache/communities-cache';
import { formatRelativeTime } from '@/lib/date-utils';

interface CommunityDetailViewProps {
  slug: string;
  initialCommunity?: CommunityDetailDTO | null;
  initialAllCommunities?: PublicCommunityDTO[];
}

function formatCount(num: number): string {
  if (!num || num <= 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

function formatLastActive(dateStr?: string | null): string {
  return formatRelativeTime(dateStr);
}

export default function CommunityDetailView({
  slug,
  initialCommunity = null,
  initialAllCommunities = [],
}: CommunityDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [community, setCommunity] = useState<CommunityDetailDTO | null>(initialCommunity);
  const [allCommunities, setAllCommunities] = useState<PublicCommunityDTO[]>(initialAllCommunities);
  const [activeTab, setActiveTab] = useState('discussions');
  const [isLoading, setIsLoading] = useState(!initialCommunity);
  const [composerOpenSignal, setComposerOpenSignal] = useState(0);
  const [latestPostTime, setLatestPostTime] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Members list for right sidebar preview
  const [previewMembers, setPreviewMembers] = useState<CommunityMemberDTO[]>([]);

  // Modals
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Sync cache and re-fetch if initial data was missing or slug changed
  useEffect(() => {
    let isMounted = true;

    if (initialCommunity) {
      setCachedCommunityDetail(slug, initialCommunity);
    }
    if (initialAllCommunities.length > 0) {
      setCachedCommunities(initialAllCommunities);
    }

    const fetchCommunityData = async () => {
      if (!community || community.slug !== slug) {
        setIsLoading(true);
      }

      try {
        const [detailRes, listRes] = await Promise.all([
          apiClient<CommunityDetailDTO>(`/communities/slug/${slug}`),
          apiClient<PublicCommunityDTO[]>('/communities?limit=50'),
        ]);

        if (isMounted) {
          if (detailRes.success && detailRes.data) {
            setCommunity(detailRes.data);
            setCachedCommunityDetail(slug, detailRes.data);
          } else if (!community) {
            notify.error(detailRes.error?.message || 'Community not found');
            router.push('/communities');
          }

          if (listRes.success && listRes.data) {
            setAllCommunities(listRes.data);
            setCachedCommunities(listRes.data);
          }
        }
      } catch (err) {
        console.warn('Error loading community details:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!initialCommunity || community?.slug !== slug) {
      void fetchCommunityData();
    }

    return () => {
      isMounted = false;
    };
  }, [slug, initialCommunity, initialAllCommunities, router, community?.slug]);

  // Fetch preview members for right sidebar
  useEffect(() => {
    if (!community?.id) return;
    let isMounted = true;

    apiClient<CommunityMemberDTO[]>(`/communities/${community.id}/members`)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setPreviewMembers(res.data.slice(0, 5));
        }
      })
      .catch((err) => console.warn('Could not load member preview:', err));

    return () => {
      isMounted = false;
    };
  }, [community?.id]);

  if (isLoading || !community) {
    return <CommunityDetailShimmer />;
  }

  const isOwnerOrAdmin =
    user?.id === community.owner?.id ||
    community.membership?.role === 'owner' ||
    community.membership?.role === 'admin';

  const isMember = community.membership?.isMember || isOwnerOrAdmin;
  const isPrivate = community.visibility === 'private';
  const isPaid = community.pricingType === 'paid';

  // Suggested communities: 5 communities excluding current
  const suggestedCommunities = allCommunities
    .filter((c) => c.slug !== community.slug)
    .slice(0, 5);

  // Handle Join / Leave
  const handleJoin = async () => {
    if (!user) {
      notify.error('Please log in to join this circle.');
      return;
    }

    if (isPaid && !isMember) {
      setIsPaidModalOpen(true);
      return;
    }

    setIsJoining(true);
    try {
      const res = await apiClient<{ joined: boolean; pending: boolean }>(
        `/communities/${community.id}/join`,
        { method: 'POST' }
      );

      if (res.success && res.data) {
        if (res.data.pending) {
          notify.success('Join request submitted to community administrators.');
          setCommunity((prev) =>
            prev
              ? {
                  ...prev,
                  membership: {
                    isMember: false,
                    role: null,
                    status: 'pending',
                    requiresPayment: isPaid,
                    requiresRules: false,
                    hasAcceptedRules: false,
                  },
                }
              : prev
          );
        } else {
          notify.success('You have joined the community circle!');
          setCommunity((prev) =>
            prev
              ? {
                  ...prev,
                  memberCount: prev.memberCount + 1,
                  membership: {
                    isMember: true,
                    role: 'member',
                    status: 'active',
                    requiresPayment: false,
                    requiresRules: false,
                    hasAcceptedRules: true,
                  },
                }
              : prev
          );
        }
      } else {
        notify.error(res.error?.message || 'Failed to join community.');
      }
    } catch {
      notify.error('Error connecting to server.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this community circle?')) return;
    try {
      const res = await apiClient(`/communities/${community.id}/leave`, { method: 'POST' });
      if (res.success) {
        notify.success('You left the community circle.');
        setCommunity((prev) =>
          prev
            ? {
                ...prev,
                memberCount: Math.max(0, prev.memberCount - 1),
                membership: null,
              }
            : prev
        );
      }
    } catch {
      notify.error('Failed to leave community.');
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        notify.success('Circle link copied to clipboard');
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {
        notify.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-foreground">
      {/* Tabs Navbar: Sticky top */}
      <CommunityNavbar
        currentCommunity={community}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOwnerOrAdmin={isOwnerOrAdmin}
        onOpenManageModal={() => setIsManageModalOpen(true)}
      />

      {/* Main Container: Shifted Hero/About to Right Sidebar in Large Screen */}
      <main className="mx-auto max-w-7xl px-0 sm:px-6 md:px-8 lg:px-10 py-0 sm:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* =========================================================
              LEFT COLUMN (Main Content Stream - 7 to 8 cols):
              Direct create post + discussions stream on desktop.
              On mobile (< lg), includes a minimal optimized header card.
              ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 min-w-0">
            {/* Minimal Optimized Community Card for Small Screens (< lg) */}
            {activeTab !== 'about' && (
              <div className="lg:hidden rounded-none sm:rounded-xl border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white overflow-hidden mb-0 sm:mb-5">
                {/* Compact banner */}
                <div className="relative w-full h-24 sm:h-28 bg-linear-to-r from-[#2c0524] via-[#480c3d] to-[#1e0219]">
                  {community.bannerUrl && (
                    <Image
                      src={community.bannerUrl}
                      alt={community.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                  {/* <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 pointer-events-none">
                    {isPrivate ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-amber-800 border border-amber-200">
                        <Lock size={10} className="text-amber-600" />
                        <span>Private</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-emerald-800 border border-emerald-200">
                        <Globe size={10} className="text-emerald-600" />
                        <span>Open</span>
                      </span>
                    )}

                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#4a0139] text-white">
                        <CreditCard size={10} />
                        <span>${community.price}/mo</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-foreground border border-[#ded5cd]">
                        Free
                      </span>
                    )}
                  </div> */}
                </div>

                {/* Header Body */}
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-end justify-between gap-2.5 -mt-9 pb-1">
                    <div className="relative w-14 h-14 rounded-xl bg-white p-0.5 border-2 border-[#ded5cd] shadow-2xs shrink-0">
                      <div className="w-full h-full rounded-lg overflow-hidden bg-[#faf8f6] flex items-center justify-center">
                        {community.iconUrl ? (
                          <Image
                            src={community.iconUrl}
                            alt={community.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-primary font-bold text-lg">
                            {community.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Join / Leave / Share actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="p-1.5 rounded-lg border border-[#ded5cd] bg-white hover:bg-[#faf8f6] text-primary-text transition-colors cursor-pointer"
                        title="Share circle"
                      >
                        {copiedLink ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Share2 size={14} />
                        )}
                      </button>
                      {isOwnerOrAdmin ? (
                        <button
                          type="button"
                          onClick={() => setIsManageModalOpen(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#ded5cd] bg-white text-[12px] font-bold text-foreground cursor-pointer"
                        >
                          <Edit3 size={12} className="text-primary" />
                          <span>Settings</span>
                        </button>
                      ) : isMember ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11.5px] font-bold">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>Joined</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleLeave}
                            className="p-1.5 rounded-lg border border-[#ded5cd] bg-white hover:bg-red-50 text-primary-text hover:text-red-700 transition-colors cursor-pointer"
                            title="Leave community"
                          >
                            <LogOut size={13} />
                          </button>
                        </div>
                      ) : community.membership?.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11.5px] font-bold">
                          <Clock size={12} className="text-amber-600" />
                          <span>Pending</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isJoining}
                          onClick={handleJoin}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[12px] font-bold transition-all cursor-pointer"
                        >
                          <Users size={12} />
                          <span>{isPaid ? `Join ($${community.price}/mo)` : isPrivate ? 'Request' : 'Join'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h1 className="text-[17px] font-bold text-foreground mt-1">
                    {community.name}
                  </h1>
                  <p className="line-clamp-2 text-[13px] md:text-[14px] text-primary-text mt-1 leading-relaxed">
                    {community.description || community.tagline}
                  </p>

                  {/* 3 Stats Minimal Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-3 mt-2.5 border-t border-[#f0ece9] text-center">
                    <div className="p-1.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9]">
                      <div className="text-[13px] font-bold text-foreground">
                        {formatCount(community.memberCount)}
                      </div>
                      <div className="text-[10.5px] text-primary-text font-medium">Members</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9]">
                      <div className="text-[13px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{Math.max(3, Math.round(community.memberCount * 0.05) || 5)}</span>
                      </div>
                      <div className="text-[10.5px] text-primary-text font-medium">Live Now</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9]">
                      <div className="text-[12px] font-bold text-foreground truncate" suppressHydrationWarning>
                        {formatLastActive(latestPostTime || community.createdAt)}
                      </div>
                      <div className="text-[10.5px] text-primary-text font-medium">Last Active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Discussions Tab (Feed with Create Post Option) */}
            {activeTab === 'discussions' && (
              <CommunityFeed
                community={community}
                isMember={isMember}
                composerOpenSignal={composerOpenSignal}
                onLatestPostTimeUpdate={(time) => setLatestPostTime(time)}
              />
            )}

            {/* 2. Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="rounded-xl sm:rounded-2xl border border-[#ded5cd] bg-white p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b185f]">
                    Circle Directory
                  </span>
                  <h2 className="mt-1 text-[20px] sm:text-[22px] font-bold text-foreground">
                    Clinicians &amp; Verified Members
                  </h2>
                  <p className="mt-1 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text leading-relaxed">
                    Engage with healthcare professionals, researchers, and specialists collaborating within this circle.
                  </p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-[#ded5cd] bg-white p-4 sm:p-5">
                  <CommunityMembers
                    communityId={community.id}
                    isMember={isMember}
                    memberDirectoryVisibility={community.settings?.memberDirectoryVisibility}
                  />
                </div>
              </div>
            )}

            {/* 3. Events Tab */}
            {activeTab === 'events' && (
              <CommunityEvents
                communityId={community.id}
                communityName={community.name}
              />
            )}

            {/* 4. Products Tab */}
            {activeTab === 'products' && (
              <CommunityProducts
                communityId={community.id}
                communityName={community.name}
              />
            )}

            {/* 5. Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                <div className="rounded-xl sm:rounded-2xl border border-[#ded5cd] bg-white p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b185f]">
                    Clinical Library
                  </span>
                  <h2 className="mt-1 text-[20px] sm:text-[22px] font-bold text-foreground">
                    Shared Documents &amp; Protocol Resources
                  </h2>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-[#ded5cd] bg-white p-4 sm:p-5">
                  <CommunityResources communityId={community.id} />
                </div>
              </div>
            )}

            {/* 6. Rules Tab (If selected directly via link) */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="rounded-xl sm:rounded-2xl border border-[#ded5cd] bg-white p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b185f]">
                    Circle Governance
                  </span>
                  <h2 className="mt-1 text-[20px] sm:text-[22px] font-bold text-foreground">
                    Community Rules &amp; Guidelines
                  </h2>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-[#ded5cd] bg-white p-4 sm:p-5">
                  <CommunityRules
                    rules={community.rules}
                    hasAccepted={community.membership?.hasAcceptedRules}
                    isMember={isMember}
                  />
                </div>
              </div>
            )}

            {/* 7. About Tab (Shown when clicked in mobile nav) */}
            {activeTab === 'about' && (
              <div className="lg:hidden">
                <CommunitySidebarCards
                  community={community}
                  previewMembers={previewMembers}
                  suggestedCommunities={suggestedCommunities}
                  latestPostTime={latestPostTime}
                  isOwnerOrAdmin={isOwnerOrAdmin}
                  isMember={isMember}
                  isJoining={isJoining}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                  onOpenManageModal={() => setIsManageModalOpen(true)}
                  onNavigateTab={setActiveTab}
                  showBreadcrumb={false}
                />
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN (Comprehensive Sidebar Cards - 4 to 5 cols):
              Sticky in large screen, contains breadcrumb + all community
              cards with white body & muted header background.
              ========================================================= */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 min-w-0">
            <CommunitySidebarCards
              community={community}
              previewMembers={previewMembers}
              suggestedCommunities={suggestedCommunities}
              latestPostTime={latestPostTime}
              isOwnerOrAdmin={isOwnerOrAdmin}
              isMember={isMember}
              isJoining={isJoining}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onOpenManageModal={() => setIsManageModalOpen(true)}
              onNavigateTab={setActiveTab}
              showBreadcrumb={true}
            />
          </aside>
        </div>
      </main>

      {/* Paid Community Modal Popup */}
      <PaidCommunityModal
        isOpen={isPaidModalOpen}
        onClose={() => setIsPaidModalOpen(false)}
        communityName={community.name}
        price={community.price}
        currency={community.currency}
      />

      {/* Edit Community Modal */}
      {isManageModalOpen && (
        <CreateCommunityModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          editingCommunity={community}
          onSuccess={(updated) => {
            setCommunity((prev) => (prev ? { ...prev, ...updated } : prev));
          }}
        />
      )}
    </div>
  );
}
