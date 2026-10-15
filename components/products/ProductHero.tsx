'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ExternalLink,
  ChevronUp,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
  Building2,
  Bell,
  Star,
} from 'lucide-react';
import { PublicProductDTO } from '@/types/products';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';

interface ProductHeroProps {
  product: PublicProductDTO;
  onVoteSuccess?: (newCount: number, hasUpvoted: boolean) => void;
  onFollowSuccess?: (newCount: number, hasFollowed: boolean) => void;
}

export default function ProductHero({
  product,
  onVoteSuccess,
  onFollowSuccess,
}: ProductHeroProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [upvoted, setUpvoted] = useState<boolean>(Boolean(product.viewerState?.hasUpvoted));
  const [upvotes, setUpvotes] = useState<number>(product.upvoteCount || 0);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  const [following, setFollowing] = useState<boolean>(Boolean(product.viewerState?.hasFollowed));
  const [followers, setFollowers] = useState<number>(product.followerCount || 0);
  const [isSubmittingFollow, setIsSubmittingFollow] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  const handleUpvote = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }
    if (isSubmittingVote) return;
    setIsSubmittingVote(true);

    const nextState = !upvoted;
    const nextCount = nextState ? upvotes + 1 : Math.max(0, upvotes - 1);
    setUpvoted(nextState);
    setUpvotes(nextCount);
    if (onVoteSuccess) onVoteSuccess(nextCount, nextState);

    try {
      const res = await apiClient<{ hasUpvoted: boolean; upvoteCount: number }>(
        `/products/${product.id}/upvote`,
        { method: 'POST' }
      );
      if (res.success && res.data) {
        setUpvoted(res.data.hasUpvoted);
        setUpvotes(res.data.upvoteCount);
        if (onVoteSuccess) onVoteSuccess(res.data.upvoteCount, res.data.hasUpvoted);
      }
    } catch {
      setUpvoted(!nextState);
      setUpvotes(upvotes);
      if (onVoteSuccess) onVoteSuccess(upvotes, !nextState);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }
    if (isSubmittingFollow) return;
    setIsSubmittingFollow(true);

    const nextState = !following;
    const nextCount = nextState ? followers + 1 : Math.max(0, followers - 1);
    setFollowing(nextState);
    setFollowers(nextCount);
    if (onFollowSuccess) onFollowSuccess(nextCount, nextState);

    try {
      const res = await apiClient<{ hasFollowed: boolean; followerCount: number }>(
        `/products/${product.id}/follow`,
        { method: 'POST' }
      );
      if (res.success && res.data) {
        setFollowing(res.data.hasFollowed);
        setFollowers(res.data.followerCount);
        if (onFollowSuccess) onFollowSuccess(res.data.followerCount, res.data.hasFollowed);
        notify.success(res.data.hasFollowed ? 'Following product updates' : 'Unfollowed product');
      }
    } catch {
      setFollowing(!nextState);
      setFollowers(followers);
      if (onFollowSuccess) onFollowSuccess(followers, !nextState);
    } finally {
      setIsSubmittingFollow(false);
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        notify.success('Link copied to clipboard');
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {
        notify.error('Failed to copy link');
      }
    }
  };

  const pricingBadge = (() => {
    switch (product.pricingModel) {
      case 'free':
        return { label: 'Free to use', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'paid_with_free_trial':
        return { label: 'Free trial available', class: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'paid':
        return { label: 'Paid software', class: 'text-slate-700 bg-slate-50 border-slate-200' };
      default:
        return { label: 'Free to use', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  })();

  return (
    <div className="pb-8">
      {/* Top Meta Badges Row */}
      <div className="flex flex-wrap items-center gap-2 mb-3.5">
        <span className="text-[12.5px] font-bold uppercase tracking-wider text-[#6b185f]">
          {product.primaryCategory?.name || 'Healthcare Innovation'}
        </span>

        {product.isFeatured && (
          <>
            <span className="text-[#ded9d5]">·</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles size={12} className="text-amber-600 fill-amber-500" />
              Featured Innovation
            </span>
          </>
        )}

        {product.companyNameSnapshot && (
          <>
            <span className="text-[#ded9d5]">·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[13px] text-foreground">
              <Building2 size={13} className="text-muted-foreground" />
              {product.companyNameSnapshot}
            </span>
          </>
        )}

        <span className="text-[#ded9d5]">·</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11.5px] font-semibold border ${pricingBadge.class}`}>
          {pricingBadge.label}
        </span>

        {product.isVerified && (
          <>
            <span className="text-[#ded9d5]">·</span>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
              <ShieldCheck size={14} className="text-emerald-600" />
              Verified Listing
            </span>
          </>
        )}
      </div>

      {/* Hero Content Header: Logo + Title + Tagline */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mt-2">
        {/* Logo */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#faf9f8] border-2 border-[#ded9d5] shrink-0 shadow-2xs">
          {product.logoUrl ? (
            <Image
              src={product.logoUrl}
              alt={product.name}
              fill
              sizes="120px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#f4ddf0] to-[#e4c4dc] text-primary font-bold text-[32px]">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[30px] xs:text-[34px] sm:text-[40px] font-bold text-foreground leading-[1.12] tracking-tight">
              {product.name}
            </h1>

            {product.launchVersion && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-semibold bg-[#faf9f8] text-primary-text border border-[#ded9d5]">
                {product.launchVersion}
              </span>
            )}
          </div>

          <p className="mt-2 text-[16px] sm:text-[18px] leading-[1.6] text-primary-text max-w-3xl">
            {product.tagline}
          </p>

          {/* Quick Stats: Rating & Followers */}
          <div className="mt-3.5 flex flex-wrap items-center gap-5 text-[13px] sm:text-[14px] text-primary-text">
            {product.averageRating !== null && (
              <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                <Star size={15} className="fill-amber-400 text-amber-500" />
                <span>{product.averageRating.toFixed(1)} / 5.0</span>
                <span className="text-muted-foreground font-normal">
                  ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </span>
            )}

            <span className="text-muted-foreground">
              {followers} {followers === 1 ? 'follower' : 'followers'}
            </span>

            {product.launchStatus && (
              <span className="capitalize text-emerald-700 font-medium">
                Status: {product.launchStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Visit Website Primary Action */}
        <a
          href={product.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-6 sm:px-7 py-3 text-[14.5px] font-bold text-white transition-all cursor-pointer shadow-xs"
        >
          <span>Visit website</span>
          <ExternalLink size={15} />
        </a>

        {/* Upvote Button */}
        <button
          type="button"
          onClick={handleUpvote}
          disabled={isSubmittingVote}
          className={`inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-[14.5px] font-bold transition-all cursor-pointer border ${upvoted
              ? 'bg-[#f4ddf0] text-primary border-[#f0cbe8] shadow-xs'
              : 'bg-white hover:bg-[#faf9f8] text-foreground hover:text-primary border-[#ded9d5]'
            }`}
        >
          <ChevronUp size={18} className={upvoted ? 'stroke-[2.5]' : 'stroke-2'} />
          <span>{upvoted ? 'Upvoted' : 'Upvote'}</span>
          <span className="text-[#ded9d5]">·</span>
          <span>{upvotes}</span>
        </button>

        {/* Follow Button */}
        <button
          type="button"
          onClick={handleFollow}
          disabled={isSubmittingFollow}
          className={`inline-flex items-center justify-center gap-2 rounded px-4.5 py-3 text-[14px] font-semibold transition-all cursor-pointer border ${following
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-white hover:bg-[#faf9f8] text-primary-text hover:text-foreground border-[#ded9d5]'
            }`}
        >
          <Bell size={15} className={following ? 'fill-emerald-600' : ''} />
          <span>{following ? 'Following' : 'Follow'}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded border border-[#ded9d5] bg-white hover:bg-[#faf9f8] px-4.5 py-3 text-[14px] font-semibold text-primary-text hover:text-foreground transition-colors cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check size={15} className="text-emerald-600" />
              <span className="text-emerald-700">Link copied</span>
            </>
          ) : (
            <>
              <Share2 size={15} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
