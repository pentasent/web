'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Star, ThumbsUp, MessageSquare, AlertCircle, CheckCircle2, Trash2, Edit3, Loader2 } from 'lucide-react';
import { ProductReviewDTO } from '@/types/products';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';

interface ProductReviewsProps {
  productId: string;
  reviews: ProductReviewDTO[];
  averageRating: number | null;
  reviewCount: number;
  recommendationPercentage: number | null;
  canReview?: boolean;
  initialUserReview?: ProductReviewDTO | null;
  isOwner?: boolean;
}

export default function ProductReviews({
  productId,
  reviews: initialReviews,
  averageRating,
  reviewCount,
  recommendationPercentage,
  canReview = true,
  initialUserReview = null,
  isOwner = false,
}: ProductReviewsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState<ProductReviewDTO[]>(initialReviews);
  const [userReview, setUserReview] = useState<ProductReviewDTO | null>(initialUserReview);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [rating, setRating] = useState<number>(userReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>(userReview?.feedback || '');
  const [whatYouLike, setWhatYouLike] = useState<string>(userReview?.whatYouLike || '');
  const [whatYouDislike, setWhatYouDislike] = useState<string>(userReview?.whatYouDislike || '');
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(userReview?.wouldRecommend ?? true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '')}`);
      return;
    }

    if (!feedback.trim() || feedback.length < 5) {
      setErrorMsg('Please provide at least 5 characters of feedback.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await apiClient<ProductReviewDTO>(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          feedback: feedback.trim(),
          whatYouLike: whatYouLike.trim() || undefined,
          whatYouDislike: whatYouDislike.trim() || undefined,
          wouldRecommend,
        }),
      });

      if (res.success && res.data) {
        setUserReview(res.data);
        // Update reviews list
        setReviewsList((prev) => {
          const filtered = prev.filter((r) => r.reviewer.id !== user.id);
          return [res.data, ...filtered];
        });
        setIsFormOpen(false);
        notify.success('Review submitted successfully!');
        setSuccessMsg('Thank you! Your verified review has been published.');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        const err = res.error?.message || 'Failed to submit review';
        setErrorMsg(err);
        notify.error(err);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting review';
      setErrorMsg(msg);
      notify.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    setIsSubmitting(true);
    setShowDeleteConfirm(false);
    try {
      const res = await apiClient<{ deleted: boolean }>(`/products/${productId}/reviews`, {
        method: 'DELETE',
      });
      if (res.success) {
        setUserReview(null);
        setReviewsList((prev) => prev.filter((r) => r.reviewer.id !== user?.id));
        notify.success('Your review has been removed.');
      } else {
        notify.error('Failed to delete review');
      }
    } catch {
      notify.error('Failed to delete review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header & Aggregates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e4e1]">
        <div>
          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
            Verified Community Ratings
          </span>
          <h2 className="mt-1 text-[24px] sm:text-[28px] font-bold text-foreground tracking-tight">
            Reviews &amp; Experiences
          </h2>
        </div>

        {/* Aggregates Badge */}
        <div className="flex items-center gap-6">
          {averageRating !== null ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#faf9f8] border border-[#ded9d5]">
                <span className="text-[20px] font-bold text-foreground leading-none">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center mt-1 text-amber-500">
                  <Star size={11} className="fill-amber-400" />
                </div>
              </div>
              <div>
                <span className="block text-[14px] font-bold text-foreground">
                  {reviewCount} {reviewCount === 1 ? 'Rating' : 'Ratings'}
                </span>
                {recommendationPercentage !== null && (
                  <span className="text-[12.5px] text-emerald-700 font-semibold">
                    {recommendationPercentage}% would recommend
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-[14px] text-muted-foreground">No reviews yet</span>
          )}

          {/* Review Action Button */}
          {user ? (
            canReview && (
              <button
                type="button"
                onClick={() => setIsFormOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all cursor-pointer shadow-2xs"
              >
                {userReview ? <Edit3 size={14} /> : <Star size={14} />}
                <span>{userReview ? 'Edit Your Review' : 'Write a Review'}</span>
              </button>
            )
          ) : (
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(pathname || '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-[#ded9d5] bg-white hover:bg-[#faf9f8] text-[13.5px] font-semibold text-foreground transition-all cursor-pointer"
            >
              <Star size={14} />
              <span>Log in to review</span>
            </Link>
          )}
        </div>
      </div>

      {/* Notice if owner */}
      {isOwner && (
        <div className="p-3.5 rounded-lg bg-[#faf9f8] border border-[#e8e4e1] text-[13.5px] text-primary-text">
          <span className="font-semibold text-foreground">Creator Notice:</span> To ensure authentic discovery integrity, creators and team members cannot review their own products.
        </div>
      )}

      {/* Feedback Messages */}
      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px] flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[14px] flex items-center gap-2 font-medium">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Review Submission Form Modal / Box */}
      {isFormOpen && (
        <div className="p-6 rounded-xl bg-[#faf9f8] border border-[#ded9d5] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-foreground">
              {userReview ? 'Update Your Review' : 'Share Your Clinical Experience'}
            </h3>
            {userReview && (
              <button
                type="button"
                onClick={handleDeleteReview}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 text-[12.5px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete review</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating Selection */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={`transition-colors ${(hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-[#ded9d5]'
                        }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-[14px] font-bold text-foreground">
                  {hoverRating || rating} / 5
                </span>
              </div>
            </div>

            {/* Recommendation Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <label className="text-[13.5px] font-semibold text-foreground">
                Would you recommend this product to colleagues?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`px-3 py-1 rounded text-[12.5px] font-bold border cursor-pointer ${wouldRecommend
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-primary-text border-[#ded9d5]'
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`px-3 py-1 rounded text-[12.5px] font-bold border cursor-pointer ${!wouldRecommend
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-white text-primary-text border-[#ded9d5]'
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div>
              <label htmlFor="review-feedback" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                Your Overall Feedback *
              </label>
              <textarea
                id="review-feedback"
                rows={3}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How does this tool perform in real clinical/workflow settings? How is the usability and support?"
                className="w-full p-3 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* What you like / dislike */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="review-like" className="block text-[12px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  What you like best (optional)
                </label>
                <input
                  id="review-like"
                  type="text"
                  value={whatYouLike}
                  onChange={(e) => setWhatYouLike(e.target.value)}
                  placeholder="e.g. Blazing speed, intuitive UI"
                  className="w-full px-3 py-2 rounded-lg border border-[#ded9d5] bg-white text-[13.5px] text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="review-dislike" className="block text-[12px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Areas for improvement (optional)
                </label>
                <input
                  id="review-dislike"
                  type="text"
                  value={whatYouDislike}
                  onChange={(e) => setWhatYouDislike(e.target.value)}
                  placeholder="e.g. Export formatting could be richer"
                  className="w-full px-3 py-2 rounded-lg border border-[#ded9d5] bg-white text-[13.5px] text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded text-[13px] font-semibold text-primary-text hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                <span>{userReview ? 'Update Review' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List (Open, Unboxed with Dividers) */}
      <div className="divide-y divide-[#e8e4e1]">
        {reviewsList.length > 0 ? (
          reviewsList.map((rev) => (
            <div key={rev.id} className="py-6 space-y-3">
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#faf9f8] border border-[#ded9d5] shrink-0">
                    {rev.reviewer.avatarUrl ? (
                      <Image
                        src={rev.reviewer.avatarUrl}
                        alt={rev.reviewer.displayName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-[14px]">
                        {rev.reviewer.displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="block text-[15px] font-bold text-foreground">
                      {rev.reviewer.displayName}
                    </span>
                    {rev.reviewer.headline && (
                      <span className="block text-[12.5px] text-muted-foreground truncate max-w-md">
                        {rev.reviewer.headline}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Stars & Recommendation */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-[#ded9d5]'}
                      />
                    ))}
                  </div>
                  {rev.wouldRecommend && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 mt-0.5">
                      <ThumbsUp size={11} />
                      Recommends
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Text */}
              <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-primary-text">
                {rev.feedback}
              </p>

              {/* Likes / Dislikes chips */}
              {(rev.whatYouLike || rev.whatYouDislike) && (
                <div className="pt-1 flex flex-wrap gap-2.5 text-[12.5px]">
                  {rev.whatYouLike && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="font-bold">Like:</span> {rev.whatYouLike}
                    </span>
                  )}
                  {rev.whatYouDislike && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
                      <span className="font-bold">Could improve:</span> {rev.whatYouDislike}
                    </span>
                  )}
                </div>
              )}

              {/* Date */}
              <span className="block text-[12px] text-muted-foreground pt-1" suppressHydrationWarning>
                {new Date(rev.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <MessageSquare size={24} className="mx-auto text-muted-foreground/60 mb-2" />
            <h4 className="text-[16px] font-bold text-foreground">No reviews posted yet</h4>
            <p className="mt-1 text-[14px] text-primary-text">
              Be the first healthcare professional to share feedback on this solution!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
