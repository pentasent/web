'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  Star,
  Sparkles,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { ProductCardDTO } from '@/types/products';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

interface ProductCardProps {
  product: ProductCardDTO;
  basePath?: string;
  index?: number;
  actions?: React.ReactNode;
  isOwner?: boolean;
  onUpvoteChange?: (productId: string, newCount: number, hasUpvoted: boolean) => void;
}

export default function ProductCard({
  product,
  basePath = '/products',
  index = 0,
  actions,
  isOwner = false,
  onUpvoteChange,
}: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [upvoted, setUpvoted] = useState<boolean>(Boolean(product.hasUpvoted));
  const [upvotes, setUpvotes] = useState<number>(product.upvoteCount || 0);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  const targetHref = `${basePath}/${product.slug}`;

  // Handle immediate upvote toggle with optimistic UI
  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(targetHref)}`);
      return;
    }

    if (isSubmittingVote) return;
    setIsSubmittingVote(true);

    const nextState = !upvoted;
    const nextCount = nextState ? upvotes + 1 : Math.max(0, upvotes - 1);

    // Optimistic update
    setUpvoted(nextState);
    setUpvotes(nextCount);
    if (onUpvoteChange) {
      onUpvoteChange(product.id, nextCount, nextState);
    }

    try {
      const res = await apiClient<{ hasUpvoted: boolean; upvoteCount: number }>(
        `/products/${product.id}/upvote`,
        { method: 'POST' }
      );
      if (res.success && res.data) {
        setUpvoted(res.data.hasUpvoted);
        setUpvotes(res.data.upvoteCount);
        if (onUpvoteChange) {
          onUpvoteChange(product.id, res.data.upvoteCount, res.data.hasUpvoted);
        }
      }
    } catch (err) {
      // Revert on error
      setUpvoted(!nextState);
      setUpvotes(upvotes);
      if (onUpvoteChange) {
        onUpvoteChange(product.id, upvotes, !nextState);
      }
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const pricingBadge = (() => {
    switch (product.pricingModel) {
      case 'free':
        return { label: 'Free to use', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'paid_with_free_trial':
        return { label: 'Free trial', class: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'paid':
        return { label: 'Paid', class: 'text-slate-700 bg-slate-50 border-slate-200' };
      default:
        return { label: 'Free', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group"
    >
      <div className="flex flex-col w-full">
        <div className="pt-6 sm:pt-7 pb-2.5 transition-colors cursor-pointer w-full flex items-start gap-4 sm:gap-5">
          {/* Logo / Monogram & Mobile Upvote Column */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <Link href={targetHref} className="shrink-0 mt-0.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-[#faf9f8] border-2 border-[#e8e4e1] flex items-center justify-center transition-transform group-hover:scale-102">
                {product.logoUrl ? (
                  <Image
                    src={product.logoUrl}
                    alt={product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#f4ddf0] to-[#e4c4dc] text-primary font-bold text-[20px] sm:text-[22px]">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>

            {/* Upvote Button on Mobile (Under Product Image) */}
            {!isOwner && (
              <div className="block sm:hidden w-full">
                <button
                  type="button"
                  onClick={handleUpvoteClick}
                  disabled={isSubmittingVote}
                  title={upvoted ? 'Remove upvote' : 'Upvote this product'}
                  className={`w-full flex flex-col items-center justify-center min-w-[52px] px-2 py-1.5 rounded-lg border transition-all cursor-pointer select-none ${upvoted
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-[#faf9f8] hover:bg-white text-foreground hover:text-primary border-[#ded9d5] hover:border-primary/50'
                    }`}
                >
                  <ChevronUp
                    size={18}
                    className={`transition-transform ${upvoted ? 'stroke-[2.5]' : 'stroke-2 group-hover:-translate-y-0.5'}`}
                  />
                  <span className="text-[12px] font-bold mt-0.5">
                    {upvotes}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Details Body */}
          <div className="flex-1 min-w-0">
            <Link href={targetHref} className="block">
              {/* Header Badges Row */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[12.5px]">
                <span className="font-bold uppercase tracking-[0.16em] text-primary">
                  {product.primaryCategory?.name || 'Healthcare Innovation'}
                </span>

                {product.isFeatured && (
                  <>
                    <span className="text-[#ded9d5]">·</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Sparkles size={11} className="text-amber-600 fill-amber-500" />
                      Featured
                    </span>
                  </>
                )}

                {product.companyName && (
                  <>
                    <span className="text-[#ded9d5]">·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Building2 size={13} className="text-muted-foreground" />
                      {product.companyName}
                    </span>
                  </>
                )}

                <span className="text-[#ded9d5]">·</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${pricingBadge.class}`}
                >
                  {pricingBadge.label}
                </span>

                {product.isVerified && (
                  <>
                    <span className="text-[#ded9d5]">·</span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-700">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      Verified
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <div className="mt-1">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  {product.name}
                </h2>
              </div>

              {/* Tagline */}
              <p className="mt-1 text-[14px] sm:text-[15px] leading-[1.65] text-primary-text line-clamp-2 max-w-3xl">
                {product.tagline}
              </p>

              {/* Meta row: Rating, reviews, upvote summary */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] sm:text-[13px] text-primary-text">
                {product.averageRating !== null && (
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star size={13} className="fill-amber-400 text-amber-500" />
                    <span>{product.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground font-normal">
                      ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </span>
                )}

                {product.followerCount > 0 && (
                  <span className="text-muted-foreground">
                    {product.followerCount} {product.followerCount === 1 ? 'follower' : 'followers'}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Upvote Button on Large Screens (Right Column) */}
          {!isOwner && (
            <div className="hidden sm:block shrink-0 self-center">
              <button
                type="button"
                onClick={handleUpvoteClick}
                disabled={isSubmittingVote}
                title={upvoted ? 'Remove upvote' : 'Upvote this product'}
                className={`flex flex-col items-center justify-center min-w-[58px] px-2.5 py-2.5 rounded-lg border transition-all cursor-pointer select-none ${upvoted
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-[#faf9f8] hover:bg-white text-foreground hover:text-primary border-[#ded9d5] hover:border-primary/50'
                  }`}
              >
                <ChevronUp
                  size={19}
                  className={`transition-transform ${upvoted ? 'stroke-[2.5]' : 'stroke-2 group-hover:-translate-y-0.5'}`}
                />
                <span className="text-[13px] font-bold mt-0.5">
                  {upvotes}
                </span>
              </button>
            </div>
          )}
        </div>

        {actions && (
          <div className="w-full pt-3 pb-5 border-t border-[#f0ece9]/90">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
