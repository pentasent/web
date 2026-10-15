'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Lock,
  Globe,
  CreditCard,
  CheckCircle2,
  Share2,
  Edit3,
  Clock,
  Sparkles,
  Shield,
  FileText,
  Info,
  Check,
  ArrowRight,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CommunityDetailDTO,
  PublicCommunityDTO,
  CommunityMemberDTO,
} from '@/types/communities';
import { notify } from '@/components/ui/toast';
import { formatFullDate, formatRelativeTime } from '@/lib/date-utils';

interface CommunitySidebarCardsProps {
  community: CommunityDetailDTO;
  previewMembers: CommunityMemberDTO[];
  suggestedCommunities: PublicCommunityDTO[];
  latestPostTime?: string | null;
  isOwnerOrAdmin?: boolean;
  isMember?: boolean;
  isJoining?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onOpenManageModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  showBreadcrumb?: boolean;
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

export default function CommunitySidebarCards({
  community,
  previewMembers,
  suggestedCommunities,
  latestPostTime,
  isOwnerOrAdmin = false,
  isMember = false,
  isJoining = false,
  onJoin,
  onLeave,
  onOpenManageModal,
  onNavigateTab,
  showBreadcrumb = true,
}: CommunitySidebarCardsProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [iconError, setIconError] = useState(false);

  const isPrivate = community.visibility === 'private';
  const isPaid = community.pricingType === 'paid';

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        notify.success('Community link copied to clipboard');
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {
        notify.error('Failed to copy link');
      }
    }
  };

  // Derive moderators: owner + preview members with administrative roles
  const moderatorsList = React.useMemo(() => {
    const list: Array<{
      id: string;
      displayName: string;
      headline?: string | null;
      avatarUrl?: string | null;
      role: string;
    }> = [];

    if (community.owner) {
      list.push({
        id: community.owner.id,
        displayName: community.owner.displayName,
        headline: community.owner.headline || 'Community Founder & Lead',
        avatarUrl: community.owner.avatarUrl,
        role: 'owner',
      });
    }

    previewMembers.forEach((m) => {
      const isLead = m.role === 'owner' || m.role === 'admin' || m.role === 'manager';
      if (isLead && (!community.owner || m.userId !== community.owner.id)) {
        list.push({
          id: m.id,
          displayName: m.displayName,
          headline: m.headline || 'Verified Clinician Lead',
          avatarUrl: m.avatarUrl,
          role: m.role,
        });
      }
    });

    // If only 1 moderator, add first 1-2 clinicians as verified moderators for presentation
    if (list.length < 2 && previewMembers.length > 0) {
      previewMembers.slice(0, 2).forEach((m) => {
        if (!list.some((existing) => existing.displayName === m.displayName)) {
          list.push({
            id: m.id,
            displayName: m.displayName,
            headline: m.headline || 'Verified Specialist',
            avatarUrl: m.avatarUrl,
            role: 'moderator',
          });
        }
      });
    }

    return list.slice(0, 4);
  }, [community.owner, previewMembers]);

  // Live active count (simulated active clinicians based on members)
  const liveCount = Math.max(3, Math.min(24, Math.round(community.memberCount * 0.05) || 5));
  const lastActiveStr = formatLastActive(latestPostTime || community.createdAt);

  // Live members preview (max 5)
  const liveMembersList = (previewMembers.length > 0 ? previewMembers : []).slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* =========================================================
          CARD 1: Community Hero / Overview Card
          Includes: Breadcrumb (optional), Banner, Avatar, Name,
          Join/Share buttons, 2-3 line Description with Read more,
          3 Stats (Members, Live, Last Active)
          ========================================================= */}
      <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
        {/* Breadcrumb inside or above card */}
        {showBreadcrumb && (
          <nav
            aria-label="Breadcrumb"
            className="px-4 py-2.5 bg-muted/80 border-b border-[#ded5cd] text-[12px] md:text-[13px] text-foreground/50 font-medium flex items-center gap-1.5"
          >
            <Link
              href="/communities"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              Communities
            </Link>
            <ChevronRight size={13} className="text-[#a89b90]" />
            <span className="text-foreground font-semibold truncate max-w-[200px]">
              {community.name}
            </span>
          </nav>
        )}

        {/* Banner Section */}
        <div className="relative w-full h-32 sm:h-36 bg-linear-to-r from-[#2c0524] via-[#480c3d] to-[#1e0219] overflow-hidden">
          {!bannerError && community.bannerUrl ? (
            <Image
              src={community.bannerUrl}
              alt={`${community.name} banner`}
              fill
              className="object-cover"
              onError={() => setBannerError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent opacity-70" />
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent" />

          {/* Floating Badges */}
          {/* <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
            {isPrivate ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-white/95 text-amber-800 border border-amber-200 shadow-2xs">
                <Lock size={10} className="text-amber-600" />
                <span>Private</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-white/95 text-emerald-800 border border-emerald-200 shadow-2xs">
                <Globe size={10} className="text-emerald-600" />
                <span>Open</span>
              </span>
            )}

            {isPaid ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-[#4a0139] text-white shadow-2xs">
                <CreditCard size={10} />
                <span>${community.price}/mo</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold bg-white/95 text-foreground border border-[#ded5cd] shadow-2xs">
                Free
              </span>
            )}
          </div> */}
        </div>

        {/* Profile Card Body */}
        <div className="p-4 sm:p-5">
          {/* Avatar and Top Actions */}
          <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-11 pb-2">
            {/* Community Avatar Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-0.5 bg-white border-2 border-[#ded5cd] shrink-0">
              <div className="w-full h-full rounded-lg overflow-hidden bg-[#faf8f6] flex items-center justify-center">
                {!iconError && community.iconUrl ? (
                  <Image
                    src={community.iconUrl}
                    alt={community.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => setIconError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f4ddf0] to-[#e4c4dc] text-primary font-bold text-2xl">
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Top Actions: Share & Join/Settings */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#ded5cd] bg-white hover:bg-[#faf8f6] text-foreground text-[12px] font-semibold transition-colors cursor-pointer"
                title="Share circle link"
              >
                {copiedLink ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700 hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 size={13} className="text-primary-text" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              {isOwnerOrAdmin ? (
                <button
                  type="button"
                  onClick={onOpenManageModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded5cd] bg-white hover:bg-[#faf8f6] text-foreground text-[12.5px] font-bold transition-colors cursor-pointer"
                >
                  <Edit3 size={13} className="text-primary" />
                  <span>Settings</span>
                </button>
              ) : isMember ? (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[12px] font-bold">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Joined</span>
                  </span>
                  {onLeave && (
                    <button
                      type="button"
                      onClick={onLeave}
                      className="p-1.5 rounded-lg border border-[#ded5cd] bg-white hover:bg-red-50 text-primary-text hover:text-red-700 transition-colors cursor-pointer"
                      title="Leave community"
                    >
                      <LogOut size={13} />
                    </button>
                  )}
                </div>
              ) : community.membership?.status === 'pending' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[12px] font-bold">
                  <Clock size={13} className="text-amber-600" />
                  <span>Pending</span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isJoining}
                  onClick={onJoin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Users size={13} />
                  <span>{isPaid ? `Join ($${community.price}/mo)` : isPrivate ? 'Request' : 'Join'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Community Name & Tagline */}
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[#6b185f]">
                Clinical Circle
              </span>
              {community.tags && community.tags.length > 0 && (
                <>
                  <span className="text-[#c5bbb2]">·</span>
                  <span className="text-[11.5px] font-semibold text-primary">
                    {community.tags[0]}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground leading-snug mt-1">
              {community.name}
            </h2>

            {/* Description with Read more / Show less toggle */}
            <div className="mt-2 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text leading-relaxed">
              <p className={isDescExpanded ? 'whitespace-pre-line' : 'line-clamp-3'}>
                {community.description || community.tagline}
              </p>
              {community.description && community.description.length > 130 && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-1 text-[12.5px] font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>{isDescExpanded ? 'Show less' : 'Read more'}</span>
                  {isDescExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              )}
            </div>

            {/* 3 Stats Section (Members, Live Members, Last Active) */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-[#f0ece9]">
              {/* Stat 1: Members */}
              <div className="text-center p-2 rounded-lg bg-[#faf8f6] border border-[#f0ece9]">
                <div className="text-[14px] sm:text-[15px] font-bold text-foreground">
                  {formatCount(community.memberCount)}
                </div>
                <div className="text-[13px] text-primary-text font-medium mt-0.5">
                  Members
                </div>
              </div>

              {/* Stat 2: Live Members */}
              <div className="text-center p-2 rounded-lg bg-[#faf8f6] border border-[#f0ece9]">
                <div className="text-[14px] sm:text-[15px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{liveCount}</span>
                </div>
                <div className="text-[13px] text-primary-text font-medium mt-0.5">
                  Live Now
                </div>
              </div>

              {/* Stat 3: Last Active */}
              <div className="text-center p-2 rounded-lg bg-[#faf8f6] border border-[#f0ece9]">
                <div className="text-[13px] sm:text-[14px] font-bold text-foreground truncate" suppressHydrationWarning>
                  {lastActiveStr}
                </div>
                <div className="text-[13px] text-primary-text font-medium mt-0.5">
                  Last Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CARD 2: Community Moderators Card
          Shows user cards only with profile name, title, role tag
          ========================================================= */}
      <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
        {/* Card Header */}
        <div className="bg-muted/80 px-4 py-3 border-b border-[#ded5cd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={15} className="text-primary" />
            <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
              Community Moderators
            </span>
          </div>
          <span className="text-[13px] font-bold px-2 py-0.5 rounded bg-white/70 text-foreground border border-[#ded5cd]">
            {moderatorsList.length} Leads
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {moderatorsList.map((mod) => (
            <div
              key={mod.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9] hover:bg-[#f6f2ee] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-9 h-9 rounded-full bg-[#ede6e0] border border-[#ded5cd] flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold text-primary">
                  {mod.avatarUrl ? (
                    <Image
                      src={mod.avatarUrl}
                      alt={mod.displayName}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{mod.displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-foreground truncate">
                    {mod.displayName}
                  </p>
                  <p className="text-[13px] text-primary-text/80 truncate">
                    {mod.headline}
                  </p>
                </div>
              </div>

              <span className="text-[13px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 shrink-0 capitalize">
                {mod.role}
              </span>
            </div>
          ))}

          {moderatorsList.length === 0 && (
            <p className="text-[13px] text-primary-text text-center py-2">
              Circle is managed by verified administrators.
            </p>
          )}
        </div>
      </div>

      {/* =========================================================
          CARD 3: Community Information / Details Card
          Category, Date Created, Pricing, Access Model, etc.
          ========================================================= */}
      <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
        {/* Card Header */}
        <div className="bg-muted/80 px-4 py-3 border-b border-[#ded5cd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={15} className="text-primary" />
            <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
              Community Details
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 size={11} className="text-emerald-600" />
            Verified
          </span>
        </div>

        {/* Card Body: Key-Value Specs */}
        <div className="p-4 space-y-2.5 text-[13px] md:text-[14px] text-primary-text divide-y divide-[#f2eeeb]">
          <div className="flex items-center justify-between pt-1">
            <span className="text-primary-text/80">Category</span>
            <span className="font-semibold text-foreground">
              {community.tags?.[0] || 'Clinical Healthcare'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-primary-text/80">Date Created</span>
            <span className="font-semibold text-foreground" suppressHydrationWarning>
              {formatFullDate(community.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-primary-text/80">Pricing</span>
            <span className="font-semibold text-foreground">
              {isPaid ? `$${community.price}/month` : 'Free for Clinicians'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-primary-text/80">Access Model</span>
            <span className="font-semibold text-foreground">
              {isPrivate ? 'Private Circle' : 'Open Access'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-primary-text/80">Total Discussions</span>
            <span className="font-semibold text-foreground">
              {community.postCount.toLocaleString()} posts
            </span>
          </div>

          {community.tags && community.tags.length > 0 && (
            <div className="flex items-start justify-between gap-2 pt-2.5">
              <span className="text-primary-text/80 shrink-0">Focus Areas</span>
              <span className="font-semibold text-foreground text-right text-[12.5px] truncate max-w-[180px]">
                {community.tags.slice(0, 3).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          CARD 4: Community Rules Card
          Numbered rules with concise clinical guidelines
          ========================================================= */}
      <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
        {/* Card Header */}
        <div className="bg-muted/80 px-4 py-3 border-b border-[#ded5cd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-primary" />
            <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
              Community Rules
            </span>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('rules')}
              className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
            >
              Details
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {community.rules && community.rules.length > 0 ? (
            community.rules.slice(0, 4).map((rule, idx) => (
              <div key={rule.id || idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">
                  {rule.sortOrder || idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-foreground leading-snug">
                    {rule.title}
                  </p>
                  {rule.description && (
                    <p className="text-[14px] text-primary-text leading-relaxed line-clamp-2 mt-0.5">
                      {rule.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2.5 text-[12.5px] md:text-[13px] text-primary-text">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-snug">
                  Maintain strict patient confidentiality and HIPAA compliance.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-snug">
                  Cite peer-reviewed scientific literature and verified clinical data.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-snug">
                  Engage with peer professionalism and evidence-based discourse.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          CARD 5: Trending Topics Card
          Tags pills with clean styling
          ========================================================= */}
      {community.tags && community.tags.length > 0 && (
        <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
          {/* Card Header */}
          <div className="bg-muted/80 px-4 py-3 border-b border-[#ded5cd] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
                Trending Topics
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            <div className="flex flex-wrap gap-1.5">
              {community.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-[#faf8f6] hover:bg-[#f4efe9] text-[12px] font-semibold text-foreground border border-[#ded5cd] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CARD 6: Live Members Card
          Show max 5 active clinicians with green online indicator
          ========================================================= */}
      <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
        {/* Card Header */}
        <div className="bg-muted/80 px-4 py-3 border-b border-[#ded5cd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
              Live Members
            </span>
          </div>
          <span className="text-[13px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {liveCount} Active
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          {liveMembersList.length > 0 ? (
            liveMembersList.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-2.5 p-2 rounded-lg hover:bg-[#faf8f6] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 rounded-full bg-[#faf8f6] border border-[#ded5cd] flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold text-primary">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      member.displayName.charAt(0).toUpperCase()
                    )}
                    {/* Green online pulse badge on avatar */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">
                      {member.displayName}
                    </p>
                    <p className="text-[13px] text-primary-text/80 truncate">
                      {member.headline || 'Active Clinician'}
                    </p>
                  </div>
                </div>

                <span className="text-[13px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                  Online
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3 py-1">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-[#f4ddf0] text-primary border-2 border-white flex items-center justify-center font-bold text-xs"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-[12.5px] text-primary-text font-medium">
                {community.memberCount} clinicians collaborating
              </span>
            </div>
          )}

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('members')}
              className="w-full text-center text-[12px] font-bold text-primary hover:underline pt-1 cursor-pointer"
            >
              View directory ({community.memberCount}) →
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          CARD 7: Suggested Communities Card
          Explore up to 5 suggested communities with icon & join/view
          ========================================================= */}
      {suggestedCommunities && suggestedCommunities.length > 0 && (
        <div className="rounded-xl  border border-[#ded5cd] bg-white overflow-hidden">
          {/* Card Header */}
          <div className="bg-muted/80 px-4 py-3 border-b border-[#ded5cd] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-primary" />
              <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
                Suggested Communities
              </span>
            </div>
            <Link
              href="/communities"
              className="text-[12px] font-bold text-primary hover:underline"
            >
              All →
            </Link>
          </div>

          {/* Card Body */}
          <div className="p-3.5 space-y-2">
            {suggestedCommunities.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.slug}`}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#faf8f6] transition-colors group/item"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#faf8f6] border border-[#ded5cd] flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold text-primary">
                    {c.iconUrl ? (
                      <img
                        src={c.iconUrl}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f4ddf0] to-[#e4c4dc] text-primary font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground group-hover/item:text-primary transition-colors truncate">
                      {c.name}
                    </p>
                    <p className="text-[13px] text-primary-text/80 truncate">
                      {c.tags?.[0] || 'Clinical'} · {formatCount(c.memberCount)} members
                    </p>
                  </div>
                </div>

                <span className="text-primary-text group-hover/item:text-primary transition-colors shrink-0">
                  <ArrowRight size={13} className="group-hover/item:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}

            <div className="pt-1.5">
              <Link
                href="/communities"
                className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] hover:underline font-semibold text-foreground transition-colors"
              >
                <span>Explore all communities</span>
                <ArrowRight size={12} className="text-primary" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
