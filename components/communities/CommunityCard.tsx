'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  ArrowRight,
  Lock,
  Check,
} from 'lucide-react';
import { PublicCommunityDTO } from '@/types/communities';
import Image from 'next/image';

interface CommunityCardProps {
  community: PublicCommunityDTO;
  index?: number;
  onPaidClick?: (community: PublicCommunityDTO) => void;
}

export default function CommunityCard({
  community,
  index = 0,
  onPaidClick,
}: CommunityCardProps) {
  const router = useRouter();
  const [iconError, setIconError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const isPaid = community.pricingType === 'paid';
  const isPrivate = community.visibility === 'private';
  const isMember = community.membership?.isMember;

  const handleCardClick = () => {
    if (isPaid && !isMember && onPaidClick) {
      onPaidClick(community);
    } else {
      router.push(`/communities/${community.slug}`);
    }
  };

  const primaryTopic = community.tags && community.tags.length > 0 ? community.tags[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.25), duration: 0.3 }}
      onClick={handleCardClick}
      className="rounded-lg border border-[#ded9d5] hover:border-[#cfc6be] bg-white transition-all duration-300 flex flex-col justify-between group cursor-pointer select-none overflow-hidden"
    >
      <div>
        {/* Top Cover Banner - Clean, uncluttered banner without floating text tags */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-linear-to-r from-[#2c0524] via-[#480c3d] to-[#1e0219]">
          {!bannerError && community.bannerUrl ? (
            <Image
              fill
              src={community.bannerUrl}
              alt={`${community.name} banner`}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-60" />
            </div>
          )}

          {/* Gentle Bottom Fade */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent" />
        </div>

        {/* Avatar & Topic Row */}
        <div className="-mt-7 px-5 relative z-10 flex items-end justify-between">
          {/* Avatar Container with status border & badge */}
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-lg bg-white shadow-xs p-0.5 shrink-0 overflow-hidden flex items-center justify-center transition-all ${
                isMember
                  ? isPaid
                    ? 'border-2 border-primary ring-2 ring-primary/20'
                    : 'border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                  : isPrivate
                  ? 'border-2 border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-2 border-white'
              }`}
            >
              {!iconError && community.iconUrl ? (
                <Image
                  width={100}
                  height={100}
                  src={community.iconUrl}
                  alt={community.name}
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  onError={() => setIconError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-md flex items-center justify-center bg-linear-to-br from-[#f4ddf0] to-[#e4c4dc] text-primary font-bold text-[18px]">
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Status Indicator Badge on Avatar */}
            {isMember ? (
              <div className="group/badge absolute -bottom-1 -right-1 z-20">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs ${
                    isPaid ? 'bg-primary' : 'bg-emerald-600'
                  }`}
                >
                  <Check size={11} strokeWidth={3} />
                </span>
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/badge:flex items-center px-2 py-0.5 rounded bg-[#1e1c1b] text-white text-[11px] font-medium whitespace-nowrap shadow-lg z-30">
                  {isPaid ? 'Joined (Paid Member)' : 'Joined Community'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1c1b]" />
                </div>
              </div>
            ) : isPrivate ? (
              <div className="group/badge absolute -bottom-1 -right-1 z-20">
                <span className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-500 text-white border-2 border-white shadow-xs">
                  <Lock size={10} strokeWidth={2.5} />
                </span>
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/badge:flex items-center px-2 py-0.5 rounded bg-[#1e1c1b] text-white text-[11px] font-medium whitespace-nowrap shadow-lg z-30">
                  Private Community
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1c1b]" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="mb-0.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#faf0f8] text-primary border border-primary/15">
              {primaryTopic || 'Clinical Circle'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-5 pt-3 pb-4">
          <h3 className="text-[17.5px] sm:text-[18px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1 sm:line-clamp-2">
            {community.name}
          </h3>

          <p className="mt-2 text-[13.5px] text-primary-text leading-relaxed line-clamp-2">
            {community.tagline || community.description}
          </p>
        </div>
      </div>

      {/* Footer: Live Stats + Direct Action */}
      <div className="px-5 py-3.5 border-t border-[#f0ece9] bg-[#faf8f6]/70 flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-3 text-primary-text font-medium text-[12.5px]">
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            <strong className="text-foreground">{community.memberCount.toLocaleString()}</strong>
            <span className="hidden xs:inline text-muted-foreground">members</span>
          </span>
          <span className="text-[#ded9d5]">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare size={14} className="text-primary" />
            <strong className="text-foreground">{community.postCount.toLocaleString()}</strong>
            <span className="hidden xs:inline text-muted-foreground">discussions</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-[13px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
          <span>
            {isMember ? 'Open circle' : isPaid ? `Join ($${community.price})` : 'Explore circle'}
          </span>
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}
