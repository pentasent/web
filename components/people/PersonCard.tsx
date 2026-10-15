'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  ShieldCheck,
  ArrowRight,
  Crown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PersonProfile } from '@/types/people';

interface PersonCardProps {
  person: PersonProfile;
  index?: number;
}

export default function PersonCard({ person, index = 0 }: PersonCardProps) {
  const isVip = Boolean(person.isVip);
  const isPremium = Boolean(person.isPremium);
  const isVerified = Boolean(person.isVerified);

  // Determine display organization
  const primaryOrg =
    person.organizations && person.organizations.length > 0
      ? person.organizations[0]
      : person.organization
      ? { name: person.organization, role: '' }
      : null;

  // Member since calculation
  const memberSinceYear = person.memberSince
    ? person.memberSince
    : person.createdAt
    ? new Date(person.createdAt).getFullYear().toString()
    : '2024';

  // Professional headline or role (handles normal users/patients without assuming doctor!)
  const headline = person.headline || person.profession || null;

  // Initials for avatar fallback
  const initials = person.displayName
    ? person.displayName
        .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'P'
    : 'P';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between ${
        isVip
          ? 'border-amber-300 hover:border-amber-400'
          : isPremium
          ? 'border-[#4a003e]/25 hover:border-[#4a003e]/50'
          : 'border-[#ebe4dc] hover:border-[#4a003e]/40'
      }`}
    >
      {/* Main Card Body */}
      <div className="p-5 sm:p-5.5 flex flex-col flex-1">
        {/* Header: Horizontal Avatar + Name/Details + Icon-Only Badges with Tooltips */}
        <div className="flex items-start gap-3.5">
          {/* Circular Avatar */}
          <div className="relative shrink-0">
            {person.avatarUrl ? (
              <div
                className={`relative h-15 w-15 sm:h-16 sm:w-16 rounded-full overflow-hidden ${
                  isVip
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white'
                    : isPremium
                    ? 'ring-2 ring-[#4a003e]/40 ring-offset-2 ring-offset-white'
                    : 'border border-[#ded6cf]'
                }`}
              >
                <Image
                  src={person.avatarUrl}
                  alt={person.displayName}
                  fill
                  sizes="64px"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={`h-15 w-15 sm:h-16 sm:w-16 rounded-full flex items-center justify-center font-bold text-base sm:text-lg ${
                  isVip
                    ? 'bg-amber-100 text-amber-950 ring-2 ring-amber-400 ring-offset-2 ring-offset-white'
                    : isPremium
                    ? 'bg-[#f8ebf5] text-[#4a003e] ring-2 ring-[#4a003e]/30 ring-offset-2 ring-offset-white'
                    : 'bg-[#f4efe9] text-[#4a003e] border border-[#ded6cf]'
                }`}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Name, Badges & "Member since · View Profile" line */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              {/* Specialist / User Name */}
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1c171a] leading-tight group-hover:text-primary transition-colors truncate">
                {person.displayName}
              </h3>

              {/* Icon-Only Badges with Floating Tooltips (Supports both VIP and Premium) */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isVip && (
                  <div className="group/tip relative flex items-center justify-center">
                    <div
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors cursor-default"
                      // title="VIP Member"
                    >
                      <Crown size={12} className="text-amber-600 fill-amber-500 shrink-0" />
                    </div>
                    {/* Floating Tooltip */}
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-30">
                      <div className="relative px-2 py-0.5 rounded bg-[#1c171a] text-white text-[10.5px] font-semibold whitespace-nowrap shadow-sm">
                        VIP Member
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c171a]" />
                      </div>
                    </div>
                  </div>
                )}

                {isPremium && (
                  <div className="group/tip relative flex items-center justify-center">
                    <div
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#4a003e]/8 border border-[#4a003e]/20 text-[#4a003e] hover:bg-[#4a003e]/15 transition-colors cursor-default"
                      // title="Premium Member"
                    >
                      <Sparkles size={11} className="text-[#4a003e] shrink-0" />
                    </div>
                    {/* Floating Tooltip */}
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-30">
                      <div className="relative px-2 py-0.5 rounded bg-[#1c171a] text-white text-[10.5px] font-semibold whitespace-nowrap shadow-sm">
                        Premium Member
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c171a]" />
                      </div>
                    </div>
                  </div>
                )}

                {isVerified && !isVip && !isPremium && (
                  <div className="group/tip relative flex items-center justify-center">
                    <div
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-default"
                      title="Verified Specialist"
                    >
                      <ShieldCheck size={12} className="shrink-0" />
                    </div>
                    {/* Floating Tooltip */}
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-30">
                      <div className="relative px-2 py-0.5 rounded bg-[#1c171a] text-white text-[10.5px] font-semibold whitespace-nowrap shadow-sm">
                        Verified Specialist
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c171a]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profession / Headline (Only rendered if present, no fake placeholders) */}
            {headline && (
              <p className="mt-1 text-[13px] text-[#554d52] font-normal leading-snug line-clamp-1">
                {headline}
              </p>
            )}

            {/* Member Since & Clean "View Profile" Text Link */}
            <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[#7d7179]">
              <span className="text-[#6b6268]">
                Member since <strong className="font-semibold text-foreground">{memberSinceYear}</strong>
              </span>
              <span className="text-[#ded8d2]">·</span>
              <Link
                href={`/people/${person.id}`}
                className="text-[#e06b2e] hover:text-[#c9591f] font-bold inline-flex items-center gap-0.5 hover:underline"
              >
                <span>View Profile</span>
                <ArrowRight size={11.5} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Hairline Divider */}
        <div className="my-3.5 border-t border-[#f0eae4]" />

        {/* Structured Info Rows (Matching Reference Card Style) */}
        <div className="flex flex-col gap-2 text-[13px]">
          {/* Affiliation / Hospital Row */}
          {/* {primaryOrg && (
            <div className="flex items-baseline gap-2">
              <span className="text-[#7d7179] font-medium shrink-0">Affiliation:</span>
              <span className="font-medium text-[#1c171a] truncate">
                {primaryOrg.role ? `${primaryOrg.role} · ` : ''}
                {primaryOrg.name}
              </span>
            </div>
          )} */}

          {/* Location Row */}
          {person.location && (
            <div className="flex items-baseline gap-2">
              <span className="text-[#7d7179] font-medium shrink-0">Location:</span>
              <span className="font-medium text-[#1c171a] truncate">{person.location}</span>
            </div>
          )}

          {/* Website Link Row if present */}
          {person.website && (
            <div className="flex items-baseline gap-2">
              <span className="text-[#7d7179] font-medium shrink-0">Website:</span>
              <a
                href={person.website.startsWith('http') ? person.website : `https://${person.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4a003e] hover:underline font-medium inline-flex items-center gap-1 truncate"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate">{person.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                <ExternalLink size={11} className="shrink-0" />
              </a>
            </div>
          )}

          {/* Expertise Chips Row (Styled with warm peach/terracotta badges like the reference) */}
          {/* {person.interests && person.interests.length > 0 && (
            <div className="flex items-start gap-2 pt-0.5">
              <span className="text-[#7d7179] font-medium shrink-0 pt-0.5">Expertise:</span>
              <div className="flex flex-wrap gap-1.5 min-w-0">
                {person.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-0.5 rounded-lg bg-[#fff6ee] text-[#c2410c] text-[11.5px] font-semibold border border-[#fed7aa]/50 hover:bg-[#ffedd5] transition-colors"
                  >
                    {interest}
                  </span>
                ))}
                {person.interests.length > 4 && (
                  <span className="self-center text-[11px] font-medium text-[#7d7179]">
                    +{person.interests.length - 4}
                  </span>
                )}
              </div>
            </div>
          )} */}

          {/* Bio excerpt fallback if no interests */}
          {(!person.interests || person.interests.length === 0) && person.bio && (
            <p className="text-[12.5px] text-[#6b6268] leading-relaxed line-clamp-2 mt-0.5">
              {person.bio}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
